<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Plugin;

use Magento\Framework\App\Area;
use Magento\Framework\App\Http as AppHttp;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\HTTP\PhpEnvironment\Response;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\ProfileManager;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Model\RequestEligibility;
use Siteation\DebugBar\Plugin\App\HttpPlugin;
use Siteation\DebugBar\Presentation\BarInjector;

/**
 * The bar must never break the page it is debugging. These are the paths where that
 * promise is actually kept.
 */
class HttpPluginTest extends TestCase
{
    #[Test]
    public function itLeavesTheResponseAloneWhenNotEligible(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->expects($this->never())->method('begin');

        $response = $this->launch($this->plugin(eligible: false, manager: $manager));

        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aCollectorThatThrowsDoesNotTakeThePageWithIt(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->method('isCollecting')->willReturn(true);
        $manager->method('finalize')->willThrowException(new RuntimeException('collector exploded'));
        $manager->expects($this->once())->method('discard');

        $response = $this->launch($this->plugin(manager: $manager));

        $this->assertSame('page', $response->getContent(), 'The page must survive a broken collector.');
    }

    #[Test]
    public function aFailureToStartDoesNotTakeThePageWithIt(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->method('begin')->willThrowException(new RuntimeException('cannot start'));
        $manager->expects($this->once())->method('discard');

        $response = $this->launch($this->plugin(manager: $manager));

        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aStoreThatThrowsDoesNotTakeThePageWithIt(): void
    {
        $manager = $this->createStub(ProfileManager::class);
        $manager->method('isCollecting')->willReturn(true);
        $manager->method('finalize')->willReturn(['id' => 'x']);

        $store = $this->createStub(ProfileStore::class);
        $store->method('put')->willThrowException(new RuntimeException('disk full'));

        $response = $this->launch($this->plugin(manager: $manager, store: $store));

        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aRequestThatThrowsIsStillProfiled(): void
    {
        $manager = $this->createMock(ProfileManager::class);
        $manager->expects($this->once())->method('recordFailure');
        $manager->method('finalize')->willReturn(['id' => 'x']);

        $store = $this->createMock(ProfileStore::class);
        $store->expects($this->once())->method('put');

        $plugin = $this->plugin(manager: $manager, store: $store);

        // The crash is the request most worth keeping, and it used to be the only one with
        // no profile at all. Magento must still see the exception it would have seen.
        $this->expectException(RuntimeException::class);

        $plugin->aroundLaunch(
            $this->createStub(AppHttp::class),
            static fn (): Response => throw new RuntimeException('boom')
        );
    }

    #[Test]
    public function aFailureWhileRecordingAFailureStillRethrows(): void
    {
        $manager = $this->createStub(ProfileManager::class);
        $manager->method('recordFailure')->willThrowException(new RuntimeException('no collector'));

        $plugin = $this->plugin(manager: $manager);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('boom');

        $plugin->aroundLaunch(
            $this->createStub(AppHttp::class),
            static fn (): Response => throw new RuntimeException('boom')
        );
    }

    #[Test]
    public function aKeyPresentedInTheUrlIsTradedForACookieAfterTheApplicationHasRun(): void
    {
        // After proceed(), never before: the cookie manager resolves its domain through the
        // store, and at the top of launch() there is none.
        $order = [];

        $accessKey = $this->createStub(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(true);
        $accessKey->method('issueCookie')->willReturnCallback(
            static function () use (&$order): bool {
                $order[] = 'cookie';

                return true;
            }
        );

        $plugin = $this->plugin(accessKey: $accessKey);
        $response = new Response();

        $plugin->aroundLaunch(
            $this->createStub(AppHttp::class),
            static function () use (&$order, $response): Response {
                $order[] = 'proceed';

                return $response;
            }
        );

        $this->assertSame(['proceed', 'cookie'], $order);
    }

    #[Test]
    public function aCookieThatCouldNotBeSetIsSaidOutLoud(): void
    {
        // Otherwise the developer keeps pasting the key into every URL and never learns why.
        $accessKey = $this->createStub(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(true);
        $accessKey->method('issueCookie')->willReturn(false);

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())
            ->method('warning')
            ->with($this->stringContains('access key cookie'));

        $this->launch($this->plugin(accessKey: $accessKey, logger: $logger));
    }

    #[Test]
    public function noKeyInTheUrlMeansNoCookieAndNoWarning(): void
    {
        $accessKey = $this->createMock(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(false);
        $accessKey->expects($this->never())->method('issueCookie');

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->never())->method('warning');

        $this->launch($this->plugin(accessKey: $accessKey, logger: $logger));
    }

    #[Test]
    public function aKeyPresentedInTheUrlRedirectsToTheSameAddressWithoutIt(): void
    {
        $accessKey = $this->createMock(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(true);
        $accessKey->expects($this->once())->method('issueCookie')->willReturn(true);

        $store = $this->createMock(ProfileStore::class);
        $store->expects($this->once())->method('put');

        $manager = $this->createStub(ProfileManager::class);
        $manager->method('finalize')->willReturn(['id' => 'x']);

        $response = $this->launch($this->plugin(
            manager: $manager,
            store: $store,
            accessKey: $accessKey,
            request: $this->request('/women/tops.html?color=red&siteation_debugbar_key=secret&p=2')
        ));

        $this->assertSame(302, $response->getHttpResponseCode());
        $this->assertSame('/women/tops.html?color=red&p=2', $response->getHeader('Location')->getFieldValue());
        $this->assertSame('', $response->getContent(), 'A redirect carries no page and no bar.');
    }

    #[Test]
    public function theRedirectDropsTheQueryStringWhenTheKeyWasAllOfIt(): void
    {
        $response = $this->launch($this->plugin(
            accessKey: $this->urlKey(),
            request: $this->request('/checkout/cart/?siteation_debugbar_key=secret')
        ));

        $this->assertSame('/checkout/cart/', $response->getHeader('Location')->getFieldValue());
    }

    #[Test]
    public function theRedirectRemovesTheKeyUnderAnyNamePhpWouldHaveReadAsIt(): void
    {
        // PHP turns dots into underscores on the way into $_GET, so this is the same key.
        $response = $this->launch($this->plugin(
            accessKey: $this->urlKey(),
            request: $this->request('/?siteation.debugbar%5Fkey=secret&q=a%20b')
        ));

        $this->assertSame('/?q=a%20b', $response->getHeader('Location')->getFieldValue());
    }

    #[Test]
    public function aKeyThatIsNotInTheQueryStringNeverRedirectsToItself(): void
    {
        $response = $this->launch($this->plugin(
            accessKey: $this->urlKey(),
            request: $this->request('/catalog/product/view/id/5/siteation_debugbar_key/secret')
        ));

        $this->assertSame(200, $response->getHttpResponseCode());
        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aKeyPresentedAsAHeaderIsNotRedirected(): void
    {
        $accessKey = $this->createMock(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(false);
        $accessKey->expects($this->never())->method('issueCookie');

        $response = $this->launch($this->plugin(accessKey: $accessKey, request: $this->request('/')));

        $this->assertSame(200, $response->getHttpResponseCode());
        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aCookieThatCouldNotBeSetIsNotFollowedByARedirect(): void
    {
        // The next request would arrive with neither key nor cookie: no bar, and no way to
        // see why.
        $accessKey = $this->createStub(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(true);
        $accessKey->method('issueCookie')->willReturn(false);

        $response = $this->launch($this->plugin(
            accessKey: $accessKey,
            request: $this->request('/?siteation_debugbar_key=secret')
        ));

        $this->assertSame(200, $response->getHttpResponseCode());
        $this->assertSame('page', $response->getContent());
    }

    #[Test]
    public function aPostWithTheKeyInTheUrlIsNotRedirected(): void
    {
        $response = $this->launch($this->plugin(
            accessKey: $this->urlKey(),
            request: $this->request('/?siteation_debugbar_key=secret', get: false)
        ));

        $this->assertSame(200, $response->getHttpResponseCode());
    }

    #[Test]
    public function anAjaxRequestWithTheKeyInTheUrlIsNotRedirected(): void
    {
        $response = $this->launch($this->plugin(
            accessKey: $this->urlKey(),
            request: $this->request('/?siteation_debugbar_key=secret', ajax: true)
        ));

        $this->assertSame(200, $response->getHttpResponseCode());
    }

    #[Test]
    public function graphQlAndRestAreNotRedirected(): void
    {
        foreach (['graphql', 'webapi_rest'] as $area) {
            $response = $this->launch($this->plugin(
                accessKey: $this->urlKey(),
                request: $this->request('/graphql?query=x&siteation_debugbar_key=secret'),
                area: $area
            ));

            $this->assertSame(200, $response->getHttpResponseCode(), $area);
        }
    }

    #[Test]
    public function aRedirectTheApplicationAlreadySentIsLeftAlone(): void
    {
        $plugin = $this->plugin(
            accessKey: $this->urlKey(),
            request: $this->request('/old.html?siteation_debugbar_key=secret')
        );
        $response = new Response();
        $response->setRedirect('/new.html', 301);

        $plugin->aroundLaunch($this->createStub(AppHttp::class), static fn (): Response => $response);

        $this->assertSame(301, $response->getHttpResponseCode());
        $this->assertSame('/new.html', $response->getHeader('Location')->getFieldValue());
    }

    #[Test]
    public function theRedirectDoesNotWaitOnAProfileThatFailed(): void
    {
        $manager = $this->createStub(ProfileManager::class);
        $manager->method('finalize')->willThrowException(new RuntimeException('collector exploded'));

        $response = $this->launch($this->plugin(
            manager: $manager,
            accessKey: $this->urlKey(),
            request: $this->request('/?siteation_debugbar_key=secret')
        ));

        $this->assertSame(302, $response->getHttpResponseCode());
        $this->assertSame('/', $response->getHeader('Location')->getFieldValue());
    }

    private function launch(HttpPlugin $plugin): Response
    {
        $response = new Response();
        $response->setContent('page');

        $result = $plugin->aroundLaunch(
            $this->createStub(AppHttp::class),
            static fn (): Response => $response
        );

        $this->assertSame($response, $result);

        return $response;
    }

    private function plugin(
        bool $eligible = true,
        ?ProfileManager $manager = null,
        ?ProfileStore $store = null,
        ?AccessKey $accessKey = null,
        ?LoggerInterface $logger = null,
        ?HttpRequest $request = null,
        string $area = Area::AREA_FRONTEND
    ): HttpPlugin {
        $eligibility = $this->createStub(RequestEligibility::class);
        $eligibility->method('allows')->willReturn($eligible);
        $eligibility->method('area')->willReturn($area);

        return new HttpPlugin(
            $eligibility,
            $accessKey ?? $this->createStub(AccessKey::class),
            $manager ?? $this->createStub(ProfileManager::class),
            $store ?? $this->createStub(ProfileStore::class),
            $this->createStub(BarInjector::class),
            new Response(),
            $request ?? $this->request('/'),
            $logger ?? $this->createStub(LoggerInterface::class)
        );
    }

    private function request(string $uri, bool $get = true, bool $ajax = false): HttpRequest
    {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getRequestUri')->willReturn($uri);
        $request->method('isGet')->willReturn($get);
        $request->method('isAjax')->willReturn($ajax);

        return $request;
    }

    private function urlKey(): AccessKey
    {
        $accessKey = $this->createStub(AccessKey::class);
        $accessKey->method('wasPresentedInUrl')->willReturn(true);
        $accessKey->method('issueCookie')->willReturn(true);

        return $accessKey;
    }
}
