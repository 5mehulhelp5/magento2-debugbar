<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use DOMDocument;
use DOMElement;
use DOMXPath;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\App\State;
use Magento\Framework\HTTP\PhpEnvironment\Response as ReadableResponse;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;
use Throwable;

/**
 * The SEO facts in the HTML the server sent, saved with the request.
 *
 * The SEO section in the bar reads the live page, which is what a visitor sees after every
 * script has run. That reading is gone the moment the tab closes, and it is not what a
 * crawler that does not run JavaScript gets. This keeps the server's side: the title, the
 * description, the canonical, robots, the headings, the language alternates, the social
 * tags and the structured data types, so History, Compare, the report and MCP can answer
 * "what did this page tell search engines" for a request that is no longer on screen.
 *
 * The response is parsed in finalize(), after the page has rendered and before the bar is
 * injected into it, so the bar's own markup is never part of what is read.
 *
 * The headings are the items, because they are the one list a page can have a lot of. The
 * rest is one record in the summary, kept small because the summary is embedded in every
 * page the bar is drawn on, with the longer lists in the payload.
 */
class SeoCollector extends AbstractCollector
{
    public const SKIPPED_NOT_FRONTEND = 'not_frontend';
    public const SKIPPED_NOT_HTML = 'not_html';
    public const SKIPPED_TOO_LARGE = 'too_large';
    public const SKIPPED_UNREADABLE = 'unreadable';

    /** A storefront page is a few hundred kB. Past this it is not a page, or not one worth parsing in the request. */
    private const MAX_BODY_BYTES = 3000000;

    /** Long enough to compare a title or a description in full, short enough to embed. */
    private const MAX_TEXT = 300;

    private const MAX_URL = 500;

    /** Per list: alternates, social tags, structured data types. */
    private const MAX_LIST = 50;

    /** The same pages PageCacheCollector expects to be cached: the ones a shop wants found. */
    private const PAGE_TYPES = [
        'cms_index_index' => 'cms',
        'cms_page_view' => 'cms',
        'catalog_category_view' => 'category',
        'catalog_product_view' => 'product',
    ];

    /** @var array<string, mixed> */
    private array $record = [];

    /** @var array<string, mixed> */
    private array $details = [];

    public function __construct(
        Redactor $redactor,
        Clock $clock,
        private readonly HttpRequest $httpRequest,
        private readonly State $appState,
        int $maxItems = 200
    ) {
        parent::__construct($redactor, $clock, $maxItems);
    }

    public function label(): string
    {
        return 'SEO';
    }

    public function reset(): void
    {
        parent::reset();
        $this->record = [];
        $this->details = [];
    }

    public function finalize(ResponseInterface $response): void
    {
        $action = (string) $this->httpRequest->getFullActionName();
        $status = $response instanceof HttpResponse ? (int) $response->getHttpResponseCode() : 200;

        $this->record = [
            'action' => $action,
            'page_type' => self::PAGE_TYPES[$action] ?? null,
            'status' => $status,
        ];

        $skipped = $this->skipReason($response);

        if ($skipped !== null) {
            $this->record['skipped'] = $skipped;

            return;
        }

        /** @var ReadableResponse $response */
        $document = $this->parse((string) $response->getContent());

        if ($document === null) {
            $this->record['skipped'] = self::SKIPPED_UNREADABLE;

            return;
        }

        $this->read($document, $this->header($response, 'X-Robots-Tag'));
    }

    /**
     * Why this response holds no page to read, or null when it does.
     */
    private function skipReason(ResponseInterface $response): ?string
    {
        if ($this->areaCode() !== 'frontend') {
            return self::SKIPPED_NOT_FRONTEND;
        }

        if (!$response instanceof ReadableResponse || $response->isRedirect()) {
            return self::SKIPPED_NOT_HTML;
        }

        $type = $this->header($response, 'Content-Type');

        if ($type !== '' && !str_contains(strtolower($type), 'text/html')) {
            return self::SKIPPED_NOT_HTML;
        }

        $body = (string) $response->getContent();

        if (stripos($body, '<html') === false) {
            return self::SKIPPED_NOT_HTML;
        }

        return strlen($body) > self::MAX_BODY_BYTES ? self::SKIPPED_TOO_LARGE : null;
    }

    private function parse(string $html): ?DOMDocument
    {
        $document = new DOMDocument();
        $previous = libxml_use_internal_errors(true);

        try {
            // libxml reads HTML as Latin-1 unless told otherwise, and a storefront is UTF-8.
            // The declaration is the one hint it takes before it has read a meta charset.
            $loaded = $document->loadHTML(
                '<?xml encoding="UTF-8">' . $html,
                LIBXML_NONET | LIBXML_COMPACT | LIBXML_NOERROR | LIBXML_NOWARNING
            );
        } catch (Throwable) {
            $loaded = false;
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }

        return $loaded ? $document : null;
    }

