<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;
use Siteation\DebugBar\Collector\PageCacheCollector;

/**
 * A page a shop expects to come from the full page cache did not go into it.
 *
 * Only CMS pages, categories and products. A cart or an account page that is not cached is
 * Magento working as intended, and a finding on every one of them would teach the reader
 * to ignore this one.
 */
class PageNotCachedRule implements RuleInterface
{
    private const PAGES = ['cms' => 'CMS page', 'category' => 'category page', 'product' => 'product page'];

    public function apply(array $profile): array
    {
        $summary = $profile['sections']['pagecache']['summary'] ?? [];
        $page = self::PAGES[$summary['page_type'] ?? ''] ?? null;

        if ($page === null || ($summary['status'] ?? null) !== PageCacheCollector::STATUS_NOT_CACHED) {
            return [];
        }

        $reasons = array_values(array_filter((array) ($summary['reasons'] ?? []), 'is_array'));
        $codes = array_column($reasons, 'code');

        // A developer machine with the cache switched off is a choice, not a defect. It is
        // still worth one line, because it is also the most common way to forget it is off.
        $onlyDisabled = $codes === ['disabled'];

        return [
            new Finding(
                'pagecache.not_cached',
                $onlyDisabled ? Finding::SEVERITY_INFO : Finding::SEVERITY_WARNING,
                'pagecache',
                sprintf('This %s was not put in the full page cache.', $page),
                implode(' ', array_column($reasons, 'text')),
                in_array('layout', $codes, true)
                    ? 'Remove cacheable="false" from the blocks listed in Page cache, and load '
                        . 'anything per customer through customer-data or an AJAX call instead.'
                    : 'Open Page cache for the reasons in the order Magento checks them.',
                ['reasons' => $codes, 'uncacheable_blocks' => (int) ($summary['count'] ?? 0)],
                ['label' => 'Review page cache', 'section' => 'pagecache']
            ),
        ];
    }
}
