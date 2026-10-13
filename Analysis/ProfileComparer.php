<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis;

use Siteation\DebugBar\Presentation\ProfileSummary;

/**
 * What changed between two stored profiles.
 *
 * The reason to keep profiles at all: a number on its own says a page took 300ms, and only
 * a second number says whether that is the change you just made. Everything here is a
 * difference, never an absolute alone.
 *
 * Query shapes come from QueryAnalyzer rather than from string equality, so a statement
 * that only differs by its bound ids counts as the same shape on both sides. That is what
 * makes "this change added forty queries" visible instead of "eighty statements differ".
 */
class ProfileComparer
{
    /** Lower is better, higher is better, or neither. */
    public const BETTER_LOWER = 'lower';
    public const BETTER_HIGHER = 'higher';
    public const BETTER_NEITHER = 'neither';

    /** Enough to see the shape of a change without turning the answer into a second profile. */
    private const MAX_QUERY_ROWS = 15;

    /**
     * @var list<array{key: string, label: string, path: string, unit: string, better: string, decimals: int}>
     */
    private const METRICS = [
        ['key' => 'duration_ms', 'label' => 'Duration', 'path' => 'metrics.duration_ms',
            'unit' => 'ms', 'better' => self::BETTER_LOWER, 'decimals' => 2],
        ['key' => 'memory_peak_mb', 'label' => 'Memory peak', 'path' => 'metrics.memory_peak_mb',
            'unit' => 'MB', 'better' => self::BETTER_LOWER, 'decimals' => 1],
        ['key' => 'query_count', 'label' => 'Queries', 'path' => 'sections.queries.summary.count',
            'unit' => '', 'better' => self::BETTER_LOWER, 'decimals' => 0],
        ['key' => 'query_ms', 'label' => 'Query time', 'path' => 'sections.queries.summary.duration_ms',
            'unit' => 'ms', 'better' => self::BETTER_LOWER, 'decimals' => 2],
        ['key' => 'block_count', 'label' => 'Blocks rendered', 'path' => 'sections.blocks.summary.unique_count',
            'unit' => '', 'better' => self::BETTER_NEITHER, 'decimals' => 0],
        ['key' => 'block_ms', 'label' => 'Block time', 'path' => 'sections.blocks.summary.duration_ms',
            'unit' => 'ms', 'better' => self::BETTER_LOWER, 'decimals' => 2],
        ['key' => 'observer_count', 'label' => 'Observer runs', 'path' => 'sections.observers.summary.count',
            'unit' => '', 'better' => self::BETTER_LOWER, 'decimals' => 0],
        ['key' => 'observer_ms', 'label' => 'Observer time', 'path' => 'sections.observers.summary.duration_ms',
            'unit' => 'ms', 'better' => self::BETTER_LOWER, 'decimals' => 2],
        ['key' => 'event_count', 'label' => 'Events dispatched', 'path' => 'sections.events.summary.count',
            'unit' => '', 'better' => self::BETTER_NEITHER, 'decimals' => 0],
        ['key' => 'cache_hit_rate', 'label' => 'Cache hit rate', 'path' => 'sections.cache.summary.hit_rate',
            'unit' => '%', 'better' => self::BETTER_HIGHER, 'decimals' => 1],
        ['key' => 'response_bytes', 'label' => 'Response size', 'path' => 'sections.request.summary.response_bytes',
            'unit' => 'B', 'better' => self::BETTER_LOWER, 'decimals' => 0],
    ];

    /**
     * The SEO facts SeoCollector keeps, in the order a reader checks them. Lengths are left
     * out: a changed title already says its length changed.
     *
     * @var array<string, string>
     */
    private const SEO_FIELDS = [
        'title' => 'Title',
        'description' => 'Meta description',
        'canonical' => 'Canonical',
        'canonical_count' => 'Canonical tags',
        'robots' => 'Robots meta',
        'robots_header' => 'X-Robots-Tag',
        'noindex' => 'Noindex',
        'nofollow' => 'Nofollow',
        'lang' => 'Language',
        'h1' => 'H1',
        'h1_count' => 'H1 count',
        'heading_count' => 'Headings',
        'hreflang_count' => 'Hreflang alternates',
        'schema_types' => 'Structured data types',
        'json_ld_invalid' => 'Unreadable JSON-LD blocks',
    ];

    public function __construct(
        private readonly QueryAnalyzer $queries,
        private readonly ProfileSummary $summary
    ) {
    }

