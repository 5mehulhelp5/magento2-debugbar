<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Controller\Adminhtml\Entity;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\Result\Redirect;
use Magento\Store\Model\StoreManagerInterface;
use Siteation\DebugBar\Model\HomePage;

/**
 * Sends "Edit this page in the admin" from the SEO section to the right edit screen.
 *
 * The storefront links here because it cannot link to the edit screen itself: admin URLs
 * carry a secret key tied to the admin session. This action is public in the secret key
 * sense only, so the link works whether "Add Secret Key to URLs" is on or off, and it then
 * redirects through the backend URL model, which adds the key when the store wants one.
 *
 * Being public does not make it unauthenticated. Magento still asks for a login first, and
 * after one it comes back here with a fresh key. It still checks the role, too: each kind of
 * page needs the resource its own edit screen needs, so this cannot send someone to a
 * screen they would have been refused anyway.
 *
 * It only ever redirects. It reads nothing beyond the one id it resolves and changes
 * nothing, which is what makes skipping the key safe: a forged link to it can do no more
 * than the admin's own bookmarks can.
 */
class Edit extends Action implements HttpGetActionInterface
{
    /** Every logged in admin. Each target checks its own resource below. */
    public const ADMIN_RESOURCE = 'Magento_Backend::admin';

    /**
     * Type => [route, id parameter, the resource its edit screen needs, whether it has a
     * store view scope].
     */
    private const TARGETS = [
        'product' => ['catalog/product/edit', 'id', 'Magento_Catalog::products', true],
        'category' => ['catalog/category/edit', 'id', 'Magento_Catalog::categories', true],
        'cms_page' => ['cms/page/edit', 'page_id', 'Magento_Cms::page', false],
        'cms_home' => ['cms/page/edit', 'page_id', 'Magento_Cms::page', false],
    ];

    /**
     * Type => [route, fixed parameters, the resource its screen needs, the store parameter's
     * name, or null when one store view sends the grid instead].
     *
     * The settings an SEO value can come from: the HTML head defaults and robots live in the
     * design configuration, the canonical switches in the catalog section.
     */
    private const SETTINGS = [
        'design_config' => ['theme/design_config/edit', ['scope' => 'stores'], 'Magento_Config::config_design',
            'scope_id'],
        'catalog_config' => ['adminhtml/system_config/edit', ['section' => 'catalog'],
            'Magento_Catalog::config_catalog', 'store'],
    ];

    /**
     * @var string[]
     */
    protected $_publicActions = ['edit'];

    public function __construct(
        Context $context,
        private readonly StoreManagerInterface $storeManager,
        private readonly HomePage $homePage
    ) {
        parent::__construct($context);
    }

    public function execute(): Redirect
    {
        $redirect = $this->resultRedirectFactory->create();
        $type = (string) $this->getRequest()->getParam('type');
        $storeId = max(0, (int) $this->getRequest()->getParam('store'));
        $target = self::TARGETS[$type] ?? null;

        if ($target === null && isset(self::SETTINGS[$type])) {
            return $this->setting($redirect, self::SETTINGS[$type], $storeId);
        }

        if ($target === null) {
            return $this->refuse($redirect, (string) __('The debug bar did not say what to edit.'));
        }

        [$route, $parameter, $resource, $scoped] = $target;

        if (!$this->_authorization->isAllowed($resource)) {
            return $this->refuse($redirect, (string) __('Your role is not allowed to edit this.'));
        }

        $id = $type === 'cms_home'
            ? $this->homePage->id($storeId)
            : (int) $this->getRequest()->getParam('id');

        if ($id <= 0) {
            return $this->refuse($redirect, (string) __('The debug bar could not find what this page shows.'));
        }

        $params = [$parameter => $id];

        // The store view the page was seen in, so the form shows the values that page drew.
        // Not in single store mode, where Magento hides the scope switcher and a store
        // scoped form would save values a merchant then cannot find.
        if ($scoped && $storeId > 0 && !$this->storeManager->isSingleStoreMode()) {
            $params['store'] = $storeId;
        }

        return $redirect->setPath($route, $params);
    }

    /**
     * @param array{0: string, 1: array<string, string>, 2: string, 3: string} $setting
     */
    private function setting(Redirect $redirect, array $setting, int $storeId): Redirect
    {
        [$route, $params, $resource, $storeParameter] = $setting;

        if (!$this->_authorization->isAllowed($resource)) {
            return $this->refuse($redirect, (string) __('Your role is not allowed to edit this.'));
        }

        $single = $storeId <= 0 || $this->storeManager->isSingleStoreMode();

        if ($storeParameter === 'scope_id') {
            // The design configuration is a grid of scopes. With one store view, which row
            // holds the value depends on where it was saved, so the grid is the answer.
            return $single
                ? $redirect->setPath('theme/design_config/index', [])
                : $redirect->setPath($route, [...$params, $storeParameter => $storeId]);
        }

        return $redirect->setPath($route, $single ? $params : [...$params, $storeParameter => $storeId]);
    }

    private function refuse(Redirect $redirect, string $message): Redirect
    {
        $this->messageManager->addErrorMessage($message);

        return $redirect->setPath('admin/dashboard/index');
    }
}
