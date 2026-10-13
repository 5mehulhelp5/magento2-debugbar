<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * The canonical URL the server sent: missing on a product or category, or given more than once.
 *
 * Missing is only a finding on products and categories. Those are the pages Magento reaches
 * by more than one URL, through a category path, a layered navigation filter or a sort order,
 * and the ones it has a setting for. A CMS page has no such setting, and a finding on every
 * one of them would be about Magento rather than the shop.
 *
 * Read from the server's HTML, so a canonical a script adds later does not count. Google
 * may run the script; plenty of crawlers and link previews do not.
 */
class SeoCanonicalRule implements RuleInterface
{
    /** Magento's own switches, under Catalog > Catalog > Search Engine Optimization. */
    private const SETTINGS = [
        'category' => 'catalog/seo/category_canonical_tag',
        'product' => 'catalog/seo/product_canonical_tag',
    ];

    public function apply(array $profile): array
    {
        $summary = $profile['sections']['seo']['summary'] ?? [];

        if (!isset($summary['canonical_count']) || (int) ($summary['status'] ?? 0) !== 200) {
            return [];
        }

        $count = (int) $summary['canonical_count'];
        $pageType = (string) ($summary['page_type'] ?? '');

        if ($count > 1) {
            return [
                new Finding(
                    'seo.canonical_multiple',
                    Finding::SEVERITY_WARNING,
                    'seo',
                    sprintf('The server sent %d canonical links.', $count),
                    'Search engines ignore every canonical on a page that gives more than one.',
                    'Find the second link: usually a theme or an extension adding its own beside Magento\'s.',
                    ['canonical_count' => $count, 'first' => (string) ($summary['canonical'] ?? '')],
                    ['label' => 'Review SEO', 'section' => 'seo', 'filter' => 'overview']
                ),
            ];
        }

        if ($count === 0 && isset(self::SETTINGS[$pageType])) {
            return [
                new Finding(
                    'seo.canonical_missing',
                    Finding::SEVERITY_WARNING,
                    'seo',
                    sprintf('This %s page has no canonical link.', $pageType),
                    'Magento serves the same ' . $pageType . ' under more than one URL, and without a '
                        . 'canonical a search engine picks which one to rank.',
                    sprintf('Switch on %s, which is off by default.', self::SETTINGS[$pageType]),
                    ['page_type' => $pageType, 'setting' => self::SETTINGS[$pageType]],
                    ['label' => 'Review SEO', 'section' => 'seo', 'filter' => 'overview']
                ),
            ];
        }

        return [];
    }
}