    /**
     * @param array<string, mixed> $baseline what it was
     * @param array<string, mixed> $subject what it is now
     * @return array<string, mixed>
     */
    public function compare(array $baseline, array $subject): array
    {
        return [
            'baseline' => $this->summary->for($baseline),
            'subject' => $this->summary->for($subject),
            'same_path' => ($baseline['sections']['request']['summary']['path'] ?? null)
                === ($subject['sections']['request']['summary']['path'] ?? null),
            'metrics' => $this->metrics($baseline, $subject),
            'findings' => $this->findings($baseline, $subject),
            'queries' => $this->queryShapes($baseline, $subject),
            'seo' => $this->seo($baseline, $subject),
        ];
    }

    /**
     * What the page told search engines, before and after. Only the facts that moved are
     * listed, since a reader opening Compare after an SEO change wants that change, not
     * fifteen rows that say the same thing twice.
     *
     * @param array<string, mixed> $baseline
     * @param array<string, mixed> $subject
     * @return array{available: bool, reason: string, changed: list<array<string, string>>, unchanged: int}
     */
    private function seo(array $baseline, array $subject): array
    {
        $was = $this->seoSummary($baseline);
        $now = $this->seoSummary($subject);
        $missing = array_keys(array_filter(['before' => $was, 'now' => $now], 'is_null'));

        if ($missing !== []) {
            return [
                'available' => false,
                // Both requests can be pages with no SEO record: an API call, a redirect,
                // or a profile from before the collector existed.
                'reason' => sprintf('No SEO record for the request %s.', implode(' or ', $missing)),
                'changed' => [],
                'unchanged' => 0,
            ];
        }

        $changed = [];
        $unchanged = 0;

        foreach (self::SEO_FIELDS as $key => $label) {
            if (!array_key_exists($key, $was) && !array_key_exists($key, $now)) {
                continue;
            }

            $before = $this->seoValue($was[$key] ?? null);
            $after = $this->seoValue($now[$key] ?? null);

            if ($before === $after) {
                $unchanged++;
                continue;
            }

            $changed[] = ['key' => $key, 'label' => $label, 'baseline' => $before, 'subject' => $after];
        }

        return ['available' => true, 'reason' => '', 'changed' => $changed, 'unchanged' => $unchanged];
    }

    /**
     * @param array<string, mixed> $profile
     * @return array<string, mixed>|null null when the request kept no SEO facts
     */
    private function seoSummary(array $profile): ?array
    {
        $summary = $profile['sections']['seo']['summary'] ?? null;

        if (!is_array($summary) || isset($summary['skipped'])) {
            return null;
        }

        return $summary;
    }

    /**
     * One display string per value, so the bar, the report and MCP all print the same thing.
     */
    private function seoValue(mixed $value): string
    {
        return match (true) {
            is_bool($value) => $value ? 'yes' : 'no',
            is_array($value) => implode(', ', array_map('strval', $value)),
            is_scalar($value) => (string) $value,
            default => '',
        };
    }

    /**
     * @param array<string, mixed> $baseline
     * @param array<string, mixed> $subject
     * @return list<array<string, mixed>>
     */
    private function metrics(array $baseline, array $subject): array
    {
        $rows = [];

        foreach (self::METRICS as $metric) {
            $was = $this->read($baseline, $metric['path']);
            $now = $this->read($subject, $metric['path']);

            if ($was === null && $now === null) {
                continue;
            }

            $rows[] = [
                'key' => $metric['key'],
                'label' => $metric['label'],
                'unit' => $metric['unit'],
                'decimals' => $metric['decimals'],
                'better' => $metric['better'],
                'baseline' => $was,
                'subject' => $now,
                ...$this->metricChange($was, $now, $metric['better']),
            ];
        }

        $rows[] = [
            'key' => 'finding_count',
            'label' => 'Findings',
            'unit' => '',
            'decimals' => 0,
            'better' => self::BETTER_LOWER,
            'baseline' => count((array) ($baseline['findings'] ?? [])),
            'subject' => count((array) ($subject['findings'] ?? [])),
            ...$this->change(
                (float) count((array) ($baseline['findings'] ?? [])),
                (float) count((array) ($subject['findings'] ?? [])),
                self::BETTER_LOWER
            ),
        ];

        return $rows;
    }

    /**
     * A metric one side never measured has no change to report.
     *
     * Cache hit rate is null on a request that read no cache (CacheCollector::summary), and
     * casting that to zero turns "there was nothing to hit" into "0% to 80%, better", which
     * is a verdict about a number nobody wrote down.
     *
     * @return array{delta: float|null, percent: float|null, verdict: string}
     */
    private function metricChange(?float $was, ?float $now, string $better): array
    {
        if ($was === null || $now === null) {
            return ['delta' => null, 'percent' => null, 'verdict' => 'unanswerable'];
        }

        return $this->change($was, $now, $better);
    }

