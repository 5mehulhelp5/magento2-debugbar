<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;
use Siteation\DebugBar\Collector\PageCacheCollector;
use Siteation\DebugBar\Model\Config;

/**
 * The action points at whichever of queries, blocks and observers took the most time, so
 * the button never opens an empty section. A full page cache hit ran none of them.
 */
class SlowRequestRule implements RuleInterface
{
    public function __construct(private readonly Config $config)
    {
    }

    public function apply(array $profile): array
    {
        $durationMs = (float) ($profile['metrics']['duration_ms'] ?? 0);
        $threshold = $this->config->slowRequestMs();

        if ($durationMs < $threshold) {
            return [];
        }

        $pageCache = $profile['sections']['pagecache']['summary'] ?? [];
        $fromCache = ($pageCache['served_from_cache'] ?? false) === true
            || ($pageCache['status'] ?? null) === PageCacheCollector::STATUS_HIT;
        $facts = ['duration_ms' => $durationMs, 'threshold_ms' => $threshold];
        $message = sprintf('The request took %s ms.', round($durationMs));

        if ($fromCache) {
            return [
                new Finding(
                    'request.slow',
                    Finding::SEVERITY_WARNING,
                    'overview',
                    $message,
                    sprintf(
                        'That is above the %s ms threshold, yet the full page cache answered it, so no query,'
                        . ' block or observer ran.',
                        round($threshold)
                    ),
                    'Reload once. A cache hit that stays slow points at the cache storage or the server,'
                    . ' not at this page.',
                    $facts,
                    ['label' => 'Review page cache', 'section' => 'pagecache']
                ),
            ];
        }

        $section = $this->slowestSection($profile);

        return [
            new Finding(
                'request.slow',
                Finding::SEVERITY_WARNING,
                'overview',
                $message,
                sprintf('That is above the %s ms threshold, and long enough to feel.', round($threshold)),
                'Compare query, block and observer time to see which of them dominates.',
                $facts,
                $section === null ? null : ['label' => 'Review ' . $section, 'section' => $section]
            ),
        ];
    }

    /**
     * The measured section that took the most time, or null when none measured anything.
     *
     * @param array $profile
     * @phpstan-param array<string, mixed> $profile
     * @return string|null
     */
    private function slowestSection(array $profile): ?string
    {
        $slowest = null;
        $slowestMs = 0.0;

        foreach (['queries', 'blocks', 'observers'] as $section) {
            $ms = (float) ($profile['sections'][$section]['summary']['duration_ms'] ?? 0);

            if ($ms > $slowestMs) {
                $slowest = $section;
                $slowestMs = $ms;
            }
        }

        return $slowest;
    }
}
