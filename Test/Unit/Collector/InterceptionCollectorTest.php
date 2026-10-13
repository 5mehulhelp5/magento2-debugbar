<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Interception\PluginList\PluginList;
use Magento\Framework\Interception\PluginListInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use Siteation\DebugBar\Collector\InterceptionCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;
use Siteation\DebugBar\Plugin\App\CachePlugin;

/**
 * The Plugins tab, read off two protected properties of Magento's plugin list.
 *
 * There is no public API for which plugins a request instantiated, so the collector reaches
 * into PluginList and promises to give up quietly when it cannot. Both halves fail silently:
 * a Magento release that renames the properties empties the tab without an error, and a
 * collector that threw instead of giving up would take the page down with it.
 */
class InterceptionCollectorTest extends TestCase
{
    #[Test]
    public function magentosPluginListStillHasThePropertiesThisReads(): void
    {
        // The one assertion here about Magento rather than the collector. CI runs it against
        // each Magento the PHP matrix installs, so a release that moves them fails here
        // instead of shipping an empty tab.
        $reflection = new ReflectionClass(PluginList::class);

        $this->assertTrue($reflection->hasProperty('_pluginInstances'));
        $this->assertTrue($reflection->hasProperty('_inherited'));
    }

    #[Test]
    public function aPluginIsListedOnTheTypeItInterceptsWithWhatItHooks(): void
    {
        $plugin = $this->plugin();
        $collector = $this->collect(
            ['Vendor\\Cart' => ['vendor_cart_tax' => $plugin]],
            ['Vendor\\Cart' => ['vendor_cart_tax' => ['instance' => $plugin::class, 'sortOrder' => 20]]]
        );

        $items = $collector->payload()['items'];

        $this->assertCount(1, $items);
        $this->assertSame('Vendor\\Cart', $items[0]['type']);
        $this->assertSame(1, $items[0]['plugin_count']);
        $this->assertSame('vendor_cart_tax', $items[0]['plugins'][0]['code']);
        $this->assertSame($plugin::class, $items[0]['plugins'][0]['class']);
        $this->assertSame(20, $items[0]['plugins'][0]['sort_order']);
        $this->assertSame(
            ['getName' => 'after', 'load' => 'around', 'save' => 'before'],
            $items[0]['plugins'][0]['methods'],
            'by method, in order, and only methods named for a plugin'
        );
    }

    #[Test]
    public function aPluginWithNoDefinitionIsNamedByItsInstance(): void
    {
        $plugin = $this->plugin();
        $collector = $this->collect(['Vendor\\Cart' => ['orphan' => $plugin]], []);

        $entry = $collector->payload()['items'][0]['plugins'][0];

        $this->assertSame($plugin::class, $entry['class']);
        $this->assertNull($entry['sort_order']);
    }

    #[Test]
    public function theBarsOwnPluginsAreLeftOutAndATypeWithOnlyThoseIsNotListed(): void
    {
        // Otherwise the tab mostly reports on the bar, which plugs into blocks and the cache.
        $plugin = $this->plugin();
        $collector = $this->collect(
            [
                'Vendor\\Cache' => ['debugbar_cache' => $plugin],
                'Vendor\\Cart' => ['debugbar_cart' => $plugin, 'vendor_cart_tax' => $plugin],
            ],
            [
                'Vendor\\Cache' => ['debugbar_cache' => ['instance' => CachePlugin::class]],
                'Vendor\\Cart' => [
                    'debugbar_cart' => ['instance' => CachePlugin::class],
                    'vendor_cart_tax' => ['instance' => $plugin::class],
                ],
            ]
        );

        $items = $collector->payload()['items'];

        $this->assertSame(['Vendor\\Cart'], array_column($items, 'type'));
        $this->assertSame(['vendor_cart_tax'], array_column($items[0]['plugins'], 'code'));
        $this->assertSame(1, $items[0]['plugin_count'], 'the count is of what is listed');
        $this->assertSame(1, $collector->summary()['intercepted_type_count']);
        $this->assertSame(1, $collector->summary()['plugin_count']);
    }

