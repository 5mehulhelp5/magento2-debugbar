<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\Filesystem\Driver\File as FileDriver;
use Magento\Framework\View\DesignInterface;
use Magento\Framework\View\File\CollectorInterface;
use SimpleXMLElement;
use Throwable;

/**
 * The layout files behind a handle, as the layout merge itself found them.
 *
 * The merge keeps no record of which file a node came from, so anything that wants to name
 * a file asks the same file collector the merge used, for the design theme the page was
 * rendered with. Shared by the Layout and Page cache sections, which would otherwise read
 * and parse the same files twice in one request.
 */
class LayoutFiles
{
    /** @var array<string, list<array{path: string, module: string, theme: string}>> */
    private array $files = [];

    /** @var array<string, SimpleXMLElement|false> */
    private array $parsed = [];

    public function __construct(
        private readonly CollectorInterface $fileSource,
        private readonly DesignInterface $design,
        private readonly FileDriver $driver
    ) {
    }

    /**
     * In the order the merge reads them: modules first, then the theme and its parents.
     *
     * @return list<array{path: string, module: string, theme: string}>
     */
    public function forHandle(string $handle): array
    {
        // A handle is a file name, so anything else in it is not one this can look up.
        if (!preg_match('/^[A-Za-z0-9_-]+$/', $handle)) {
            return [];
        }

        if (!array_key_exists($handle, $this->files)) {
            $this->files[$handle] = $this->collect($handle);
        }

        return $this->files[$handle];
    }

    public function parse(string $path): SimpleXMLElement|false
    {
        if (!array_key_exists($path, $this->parsed)) {
            try {
                $this->parsed[$path] = simplexml_load_string($this->driver->fileGetContents($path)) ?: false;
            } catch (Throwable) {
                $this->parsed[$path] = false;
            }
        }

        return $this->parsed[$path];
    }

    /**
     * @return list<array{path: string, module: string, theme: string}>
     */
    private function collect(string $handle): array
    {
        try {
            $files = [];

            foreach ($this->fileSource->getFiles($this->design->getDesignTheme(), $handle . '.xml') as $file) {
                $files[] = [
                    'path' => (string) $file->getFilename(),
                    'module' => (string) $file->getModule(),
                    'theme' => (string) $file->getTheme()?->getCode(),
                ];
            }

            return $files;
        } catch (Throwable) {
            return [];
        }
    }
}
