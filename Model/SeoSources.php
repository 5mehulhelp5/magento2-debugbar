<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Cms\Model\ResourceModel\Page as PageResource;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\DataObject;
use Magento\Framework\Registry;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use Throwable;

/**
 * Where each SEO value on a product, category or CMS page comes from.
 *
 * Each rule here is the one Magento's own code follows: Catalog\Helper\Product\View for a
 * product, Catalog\Block\Category\View for a category, Cms\Block\Page for a CMS page, and
 * Framework\View\Page\Config and Title for the defaults and the title prefix and suffix.
 * From that rule this predicts the value, and says whether the page matches it. When it does
 * not, something past Magento's rule set the value: a plugin, an observer, layout XML, a
 * theme or an SEO extension. Naming the place to look is the point, not the prediction.
 *
 * The product and category are the ones the controller registered, so this reads the values
 * the page was rendered with, in its store view, without a dependency on the catalog module.
 * A page served from the full page cache was never routed and registered nothing, so it has
 * no sources; a CMS page is read by its id, which the request does carry.
 */
class SeoSources
{
    public const FROM_ATTRIBUTE = 'attribute';
    public const FROM_FIELD = 'field';
    public const FROM_SETTING = 'setting';

    private const TITLE_PREFIX = 'design/head/title_prefix';
    private const TITLE_SUFFIX = 'design/head/title_suffix';
    private const DEFAULT_DESCRIPTION = 'design/head/default_description';
    private const DEFAULT_ROBOTS = 'design/search_engine_robots/default_robots';
    private const PRODUCT_CANONICAL = 'catalog/seo/product_canonical_tag';
    private const CATEGORY_CANONICAL = 'catalog/seo/category_canonical_tag';
    private const TITLE_SEPARATOR = 'catalog/seo/title_separator';

    /** As long as SeoCollector keeps a title or description. */
    private const MAX_TEXT = 300;

    public function __construct(
        private readonly Registry $registry,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly HttpRequest $request,
        private readonly StoreManagerInterface $storeManager,
        private readonly PageResource $pageResource,
        private readonly HomePage $homePage,
        private readonly AdminEditLink $editLink
    ) {
    }

    /**
     * @param array<string, mixed> $record SeoCollector's summary of the page that was served
     * @return list<array{field: string, label: string, from: string, source: string, key: string,
     *     expected: string|null, served: string, matches: bool|null, edit: string}>
     */
    public function explain(array $record): array
    {
        try {
            return match ((string) ($record['action'] ?? '')) {
                'catalog_product_view' => $this->catalog('product', 'current_product', self::PRODUCT_CANONICAL, $record),
                'catalog_category_view' => $this->catalog('category', 'current_category', self::CATEGORY_CANONICAL, $record),
                'cms_page_view' => $this->cms('cms_page', (int) $this->request->getParam('page_id'), $record),
                'cms_index_index' => $this->cms('cms_home', $this->homePage->id($this->storeId()), $record),
                default => [],
            };
        } catch (Throwable) {
            // A missing table or an entity type with a mind of its own must not cost the page.
            return [];
        }
    }

