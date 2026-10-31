<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Siteation\DebugBar\Analysis\ProfileComparer;

/**
 * A profile as markdown, for reading rather than for parsing.
 *
 * The MCP tools already serve agents that can call them. This is for everything else: an
 * assistant in a browser tab, a colleague in a chat window, a coding agent that has a
 * shell but no MCP server configured. Markdown because every one of them reads it, and
 * because a person can check what they are about to paste.
 *
 * Defined once here and rendered by three things: the console command, the profile
 * endpoint, and the bar's copy button. A second renderer would drift from the first.
 *
 * Bounded like everything else. A profile can hold six hundred queries; a report that
 * carried them all would be pasted nowhere.
 */
class ProfileReport
{
    private const MAX_FINDINGS = 10;
    private const MAX_QUERIES = 10;
    private const MAX_SPANS = 8;
    private const MAX_SQL_LENGTH = 300;
    private const MAX_LABEL_LENGTH = 90;

    public function __construct(
        private readonly ProfileSummary $summary,
        private readonly ProfileComparer $comparer
    ) {
    }

    /**
     * @param array<string, mixed> $profile
     * @param array<string, mixed>|null $baseline an earlier profile to measure against
     */
    public function render(array $profile, ?array $baseline = null): string
    {
        $summary = $this->summary->for($profile);

        $blocks = [
            $this->heading($summary),
            $this->findings($profile),
            $this->cost($profile),
            $this->queries($profile),
            $this->slowest($profile),
            $this->seo($profile),
        ];

        if ($baseline !== null) {
            $blocks[] = $this->changed($baseline, $profile);
        }

        $blocks[] = $this->footer($summary);

        return implode("\n\n", array_filter($blocks)) . "\n";
    }

    /**
     * @param array<string, mixed> $summary
     */
    private function heading(array $summary): string
    {
        return sprintf(
            "# %s %s\n\n%s in %s ms, %s %s, %d %s.",
            $this->text((string) ($summary['method'] ?? 'GET')),
            $this->text($this->requestLabel($summary)),
            $this->text((string) ($summary['status'] ?? 'Threw, no response')),
            $this->number($summary['duration_ms'] ?? 0, 2),
            $this->text((string) ($summary['area'] ?? 'unknown area')),
            $summary['action'] ? 'action ' . $this->code((string) $summary['action']) : 'no action',
            (int) ($summary['query_count'] ?? 0),
            (int) ($summary['query_count'] ?? 0) === 1 ? 'query' : 'queries'
        );
    }

