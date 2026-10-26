<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Magento\Framework\App\State;
use Magento\Framework\Component\ComponentRegistrar;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Framework\View\DesignInterface;
use Throwable;

/**
 * Static URLs for the bar's own files, and for the scripts of sections other modules add.
 *
 * The theme is passed explicitly rather than left to the asset repository. On a full page
 * cache hit nothing ever initialises the design, so the repository falls back to an empty
 * theme path and builds a "frontend/_view/..." URL that no static handler will serve.
 * Asking for the configured theme id makes the repository resolve it through the cached
 * theme provider instead, which does not need a rendered page.
 *
 * URLs carry the built file's modification time. Magento's static version only changes on
 * a deploy, so without this a rebuilt bar keeps being served from the browser cache and
 * appears not to have changed at all.
 */
class AssetUrl
{
    private const MODULE_NAME = 'Siteation_DebugBar';
    private const MODULE = self::MODULE_NAME . '::';

    /** @var array<string, string> */
    private array $urls = [];

    public function __construct(
        private readonly AssetRepository $assetRepository,
        private readonly DesignInterface $design,
        private readonly State $appState,
        private readonly ComponentRegistrar $registrar
    ) {
    }

    public function for(string $file): string
    {
        return $this->forAsset(self::MODULE . $file);
    }

    /**
     * A file from any module, named the way Magento names one: `Vendor_Module::js/file.js`.
     * This is how a section from another module gets its scripts onto the page.
     */
    public function forAsset(string $asset): string
    {
        return $this->urls[$asset] ??= $this->build($asset);
    }

    private function build(string $asset): string
    {
        try {
            $url = $this->assetRepository->getUrlWithParams($asset, $this->params());
        } catch (Throwable) {
            $url = $this->assetRepository->getUrl($asset);
        }

        $version = $this->version($asset);

        if ($version === null) {
            return $url;
        }

        return $url . (str_contains($url, '?') ? '&' : '?') . 'v=' . $version;
    }

    private function version(string $asset): ?string
    {
        [$module, $file] = array_pad(explode('::', $asset, 2), 2, '');
        $root = $file === '' ? null : $this->registrar->getPath(ComponentRegistrar::MODULE, $module);

        if ($root === null) {
            return null;
        }

        $path = $root . '/view/base/web/' . $file;

        if (!is_file($path)) {
            return null;
        }

        $modified = filemtime($path);

        return $modified === false ? null : dechex($modified);
    }

    /**
     * @return array<string, mixed>
     */
    private function params(): array
    {
        $area = $this->appState->getAreaCode();
        $params = ['area' => $area];
        $themeId = $this->design->getConfigurationDesignTheme($area);

        if ($themeId) {
            $params['themeId'] = $themeId;
        }

        return $params;
    }
}
