<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Controller;

use Magento\Backend\App\Action\Context;
use Magento\Backend\Model\View\Result\Redirect;
use Magento\Backend\Model\View\Result\RedirectFactory;
use Magento\Cms\Model\ResourceModel\Page as PageResource;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\AuthorizationInterface;
use Magento\Framework\Message\ManagerInterface;
use Magento\Store\Model\StoreManagerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Controller\Adminhtml\Entity\Edit;
use Siteation\DebugBar\Model\HomePage;

/**
 * The admin half of "Edit this page in the admin": where it sends you, and when it refuses.
 *
 * It skips the secret key check, so the role check is the whole of what stands between a
 * link and an edit screen, and it is asserted here rather than trusted.
 */
class AdminEntityEditTest extends TestCase
{
    /** @var array{0: string, 1: array<string, mixed>}|null */
    private ?array $redirectedTo = null;

    #[Test]
    public function aProductOpensInTheStoreViewItWasSeenIn(): void
    {
        $this->edit(['type' => 'product', 'id' => '42', 'store' => '3'])->execute();

        $this->assertSame(['catalog/product/edit', ['id' => 42, 'store' => 3]], $this->redirectedTo);
    }

    #[Test]
    public function singleStoreModeLeavesTheScopeOut(): void
    {
        $this->edit(['type' => 'category', 'id' => '9', 'store' => '1'], singleStore: true)->execute();

        $this->assertSame(['catalog/category/edit', ['id' => 9]], $this->redirectedTo);
    }

    #[Test]
    public function aCmsPageHasNoStoreScope(): void
    {
        $this->edit(['type' => 'cms_page', 'id' => '5', 'store' => '3'])->execute();

        $this->assertSame(['cms/page/edit', ['page_id' => 5]], $this->redirectedTo);
    }

    #[Test]
    public function aDesignSettingOpensTheStoreViewsDesignConfiguration(): void
    {
        $this->edit(['type' => 'design_config', 'id' => '0', 'store' => '3'])->execute();
        $this->assertSame(['theme/design_config/edit', ['scope' => 'stores', 'scope_id' => 3]], $this->redirectedTo);

        // With one store view the grid is the honest answer: which row holds the value
        // depends on where the merchant saved it.
        $this->edit(['type' => 'design_config', 'id' => '0', 'store' => '1'], singleStore: true)->execute();
        $this->assertSame(['theme/design_config/index', []], $this->redirectedTo);
    }

    #[Test]
    public function aCatalogSettingOpensTheCatalogSectionInTheStoreView(): void
    {
        $this->edit(['type' => 'catalog_config', 'id' => '0', 'store' => '3'])->execute();
        $this->assertSame(['adminhtml/system_config/edit', ['section' => 'catalog', 'store' => 3]], $this->redirectedTo);

        $this->edit(['type' => 'catalog_config', 'id' => '0', 'store' => '1'], singleStore: true)->execute();
        $this->assertSame(['adminhtml/system_config/edit', ['section' => 'catalog']], $this->redirectedTo);
    }

    #[Test]
    public function aSettingIsRefusedToARoleThatCannotOpenItsScreen(): void
    {
        $this->edit(['type' => 'catalog_config', 'id' => '0', 'store' => '3'], allowed: false)->execute();

        $this->assertSame(['admin/dashboard/index', []], $this->redirectedTo);
    }

    #[Test]
    public function theHomePageIsResolvedFromConfiguration(): void
    {
        $this->edit(['type' => 'cms_home', 'id' => '0', 'store' => '3'], homePage: 'home')->execute();
        $this->assertSame(['cms/page/edit', ['page_id' => 11]], $this->redirectedTo, 'looked up by identifier');

        $this->edit(['type' => 'cms_home', 'id' => '0', 'store' => '3'], homePage: 'home|17')->execute();
        $this->assertSame(['cms/page/edit', ['page_id' => 17]], $this->redirectedTo, 'the id after the bar wins');
    }

    #[Test]
    public function aRoleWithoutTheResourceIsSentToTheDashboard(): void
    {
        $this->edit(['type' => 'product', 'id' => '42'], allowed: false)->execute();

        $this->assertSame(['admin/dashboard/index', []], $this->redirectedTo);
    }

    #[Test]
    public function anUnknownTypeOrMissingIdIsSentToTheDashboard(): void
    {
        $this->edit(['type' => 'order', 'id' => '1'])->execute();
        $this->assertSame(['admin/dashboard/index', []], $this->redirectedTo);

        $this->edit(['type' => 'product', 'id' => 'abc'])->execute();
        $this->assertSame(['admin/dashboard/index', []], $this->redirectedTo);
    }

    /**
     * @param array<string, string> $params
     */
    private function edit(
        array $params,
        bool $allowed = true,
        bool $singleStore = false,
        string $homePage = ''
    ): Edit {
        $this->redirectedTo = null;

        $request = $this->createStub(RequestInterface::class);
        $request->method('getParam')->willReturnCallback(
            static fn (string $name): mixed => $params[$name] ?? null
        );

        $redirect = $this->createStub(Redirect::class);
        $redirect->method('setPath')->willReturnCallback(
            function (string $path, array $routeParams = []) use ($redirect): Redirect {
                $this->redirectedTo = [$path, $routeParams];

                return $redirect;
            }
        );
        $redirects = $this->createStub(RedirectFactory::class);
        $redirects->method('create')->willReturn($redirect);

        $authorization = $this->createStub(AuthorizationInterface::class);
        $authorization->method('isAllowed')->willReturn($allowed);

        $context = $this->createStub(Context::class);
        $context->method('getRequest')->willReturn($request);
        $context->method('getResultRedirectFactory')->willReturn($redirects);
        $context->method('getAuthorization')->willReturn($authorization);
        $context->method('getMessageManager')->willReturn($this->createStub(ManagerInterface::class));

        $scopeConfig = $this->createStub(ScopeConfigInterface::class);
        $scopeConfig->method('getValue')->willReturn($homePage);

        $stores = $this->createStub(StoreManagerInterface::class);
        $stores->method('isSingleStoreMode')->willReturn($singleStore);

        $pages = $this->createStub(PageResource::class);
        $pages->method('checkIdentifier')->willReturn('11');

        return new Edit($context, $stores, new HomePage($scopeConfig, $pages));
    }
}