    /**
     * The conclusions first. An agent that reads nothing else should still read these.
     *
     * @param array<string, mixed> $profile
     */
    private function findings(array $profile): string
    {
        $findings = array_slice((array) ($profile['findings'] ?? []), 0, self::MAX_FINDINGS);

        if ($findings === []) {
            return "## Findings\n\nNothing matched a rule on this request.";
        }

        $lines = ['## Findings', ''];

        foreach ($findings as $finding) {
            $lines[] = sprintf(
                '- **%s** %s',
                $this->text((string) ($finding['severity'] ?? 'notice')),
                $this->text((string) ($finding['message'] ?? ''))
            );

            if (!empty($finding['why'])) {
                $lines[] = '  - Why: ' . $this->text((string) $finding['why']);
            }

            if (!empty($finding['next'])) {
                $lines[] = '  - Next: ' . $this->text((string) $finding['next']);
            }

            if (!empty($finding['location'])) {
                $lines[] = '  - Where: ' . $this->code((string) $finding['location']);
            }
        }

        $total = count((array) ($profile['findings'] ?? []));

        if ($total > self::MAX_FINDINGS) {
            $lines[] = sprintf('- ... %d more, worst first.', $total - self::MAX_FINDINGS);
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function cost(array $profile): string
    {
        $rows = [
            ['Duration', $this->number($profile['metrics']['duration_ms'] ?? 0, 2) . ' ms'],
            ['Memory peak', $this->number($profile['metrics']['memory_peak_mb'] ?? 0, 1) . ' MB'],
            ['Queries', $this->section($profile, 'queries', 'count')
                . ' in ' . $this->number($this->section($profile, 'queries', 'duration_ms'), 2) . ' ms'],
            ['Blocks', $this->section($profile, 'blocks', 'unique_count')
                . ' in ' . $this->number($this->section($profile, 'blocks', 'duration_ms'), 2) . ' ms'],
            ['Observers', $this->section($profile, 'observers', 'count')
                . ' in ' . $this->number($this->section($profile, 'observers', 'duration_ms'), 2) . ' ms'],
            ['Events', $this->section($profile, 'events', 'count') . ' dispatched'],
            ['Cache', $this->cacheLine($profile)],
        ];

        $lines = ['## Cost', '', '| | |', '| --- | --- |'];

        foreach ($rows as [$label, $value]) {
            $lines[] = sprintf('| %s | %s |', $label, $value);
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function cacheLine(array $profile): string
    {
        $rate = $profile['sections']['cache']['summary']['hit_rate'] ?? null;

        return $rate === null
            ? 'no reads'
            : $this->number($rate, 1) . '% hit rate';
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function queries(array $profile): string
    {
        $items = (array) ($profile['sections']['queries']['payload']['items'] ?? []);

        if ($items === []) {
            return '';
        }

        usort(
            $items,
            static fn (array $a, array $b): int => ($b['duration_ms'] ?? 0) <=> ($a['duration_ms'] ?? 0)
        );

        $lines = ['## Slowest queries', ''];

        foreach (array_slice($items, 0, self::MAX_QUERIES) as $index => $query) {
            // A fenced block, not a code span: Magento quotes every identifier in
            // backticks, so a single backtick span would end at the first one and the rest
            // of the statement would be rendered as prose.
            $lines[] = sprintf('%d. %s ms', $index + 1, $this->number($query['duration_ms'] ?? 0, 2));
            $lines[] = '';
            $lines[] = $this->fence('sql', $this->trim((string) ($query['sql'] ?? '')), '   ');

            $frame = $query['callsite'][0] ?? null;

            if (is_array($frame) && isset($frame['file'], $frame['line'])) {
                $lines[] = sprintf('   %s:%d', $this->text((string) $frame['file']), $frame['line']);
            }
        }

        return implode("\n", $lines);
    }

    /**
     * The waterfall's answer without the waterfall.
     *
     * Queries are left out: they have their own list above with the same durations, and a
     * report that says the same thing twice is one nobody finishes reading.
     *
     * @param array<string, mixed> $profile
     */
    private function slowest(array $profile): string
    {
        $items = (array) ($profile['sections']['timeline']['payload']['items'] ?? []);
        $spans = array_values(array_filter(
            $items,
            static fn (array $item): bool => ($item['kind'] ?? '') === 'span'
                && ($item['section'] ?? '') !== 'queries'
        ));

        if ($spans === []) {
            return '';
        }

        usort(
            $spans,
            static fn (array $a, array $b): int => ($b['duration_ms'] ?? 0) <=> ($a['duration_ms'] ?? 0)
        );

        $lines = ['## Where the rest of the time went', ''];

        foreach (array_slice($spans, 0, self::MAX_SPANS) as $span) {
            $lines[] = sprintf(
                '- %s ms — %s (%s), starting at %s ms',
                $this->number($span['duration_ms'] ?? 0, 2),
                $this->text($this->label((string) ($span['label'] ?? ''))),
                $this->text((string) ($span['section'] ?? '')),
                $this->number($span['start_ms'] ?? 0, 1)
            );
        }

        return implode("\n", $lines);
    }

    /**
     * What the server told search engines, for a storefront page.
     *
     * The findings about it are already in the findings list at the top, so this is the
     * facts only: what a reader checks a finding against.
     *
     * @param array<string, mixed> $profile
     */
    private function seo(array $profile): string
    {
        $seo = $profile['sections']['seo']['summary'] ?? null;

        if (!is_array($seo) || isset($seo['skipped']) || !isset($seo['title_length'])) {
            return '';
        }

        $none = static fn (mixed $value): string => (string) $value === '' ? 'none' : (string) $value;
        $types = (array) ($seo['schema_types'] ?? []);

        $rows = [
            ['Title', sprintf('%s (%d characters)', $this->cell($none($seo['title'] ?? '')), $seo['title_length'])],
            ['Description', sprintf('%d characters', (int) ($seo['description_length'] ?? 0))],
            ['Canonical', $this->cell($none($seo['canonical'] ?? ''))
                . ((int) ($seo['canonical_count'] ?? 0) > 1 ? sprintf(' (%d links)', $seo['canonical_count']) : '')],
            ['Robots', $this->cell($none(trim(implode(', ', array_filter([
                (string) ($seo['robots'] ?? ''),
                ($seo['robots_header'] ?? '') === '' ? '' : 'header: ' . $seo['robots_header'],
            ])))))],
            ['Language', $this->cell($none($seo['lang'] ?? ''))
                . sprintf(', %d hreflang alternates', (int) ($seo['hreflang_count'] ?? 0))],
            ['H1', sprintf('%d', (int) ($seo['h1_count'] ?? 0))
                . (($seo['h1'] ?? '') === '' ? '' : ', first: ' . $this->cell((string) $seo['h1']))],
            ['Structured data', $types === [] ? 'none' : $this->cell(implode(', ', $types))],
        ];

        $lines = ['## SEO, as the server sent it', '', '| | |', '| --- | --- |'];

        foreach ($rows as [$label, $value]) {
            $lines[] = sprintf('| %s | %s |', $label, $value);
        }

        return implode("\n", [...$lines, ...$this->sources($profile)]);
    }

    /**
     * Where each value came from, and which ones something past Magento's own rule set.
     *
     * @param array<string, mixed> $profile
     * @return list<string>
     */
    private function sources(array $profile): array
    {
        $sources = $profile['sections']['seo']['payload']['sources'] ?? [];

        if (!is_array($sources) || $sources === []) {
            return [];
        }

        $lines = ['', 'Where each value came from:', ''];

        foreach ($sources as $row) {
            $lines[] = sprintf(
                '- %s: %s%s%s',
                $this->text((string) ($row['label'] ?? '')),
                $this->text((string) ($row['source'] ?? '')),
                ($row['key'] ?? '') === '' ? '' : ' ' . $this->code((string) $row['key']),
                ($row['matches'] ?? null) === false
                    ? sprintf(
                        '. The page does not match it (expected "%s"), so something else set this value.',
                        $this->text($this->label((string) ($row['expected'] ?? '')))
                    )
                    : ''
            );
        }

        return $lines;
    }

    /** Page text in a table cell: one line, no pipe to end the cell early. */
    private function cell(string $value): string
    {
        return str_replace('|', '\|', $this->text($this->label($value)));
    }

    /**
     * @param array<string, mixed> $baseline
     * @param array<string, mixed> $subject
     */
    private function changed(array $baseline, array $subject): string
    {
        $diff = $this->comparer->compare($baseline, $subject);
        $lines = [
            '## What changed',
            '',
            sprintf(
                'Against %s, %s %s.',
                $this->code((string) ($diff['baseline']['profile_id'] ?? '')),
                $this->text((string) ($diff['baseline']['method'] ?? '')),
                $this->text((string) ($diff['baseline']['path'] ?? ''))
            ),
            '',
            '| | before | now | change |',
            '| --- | --- | --- | --- |',
        ];

        foreach ($diff['metrics'] as $metric) {
            // A side that is null was never measured, and printing it as 0.00 would read as
            // a measurement of nothing rather than as nothing measured.
            $lines[] = sprintf(
                '| %s | %s | %s | %s |',
                $metric['label'],
                $this->side($metric, 'baseline'),
                $this->side($metric, 'subject'),
                $this->delta($metric)
            );
        }

        foreach ($diff['findings']['added'] as $finding) {
            $lines[] = '';
            $lines[] = '- New finding: ' . $this->text((string) ($finding['message'] ?? ''));
        }

        foreach ($diff['findings']['resolved'] as $finding) {
            $lines[] = '';
            $lines[] = '- Resolved: ' . $this->text((string) ($finding['message'] ?? ''));
        }

        if ($diff['seo']['available']) {
            $lines[] = '';
            $lines[] = sprintf(
                'SEO: %d changed, %d the same.',
                count($diff['seo']['changed']),
                $diff['seo']['unchanged']
            );

            foreach ($diff['seo']['changed'] as $row) {
                $lines[] = sprintf(
                    '- %s: %s to %s',
                    $row['label'],
                    $row['baseline'] === '' ? 'none' : $this->cell($row['baseline']),
                    $row['subject'] === '' ? 'none' : $this->cell($row['subject'])
                );
            }
        }

        $queries = $diff['queries'];

        $lines[] = '';
        $lines[] = sprintf(
            'Query shapes: %d added, %d gone, %d running a different number of times.',
            $queries['added_total'],
            $queries['removed_total'],
            $queries['changed_total']
        );

        foreach (array_slice($queries['added'], 0, 5) as $row) {
            $lines[] = sprintf('- +%d', $row['count']);
            $lines[] = '';
            $lines[] = $this->fence('sql', $this->trim((string) $row['sql']), '  ');
        }

        return implode("\n", $lines);
    }

    /**
     * @param array<string, mixed> $summary
     */
    private function footer(array $summary): string
    {
        return sprintf(
            "---\n\nProfile %s, captured by Siteation_DebugBar. Values are redacted at "
            . 'record time and lists are truncated, so absence here is not absence in the request.',
            $this->code((string) ($summary['profile_id'] ?? ''))
        );
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function section(array $profile, string $section, string $key): float|int
    {
        $value = $profile['sections'][$section]['summary'][$key] ?? 0;

        return is_numeric($value) ? $value + 0 : 0;
    }

    /** A label is a name, not a document: one line, short enough to scan. */
    private function label(string $value): string
    {
        $value = trim((string) preg_replace('/\s+/', ' ', $value));

        return strlen($value) <= self::MAX_LABEL_LENGTH
            ? $value
            : substr($value, 0, self::MAX_LABEL_LENGTH) . ' ...';
    }

    /**
     * Captured text written as prose, on one line and inert.
     *
     * The values come from the request: an exception message, a page title, a block name.
     * A newline in one could end the list item it sits in and start a heading, and a tag in
     * one would render as HTML wherever the report is pasted. Only < > & are encoded, so a
     * quote in a message still reads as a quote in the raw markdown.
     */
    private function text(string $value): string
    {
        return strtr(
            trim((string) preg_replace('/\s+/', ' ', $value)),
            ['&' => '&amp;', '<' => '&lt;', '>' => '&gt;']
        );
    }

    /**
     * Captured text as an inline code span that no backtick inside it can close.
     *
     * CommonMark ends a span at the first backtick run as long as the one that opened it,
     * so the delimiter is one longer than the longest run in the value. A value that starts
     * or ends with a backtick would merge into the delimiter, so it is padded with a space,
     * which the renderer strips again from both sides.
     */
    private function code(string $value): string
    {
        $value = (string) preg_replace('/\s+/', ' ', $value);

        if (trim($value) === '') {
            return '` `';
        }

        $fence = str_repeat('`', $this->longestRun($value) + 1);
        $pad = preg_match('/^[` ]|[` ]$/', $value) ? ' ' : '';

        return $fence . $pad . $value . $pad . $fence;
    }

    /**
     * Captured text as a fenced block, indented to sit inside a list item.
     *
     * A line of three or more backticks inside the body would close a fence of the same
     * length, so the fence is longer than any such run, and never shorter than three.
     */
    private function fence(string $lang, string $body, string $indent = ''): string
    {
        $fence = str_repeat('`', max(3, $this->longestRun($body) + 1));
        $lines = array_map(
            static fn (string $line): string => $indent . $line,
            [$fence . $lang, ...explode("\n", $body), $fence]
        );

        return implode("\n", $lines);
    }

    private function longestRun(string $value): int
    {
        preg_match_all('/`+/', $value, $matches);

        return max([0, ...array_map('strlen', $matches[0])]);
    }

    private function trim(string $sql): string
    {
        $sql = trim((string) preg_replace('/\s+/', ' ', $sql));

        return strlen($sql) <= self::MAX_SQL_LENGTH
            ? $sql
            : substr($sql, 0, self::MAX_SQL_LENGTH) . ' ...';
    }

    /**
     * The path does not tell two Magewire updates apart: every component posts to the same
     * URL. Where the collector recognised one, the component and the action stand in.
     *
     * @param array<string, mixed> $summary
     */
    private function requestLabel(array $summary): string
    {
        $magewire = $summary['magewire'] ?? null;

        if (is_array($magewire) && ($magewire['component'] ?? '') !== '') {
            return trim(sprintf('%s %s', $magewire['component'], $magewire['action'] ?? ''));
        }

        return (string) ($summary['path'] ?? '/');
    }

    /**
     * @param array<string, mixed> $metric
     */
    private function side(array $metric, string $side): string
    {
        return $metric[$side] === null
            ? 'none'
            : $this->number((float) $metric[$side], (int) $metric['decimals']);
    }

    /**
     * @param array<string, mixed> $metric
     */
    private function delta(array $metric): string
    {
        if ($metric['delta'] === null) {
            return 'not comparable';
        }

        $sign = $metric['delta'] > 0 ? '+' : '';
        $verdict = $metric['verdict'] === 'same' ? '' : ' (' . $metric['verdict'] . ')';

        return $sign . $this->number((float) $metric['delta'], (int) $metric['decimals']) . $verdict;
    }

    private function number(mixed $value, int $decimals): string
    {
        return number_format((float) $value, $decimals, '.', '');
    }
}
