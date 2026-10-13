<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Cms\Model\ResourceModel\Page as PageResource;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Throwable;

/**
 * Which CMS page is a store view's home page.
 *
 * The home page is named in configuration rather than in the URL, as an identifier or as
 * "identifier|id" when two pages share one. Magento's own Cms\Helper\Page reads it the same
 * way.
 */
class HomePage
{
    private const XML_PATH_HOME_PAGE = 'web/default/cms_home_page';

    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly PageResource $pageResource
    ) {
    }

    /**
     * @return int the page id, 0 when none is set or it cannot be found
     */
    public function id(int $storeId): int
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
}
