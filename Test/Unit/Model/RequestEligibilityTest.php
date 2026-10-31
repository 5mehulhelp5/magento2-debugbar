<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\AreaList;
use Magento\Framework\App\Request\Http as HttpRequest;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\AccessKey;
use Siteation\DebugBar\Model\ClientAddress;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\RequestEligibility;

class RequestEligibilityTest extends TestCase
{
    #[Test]
    public function readingIsRefusedWithoutTheKey(): void
    {
        // The wiring, not the comparison: an endpoint that answers someone the collector
        // would have ignored is a way around the gate rather than a thing behind it.
        $this->assertFalse($this->eligibility(key: false)->allowsRead());
        $this->assertFalse($this->eligibility(key: false)->allows());
    }

    #[Test]
    public function readingIsRefusedWhenTheBarIsOff(): void
    {
        $this->assertFalse($this->eligibility(enabled: false)->allowsRead());
    }

    #[Test]
    public function readingIsRefusedFromAnAddressThatIsNotAllowed(): void
    {
        $this->assertFalse($this->eligibility(ip: false)->allowsRead());
    }

    #[Test]
    public function everythingSatisfiedLetsBothThrough(): void
    {
        $this->assertTrue($this->eligibility()->allowsRead());
        $this->assertTrue($this->eligibility()->allows());
    }

    #[Test]
    public function anAreaThatIsNotCollectedCanStillBeRead(): void
    {
        // The area list says what is worth profiling, not who may look. A profile of an
        // area since switched off was still collected for this developer.
        $eligibility = $this->eligibility(area: false);

        $this->assertTrue($eligibility->allowsRead());
        $this->assertFalse($eligibility->allows());
    }

    #[Test]
    public function theBarDoesNotProfileItsOwnEndpoints(): void
    {
        $eligibility = $this->eligibility(path: '/siteation_debugbar/profile/view/id/x/');

        $this->assertFalse($eligibility->allows(), 'Reading a profile would evict real ones.');
        $this->assertTrue($eligibility->allowsRead());
    }

    #[Test]
    public function theBarDoesNotProfileItsOwnEndpointsInTheAdminEither(): void
    {
        // In the admin the route follows the admin front name, so a prefix check on the path
        // never matched there and every click in the bar pushed a real profile out.
        $eligibility = $this->eligibility(
            path: '/secret_admin/siteation_debugbar/profile/view/id/x/',
            areaCode: 'adminhtml'
        );

        $this->assertFalse($eligibility->allows(), 'Reading a profile would evict real ones.');
        $this->assertTrue($eligibility->allowsRead());
    }

    #[Test]
    public function aPageThatOnlyMentionsTheFrontNameLaterIsStillProfiled(): void
    {
        $this->assertTrue($this->eligibility(
            path: '/secret_admin/catalog/product/edit/id/siteation_debugbar/',
            areaCode: 'adminhtml'
        )->allows());
        $this->assertTrue($this->eligibility(path: '/catalog/siteation_debugbar/')->allows());
    }

    #[Test]
    public function keylessAnswersOnlyAddressesThatCannotComeFromTheInternet(): void
    {
        foreach (['127.0.0.1', '::1', '10.0.0.4', '172.18.0.1', '192.168.1.20', 'fd00::1', 'fe80::1'] as $local) {
            $this->assertTrue($this->eligibility(client: $local)->allowsRead(), $local);
        }

        foreach (['203.0.113.7', '8.8.8.8', '2001:4860:4860::8888'] as $public) {
            $this->assertFalse($this->eligibility(client: $public)->allowsRead(), $public);
            $this->assertFalse($this->eligibility(client: $public)->allows(), $public);
        }
    }

    #[Test]
    public function aKeyOrAnAddressListLiftsTheLocalOnlyRule(): void
    {
        $key = str_repeat('k', 32);

        $this->assertTrue($this->eligibility(client: '203.0.113.7', configuredKey: $key)->allowsRead());
        $this->assertTrue($this->eligibility(client: '203.0.113.7', allowedIps: ['203.0.113.7'])->allowsRead());
    }

    #[Test]
    public function theStorefrontDoesNotHandOutAdminProfiles(): void
    {
        $storefront = $this->eligibility();

        $this->assertFalse($storefront->allowsReadOf($this->profileOf('adminhtml')));
        $this->assertTrue($storefront->allowsReadOf($this->profileOf('frontend')));
        $this->assertTrue($storefront->allowsReadOf($this->profileOf('webapi_rest')));
        $this->assertTrue($storefront->allowsReadOf(['id' => 'x']), 'A profile with no request section.');
    }

    #[Test]
    public function theAdminReadsEveryArea(): void
    {
        // The admin controllers delegate to the storefront ones behind the admin session, so
        // the same check sees the admin front name there.
        $admin = $this->eligibility(path: '/secret_admin/siteation_debugbar/profile/view/', areaCode: 'adminhtml');

        $this->assertTrue($admin->allowsReadOf($this->profileOf('adminhtml')));
        $this->assertTrue($admin->allowsReadOf($this->profileOf('frontend')));
    }

    /**
     * @return array<string, mixed>
     */
    private function profileOf(string $area): array
    {
        return ['id' => 'x', 'sections' => ['request' => ['summary' => ['area' => $area]]]];
    }

    /**
     * @param list<string> $allowedIps
     */
    private function eligibility(
        bool $enabled = true,
        bool $ip = true,
        bool $area = true,
        bool $key = true,
        string $path = '/checkout/cart/',
        string $areaCode = 'frontend',
        string $client = '127.0.0.1',
        string $configuredKey = '',
        array $allowedIps = []
    ): RequestEligibility {
        $config = $this->createStub(Config::class);
        $config->method('isEnabled')->willReturn($enabled);
        $config->method('allowsIp')->willReturn($ip);
        $config->method('allowsArea')->willReturn($area);
        $config->method('accessKey')->willReturn($configuredKey);
        $config->method('allowedIps')->willReturn($allowedIps);

        $request = $this->createStub(HttpRequest::class);
        $request->method('getPathInfo')->willReturn($path);
        // As Http::getFrontName() does: the first segment of the path.
        $request->method('getFrontName')->willReturn(explode('/', trim($path, '/'))[0]);
        $request->method('getServer')->willReturn($client);

        $areaList = $this->createStub(AreaList::class);
        $areaList->method('getCodeByFrontName')->willReturn($areaCode);

        $accessKey = $this->createStub(AccessKey::class);
        $accessKey->method('allows')->willReturn($key);

        return new RequestEligibility(
            $config,
            $request,
            $areaList,
            $accessKey,
            new ClientAddress($request, $config)
        );
    }
}
