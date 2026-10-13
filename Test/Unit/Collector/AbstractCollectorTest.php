<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Collector\AbstractCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;

/**
 * A row past the cap is only counted, so redacting it is work thrown away. A page with
 * thousands of queries paid for every one of them.
 */
class AbstractCollectorTest extends TestCase
{
    #[Test]
    public function aRowPastTheCapIsTrackedWithoutBeingRedacted(): void
    {
        $redactor = new class extends Redactor {
            public int $cleaned = 0;

            public function clean(mixed $value, int $depth = 0): mixed
            {
                if ($depth === 0) {
                    $this->cleaned++;
                }

                return parent::clean($value, $depth);
            }
        };

        $collector = new class ($redactor, new Clock(), 2) extends AbstractCollector {
            public int $tracked = 0;

            public function label(): string
            {
                return 'test';
            }

            protected function track(array $item): void
            {
                $this->tracked++;
            }
        };

        for ($i = 0; $i < 5; $i++) {
            $collector->record(['n' => $i]);
        }

        $this->assertSame(2, $redactor->cleaned);
        $this->assertSame(5, $collector->tracked);
        $this->assertSame(
            ['count' => 5, 'retained_count' => 2, 'dropped_count' => 3, 'truncated' => true],
            $collector->summary()
        );
    }
}
