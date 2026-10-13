<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Filesystem\Driver\File as FileDriver;
use Magento\Framework\View\Design\ThemeInterface;
use Magento\Framework\View\DesignInterface;
use Magento\Framework\View\File;
use Magento\Framework\View\File\CollectorInterface;
use Magento\Framework\View\Layout;
use Magento\Framework\View\Layout\ProcessorInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Collector\LayoutCollector;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\LayoutFiles;
use Siteation\DebugBar\Model\Redactor;

/**
 * The handles a page loaded, and which of them put each block there.
 *
 * A wrong answer does not throw. A block credited to the wrong handle sends a developer to
 * edit a file that did not add it, and a handle missing from the list reads as "this page
 * never loaded that XML".
 */
class LayoutCollectorTest extends TestCase
{
    private string $dir;

    protected function setUp(): void
    {
        $this->dir = sys_get_temp_dir() . '/ndb-handles-' . bin2hex(random_bytes(4));
        mkdir($this->dir);
    }

    protected function tearDown(): void
    {
        array_map('unlink', glob($this->dir . '/*') ?: []);
        rmdir($this->dir);
    }

    #[Test]
    public function handlesAreListedInLoadOrderWithTheFilesBehindEach(): void
    {
        $module = $this->file('Magento_Catalog-default', '<block name="header"/>');
        $theme = $this->file('Nft-default', '<block name="footer"/>');
        $product = $this->file('catalog_product_view', '<block name="product.info"/>');

        $collector = $this->collector([
            'default' => [[$module, 'Magento_Catalog', ''], [$theme, 'Magento_Theme', 'Nebula/Nft']],
            'catalog_product_view' => [[$product, 'Magento_Catalog', '']],
        ]);
        $collector->generated($this->layout(['default', 'catalog_product_view'], ['header', 'footer', 'product.info']));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $items = $collector->payload()['items'];

        $this->assertSame(['default', 'catalog_product_view'], array_column($items, 'handle'));
        $this->assertSame(
            [
                ['file' => $module, 'module' => 'Magento_Catalog', 'theme' => ''],
                ['file' => $theme, 'module' => 'Magento_Theme', 'theme' => 'Nebula/Nft'],
            ],
            $items[0]['files']
        );
        $this->assertSame([2, 1], array_column($items, 'block_count'));

        $summary = $collector->summary();
        $this->assertSame(2, $summary['handle_count']);
        $this->assertSame(3, $summary['file_count']);
        $this->assertSame(3, $summary['block_count']);
    }

    #[Test]
    public function aBlockBelongsToTheFirstHandleThatDeclaresIt(): void
    {
        // The product handle declares the block again to move it. It did not add it, and
        // filtering the Blocks section by that handle must not claim it did.
        $default = $this->file('default', '<block name="breadcrumbs"/>');
        $product = $this->file('catalog_product_view', '<block name="breadcrumbs"/><block name="product.info"/>');

        $collector = $this->collector([
            'default' => [[$default, 'Magento_Theme', '']],
            'catalog_product_view' => [[$product, 'Magento_Catalog', '']],
        ]);
        $collector->generated($this->layout(['default', 'catalog_product_view'], ['breadcrumbs', 'product.info']));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame(
            ['breadcrumbs' => 'default', 'product.info' => 'catalog_product_view'],
            $collector->payload()['blocks']
        );
        $this->assertSame([1, 1], array_column($collector->payload()['items'], 'block_count'));
    }

    #[Test]
    public function aBlockALaterFileRemovedIsNotCreditedToAnyHandle(): void
    {
        $default = $this->file('default', '<block name="compare.link"/><block name="minicart"/>');

        $collector = $this->collector(['default' => [[$default, 'Magento_Theme', '']]]);
        $collector->generated($this->layout(['default'], ['minicart']));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame(['minicart' => 'default'], $collector->payload()['blocks']);
    }