    private function read(DOMDocument $document, string $robotsHeader): void
    {
        $xpath = new DOMXPath($document);

        // Measured before they are cut, so a title past the limit says how far past.
        $title = $this->text($this->first($xpath, '//head/title') ?? $this->first($xpath, '//title'), null, false);
        $description = $this->text($this->meta($xpath, 'description')[0] ?? null, 'content', false);
        $canonicals = $this->canonicals($xpath);
        $robots = implode(', ', array_filter(array_map(
            fn (DOMElement $meta): string => $this->clip($meta->getAttribute('content')),
            [...$this->meta($xpath, 'robots'), ...$this->meta($xpath, 'googlebot')]
        )));
        $directives = strtolower($robots . ', ' . $robotsHeader);
        $headings = $this->headings($xpath);
        $schema = $this->schema($xpath);
        $alternates = $this->alternates($xpath);

        foreach ($headings as $heading) {
            $this->record($heading);
        }

        $h1 = array_values(array_filter($headings, static fn (array $h): bool => $h['level'] === 1));
        $root = $document->documentElement;

        // A page served from the full page cache was never routed, so the request has no
        // action to name it by. Magento writes the action into the body class, and that is
        // stored with the page, which is what keeps the rules working on a cached page.
        if ($this->record['page_type'] === null) {
            $this->record = [...$this->record, ...$this->pageFromBody($xpath)];
        }

        $this->record += [
            'title' => $this->clip($title),
            'title_length' => mb_strlen($title),
            'description' => $this->clip($description),
            'description_length' => mb_strlen($description),
            'canonical' => $canonicals[0] ?? '',
            'canonical_count' => count($canonicals),
            'robots' => $robots,
            'robots_header' => $robotsHeader,
            'noindex' => preg_match('/\b(noindex|none)\b/', $directives) === 1,
            'nofollow' => preg_match('/\b(nofollow|none)\b/', $directives) === 1,
            'lang' => $root instanceof DOMElement ? $this->clip($root->getAttribute('lang')) : '',
            'h1' => $h1[0]['text'] ?? '',
            'h1_count' => count($h1),
            'heading_count' => count($headings),
            'hreflang_count' => count($alternates),
            'schema_types' => $schema['types'],
            'json_ld_count' => $schema['json_ld_count'],
            'json_ld_invalid' => $schema['json_ld_invalid'],
        ];

        $this->details = [
            'canonicals' => $canonicals,
            'hreflang' => $alternates,
            'social' => $this->social($xpath),
        ];
    }

    /**
     * @return array{action?: string, page_type?: string}
     */
    private function pageFromBody(DOMXPath $xpath): array
    {
        $body = $this->first($xpath, '//body');
        $classes = $body === null ? [] : $this->tokens($body->getAttribute('class'));

        foreach (self::PAGE_TYPES as $action => $type) {
            if (in_array(str_replace('_', '-', $action), $classes, true)) {
                return ['action' => $action, 'page_type' => $type];
            }
        }

        return [];
    }

    /**
     * @return list<string>
     */
    private function canonicals(DOMXPath $xpath): array
    {
        $hrefs = [];

        foreach ($this->nodes($xpath, '//link[@rel]') as $link) {
            if (in_array('canonical', $this->tokens($link->getAttribute('rel')), true)) {
                $hrefs[] = $this->clip($link->getAttribute('href'), self::MAX_URL);
            }
        }

        return array_slice($hrefs, 0, self::MAX_LIST);
    }

    /**
     * @return list<array{lang: string, href: string}>
     */
    private function alternates(DOMXPath $xpath): array
    {
        $alternates = [];

        foreach ($this->nodes($xpath, '//link[@hreflang]') as $link) {
            if (in_array('alternate', $this->tokens($link->getAttribute('rel')), true)) {
                $alternates[] = [
                    'lang' => $this->clip($link->getAttribute('hreflang')),
                    'href' => $this->clip($link->getAttribute('href'), self::MAX_URL),
                ];
            }
        }

        return array_slice($alternates, 0, self::MAX_LIST);
    }

    /**
     * @return list<array{level: int, text: string}>
     */
    private function headings(DOMXPath $xpath): array
    {
        $headings = [];

        // Not inside a <template>: a browser keeps that content out of the document until a
        // script stamps it, and Alpine themes hold a lot of markup there. libxml does not
        // know the element and parses it like any other.
        $query = '(//h1 | //h2 | //h3 | //h4 | //h5 | //h6)[not(ancestor::template)]';

        foreach ($this->nodes($xpath, $query) as $heading) {
            $headings[] = ['level' => (int) substr($heading->nodeName, 1), 'text' => $this->text($heading)];
        }

        return $headings;
    }

    /**
     * Open Graph and X tags by name, the first of each.
     *
     * @return array<string, string>
     */
    private function social(DOMXPath $xpath): array
    {
        $tags = [];

        foreach ($this->nodes($xpath, '//meta') as $meta) {
            $name = strtolower(trim($meta->getAttribute('property') ?: $meta->getAttribute('name')));

            if ((str_starts_with($name, 'og:') || str_starts_with($name, 'twitter:'))
                && !isset($tags[$name])
                && count($tags) < self::MAX_LIST
            ) {
                $tags[$name] = $this->clip($meta->getAttribute('content'), self::MAX_URL);
            }
        }

        return $tags;
    }