    /**
     * A percentage against a baseline of zero is not infinity, it is unanswerable, and a
     * verdict on a change of nothing is noise.
     *
     * @return array{delta: float, percent: float|null, verdict: string}
     */
    private function change(float $was, float $now, string $better): array
    {
        $delta = round($now - $was, 4);
        $percent = $was == 0.0 ? null : round(($delta / abs($was)) * 100, 1);

        if ($delta == 0.0 || $better === self::BETTER_NEITHER) {
            return ['delta' => $delta, 'percent' => $percent, 'verdict' => 'same'];
        }

        $improved = $better === self::BETTER_LOWER ? $delta < 0 : $delta > 0;

        return ['delta' => $delta, 'percent' => $percent, 'verdict' => $improved ? 'better' : 'worse'];
    }

    /**
     * @param array<string, mixed> $baseline
     * @param array<string, mixed> $subject
     * @return array{added: list<array<string, mixed>>, resolved: list<array<string, mixed>>, unchanged: int}
     */
    private function findings(array $baseline, array $subject): array
    {
        $was = $this->keyFindings($baseline);
        $now = $this->keyFindings($subject);

        return [
            // 'added', not 'new': the bar reads this through Alpine's CSP evaluator, whose
            // parser sees a reserved keyword rather than a property name.
            'added' => array_values(array_diff_key($now, $was)),
            'resolved' => array_values(array_diff_key($was, $now)),
            'unchanged' => count(array_intersect_key($now, $was)),
        ];
    }

    /**
     * Keyed by rule and message together: one rule can speak more than once about a
     * request, and those are different findings.
     *
     * @param array<string, mixed> $profile
     * @return array<string, array<string, mixed>>
     */
    private function keyFindings(array $profile): array
    {
        $keyed = [];

        foreach ((array) ($profile['findings'] ?? []) as $finding) {
            if (!is_array($finding)) {
                continue;
            }

            $keyed[($finding['id'] ?? '') . '|' . ($finding['message'] ?? '')] = [
                'id' => $finding['id'] ?? null,
                'severity' => $finding['severity'] ?? null,
                'section' => $finding['section'] ?? null,
                'message' => $finding['message'] ?? null,
            ];
        }

        return $keyed;
    }

    /**
     * @param array<string, mixed> $baseline
     * @param array<string, mixed> $subject
     * @return array<string, mixed>
     */
    private function queryShapes(array $baseline, array $subject): array
    {
        $was = $this->groups($baseline);
        $now = $this->groups($subject);

        $added = [];
        $removed = [];
        $changed = [];

        foreach ($now as $fingerprint => $group) {
            if (!isset($was[$fingerprint])) {
                $added[] = ['sql' => $group['sql'], 'count' => $group['count'], 'delta' => $group['count']];

                continue;
            }

            $delta = $group['count'] - $was[$fingerprint]['count'];

            if ($delta !== 0) {
                $changed[] = [
                    'sql' => $group['sql'],
                    'baseline_count' => $was[$fingerprint]['count'],
                    'count' => $group['count'],
                    'delta' => $delta,
                ];
            }
        }

        foreach ($was as $fingerprint => $group) {
            if (!isset($now[$fingerprint])) {
                $removed[] = ['sql' => $group['sql'], 'count' => $group['count'], 'delta' => -$group['count']];
            }
        }

        return [
            'shapes_before' => count($was),
            'shapes_after' => count($now),
            'added' => $this->rank($added),
            'removed' => $this->rank($removed),
            'changed' => $this->rank($changed),
            'added_total' => count($added),
            'removed_total' => count($removed),
            'changed_total' => count($changed),
        ];
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @return list<array<string, mixed>>
     */
    private function rank(array $rows): array
    {
        usort($rows, static fn (array $a, array $b): int => abs($b['delta']) <=> abs($a['delta']));

        return array_slice($rows, 0, self::MAX_QUERY_ROWS);
    }

    /**
     * @param array<string, mixed> $profile
     * @return array<string, array<string, mixed>>
     */
    private function groups(array $profile): array
    {
        $items = $profile['sections']['queries']['payload']['items'] ?? [];
        $keyed = [];

        foreach ($this->queries->analyze(is_array($items) ? $items : [])['groups'] as $group) {
            $keyed[(string) $group['fingerprint']] = $group;
        }

        return $keyed;
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function read(array $profile, string $path): float|int|null
    {
        $value = $profile;

        foreach (explode('.', $path) as $step) {
            if (!is_array($value) || !array_key_exists($step, $value)) {
                return null;
            }

            $value = $value[$step];
        }

        return is_numeric($value) ? $value + 0 : null;
    }
}
