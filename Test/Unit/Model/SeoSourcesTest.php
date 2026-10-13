<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Cms\Model\ResourceModel\Page as PageResource;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\DataObject;
use Magento\Framework\DB\Adapter\AdapterInterface;
use Magento\Framework\DB\Select;
use Magento\Framework\Registry;
use Magento\Store\Model\Store;
use Magento\Store\Model\StoreManagerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\AdminEditLink;
use Siteation\DebugBar\Model\HomePage;
use Siteation\DebugBar\Model\SeoSources;

class SeoSourcesTest extends TestCase
{
    private const SETTINGS = [
        'design/head/title_prefix' => '',
        'design/head/title_suffix' => '| Shop',
        'design/head/default_description' => 'The default description.',
        'design/search_engine_robots/default_robots' => 'INDEX,FOLLOW',
        'catalog/seo/product_canonical_tag' => '1',
        'catalog/seo/category_canonical_tag' => '0',
        'catalog/seo/title_separator' => '-',
        'web/default/cms_home_page' => 'home|7',
    ];

    private Registry $registry;

    /** @var array<string, string>|false */
    private array|false $cmsRow = false;

    protected function setUp(): void
    {
        $this->registry = new Registry();
    }

    #[Test]
    public function aProductTitleComesFromMetaTitleWithTheConfiguredSuffix(): void
    {
        $this->registry->register('current_product', new DataObject([
            'entity_id' => 42, 'name' => 'Joust Duffle Bag', 'meta_title' => 'Joust bag', 'meta_description' => '',
        ]));

        $rows = $this->byField($this->sources()->explain([
            'action' => 'catalog_product_view',
            'title' => 'Joust bag | Shop',
            'description' => 'The default description.',
            'h1' => 'Joust Duffle Bag',
            'canonical_count' => 1,
            'robots' => 'INDEX, FOLLOW',
        ]));

        $this->assertSame('meta_title', $rows['title']['key']);
        $this->assertSame('Joust bag | Shop', $rows['title']['expected']);
        $this->assertTrue($rows['title']['matches']);
        $this->assertSame('edit:product:42', $rows['title']['edit']);

        $this->assertSame(
            'design/head/default_description',
            $rows['description']['key'],
            'an empty meta_description falls back to the store default'
        );
        $this->assertSame('edit:design_config:0', $rows['description']['edit']);
        $this->assertTrue($rows['description']['matches']);

        $this->assertTrue($rows['h1']['matches']);
        $this->assertTrue($rows['canonical']['matches'], 'the setting is on and the page has one');
        $this->assertTrue($rows['robots']['matches'], 'robots are matched without case or spaces');
    }

    #[Test]
    public function aValueThePageDoesNotMatchIsMarkedAsSetElsewhere(): void
    {
        $this->registry->register('current_product', new DataObject([
            'entity_id' => 42, 'name' => 'Joust Duffle Bag', 'meta_title' => '', 'meta_description' => 'Own text.',
        ]));

        $rows = $this->byField($this->sources()->explain([
            'action' => 'catalog_product_view',
            'title' => 'Buy Joust Duffle Bag online',
            'description' => 'Own text.',
            'h1' => 'Joust Duffle Bag',
            'canonical_count' => 0,
            'robots' => 'NOINDEX,NOFOLLOW',
        ]));

        $this->assertSame('name', $rows['title']['key'], 'an empty meta_title falls back to the name');
        $this->assertSame('Joust Duffle Bag | Shop', $rows['title']['expected']);
        $this->assertFalse($rows['title']['matches']);
        $this->assertSame('meta_description', $rows['description']['key']);
        $this->assertTrue($rows['description']['matches']);
        $this->assertFalse($rows['canonical']['matches'], 'the setting is on and the page has none');
        $this->assertFalse($rows['robots']['matches']);
    }

    #[Test]
    public function aCategoryTitleFromTheBreadcrumbIsNamedButNotPredicted(): void
    {
        $this->registry->register('current_category', new DataObject([
            'entity_id' => 9, 'name' => 'Bags', 'meta_title' => '', 'meta_description' => '',
        ]));

        $rows = $this->byField($this->sources()->explain([
            'action' => 'catalog_category_view', 'title' => 'Bags - Gear | Shop', 'canonical_count' => 0,
        ]));

        $this->assertNull($rows['title']['expected']);
        $this->assertNull($rows['title']['matches'], 'no prediction, so no verdict');
        $this->assertStringContainsString('"-"', $rows['title']['source']);
        $this->assertTrue($rows['canonical']['matches'], 'the category setting is off and the page has none');
        $this->assertSame('edit:catalog_config:0', $rows['canonical']['edit']);
    }

