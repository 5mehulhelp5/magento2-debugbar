<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Backend\App\Area\FrontNameResolver;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\State;
use Magento\Store\Api\Data\StoreInterface;
use Magento\Store\Model\StoreManagerInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\AdminEditLink;
use Siteation\DebugBar\Model\Config;

/**
 * The storefront half of "Edit this page in the admin".
 *
 * Everything it decides is a string built from the request and configuration, and the two
 * ways to get it wrong are silent: a link on a page it does not belong on, and a link to
 * the storefront's host rather than the admin's.
 */
class AdminEditLinkTest extends TestCase
{
    #[Test]
    public function aProductPageLinksToTheAdminRouteWithItsIdAndStore(): void
    {
        $link = $this->link('catalog_product_view', ['id' => '42']);

        $this->assertSame(
            'https://shop.test/admin/siteation_debugbar/entity/edit/type/product/id/42/store/3/',
            $link->forCurrentPage()
        );
    }

    #[Test]
    public function categoryAndCmsPagesReadTheirOwnIdParameter(): void
    {
        $this->assertStringContainsString(
            '/type/category/id/9/',
            $this->link('catalog_category_view', ['id' => '9'])->forCurrentPage()
        );
        $this->assertStringContainsString(
            '/type/cms_page/id/5/',
            $this->link('cms_page_view', ['page_id' => '5'])->forCurrentPage()
        );
    }

    #[Test]
    public function theHomePageLeavesItsIdToTheAdminSide(): void
    {
        $this->assertStringContainsString(
            '/type/cms_home/id/0/store/3/',
            $this->link('cms_index_index')->forCurrentPage()
        );
    }

    #[Test]
    public function aPageNoAdminScreenEditsGetsNoLink(): void
    {
        $this->assertSame('', $this->link('checkout_cart_index')->forCurrentPage());
        $this->assertSame('', $this->link('catalog_product_view', ['id' => ''])->forCurrentPage());
        $this->assertSame('', $this->link('catalog_product_view', ['id' => '-1'])->forCurrentPage());
    }

    #[Test]
    public function noLinkOutsideTheStorefrontOrWithTheSectionOff(): void
    {
        $this->assertSame('', $this->link('catalog_product_view', ['id' => '1'], area: 'adminhtml')->forCurrentPage());
        $this->assertSame('', $this->link('catalog_product_view', ['id' => '1'], seo: false)->forCurrentPage());
    }

    #[Test]
    public function aCustomAdminUrlAndPathAreFollowed(): void
    {
        $link = $this->link('catalog_product_view', ['id' => '1'], config: [
            FrontNameResolver::XML_PATH_USE_CUSTOM_ADMIN_URL => '1',
            FrontNameResolver::XML_PATH_CUSTOM_ADMIN_URL => 'https://backoffice.test',
        ], frontName: 'secret_admin');

        $this->assertStringStartsWith(
            'https://backoffice.test/secret_admin/siteation_debugbar/',
            $link->forCurrentPage()
        );
    }

    #[Test]
    public function withoutRewritesTheUrlGoesThroughIndexPhp(): void
    {
        $link = $this->link('catalog_product_view', ['id' => '1'], config: ['web/seo/use_rewrites' => '0']);

        $this->assertStringStartsWith('https://shop.test/index.php/admin/', $link->forCurrentPage());
    }

    #[Test]
    public function anAdminWithoutHttpsGetsTheUnsecureBaseUrl(): void
    {
        $link = $this->link('catalog_product_view', ['id' => '1'], config: ['web/secure/use_in_adminhtml' => '0']);

        $this->assertStringStartsWith('http://shop.test/admin/', $link->forCurrentPage());
    }

    /**
     * @param array<string, string> $params
     * @param array<string, string> $config
     */
    private function link(
        string $action,
        array $params = [],
        string $area = 'frontend',
        bool $seo = true,
        array $config = [],
        string $frontName = 'admin'
    ): AdminEditLink {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getFullActionName')->willReturn($action);
        $request->method('getParam')->willReturnCallback(
            static fn (string $name): mixed => $params[$name] ?? null
        );

        $state = $this->createStub(State::class);
        $state->method('getAreaCode')->willReturn($area);

        $settings = $this->createStub(Config::class);
        $settings->method('collects')->willReturn($seo);

        $resolver = $this->createStub(FrontNameResolver::class);
        $resolver->method('getFrontName')->willReturn($frontName);

        $values = $config + [
            'web/secure/base_url' => 'https://shop.test/',
            'web/unsecure/base_url' => 'http://shop.test/',
            'web/secure/use_in_adminhtml' => '1',
            'web/seo/use_rewrites' => '1',
        ];
        $scopeConfig = $this->createStub(ScopeConfigInterface::class);
        $scopeConfig->method('getValue')->willReturnCallback(
            static fn (string $path): ?string => $values[$path] ?? null
        );
        $scopeConfig->method('isSetFlag')->willReturnCallback(
            static fn (string $path): bool => (bool) ($values[$path] ?? false)
        );

        $store = $this->createStub(StoreInterface::class);
        $store->method('getId')->willReturn(3);
        $stores = $this->createStub(StoreManagerInterface::class);
        $stores->method('getStore')->willReturn($store);

        return new AdminEditLink($request, $state, $settings, $resolver, $scopeConfig, $stores);
    }
}
