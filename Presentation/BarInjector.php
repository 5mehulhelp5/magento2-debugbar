<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Presentation;

use Laminas\Http\Header\HeaderInterface;
use Magento\Framework\App\Response\HttpInterface as HttpResponse;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\HTTP\PhpEnvironment\Response as ReadableResponse;
use Magento\Framework\UrlInterface;
use Siteation\DebugBar\Model\AdminEditLink;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ContributedSections;

/**
 * Adds the bar to HTML responses, and the profile id to every profiled response.
 *
 * Four tags reach the page and none of them is inline script or inline style: two script
 * elements for the bundles, the host element, and the profile as
 * <script type="application/json">, which browsers treat as data. The stylesheet is the
 * third external file and needs no tag of its own, because its URL travels as a data
 * attribute for the bar to load inside its shadow root. Magento_Csp therefore needs no
 * nonce and no unsafe-inline.
 *
 * The value policy rides along as an attribute too. The Alpine section reads live objects
 * out of the page rather than a redacted profile, so the bar has to know the policy at
 * render time to apply it itself.
 *
 * Sections other modules add travel the same way: their list as a data attribute, and their
 * scripts as more external files, only for the sections the store has switched on.
 *
 * Responses that cannot carry a bar still get the header, which is how AJAX, GraphQL and
 * REST requests reach the bar's request list and how an agent correlates a request to its
 * stored profile.
 *
 * Anything touched here is marked unshareable. A response carrying a bar is one developer's
 * view of one request, and a response carrying the profile header names a profile that only
 * they may read; either one sitting in Varnish or a CDN would be served to every visitor
 * after it. Magento's built in cache saves the body before this plugin ever sees it, so it
 * is the shared caches in front that this is for.
 */
class BarInjector
{
    public const PROFILE_HEADER = 'X-Siteation-DebugBar-Profile';

    /**
     * What the request was, when the URL does not say.
     *
     * The bar's request list is built in the browser from what it saw go past, and all it
     * has there is a method and a URL. Every Magewire component posts to the same one, so
     * the server sends the label rather than have the watcher read request bodies.
     */
    public const LABEL_HEADER = 'X-Siteation-DebugBar-Label';

    /**
     * The bar's host element is a custom element rather than a div with a known id, so the
     * element owns its own mounting and the tag name is the only thing the injector, the
     * bundle and the error capture have to agree on.
     */
    private const ROOT_TAG = 'siteation-debugbar';
    private const DATA_ID = 'siteation-debugbar-profile';

    /**
     * The URL is emitted as a template so the bar can load any profile it discovers, not
     * only the one that rendered the page.
     */
    private const ID_PLACEHOLDER = '__PROFILE_ID__';

    public function __construct(
        private readonly AssetUrl $assets,
        private readonly UrlInterface $url,
        private readonly Config $config,
        private readonly AdminEditLink $adminEditLink,
        private readonly ContributedSections $contributed
    ) {
    }

    /**
     * @param array<string, mixed> $profile
     */
    public function inject(ResponseInterface $response, array $profile): void
    {
        if (!$response instanceof HttpResponse) {
            return;
        }

        $response->setHeader(self::PROFILE_HEADER, (string) $profile['id'], true);

        $label = $this->label($profile);

        if ($label !== null) {
            $response->setHeader(self::LABEL_HEADER, $label, true);
        }

        $this->refuseSharing($response);

        // The header rides on anything. Reading and rewriting a body needs the concrete
        // response, because App\Response\HttpInterface declares no getter for it.
        if (!$response instanceof ReadableResponse || !$this->supports($response)) {
            return;
        }

        $html = $this->insertHead((string) $response->getContent());
        $html = $this->insertBody($html, $profile);

        $response->setBody($html);
        $response->clearHeader('Content-Length');
    }

    /**
     * X-Magento-Tags goes with it: Magento's own Varnish configuration decides a response is
     * cacheable by the presence of that header, so leaving it would leave the decision to a
     * rule that never heard of this module.
     */
    /**
     * @param array<string, mixed> $profile
     */
    private function label(array $profile): ?string
    {
        $magewire = $profile['sections']['request']['summary']['magewire'] ?? null;

        if (!is_array($magewire) || ($magewire['component'] ?? '') === '') {
            return null;
        }

        return trim(sprintf('%s %s', $magewire['component'], $magewire['action'] ?? ''));
    }

    private function refuseSharing(HttpResponse $response): void
    {
        // The same directives Magento's own setNoCacheHeaders() sends, and deliberately not
        // "private": Magento's Varnish configuration answers that one with a 24 hour
        // hit-for-pass, so a single debugged page would bypass the cache for every visitor
        // for a day, and the ban that invalidation sends could not clear it. Without it the
        // object is unstorable just the same, for two minutes instead.
        $response->setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0', true);
        $response->setHeader('Pragma', 'no-cache', true);
        $response->clearHeader('X-Magento-Tags');
    }