    #[Test]
    public function theHomePageIsReadFromTheCmsPageConfigurationNames(): void
    {
        $this->cmsRow = [
            'title' => 'Home',
            'meta_title' => '',
            'meta_description' => 'Welcome.',
            'content_heading' => '',
        ];

        $rows = $this->byField($this->sources()->explain([
            'action' => 'cms_index_index',
            'title' => 'Home | Shop',
            'description' => 'Welcome.',
            'h1' => 'Big ideas',
            'canonical_count' => 1,
        ]));

        $this->assertSame('title', $rows['title']['key']);
        $this->assertTrue($rows['title']['matches']);
        $this->assertSame('edit:cms_home:0', $rows['title']['edit']);
        $this->assertSame('content_heading', $rows['h1']['key']);
        $this->assertFalse($rows['h1']['matches'], 'the H1 came from the content, not the content heading');
        $this->assertFalse($rows['canonical']['matches'], 'Magento writes none on a CMS page');
    }

    #[Test]
    public function aCachedPageHasNoSources(): void
    {
        $this->registry->register('current_product', new DataObject(['entity_id' => 42]));

        $this->assertSame([], $this->sources()->explain(['action' => '__', 'page_type' => 'product']));
        $this->assertSame([], $this->sources()->explain(['action' => 'checkout_cart_index']));
    }

    #[Test]
    public function aProductStatesItsPriceInBothTaxModesAndWhetherItSells(): void
    {
        $amount = new class {
            public function getValue(): float
            {
                return 36.3;
            }

            public function getBaseAmount(): float
            {
                return 30.0;
            }
        };
        $price = new class ($amount) {
            public function __construct(private readonly object $amount)
            {
            }

            public function getAmount(): object
            {
                return $this->amount;
            }
        };
        $priceInfo = new class ($price) {
            public function __construct(private readonly object $price)
            {
            }

            public function getPrice(string $code): object
            {
                return $this->price;
            }
        };
        $product = new class (['type_id' => 'simple'], $priceInfo) extends DataObject {
            public function __construct(array $data, private readonly object $priceInfo)
            {
                parent::__construct($data);
            }

            public function getPriceInfo(): object
            {
                return $this->priceInfo;
            }

            public function isSalable(): bool
            {
                return false;
            }
        };
        $this->registry->register('current_product', $product);

        $this->assertSame(
            ['type' => 'simple', 'price' => 36.3, 'price_excl_tax' => 30.0, 'currency' => 'EUR', 'salable' => false],
            $this->sources()->product()
        );
    }

    #[Test]
    public function aPageThatIsNoProductHasNoProductFacts(): void
    {
        $this->assertNull($this->sources()->product());
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @return array<string, array<string, mixed>>
     */
    private function byField(array $rows): array
    {
        return array_column($rows, null, 'field');
    }

    private function sources(): SeoSources
    {
        $config = $this->createStub(ScopeConfigInterface::class);
        $config->method('getValue')->willReturnCallback(
            static fn (string $path): ?string => self::SETTINGS[$path] ?? null
        );
        $config->method('isSetFlag')->willReturnCallback(
            static fn (string $path): bool => (bool) (self::SETTINGS[$path] ?? false)
        );

        $request = $this->createStub(HttpRequest::class);
        $request->method('getParam')->willReturn(null);

        $store = $this->createStub(Store::class);
        $store->method('getId')->willReturn(1);
        $store->method('getCurrentCurrencyCode')->willReturn('EUR');
        $stores = $this->createStub(StoreManagerInterface::class);
        $stores->method('getStore')->willReturn($store);

        $select = $this->createStub(Select::class);
        $select->method('from')->willReturnSelf();
        $select->method('where')->willReturnSelf();
        $connection = $this->createStub(AdapterInterface::class);
        $connection->method('select')->willReturn($select);
        $connection->method('fetchRow')->willReturnCallback(fn (): array|false => $this->cmsRow);
        $pages = $this->createStub(PageResource::class);
        $pages->method('getConnection')->willReturn($connection);
        $pages->method('getMainTable')->willReturn('cms_page');

        $links = $this->createStub(AdminEditLink::class);
        $links->method('forTarget')->willReturnCallback(
            static fn (string $type, int $id = 0): string => "edit:$type:$id"
        );

        $homePage = new HomePage($config, $pages);

        return new SeoSources($this->registry, $config, $request, $stores, $pages, $homePage, $links);
    }
}
