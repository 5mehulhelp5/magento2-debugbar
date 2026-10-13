<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Controller\Adminhtml\Profile;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultInterface;
use Siteation\DebugBar\Controller\Profile\History as StorefrontHistory;

/**
 * Serves the list of recent profiles for the History section in the admin.
 *
 * In the admin the bar's URLs are built by the backend URL model, so they point here, under
 * the admin path and with a secret key. Without this the admin answered its own 404 page
 * and the bar said "The response was not JSON". The work, and the gate on whether the bar
 * may answer at all, stay in the storefront controller.
 */
class History extends Action implements HttpGetActionInterface
{
    /** Every logged in admin: the bar is shown to all of them. */
    public const ADMIN_RESOURCE = 'Magento_Backend::admin';

    /**
     * @param Context $context
     * @param StorefrontHistory $storefront
     */
    public function __construct(Context $context, private readonly StorefrontHistory $storefront)
    {
        parent::__construct($context);
    }

    /**
     * @inheritDoc
     */
    public function execute(): ResultInterface
    {
        return $this->storefront->execute();
    }
}
