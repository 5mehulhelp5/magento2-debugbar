<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * The number of H1 headings in the HTML the server sent.
 *
 * More than one is the usual result of a theme that renders the page title in a block and
 * a CMS editor who typed one into the content as well. None is only a finding on a CMS
 * page, category or product, the pages that have a main subject to name.
 */
class SeoHeadingRule implements RuleInterface
{
    private const PAGES = ['cms' => 'CMS page', 'category' => 'category page', 'product' => 'product page'];

    public function apply(array $profile): array
    {
        $summary = $profile['sections']['seo']['summary'] ?? [];

        if (!isset($summary['h1_count']) || (int) ($summary['status'] ?? 0) !== 200) {
            return [];
        }

        $count = (int) $summary['h1_count'];
        $page = self::PAGES[$summary['page_type'] ?? ''] ?? null;

        if ($count > 1) {
            return [
                new Finding(
                    'seo.h1_multiple',
                    Finding::SEVERITY_WARNING,
                    'seo',
                    sprintf('The server sent %d H1 headings.', $count),
                    'One H1 names what the page is about. Several leave a search engine to guess which.',
                    'Open Headings to see them in order, and turn the extra ones into H2.',
                    ['h1_count' => $count, 'first' => (string) ($summary['h1'] ?? '')],
                    ['label' => 'Review headings', 'section' => 'seo', 'filter' => 'headings']
                ),
            ];
        }

        if ($count === 0 && $page !== null) {
            return [
                new Finding(
                    'seo.h1_missing',
                    Finding::SEVERITY_INFO,
                    'seo',
                    sprintf('This %s has no H1 in the HTML the server sent.', $page),
                    'The H1 is the strongest signal on the page of what it is about.',
                    'Check whether the theme hides the page title on this page, or a script adds it later.',
                    ['page_type' => (string) $summary['page_type']],
                    ['label' => 'Review headings', 'section' => 'seo', 'filter' => 'headings']
                ),
            ];
        }

        return [];
    }
}