    /**
     * The structured data types the server sent, from JSON-LD and microdata. Whether each
     * one is complete is the live Schema view's job; this is what the server committed to.
     *
     * @return array{types: list<string>, json_ld_count: int, json_ld_invalid: int}
     */
    private function schema(DOMXPath $xpath): array
    {
        $types = [];
        $count = 0;
        $invalid = 0;

        foreach ($this->nodes($xpath, '//script[@type]') as $script) {
            if (strtolower(trim($script->getAttribute('type'))) !== 'application/ld+json') {
                continue;
            }

            $count++;

            try {
                $data = json_decode((string) $script->textContent, true, 64, JSON_THROW_ON_ERROR);
            } catch (Throwable) {
                $invalid++;

                continue;
            }

            array_push($types, ...$this->typesIn($data));
        }

        foreach ($this->nodes($xpath, '//*[@itemscope][@itemtype][not(ancestor::template)]') as $item) {
            foreach (preg_split('/\s+/', trim($item->getAttribute('itemtype'))) ?: [] as $type) {
                $types[] = $this->shortType($type);
            }
        }

        $types = array_values(array_unique(array_filter($types)));

        return [
            'types' => array_slice($types, 0, self::MAX_LIST),
            'json_ld_count' => $count,
            'json_ld_invalid' => $invalid,
        ];
    }

    /**
     * Every @type in a JSON-LD value, through @graph and nested entities.
     *
     * @return list<string>
     */
    private function typesIn(mixed $data, int $depth = 0): array
    {
        if (!is_array($data) || $depth > 8) {
            return [];
        }

        $types = [];

        foreach ((array) ($data['@type'] ?? []) as $type) {
            if (is_string($type)) {
                $types[] = $this->shortType($type);
            }
        }

        foreach ($data as $key => $value) {
            if ($key !== '@type' && is_array($value)) {
                array_push($types, ...$this->typesIn($value, $depth + 1));
            }
        }

        return $types;
    }

    /** "https://schema.org/Product" and "Product" are one type. */
    private function shortType(string $type): string
    {
        return $this->clip((string) preg_replace('#^https?://(www\.)?schema\.org/#i', '', trim($type)), 100);
    }

    /**
     * @return list<DOMElement>
     */
    private function meta(DOMXPath $xpath, string $name): array
    {
        return array_values(array_filter(
            $this->nodes($xpath, '//meta'),
            static fn (DOMElement $meta): bool
                => strtolower(trim($meta->getAttribute('name') ?: $meta->getAttribute('property'))) === $name
        ));
    }

    private function first(DOMXPath $xpath, string $query): ?DOMElement
    {
        return $this->nodes($xpath, $query)[0] ?? null;
    }

    /**
     * @return list<DOMElement>
     */
    private function nodes(DOMXPath $xpath, string $query): array
    {
        $found = $xpath->query($query);
        $nodes = [];

        foreach ($found === false ? [] : $found as $node) {
            if ($node instanceof DOMElement) {
                $nodes[] = $node;
            }
        }

        return $nodes;
    }

    /**
     * An element's text, or one of its attributes, collapsed as a browser shows it.
     */
    private function text(?DOMElement $element, ?string $attribute = null, bool $clip = true): string
    {
        if ($element === null) {
            return '';
        }

        $value = $attribute === null ? (string) $element->textContent : $element->getAttribute($attribute);

        return $clip ? $this->clip($value) : $this->collapse($value);
    }

    private function clip(string $value, int $length = self::MAX_TEXT): string
    {
        $value = $this->collapse($value);

        return mb_strlen($value) <= $length ? $value : mb_substr($value, 0, $length) . '...';
    }

    private function collapse(string $value): string
    {
        return trim((string) preg_replace('/\s+/u', ' ', $value));
    }

    /**
     * @return list<string>
     */
    private function tokens(string $value): array
    {
        return preg_split('/\s+/', strtolower(trim($value)), -1, PREG_SPLIT_NO_EMPTY) ?: [];
    }

    private function header(ResponseInterface $response, string $name): string
    {
        if (!$response instanceof HttpResponse) {
            return '';
        }

        $header = $response->getHeader($name);

        if ($header === false || $header === null || !method_exists($header, 'getFieldValue')) {
            return '';
        }

        return substr(trim((string) $header->getFieldValue()), 0, 200);
    }

    public function summary(): array
    {
        $retained = count($this->items);

        return [...$this->counts($retained + $this->dropped, $retained), ...$this->record];
    }

    public function payload(): array
    {
        return [...$this->details, 'items' => $this->items];
    }

    private function areaCode(): string
    {
        try {
            return (string) $this->appState->getAreaCode();
        } catch (Throwable) {
            return 'unknown';
        }
    }
}
