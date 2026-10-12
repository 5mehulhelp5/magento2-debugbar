<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Controller\Adminhtml\Entity;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Cms\Model\ResourceModel\Page as PageResource;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Controller\Result\Redirect;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;
use Throwable;

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

    private const XML_PATH_HOME_PAGE = 'web/default/cms_home_page';

    /**
     * @var string[]
     */
    protected $_publicActions = ['edit'];

    public function __construct(
        Context $context,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly StoreManagerInterface $storeManager,
        private readonly PageResource $pageResource
    ) {
        parent::__construct($context);
    }

    public function execute(): Redirect
    {
        $redirect = $this->resultRedirectFactory->create();
        $type = (string) $this->getRequest()->getParam('type');
        $storeId = max(0, (int) $this->getRequest()->getParam('store'));
        $target = self::TARGETS[$type] ?? null;

        if ($target === null) {
            return $this->refuse($redirect, (string) __('The debug bar did not say what to edit.'));
        }

        [$route, $parameter, $resource, $scoped] = $target;

        if (!$this->_authorization->isAllowed($resource)) {
            return $this->refuse($redirect, (string) __('Your role is not allowed to edit this.'));
        }

        $id = $type === 'cms_home'
            ? $this->homePageId($storeId)
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
     * The home page is named in configuration rather than in the URL, as an identifier or as
     * "identifier|id" when two pages share one. Magento's own Cms\Helper\Page reads it the
     * same way.
     */
    private function homePageId(int $storeId): int
    {
        $value = (string) $this->scopeConfig->getValue(
            self::XML_PATH_HOME_PAGE,
            ScopeInterface::SCOPE_STORE,
            $storeId
        );
        $delimiter = strrpos($value, '|');

        if ($delimiter !== false) {
            return (int) substr($value, $delimiter + 1);
        }

        if ($value === '') {
            return 0;
        }

        try {
            return (int) $this->pageResource->checkIdentifier($value, $storeId);
        } catch (Throwable) {
            return 0;
        }
    }

    private function refuse(Redirect $redirect, string $message): Redirect
    {
        $this->messageManager->addErrorMessage($message);

        return $redirect->setPath('admin/dashboard/index');
    }
}
