<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Laminas\Http\Header\HeaderInterface;
use Laminas\Http\Header\SetCookie;
use Magento\Framework\App\Cache\StateInterface as CacheState;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\MaintenanceMode;
use Magento\Framework\App\PageCache\NotCacheableInterface;
use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\App\State;
use Magento\Framework\HTTP\PhpEnvironment\Response as ReadableResponse;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;
use Throwable;

/**
 * Why this page was, or was not, put in the full page cache.
 *
 * The bar used to guess: no queries and no events meant a hit. The answer is spread over
 * the request, so three plugins feed this one record. The built-in cache says when it
 * answered from storage, the layout says which blocks refused to be cached, and the
 * response is read as the application offered it to the cache, before the cache rewrote
 * its headers. Kernel::process() swaps a public Cache-Control for no-cache once it has
 * stored the page, so the final response alone would make every stored page look refused.
 *
 * Varnish never shows PHP a hit, so on Varnish the best this can say is whether the
 * response was offered as cacheable.
 *
 * Holds one record. The item cap applies to the list of uncacheable blocks only.
 */
class PageCacheCollector extends AbstractCollector
{
    public const STATUS_HIT = 'hit';
    public const STATUS_STORED = 'stored';
    public const STATUS_CACHEABLE = 'cacheable';
    public const STATUS_NOT_CACHED = 'not_cached';
    public const STATUS_NOT_APPLICABLE = 'not_applicable';

    /** Magento\PageCache\Model\Config::BUILT_IN and VARNISH, read as config so the bar keeps no module dependency */
    private const TYPE_PATH = 'system/full_page_cache/caching_application';
    private const TTL_PATH = 'system/full_page_cache/ttl';
    private const TYPES = [1 => 'built-in', 2 => 'varnish'];

    /** The pages a shop expects to come from the cache, by full action name */
    private const PAGE_TYPES = [
        'cms_index_index' => 'cms',
        'cms_page_view' => 'cms',
        'catalog_category_view' => 'category',
        'catalog_product_view' => 'product',
    ];

    private bool $servedFromCache = false;

    /** @var array{cache_control: string, pragma: string, status: int, not_cacheable: bool, cookies: list<string>}|null */
    private ?array $offered = null;

    private ?bool $layoutCacheable = null;

    /** @var array<string, mixed> */
    private array $record = [];

    public function __construct(
        Redactor $redactor,
        Clock $clock,
        private readonly HttpRequest $httpRequest,
        private readonly State $appState,
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly CacheState $cacheState,
        private readonly MaintenanceMode $maintenanceMode,
        int $maxItems = 100
    ) {
        parent::__construct($redactor, $clock, $maxItems);
    }

    public function label(): string
    {
        return 'Page cache';
    }

    public function reset(): void
    {
        parent::reset();
        $this->servedFromCache = false;
        $this->offered = null;
        $this->layoutCacheable = null;
        $this->record = [];
    }

    /**
     * The built-in cache answered. Nothing below this ran, so the panel must say so rather
     * than show an empty list of reasons.
     */
    public function servedFromCache(): void
    {
        $this->servedFromCache = true;
    }

    /**
     * The response as the application handed it to the built-in cache, before the cache
     * rewrote its headers and cleared its cookies.
     *
     * @param HttpResponse $response
     * @param list<string> $cookies names of cookies already sent with setcookie()
     */
    public function offered(HttpResponse $response, array $cookies = []): void
    {
        $this->offered = [
            'cache_control' => $this->header($response, 'Cache-Control'),
            'pragma' => $this->header($response, 'Pragma'),
            'status' => (int) $response->getHttpResponseCode(),
            'not_cacheable' => $response instanceof NotCacheableInterface,
            'cookies' => array_values(array_unique([...$cookies, ...$this->responseCookies($response)])),
        ];
    }

    /**
     * What the generated layout decided.
     *
     * @param bool $cacheable Layout::isCacheable()
     * @param list<array{name: string, handle: ?string, file: ?string}> $blocks the blocks
     *        marked cacheable="false" that made it into the page
     */
    public function layout(bool $cacheable, array $blocks): void
    {
        // A request can generate more than one layout. Any one that refuses is enough.
        $this->layoutCacheable = ($this->layoutCacheable ?? true) && $cacheable;

        foreach ($blocks as $block) {
            $this->record($block);
        }
    }