    #[Test]
    public function aSeparateLayoutKeepsItsHandlesAndItsBlocks(): void
    {
        $default = $this->file('default', '<block name="header"/>');
        $email = $this->file('sales_email_order_items', '<block name="items"/>');

        $collector = $this->collector([
            'default' => [[$default, 'Magento_Theme', '']],
            'sales_email_order_items' => [[$email, 'Magento_Sales', '']],
        ]);
        $collector->generated($this->layout(['default'], ['header']));
        $collector->generated($this->layout(['sales_email_order_items'], ['items']));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame(
            ['default', 'sales_email_order_items'],
            array_column($collector->payload()['items'], 'handle')
        );
        $this->assertSame(['page', 'separate'], array_column($collector->payload()['items'], 'layout'));
        $this->assertSame(
            ['header' => 'default', 'items' => 'sales_email_order_items'],
            $collector->payload()['blocks']
        );
    }

    #[Test]
    public function thePageIsListedBeforeALayoutThatWasGeneratedAheadOfIt(): void
    {
        // Prices render through a layout of their own, generated while the page's blocks are
        // being built, so it finishes first. Listed in that order, the cart's handles started
        // with catalog_product_prices.
        $prices = $this->file('catalog_product_prices', '<block name="render.product.prices"/>');
        $default = $this->file('default', '<block name="header"/>');

        $collector = $this->collector([
            'catalog_product_prices' => [[$prices, 'Magento_Catalog', '']],
            'default' => [[$default, 'Magento_Theme', '']],
        ]);
        $collector->generated($this->layout(['catalog_product_prices'], ['render.product.prices']));
        $collector->generated($this->layout(['default', 'checkout_cart_index'], ['header']));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $items = $collector->payload()['items'];

        $this->assertSame(
            ['default', 'checkout_cart_index', 'catalog_product_prices'],
            array_column($items, 'handle')
        );
        $this->assertSame(['page', 'page', 'separate'], array_column($items, 'layout'));
    }

    #[Test]
    public function aHandleAFilePullsInIsListedAfterItAndItsBlocksAreCreditedToIt(): void
    {
        // The page never asks for checkout_cart_item_renderers. The cart's own file does,
        // with an update, and that is where the item renderers come from.
        $cart = $this->file(
            'checkout_cart_index',
            '<block name="checkout.cart"/>',
            '<update handle="checkout_cart_item_renderers"/>'
        );
        $renderers = $this->file('checkout_cart_item_renderers', '<block name="checkout.cart.item.renderers"/>');

        $collector = $this->collector([
            'checkout_cart_index' => [[$cart, 'Magento_Checkout', '']],
            'checkout_cart_item_renderers' => [[$renderers, 'Magento_Checkout', '']],
        ]);
        $collector->generated(
            $this->layout(['checkout_cart_index'], ['checkout.cart', 'checkout.cart.item.renderers'])
        );
        $collector->finalize($this->createStub(ResponseInterface::class));

        $items = $collector->payload()['items'];

        $this->assertSame(['checkout_cart_index', 'checkout_cart_item_renderers'], array_column($items, 'handle'));
        $this->assertSame([null, 'checkout_cart_index'], array_column($items, 'via'));
        $this->assertSame(
            [
                'checkout.cart.item.renderers' => 'checkout_cart_item_renderers',
                'checkout.cart' => 'checkout_cart_index',
            ],
            $collector->payload()['blocks']
        );
    }

    #[Test]
    public function handlesThatUpdateEachOtherAreEachListedOnce(): void
    {
        $first = $this->file('first', '', '<update handle="second"/>');
        $second = $this->file('second', '', '<update handle="first"/>');

        $collector = $this->collector([
            'first' => [[$first, 'Acme_Loop', '']],
            'second' => [[$second, 'Acme_Loop', '']],
        ]);
        $collector->generated($this->layout(['first'], []));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertSame(['first', 'second'], array_column($collector->payload()['items'], 'handle'));
    }

