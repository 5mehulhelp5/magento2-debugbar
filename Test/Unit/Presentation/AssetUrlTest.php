<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Presentation;

use Magento\Framework\App\State;
use Magento\Framework\Component\ComponentRegistrar;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Framework\View\DesignInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Presentation\AssetUrl;

/**
 * A section from another module loads its scripts through the same URLs as the bar's own,
 * so a rebuilt script of theirs is not served stale from the browser cache either.
 */
class AssetUrlTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        $this->root = sys_get_temp_dir() . '/ndb-asset-' . bin2hex(random_bytes(4));
        mkdir($this->root . '/view/base/web/js', 0700, true);
        file_put_contents($this->root . '/view/base/web/js/section.js', '');
        touch($this->root . '/view/base/web/js/section.js', 1700000000);
    }

    protected function tearDown(): void
    {
        unlink($this->root . '/view/base/web/js/section.js');
        rmdir($this->root . '/view/base/web/js');
        rmdir($this->root . '/view/base/web');
        rmdir($this->root . '/view/base');
        rmdir($this->root . '/view');
        rmdir($this->root);
    }

    #[Test]
    public function anotherModulesScriptIsVersionedByItsOwnFile(): void
    {
        $this->assertSame(
            'https://example.test/static/Vendor_Module/js/section.js?v=' . dechex(1700000000),
            $this->assets()->forAsset('Vendor_Module::js/section.js')
        );
    }

    #[Test]
    public function aFileThatIsNotThereIsStillAUrlJustNotAVersionedOne(): void
    {
        $this->assertSame(
            'https://example.test/static/Vendor_Module/js/missing.js',
            $this->assets()->forAsset('Vendor_Module::js/missing.js')
        );
    }

    private function assets(): AssetUrl
    {
        $repository = $this->createStub(AssetRepository::class);
        $repository->method('getUrlWithParams')->willReturnCallback(
            static fn (string $asset): string => 'https://example.test/static/' . str_replace('::', '/', $asset)
        );

        $state = $this->createStub(State::class);
        $state->method('getAreaCode')->willReturn('frontend');

        $registrar = $this->createStub(ComponentRegistrar::class);
        $registrar->method('getPath')->willReturnCallback(
            fn (string $type, string $module): ?string => $module === 'Vendor_Module' ? $this->root : null
        );

        return new AssetUrl($repository, $this->createStub(DesignInterface::class), $state, $registrar);
    }
}
