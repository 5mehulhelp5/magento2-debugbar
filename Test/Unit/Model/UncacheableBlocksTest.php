<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\Filesystem\Driver\File as FileDriver;
use Magento\Framework\View\Design\ThemeInterface;
use Magento\Framework\View\DesignInterface;
use Magento\Framework\View\File;
use Magento\Framework\View\File\CollectorInterface;
use Magento\Framework\View\Layout;
use Magento\Framework\View\Layout\Element;
use Magento\Framework\View\Layout\ProcessorInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\UncacheableBlocks;

/**
 * The block and the file a developer is sent to.
 *
 * Naming the wrong file is worse than naming none: the developer removes an attribute that
 * was never there and the page stays uncached.
 */
class UncacheableBlocksTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        $this->dir = sys_get_temp_dir() . '/ndb-layout-' . bin2hex(random_bytes(4));
        mkdir($this->dir);
    }

    protected function tearDown(): void
    {
        array_map('unlink', glob($this->dir . '/*') ?: []);
        rmdir($this->dir);
    }

    #[Test]
    public function eachBlockIsTracedToTheFileThatMarkedIt(): void
    {
        // default.xml loads first and also declares the block, without the attribute. It is
        // not the file that made the page uncacheable, so it must not be the one named.
        $default = $this->file('default', '<block name="stock.notice"/>');
        $product = $this->file('catalog_product_view', '<block name="stock.notice" cacheable="false"/>');

        $blocks = $this->finder([
            'default' => [$default],
            'catalog_product_view' => [$product],
        ])->find($this->layout(['stock.notice']));

        $this->assertSame(
            [['name' => 'stock.notice', 'handle' => 'catalog_product_view', 'file' => $product]],
            $blocks
        );
    }

    #[Test]
    public function aBlockThatWasRemovedFromThePageIsNotBlamed(): void
    {
        // Layout::isCacheable() skips a cacheable="false" node whose block is not in the
        // structure, after a remove="true" for example. Blaming it would send the developer
        // after a block the page does not have.
        $blocks = $this->finder([])->find($this->layout(['stock.notice', 'gone'], present: ['stock.notice']));

        $this->assertSame(['stock.notice'], array_column($blocks, 'name'));
    }

    #[Test]
    public function aBlockFoundInNoFileSaysSoRatherThanGuessing(): void
    {
        $other = $this->file('default', '<block name="something.else" cacheable="false"/>');

        $blocks = $this->finder(['default' => [$other]])->find($this->layout(['stock.notice']));

        $this->assertNull($blocks[0]['handle']);
        $this->assertNull($blocks[0]['file']);
    }

    #[Test]
    public function aCacheablePageCostsNoFileReads(): void
    {
        $source = $this->createMock(CollectorInterface::class);
        $source->expects($this->never())->method('getFiles');

        $this->assertSame([], $this->finder([], $source)->find($this->layout([])));
    }

    private function file(string $handle, string $body): string
    {
        $path = $this->dir . '/' . $handle . '.xml';
        file_put_contents($path, '<?xml version="1.0"?><page><body>' . $body . '</body></page>');

        return $path;
    }

    /**
     * @param list<string> $uncacheable
     * @param list<string>|null $present
     */
    private function layout(array $uncacheable, ?array $present = null): Layout
    {
        $blocks = implode('', array_map(
            static fn (string $name): string => sprintf('<block name="%s" cacheable="false"/>', $name),
            $uncacheable
        ));
        $root = simplexml_load_string(
            '<layout><body>' . $blocks . '<block name="fine"/></body></layout>',
            Element::class
        );
        $present ??= $uncacheable;

        $update = $this->createStub(ProcessorInterface::class);
        $update->method('getHandles')->willReturn(['default', 'catalog_product_view']);

        $layout = $this->createStub(Layout::class);
        $layout->method('getNode')->willReturn($root);
        $layout->method('hasElement')
            ->willReturnCallback(static fn (string $name): bool => in_array($name, $present, true));
        $layout->method('getUpdate')->willReturn($update);

        return $layout;
    }

    private function fileAt(string $path): File
    {
        $file = $this->createStub(File::class);
        $file->method('getFilename')->willReturn($path);

        return $file;
    }

    /**
     * @param array<string, list<string>> $filesByHandle
     */
    private function finder(array $filesByHandle, ?CollectorInterface $source = null): UncacheableBlocks
    {
        if ($source === null) {
            $source = $this->createStub(CollectorInterface::class);
            $source->method('getFiles')->willReturnCallback(
                fn ($theme, string $pattern): array => array_map(
                    fn (string $path): File => $this->fileAt($path),
                    $filesByHandle[basename($pattern, '.xml')] ?? []
                )
            );
        }

        $design = $this->createStub(DesignInterface::class);
        $design->method('getDesignTheme')->willReturn($this->createStub(ThemeInterface::class));

        $callSites = $this->createStub(CallSiteResolver::class);
        $callSites->method('relativePath')->willReturnArgument(0);

        return new UncacheableBlocks($source, $design, new FileDriver(), $callSites);
    }
}