    /**
     * The facts a product page's structured data should agree with: what it sells for, in
     * which currency, and whether it can be bought at all.
     *
     * @return array{type: string, price: float, price_excl_tax: float, currency: string, salable: bool}|null
     */
    public function product(): ?array
    {
        try {
            $product = $this->registry->registry('current_product');

            if (!$product instanceof DataObject || !method_exists($product, 'getPriceInfo')) {
                return null;
            }

            $amount = $product->getPriceInfo()->getPrice('final_price')->getAmount();

            return [
                'type' => (string) $product->getData('type_id'),
                'price' => round((float) $amount->getValue(), 2),
                'price_excl_tax' => round((float) $amount->getBaseAmount(), 2),
                'currency' => (string) $this->storeManager->getStore()->getCurrentCurrencyCode(),
                'salable' => method_exists($product, 'isSalable') && (bool) $product->isSalable(),
            ];
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * @param array<string, mixed> $record
     * @return list<array<string, mixed>>
     */
    private function catalog(string $type, string $registryKey, string $canonicalSetting, array $record): array
    {
        $entity = $this->registry->registry($registryKey);

        if (!$entity instanceof DataObject) {
            return [];
        }

        $edit = $this->editLink->forTarget($type, (int) $entity->getData('entity_id'));
        $metaTitle = trim((string) $entity->getData('meta_title'));
        $name = (string) $entity->getData('name');
        $noun = ucfirst($type);
        $rows = [];

        if ($metaTitle !== '') {
            $rows[] = $this->row('title', 'Title', self::FROM_ATTRIBUTE, "$noun attribute", 'meta_title',
                $this->withAffixes($metaTitle), (string) ($record['title'] ?? ''), $edit);
        } elseif ($type === 'product') {
            $rows[] = $this->row('title', 'Title', self::FROM_ATTRIBUTE, 'Product name, as meta_title is empty', 'name',
                $this->withAffixes($name), (string) ($record['title'] ?? ''), $edit);
        } else {
            // The category names along the breadcrumb, current first. Predicting that means
            // loading every parent, which is more than a debug read should cost a request.
            $rows[] = $this->row('title', 'Title', self::FROM_ATTRIBUTE,
                sprintf('Category names along the breadcrumb, joined by "%s", as meta_title is empty',
                    (string) $this->setting(self::TITLE_SEPARATOR)),
                'name', null, (string) ($record['title'] ?? ''), $edit);
        }

        $rows[] = $this->description("$noun attribute", (string) $entity->getData('meta_description'), $record, $edit);
        $rows[] = $this->row('h1', 'H1', self::FROM_ATTRIBUTE, "$noun name", 'name', $name,
            (string) ($record['h1'] ?? ''), $edit);

        $on = $this->scopeConfig->isSetFlag($canonicalSetting, ScopeInterface::SCOPE_STORE);
        $rows[] = $this->row('canonical', 'Canonical', self::FROM_SETTING, 'Setting', $canonicalSetting,
            $on ? 'a canonical tag' : 'no canonical tag',
            (int) ($record['canonical_count'] ?? 0) > 0 ? 'a canonical tag' : 'no canonical tag',
            $this->editLink->forTarget('catalog_config'));
        $rows[] = $this->robots($record);

        return $rows;
    }

    /**
     * @param array<string, mixed> $record
     * @return list<array<string, mixed>>
     */
    private function cms(string $type, int $id, array $record): array
    {
        if ($id <= 0) {
            return [];
        }

        $connection = $this->pageResource->getConnection();

        if ($connection === false) {
            return [];
        }

        $page = $connection->fetchRow(
            $connection->select()
                ->from($this->pageResource->getMainTable(), ['title', 'meta_title', 'meta_description', 'content_heading'])
                ->where('page_id = ?', $id)
        );

        if (!is_array($page)) {
            return [];
        }

        $edit = $this->editLink->forTarget($type, $type === 'cms_home' ? 0 : $id);
        $metaTitle = trim((string) $page['meta_title']);

        return [
            $metaTitle !== ''
                ? $this->row('title', 'Title', self::FROM_FIELD, 'CMS page field', 'meta_title',
                    $this->withAffixes($metaTitle), (string) ($record['title'] ?? ''), $edit)
                : $this->row('title', 'Title', self::FROM_FIELD, 'CMS page title, as meta_title is empty', 'title',
                    $this->withAffixes((string) $page['title']), (string) ($record['title'] ?? ''), $edit),
            $this->description('CMS page field', (string) $page['meta_description'], $record, $edit),
            $this->row('h1', 'H1', self::FROM_FIELD, 'CMS page field', 'content_heading',
                (string) $page['content_heading'], (string) ($record['h1'] ?? ''), $edit),
            // Magento writes no canonical on a CMS page. One that is there came from elsewhere.
            $this->row('canonical', 'Canonical', self::FROM_SETTING, 'Not written by Magento on a CMS page', '',
                'no canonical tag',
                (int) ($record['canonical_count'] ?? 0) > 0 ? 'a canonical tag' : 'no canonical tag', ''),
            $this->robots($record),
        ];
    }

    /**
     * @param array<string, mixed> $record
     * @return array<string, mixed>
     */
    private function description(string $source, string $own, array $record, string $edit): array
    {
        $served = (string) ($record['description'] ?? '');

        if (trim($own) !== '') {
            $from = str_starts_with($source, 'CMS') ? self::FROM_FIELD : self::FROM_ATTRIBUTE;

            return $this->row('description', 'Meta description', $from, $source, 'meta_description', $own, $served, $edit);
        }

        return $this->row('description', 'Meta description', self::FROM_SETTING,
            'Default description, as meta_description is empty', self::DEFAULT_DESCRIPTION,
            (string) $this->setting(self::DEFAULT_DESCRIPTION), $served, $this->editLink->forTarget('design_config'));
    }

    /**
     * @param array<string, mixed> $record
     * @return array<string, mixed>
     */
    private function robots(array $record): array
    {
        return $this->row('robots', 'Robots meta', self::FROM_SETTING, 'Setting', self::DEFAULT_ROBOTS,
            (string) $this->setting(self::DEFAULT_ROBOTS), (string) ($record['robots'] ?? ''),
            $this->editLink->forTarget('design_config'));
    }

    /**
     * @return array{field: string, label: string, from: string, source: string, key: string,
     *     expected: string|null, served: string, matches: bool|null, edit: string}
     */
    private function row(
        string $field,
        string $label,
        string $from,
        string $source,
        string $key,
        ?string $expected,
        string $served,
        string $edit
    ): array {
        return [
            'field' => $field,
            'label' => $label,
            'from' => $from,
            'source' => $source,
            'key' => $key,
            'expected' => $expected === null ? null : $this->clip($expected),
            'served' => $served,
            'matches' => $expected === null ? null : $this->comparable($field, $expected) === $this->comparable($field, $served),
            'edit' => $edit,
        ];
    }

    /** Framework\View\Page\Title::addConfigValues, which every title passes through. */
    private function withAffixes(string $title): string
    {
        return trim($this->setting(self::TITLE_PREFIX) . ' ' . $title . ' ' . $this->setting(self::TITLE_SUFFIX));
    }

    /**
     * Both sides as SeoCollector keeps them: whitespace collapsed, cut at the same length.
     * Robots directives are matched without case or spaces, the way crawlers read them.
     */
    private function comparable(string $field, string $value): string
    {
        $value = (string) preg_replace('/\.\.\.$/', '', $this->clip($value));

        return $field === 'robots' ? strtolower(str_replace(' ', '', $value)) : $value;
    }

    private function clip(string $value): string
    {
        $value = trim((string) preg_replace('/\s+/u', ' ', $value));

        return mb_strlen($value) <= self::MAX_TEXT ? $value : mb_substr($value, 0, self::MAX_TEXT) . '...';
    }

    private function setting(string $path): string
    {
        return (string) $this->scopeConfig->getValue($path, ScopeInterface::SCOPE_STORE);
    }

    private function storeId(): int
    {
        return (int) $this->storeManager->getStore()->getId();
    }
}