    #[Test]
    public function theMostInterceptedTypeComesFirstAndTiesGoByName(): void
    {
        $plugin = $this->plugin();
        $collector = $this->collect(
            [
                'Vendor\\B' => ['one' => $plugin],
                'Vendor\\C' => ['one' => $plugin, 'two' => $plugin],
                'Vendor\\A' => ['one' => $plugin],
            ],
            []
        );

        $this->assertSame(
            ['Vendor\\C', 'Vendor\\A', 'Vendor\\B'],
            array_column($collector->payload()['items'], 'type')
        );
    }

    #[Test]
    public function theSummaryCountsTypesAndPlugins(): void
    {
        $plugin = $this->plugin();
        $summary = $this->collect(
            ['Vendor\\A' => ['one' => $plugin], 'Vendor\\B' => ['one' => $plugin, 'two' => $plugin]],
            []
        )->summary();

        $this->assertTrue($summary['available']);
        $this->assertSame(2, $summary['intercepted_type_count']);
        $this->assertSame(3, $summary['plugin_count']);
    }

    #[Test]
    public function aPluginListWithoutThePropertiesIsUnavailableAndNotAnError(): void
    {
        $pluginList = $this->createStub(PluginListInterface::class);
        $collector = new InterceptionCollector(new Redactor(), new Clock(), $pluginList);

        $collector->finalize($this->createStub(ResponseInterface::class));

        $this->assertFalse($collector->summary()['available']);
        $this->assertSame([], $collector->payload()['items']);
    }

    #[Test]
    public function instancesThatAreNotAListAreUnavailable(): void
    {
        $collector = $this->collect('not a list', []);

        $this->assertFalse($collector->summary()['available']);
        $this->assertSame(0, $collector->summary()['intercepted_type_count']);
    }

    #[Test]
    public function aFailurePartWayThroughLeavesNothingHalfRead(): void
    {
        // Vendor\A is read before Vendor\B fails. A tab showing A alone would look complete.
        $plugin = $this->plugin();
        $collector = $this->collect(
            ['Vendor\\A' => ['one' => $plugin], 'Vendor\\B' => ['broken' => 'not an object']],
            []
        );

        $this->assertFalse($collector->summary()['available']);
        $this->assertSame([], $collector->payload()['items']);
        $this->assertSame(0, $collector->summary()['plugin_count']);
    }

    /**
     * A collector finalized over a plugin list holding these, the way Magento's holds them.
     *
     * @param mixed $instances type => code => plugin object, as _pluginInstances
     * @param array<string, array<string, array<string, mixed>>> $inherited as _inherited
     */
    private function collect(mixed $instances, array $inherited): InterceptionCollector
    {
        $pluginList = new class ($instances, $inherited) implements PluginListInterface {
            // phpcs:ignore PSR2.Classes.PropertyDeclaration.Underscore -- named as Magento names them
            protected mixed $_pluginInstances;

            // phpcs:ignore PSR2.Classes.PropertyDeclaration.Underscore -- named as Magento names them
            protected array $_inherited;

            /**
             * @param array<string, array<string, array<string, mixed>>> $inherited
             */
            public function __construct(mixed $instances, array $inherited)
            {
                $this->_pluginInstances = $instances;
                $this->_inherited = $inherited;
            }

            // phpcs:ignore Magento2.CodeAnalysis.EmptyBlock.DetectedFunction -- never called
            public function getNext($type, $method, $code = null)
            {
            }

            // phpcs:ignore Magento2.CodeAnalysis.EmptyBlock.DetectedFunction -- never called
            public function getPlugin($type, $code)
            {
            }
        };

        $collector = new InterceptionCollector(new Redactor(), new Clock(), $pluginList);
        $collector->finalize($this->createStub(ResponseInterface::class));

        return $collector;
    }

    private function plugin(): object
    {
        return new class {
            public function beforeSave(): void
            {
            }

            public function aroundLoad(): void
            {
            }

            public function afterGetName(): void
            {
            }

            // Named like a hook but not one: nothing follows the prefix.
            public function after(): void
            {
            }

            public function execute(): void
            {
            }

            // A plugin method has to be public for Magento to call it.
            private function beforeHidden(): void
            {
            }
        };
    }
}
