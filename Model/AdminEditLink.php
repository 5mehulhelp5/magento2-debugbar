<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Backend\App\Area\FrontNameResolver;
use Magento\Framework\App\Area;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\State;
use Magento\Store\Model\StoreManagerInterface;
use Throwable;

/**
 * Where to edit what the storefront is showing.
 *
 * The storefront cannot link to an admin edit screen itself. An admin URL carries a secret
 * key tied to the admin session, which a storefront request does not have, and building
 * one here would mean instantiating the backend URL model, whose session would then start
 * inside the storefront's. So this links to a small admin route instead, with the entity
 * named in the path, and that route builds the keyed URL once it is inside the admin. See
 * Controller\Adminhtml\Entity\Edit.
 *
 * The entity comes from the request rather than from the catalog or CMS modules: the route
 * and its id parameter are all the storefront router ever set, and reading them keeps this
 * module free of a dependency on either. The home page is the one exception, since its id
 * lives in configuration, and the admin side resolves it.
 */
class AdminEditLink
{
    public const ROUTE = 'siteation_debugbar/entity/edit';

    /**
     * Full action name => [entity type, the request parameter holding its id].
     *
     * A null parameter means the id is not in the request, and the admin side looks it up.
     */
    private const ENTITIES = [
        'catalog_product_view' => ['product', 'id'],
        'catalog_category_view' => ['category', 'id'],
        'cms_page_view' => ['cms_page', 'page_id'],
        'cms_index_index' => ['cms_home', null],
    ];

    private const XML_PATH_SECURE_BASE_URL = 'web/secure/base_url';
    private const XML_PATH_UNSECURE_BASE_URL = 'web/unsecure/base_url';
    private const XML_PATH_SECURE_IN_ADMIN = 'web/secure/use_in_adminhtml';
    private const XML_PATH_USE_REWRITES = 'web/seo/use_rewrites';

    public function __construct(
        private readonly HttpRequest $request,
        private readonly State $appState,
        private readonly Config $config,
        private readonly FrontNameResolver $frontNameResolver,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly StoreManagerInterface $storeManager
    ) {
    }

    /**
     * @return string the admin URL, or '' when this page is not one an admin screen edits
     */
    public function forCurrentPage(): string
    {
        if (!$this->config->collects('seo') || $this->area() !== Area::AREA_FRONTEND) {
            return '';
        }

        $entity = self::ENTITIES[strtolower((string) $this->request->getFullActionName())] ?? null;

        if ($entity === null) {
            return '';
        }

        [$type, $parameter] = $entity;
        $id = $parameter === null ? 0 : (int) $this->request->getParam($parameter);

        if ($parameter !== null && $id <= 0) {
            return '';
        }

        return $this->forTarget($type, $id);
    }

    /**
     * A link to one of the admin route's targets, for the store view this request is in.
     *
     * @param string $type a target Controller\Adminhtml\Entity\Edit knows: an entity type, or
     *     a configuration screen
     * @param int $id the entity's id, 0 for a target that has none or resolves its own
     * @return string the admin URL, or '' when the store cannot be read
     */
    public function forTarget(string $type, int $id = 0): string
    {
        try {
            $storeId = (int) $this->storeManager->getStore()->getId();
        } catch (Throwable) {
            return '';
        }

        return sprintf(
            '%s%s%s/%s/type/%s/id/%d/store/%d/',
            $this->adminBaseUrl(),
            $this->scopeConfig->isSetFlag(self::XML_PATH_USE_REWRITES) ? '' : 'index.php/',
            trim((string) $this->frontNameResolver->getFrontName(), '/'),
            self::ROUTE,
            $type,
            $id,
            $storeId
        );
    }

    /**
     * The admin's own base URL, read the way the backend URL model reads it: a custom admin
     * URL when one is set, and the default scope's base URL otherwise, never the store's.
     */
    private function adminBaseUrl(): string
    {
        if ($this->scopeConfig->isSetFlag(FrontNameResolver::XML_PATH_USE_CUSTOM_ADMIN_URL)) {
            $custom = (string) $this->scopeConfig->getValue(FrontNameResolver::XML_PATH_CUSTOM_ADMIN_URL);

            if ($custom !== '') {
                return rtrim($custom, '/') . '/';
            }
        }

        $path = $this->scopeConfig->isSetFlag(self::XML_PATH_SECURE_IN_ADMIN)
            ? self::XML_PATH_SECURE_BASE_URL
            : self::XML_PATH_UNSECURE_BASE_URL;

        return rtrim((string) $this->scopeConfig->getValue($path), '/') . '/';
    }

    private function area(): string
    {
        try {
            return (string) $this->appState->getAreaCode();
        } catch (Throwable) {
            return '';
        }
    }
}
