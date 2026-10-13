<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * A CMS page, category or product, answered with a 200, that asks not to be indexed.
 *
 * Those are the pages a shop exists to have found. Everywhere else, the cart, the account,
 * a search result, noindex is often exactly right, so it is not a finding there.
 *
 * On a staging site this is correct and expected. The finding says where the value came
 * from rather than pretending to know which kind of site this is.
 */
class SeoNoindexRule implements RuleInterface
{
    private const PAGES = ['cms' => 'CMS page', 'category' => 'category page', 'product' => 'product page'];

    /** Content > Design > Configuration > Search Engine Robots */
    private const SETTING = 'design/search_engine_robots/default_robots';

    public function apply(array $profile): array
    {
        $summary = $profile['sections']['seo']['summary'] ?? [];
        $page = self::PAGES[$summary['page_type'] ?? ''] ?? null;

        if ($page === null || (int) ($summary['status'] ?? 0) !== 200 || empty($summary['noindex'])) {
            return [];
        }

        $header = (string) ($summary['robots_header'] ?? '');
        $fromHeader = preg_match('/\b(noindex|none)\b/i', $header) === 1;

        return [
            new Finding(
                'seo.noindex',
                Finding::SEVERITY_WARNING,
                'seo',
                sprintf('This %s asks search engines not to index it.', $page),
                $fromHeader
                    ? sprintf('The X-Robots-Tag header says "%s".', $header)
                    : sprintf('The robots meta tag says "%s".', (string) ($summary['robots'] ?? '')),
                $fromHeader
                    ? 'The header is set outside Magento\'s robots setting: check the web server, '
                        . 'a CDN rule, or an extension that adds headers.'
                    : sprintf(
                        'Check %s for this store view. Leave it if this is a staging site.',
                        self::SETTING
                    ),
                ['robots' => (string) ($summary['robots'] ?? ''), 'robots_header' => $header],
                ['label' => 'Review SEO', 'section' => 'seo', 'filter' => 'overview']
            ),
        ];
    }
}