    #[Test]
    public function everyBlockOfABusyHandleIsKeptAndNoneIsMistakenForASecret(): void
    {
        // default declares more blocks than the redactor keeps of one array, and the
        // customer section blocks have "session" in their names. Through the redactor the
        // map would come back truncated, with some names replaced by "[redacted]".
        $names = array_map(static fn (int $i): string => 'block.' . $i, range(1, 150));
        $names[] = 'customer.session.data';
        $default = $this->file('default', implode('', array_map(
            static fn (string $name): string => sprintf('<block name="%s"/>', $name),
            $names
        )));

        $collector = $this->collector(['default' => [[$default, 'Magento_Theme', '']]]);
        $collector->generated($this->layout(['default'], $names));
        $collector->finalize($this->createStub(ResponseInterface::class));

        $blocks = $collector->payload()['blocks'];

        $this->assertCount(151, $blocks);
        $this->assertSame('default', $blocks['customer.session.data']);
    }

    #[Test]
    public function nothingIsReadWhileThePageIsRendering(): void
    {
        // The file lookup is the expensive part. Done in the middle of the render, its time
        // would be charged to whichever block happened to come next.
        $source = $this->createMock(CollectorInterface::class);
        $source->expects($this->never())->method('getFiles');

        $collector = $this->collector([], $source);
        $collector->generated($this->layout(['default'], []));

        $this->assertSame([], $collector->payload()['items']);
    }

    #[Test]
    public function resetForgetsTheLastRequest(): void
    {
        $default = $this->file('default', '<block name="header"/>');

        $collector = $this->collector(['default' => [[$default, 'Magento_Theme', '']]]);
        $collector->generated($this->layout(['default'], ['header']));
        $collector->finalize($this->createStub(ResponseInterface::class));
        $collector->reset();

        $this->assertSame(['items' => [], 'blocks' => []], $collector->payload());
        $this->assertSame(0, $collector->summary()['handle_count']);
    }

    private function file(string $name, string $body, string $updates = ''): string
    {
        $path = $this->dir . '/' . $name . '.xml';
        file_put_contents($path, '<?xml version="1.0"?><page>' . $updates . '<body>' . $body . '</body></page>');

        return $path;
    }

    /**
     * @param list<string> $handles
     * @param list<string> $present
     */
    private function layout(array $handles, array $present): Layout
    {
        $update = $this->createStub(ProcessorInterface::class);
        $update->method('getHandles')->willReturn($handles);

        $layout = $this->createStub(Layout::class);
        $layout->method('getUpdate')->willReturn($update);
        $layout->method('hasElement')
            ->willReturnCallback(static fn (string $name): bool => in_array($name, $present, true));

        return $layout;
    }

    /**
     * @param array<string, list<array{0: string, 1: string, 2: string}>> $filesByHandle path, module, theme
     */
    private function collector(array $filesByHandle, ?CollectorInterface $source = null): LayoutCollector
    {
        if ($source === null) {
            $source = $this->createStub(CollectorInterface::class);
            $source->method('getFiles')->willReturnCallback(
                fn ($theme, string $pattern): array => array_map(
                    fn (array $file): File => $this->fileAt(...$file),
                    $filesByHandle[basename($pattern, '.xml')] ?? []
                )
            );
        }

        $design = $this->createStub(DesignInterface::class);
        $design->method('getDesignTheme')->willReturn($this->createStub(ThemeInterface::class));

        $callSites = $this->createStub(CallSiteResolver::class);
        $callSites->method('relativePath')->willReturnArgument(0);

        return new LayoutCollector(
            new Redactor(),
            new Clock(),
            new LayoutFiles($source, $design, new FileDriver()),
            $callSites
        );
    }

    private function fileAt(string $path, string $module, string $themeCode): File
    {
        $theme = null;

        if ($themeCode !== '') {
            $theme = $this->createStub(ThemeInterface::class);
            $theme->method('getCode')->willReturn($themeCode);
        }

        $file = $this->createStub(File::class);
        $file->method('getFilename')->willReturn($path);
        $file->method('getModule')->willReturn($module);
        $file->method('getTheme')->willReturn($theme);

        return $file;
    }
}