    private function supports(ReadableResponse $response): bool
    {
        if ($response->isRedirect()) {
            return false;
        }

        $disposition = $response->getHeader('Content-Disposition');

        if ($disposition instanceof HeaderInterface
            && str_contains(strtolower($disposition->getFieldValue()), 'attachment')
        ) {
            return false;
        }

        $contentType = $response->getHeader('Content-Type');

        if ($contentType instanceof HeaderInterface
            && !str_contains(strtolower($contentType->getFieldValue()), 'text/html')
        ) {
            return false;
        }

        return preg_match('#</body\s*>#i', (string) $response->getContent()) === 1;
    }

    /**
     * The request watcher has to block in the head. By the time a deferred module at the
     * end of the body runs, the theme has already fetched its private content, and those
     * requests would never be seen.
     */
    private function insertHead(string $html): string
    {
        // After the bar's own: a section's head script registers with the watcher early.js
        // installs, and has the same reason to block, the theme's scripts not having run yet.
        $script = implode('', array_map(
            fn (string $url): string => sprintf('<script src="%s"></script>', $this->escape($url)),
            [$this->assets->for('js/debugbar-early.js'), ...$this->contributedScripts('head')]
        ));

        if (preg_match('#</head\s*>#i', $html) !== 1) {
            return $html;
        }

        // ?? and not a cast: on a PCRE failure the return is null, and casting it hands
        // back an empty string as the whole document. Every other failure in this module
        // costs the bar; this one would cost the page.
        return preg_replace_callback(
            '#</head\s*>#i',
            static fn (array $matches): string => $script . $matches[0],
            $html,
            1
        ) ?? $html;
    }

    /**
     * @param array<string, mixed> $profile
     */
    private function insertBody(string $html, array $profile): string
    {
        $json = json_encode(
            $this->slim($profile),
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP
        );

        $markup = sprintf(
            '<%s data-css="%s" data-profile-url="%s"'
            . ' data-value-policy="%s" data-sections="%s"'
            . ' data-history-url="%s" data-compare-url="%s"'
            . ' data-editor="%s" data-editor-root="%s" data-admin-edit="%s"'
            . ' data-extensions="%s"></%s>'
            . '<script type="application/json" id="%s">%s</script>'
            . '%s<script type="module" src="%s" defer></script>',
            self::ROOT_TAG,
            $this->escape($this->assets->for('css/debugbar.css')),
            $this->escape($this->profileUrl(self::ID_PLACEHOLDER)),
            $this->escape($this->config->valuePolicy()),
            // The same list that decided what was collected, so the panels the bar draws and
            // the sections the profile holds cannot disagree. Empty means all of them.
            $this->escape(implode(',', $this->config->sections())),
            $this->escape($this->url->getUrl('siteation_debugbar/profile/history', ['_secure' => true])),
            $this->escape($this->url->getUrl('siteation_debugbar/profile/compare', ['_secure' => true])),
            $this->escape($this->config->editor()),
            $this->escape($this->config->editorRoot()),
            // Empty on any page that is not a product, a category or a CMS page, and on
            // every page when the SEO section is off.
            $this->escape($this->adminEditLink->forCurrentPage()),
            $this->escape($this->extensions()),
            self::ROOT_TAG,
            self::DATA_ID,
            $json === false ? '{}' : $json,
            // Before the bar's own module: modules run in document order, so a section's
            // reader is registered by the time the bar starts.
            implode('', array_map(
                fn (string $url): string => sprintf(
                    '<script type="module" src="%s" defer></script>',
                    $this->escape($url)
                ),
                $this->contributedScripts('body')
            )),
            $this->escape($this->assets->for('js/debugbar.js'))
        );

        // preg_replace would read the backslashes in the payload, PHP class names above
        // all, as escape sequences in the replacement and corrupt the JSON. A callback
        // hands the replacement back untouched.
        return preg_replace_callback(
            '#</body\s*>#i',
            static fn (array $matches): string => $markup . $matches[0],
            $html,
            1
        ) ?? $html;
    }

    /**
     * Summaries only. A busy uncached page produces a profile of several hundred
     * kilobytes, and adding that to every response while developing would be worse than
     * the problem the bar solves. The bar fetches a section's items when it is opened.
     *
     * @param array<string, mixed> $profile
     * @return array<string, mixed>
     */
    private function slim(array $profile): array
    {
        $sections = [];

        foreach ((array) ($profile['sections'] ?? []) as $key => $section) {
            $sections[$key] = [
                'label' => $section['label'] ?? $key,
                'summary' => $section['summary'] ?? [],
            ];
        }

        return [...$profile, 'sections' => $sections, 'lazy' => true];
    }

    /**
     * The sections other modules add, as the bar lists them. The bar filters them by the
     * same data-sections list as its own.
     */
    private function extensions(): string
    {
        $json = json_encode($this->contributed->definitions(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return $json === false ? '[]' : $json;
    }

    /**
     * @param 'head'|'body' $where
     * @return list<string>
     */
    private function contributedScripts(string $where): array
    {
        return array_map(
            fn (string $asset): string => $this->assets->forAsset($asset),
            $this->contributed->scripts($where)
        );
    }

    private function profileUrl(string $id): string
    {
        return $this->url->getUrl('siteation_debugbar/profile/view', ['id' => $id, '_secure' => true]);
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
