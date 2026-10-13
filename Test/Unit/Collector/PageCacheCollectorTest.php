<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use Magento\Framework\App\Cache\StateInterface as CacheState;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\MaintenanceMode;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\State;
use Magento\Framework\HTTP\PhpEnvironment\Response;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Collector\PageCacheCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;

/**
 * The answer to "why is this page not cached", and the cases where the honest answer is a
 * different one.
 *
 * A wrong verdict does not throw. A stored page reported as refused sends a developer
 * hunting for a block that is not there, and a hit reported with no reasons reads as "the
 * bar found nothing wrong" about a page the application never generated.
 */
class PageCacheCollectorTest extends TestCase
{
    #[Test]
    public function aStoredPageIsReadFromWhatTheCacheWasOfferedNotWhatItSentAfterwards(): void
    {
        $collector = $this->collector();

        $offered = $this->response('public, max-age=86400, s-maxage=86400');
        $collector->layout(true, []);
        $collector->offered($offered);

        // Kernel::process() rewrites the headers once it has stored the page. Read last,
        // every stored page would look like one that was refused.
        $final = $this->response('no-store, no-cache, must-revalidate, max-age=0');
        $final->setHeader('Pragma', 'no-cache');
        $collector->finalize($final);

        $summary = $collector->summary();

        $this->assertSame(PageCacheCollector::STATUS_STORED, $summary['status']);
        $this->assertSame([], $summary['reasons']);
        $this->assertMatchesRegularExpression('/public.*s-maxage=86400/', $summary['cache_control']);
        $this->assertSame('', $summary['pragma'], 'the cache wrote that Pragma, the application did not');
    }

    #[Test]
    public function anUncacheableBlockIsTheReasonAndIsListedWithItsFile(): void
    {
        $collector = $this->collector(action: 'catalog_product_view');

        $collector->layout(false, [[
            'name' => 'product.info.stock',
            'handle' => 'catalog_product_view',
            'file' => 'app/code/Acme/Stock/view/frontend/layout/catalog_product_view.xml',
        ]]);
        $collector->finalize($this->response('no-store, no-cache, must-revalidate, max-age=0'));

        $summary = $collector->summary();

        $this->assertSame(PageCacheCollector::STATUS_NOT_CACHED, $summary['status']);
        $this->assertSame(
            ['layout'],
            array_column($summary['reasons'], 'code'),
            'the layout explains it, so not_public is not added on top'
        );
        $this->assertSame('product', $summary['page_type']);
        $this->assertSame(1, $summary['count']);
        $this->assertSame('catalog_product_view', $collector->payload()['items'][0]['handle']);
    }

    #[Test]
    public function aHitSaysServedFromCacheRatherThanListingNoReasons(): void
    {
        $collector = $this->collector();

        $collector->servedFromCache();
        $collector->finalize($this->response(''));

        $summary = $collector->summary();

        $this->assertSame(PageCacheCollector::STATUS_HIT, $summary['status']);
        $this->assertTrue($summary['served_from_cache']);
        $this->assertSame(0, $summary['reason_count']);
    }

    #[Test]
    public function everyReasonIsGivenInTheOrderMagentoChecksThem(): void
    {
        $collector = $this->collector(method: 'POST', enabled: false, maintenance: true);

        $collector->layout(false, []);
        $collector->finalize($this->response('', 500));

        $this->assertSame(
            ['disabled', 'method', 'maintenance', 'layout', 'status'],
            array_column($collector->summary()['reasons'], 'code')
        );
    }

    #[Test]
    public function aPageWithNoLayoutIsToldApartFromOneMadePrivateAfterwards(): void
    {
        $redirect = $this->collector();
        $redirect->finalize($this->response('no-store'));

        $private = $this->collector();
        $private->layout(true, []);
        $private->finalize($this->response('private, max-age=0'));

        $this->assertSame('no_layout', $redirect->summary()['reasons'][0]['code']);
        $this->assertSame('not_public', $private->summary()['reasons'][0]['code']);
        $this->assertStringContainsString('private', $private->summary()['reasons'][0]['text']);
    }

    #[Test]
    public function varnishIsOnlyEverOfferedThePageNeverSeenStoringIt(): void
    {
        $collector = $this->collector(type: 2);

        $collector->layout(true, []);
        $collector->finalize($this->response('public, max-age=86400, s-maxage=86400'));

        $this->assertSame(PageCacheCollector::STATUS_CACHEABLE, $collector->summary()['status']);
    }

    #[Test]
    public function theAdminIsNotAPageTheCacheAppliesTo(): void
    {
        $collector = $this->collector(area: 'adminhtml');
        $collector->finalize($this->response('no-store'));

        $summary = $collector->summary();

        $this->assertSame(PageCacheCollector::STATUS_NOT_APPLICABLE, $summary['status']);
        $this->assertSame([], $summary['reasons']);
    }

    #[Test]
    public function cookiesAreKeptByNameOnly(): void
    {
        $collector = $this->collector();

        $offered = $this->response('public, max-age=86400, s-maxage=86400');
        $offered->getHeaders()->addHeaderLine('Set-Cookie', 'PHPSESSID=secret-session-id; path=/');
        $collector->layout(true, []);
        $collector->offered($offered, ['form_key']);
        $collector->finalize($this->response('no-store'));

        $summary = $collector->summary();

        $this->assertSame(['form_key', 'PHPSESSID'], $summary['set_cookies']);
        $this->assertStringNotContainsString('secret-session-id', (string) json_encode($summary));
    }

    #[Test]
    public function oneLayoutThatRefusesIsEnough(): void
    {
        $collector = $this->collector();

        $collector->layout(false, []);
        $collector->layout(true, []);
        $collector->finalize($this->response(''));

        $this->assertFalse($collector->summary()['layout_cacheable']);
    }

    private function response(string $cacheControl, int $status = 200): Response
    {
        $response = new Response();
        $response->setHttpResponseCode($status);

        if ($cacheControl !== '') {
            $response->setHeader('Cache-Control', $cacheControl);
        }

        return $response;
    }

    private function collector(
        string $method = 'GET',
        string $area = 'frontend',
        string $action = 'cms_page_view',
        bool $enabled = true,
        int $type = 1,
        bool $maintenance = false
    ): PageCacheCollector {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getMethod')->willReturn($method);
        $request->method('getFullActionName')->willReturn($action);
        $request->method('isSecure')->willReturn(true);

        $state = $this->createStub(State::class);
        $state->method('getAreaCode')->willReturn($area);

        $config = $this->createStub(ScopeConfigInterface::class);
        $config->method('getValue')->willReturnMap([
            [
                'system/full_page_cache/caching_application',
                ScopeConfigInterface::SCOPE_TYPE_DEFAULT,
                null,
                (string) $type,
            ],
            ['system/full_page_cache/ttl', ScopeConfigInterface::SCOPE_TYPE_DEFAULT, null, '86400'],
        ]);

        $cacheState = $this->createStub(CacheState::class);
        $cacheState->method('isEnabled')->willReturn($enabled);

        $maintenanceMode = $this->createStub(MaintenanceMode::class);
        $maintenanceMode->method('isOn')->willReturn($maintenance);

        return new PageCacheCollector(
            new Redactor(),
            new Clock(),
            $request,
            $state,
            $config,
            $cacheState,
            $maintenanceMode
        );
    }
}
