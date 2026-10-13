<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Controller;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Controller\Adminhtml\Profile as Admin;
use Siteation\DebugBar\Controller\Profile as Storefront;

class AdminProfileTest extends TestCase
{
    /**
     * In the admin the bar asks for /<admin>/siteation_debugbar/profile/<action>/, because the
     * backend URL model builds its links. Each of those needs an admin controller, or the admin
     * answers its own 404 page and the bar reports "The response was not JSON".
     *
     * @param class-string $admin
     * @param class-string $storefront
     */
    #[Test]
    #[DataProvider('actions')]
    public function theAdminAnswersWhatTheStorefrontWould(string $admin, string $storefront): void
    {
        $result = $this->createStub(ResultInterface::class);
        $inner = $this->createMock($storefront);
        $inner->expects($this->once())->method('execute')->willReturn($result);

        $context = $this->createStub(Context::class);
        $context->method('getRequest')->willReturn($this->createStub(RequestInterface::class));

        $this->assertSame($result, (new $admin($context, $inner))->execute());
        $this->assertSame('Magento_Backend::admin', $admin::ADMIN_RESOURCE);
    }

    /**
     * @return array<string, array{class-string, class-string}>
     */
    public static function actions(): array
    {
        return [
            'view' => [Admin\View::class, Storefront\View::class],
            'history' => [Admin\History::class, Storefront\History::class],
            'compare' => [Admin\Compare::class, Storefront\Compare::class],
        ];
    }
}