    public function finalize(ResponseInterface $response): void
    {
        $area = $this->areaCode();
        $method = strtoupper((string) $this->httpRequest->getMethod());
        $action = (string) $this->httpRequest->getFullActionName();
        $type = self::TYPES[(int) $this->scopeConfig->getValue(self::TYPE_PATH)] ?? 'built-in';
        $enabled = $this->cacheState->isEnabled('full_page');
        $http = $response instanceof HttpResponse ? $response : null;

        $cookies = $this->offered['cookies'] ?? ($http === null ? [] : $this->responseCookies($http));

        $this->record = [
            'enabled' => $enabled,
            'type' => $type,
            'ttl' => (int) $this->scopeConfig->getValue(self::TTL_PATH),
            'served_from_cache' => $this->servedFromCache,
            'area' => $area,
            'method' => $method,
            'is_secure' => $this->httpRequest->isSecure(),
            'action' => $action,
            'page_type' => self::PAGE_TYPES[$action] ?? null,
            'layout_cacheable' => $this->layoutCacheable,
            // As offered to the cache when the built-in one ran, otherwise as sent.
            'cache_control' => $this->offered['cache_control']
                ?? ($http === null ? '' : $this->header($http, 'Cache-Control')),
            'pragma' => $this->offered['pragma'] ?? ($http === null ? '' : $this->header($http, 'Pragma')),
            'cache_debug' => $http === null ? '' : $this->header($http, 'X-Magento-Cache-Debug'),
            'set_cookies' => $cookies,
        ];

        $status = $http === null ? 200 : (int) $http->getHttpResponseCode();
        $reasons = $this->reasons($status, $http instanceof NotCacheableInterface);

        $this->record['reasons'] = $reasons;
        $this->record['status'] = $this->status($reasons);
    }

    /**
     * Every reason the page was not stored, in the order Magento would hit them.
     *
     * @return list<array{code: string, text: string}>
     */
    private function reasons(int $finalStatus, bool $finalNotCacheable): array
    {
        $record = $this->record;

        if ($this->servedFromCache || $record['area'] !== 'frontend') {
            return [];
        }

        $reasons = [];
        $add = static function (string $code, string $text) use (&$reasons): void {
            $reasons[] = ['code' => $code, 'text' => $text];
        };

        if (!$record['enabled']) {
            $add('disabled', 'The full_page cache type is disabled.');
        }

        if (!in_array($record['method'], ['GET', 'HEAD'], true)) {
            $add('method', sprintf('Only GET and HEAD are cached, this was %s.', $record['method']));
        }

        if ($this->maintenance()) {
            $add('maintenance', 'Maintenance mode is on, and the cache is skipped while it is.');
        }

        if ($this->layoutCacheable === false) {
            $count = count($this->items) + $this->dropped;
            $add('layout', $count > 0
                ? sprintf(
                    '%d block%s marked cacheable="false" made the whole layout uncacheable.',
                    $count,
                    $count === 1 ? '' : 's'
                )
                : 'The layout was created as uncacheable.');
        }

        $status = $this->offered['status'] ?? $finalStatus;

        if (!in_array($status, [200, 404], true)) {
            $add('status', sprintf('Only 200 and 404 responses are cached, this was %d.', $status));
        }

        if ($this->offered['not_cacheable'] ?? $finalNotCacheable) {
            $add('response', 'The response type is one Magento never caches.');
        }

        // Only worth saying when nothing above already explains it. Magento marks the response
        // public after generating a cacheable layout, so a page with no layout, a redirect or
        // JSON, never gets there, and anything else made it private after the fact.
        if ($reasons === [] && !preg_match('/public.*s-maxage=\d+/', (string) $record['cache_control'])) {
            $add(
                $this->layoutCacheable === null ? 'no_layout' : 'not_public',
                $this->layoutCacheable === null
                    ? 'No page layout was generated, so nothing marked the response public.'
                    : sprintf(
                        'The response was not offered as public: Cache-Control is "%s".',
                        $record['cache_control']
                    )
            );
        }

        return $reasons;
    }

    /**
     * @param list<array{code: string, text: string}> $reasons
     */
    private function status(array $reasons): string
    {
        if ($this->servedFromCache) {
            return self::STATUS_HIT;
        }

        if ($this->record['area'] !== 'frontend') {
            return self::STATUS_NOT_APPLICABLE;
        }

        if ($reasons !== []) {
            return self::STATUS_NOT_CACHED;
        }

        // Varnish decides for itself, out of sight of PHP.
        return $this->record['type'] === 'varnish' ? self::STATUS_CACHEABLE : self::STATUS_STORED;
    }

    public function summary(): array
    {
        $retained = count($this->items);

        return [
            ...$this->counts($retained + $this->dropped, $retained),
            ...$this->record,
            'reason_count' => count($this->record['reasons'] ?? []),
        ];
    }

    private function header(HttpResponse $response, string $name): string
    {
        $header = $response->getHeader($name);

        if (!$header instanceof HeaderInterface) {
            return '';
        }

        // Bounded like every string a profile keeps. These are the application's own
        // headers, not visitor input, but nothing reaches a stored file unbounded.
        return substr(trim((string) $header->getFieldValue()), 0, 300);
    }

    /**
     * Cookie names only. The value of a session cookie is a credential.
     *
     * @return list<string>
     */
    private function responseCookies(HttpResponse $response): array
    {
        if (!$response instanceof ReadableResponse) {
            return [];
        }

        // Not getHeader(): Set-Cookie repeats, and getHeader() hands back only the first.
        $header = $response->getHeaders()->get('Set-Cookie');

        if ($header === false) {
            return [];
        }

        $names = [];

        foreach (is_iterable($header) ? $header : [$header] as $cookie) {
            $name = $cookie instanceof SetCookie ? (string) $cookie->getName() : '';

            if ($name !== '') {
                $names[] = substr($name, 0, 100);
            }
        }

        return $names;
    }

    private function maintenance(): bool
    {
        try {
            return $this->maintenanceMode->isOn();
        } catch (Throwable) {
            return false;
        }
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
