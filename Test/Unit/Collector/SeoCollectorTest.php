<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Collector;

use Magento\Framework\App\Request\Http as HttpRequest;
use Magento\Framework\App\State;
use Magento\Framework\HTTP\PhpEnvironment\Response;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Collector\SeoCollector;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\Redactor;

/**
 * What the server's HTML told search engines, read the way the live SEO view reads the page.
 *
 * A wrong reading does not throw. A canonical missed because rel held two tokens, or a
 * title measured in bytes rather than characters, is a finding about a page that is fine,
 * and a finding that is wrong once teaches the reader to skip the rest.
 */
class SeoCollectorTest extends TestCase
{
    private const PAGE = <<<'HTML'
        <!doctype html>
        <html lang="nl-NL">
        <head>
            <meta charset="utf-8">
            <title>  Fietsen   en onderdelen | Café Velo  </title>
            <meta name="description" content="Alles voor de fiets.">
            <meta name="ROBOTS" content="INDEX,FOLLOW">
            <link rel="canonical" href="https://shop.test/fietsen.html">
            <link rel="alternate" hreflang="nl-NL" href="https://shop.test/fietsen.html">
            <link rel="alternate" hreflang="x-default" href="https://shop.test/en/bikes.html">
            <meta property="og:title" content="Fietsen">
            <meta name="twitter:card" content="summary">
            <script type="application/ld+json">
                {"@context": "https://schema.org", "@graph": [
                    {"@type": "BreadcrumbList", "itemListElement": []},
                    {"@type": "Product", "offers": {"@type": "Offer"}}
                ]}
            </script>
            <script type="application/ld+json">{ not json </script>
        </head>
        <body>
            <h1>Fietsen</h1>
            <section itemscope itemtype="https://schema.org/Organization">
                <h2>Over <em>ons</em></h2>
            </section>
            <h3>Levering</h3>
            <template x-if="open"><h2>Only once a script stamps it</h2></template>
        </body>
        </html>
        HTML;

    #[Test]
    public function theHeadIsReadAsTheServerSentIt(): void
    {
        $summary = $this->collect(self::PAGE)->summary();

        $this->assertSame('Fietsen en onderdelen | Café Velo', $summary['title'], 'collapsed as a browser shows it');
        $this->assertSame(33, $summary['title_length'], 'characters, not bytes: é is one');
        $this->assertSame('Alles voor de fiets.', $summary['description']);
        $this->assertSame('https://shop.test/fietsen.html', $summary['canonical']);
        $this->assertSame(1, $summary['canonical_count']);
        $this->assertSame('INDEX,FOLLOW', $summary['robots']);
        $this->assertFalse($summary['noindex']);
        $this->assertSame('nl-NL', $summary['lang']);
        $this->assertSame(2, $summary['hreflang_count']);
        $this->assertSame('category', $summary['page_type']);
    }

    #[Test]
    public function headingsAreTheItemsInPageOrderLeavingOutTemplates(): void
    {
        $collector = $this->collect(self::PAGE);

        $this->assertSame(
            [[1, 'Fietsen'], [2, 'Over ons'], [3, 'Levering']],
            array_map(
                static fn (array $item): array => [$item['level'], $item['text']],
                $collector->payload()['items']
            )
        );
        $this->assertSame(1, $collector->summary()['h1_count']);
        $this->assertSame('Fietsen', $collector->summary()['h1']);
    }

    #[Test]
    public function structuredDataTypesComeFromTheGraphNestingAndMicrodata(): void
    {
        $summary = $this->collect(self::PAGE)->summary();

        $this->assertSame(['BreadcrumbList', 'Product', 'Offer', 'Organization'], $summary['schema_types']);
        $this->assertSame(2, $summary['json_ld_count']);
        $this->assertSame(1, $summary['json_ld_invalid'], 'a block that does not parse is counted, not dropped');
    }

    #[Test]
    public function socialTagsAndAlternatesAreKeptInThePayload(): void
    {
        $payload = $this->collect(self::PAGE)->payload();

        $this->assertSame(['og:title' => 'Fietsen', 'twitter:card' => 'summary'], $payload['social']);
        $this->assertSame('x-default', $payload['hreflang'][1]['lang']);
        $this->assertSame(['https://shop.test/fietsen.html'], $payload['canonicals']);
    }

    #[Test]
    public function aCanonicalIsFoundWhateverElseRelSays(): void
    {
        $summary = $this->collect($this->page(
            '<link rel="Canonical" href="/a"><link rel="alternate canonical" href="/b">'
        ))->summary();

        $this->assertSame(2, $summary['canonical_count']);
        $this->assertSame('/a', $summary['canonical']);
    }

    #[Test]
    public function noindexIsReadFromTheMetaTagAndFromTheHeader(): void
    {
        $meta = $this->collect($this->page('<meta name="googlebot" content="noindex">'))->summary();
        $header = $this->collect($this->page(''), robotsHeader: 'none')->summary();
        $neither = $this->collect($this->page('<meta name="robots" content="index, follow">'))->summary();

        $this->assertTrue($meta['noindex']);
        $this->assertTrue($header['noindex']);
        $this->assertTrue($header['nofollow'], 'none is noindex and nofollow together');
        $this->assertSame('none', $header['robots_header']);
        $this->assertFalse($neither['noindex']);
    }

    #[Test]
    public function aLongTitleIsCutForStorageButMeasuredInFull(): void
    {
        $summary = $this->collect($this->page('<title>' . str_repeat('a', 400) . '</title>'))->summary();

        $this->assertSame(400, $summary['title_length']);
        $this->assertSame(303, mb_strlen($summary['title']));
    }

    #[Test]
    public function aPageFromTheFullPageCacheIsNamedByItsBodyClass(): void
    {
        // A cache hit is never routed, so the request's action is Magento's "__".
        $summary = $this->collect(
            '<html><head><title>Home</title></head><body class="cms-index-index page-layout-1column">'
            . '<h1>Home</h1></body></html>',
            action: '__'
        )->summary();
        $unknown = $this->collect('<html><body class="customer-account-index"></body></html>', action: '__')
            ->summary();

        $this->assertSame('cms', $summary['page_type']);
        $this->assertSame('cms_index_index', $summary['action']);
        $this->assertNull($unknown['page_type'], 'a page the rules are not about stays unnamed');
    }

    #[Test]
    public function nothingIsReadOutsideAStorefrontPage(): void
    {
        $admin = $this->collect(self::PAGE, area: 'adminhtml')->summary();
        $json = $this->collect('{"html": "<html>"}', contentType: 'application/json')->summary();
        $fragment = $this->collect('<div>a block</div>')->summary();

        $this->assertSame(SeoCollector::SKIPPED_NOT_FRONTEND, $admin['skipped']);
        $this->assertSame(SeoCollector::SKIPPED_NOT_HTML, $json['skipped']);
        $this->assertSame(SeoCollector::SKIPPED_NOT_HTML, $fragment['skipped']);
        $this->assertArrayNotHasKey('title', $admin, 'a skipped page claims nothing about its title');
    }

    #[Test]
    public function aPageTooLargeToParseInTheRequestIsSkippedAndSaysSo(): void
    {
        $summary = $this->collect($this->page('') . str_repeat(' ', 3000001))->summary();

        $this->assertSame(SeoCollector::SKIPPED_TOO_LARGE, $summary['skipped']);
    }

    #[Test]
    public function resetForgetsThePreviousPage(): void
    {
        $collector = $this->collect(self::PAGE);
        $collector->reset();

        $this->assertSame([], $collector->payload()['items']);
        $this->assertArrayNotHasKey('title', $collector->summary());
    }

    private function page(string $head): string
    {
        return '<!doctype html><html><head>' . $head . '</head><body><p>x</p></body></html>';
    }

    private function collect(
        string $body,
        string $area = 'frontend',
        string $contentType = 'text/html; charset=UTF-8',
        string $robotsHeader = '',
        string $action = 'catalog_category_view'
    ): SeoCollector {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getFullActionName')->willReturn($action);

        $state = $this->createStub(State::class);
        $state->method('getAreaCode')->willReturn($area);

        $response = new Response();
        $response->setHttpResponseCode(200);
        $response->setHeader('Content-Type', $contentType);
        $response->setContent($body);

        if ($robotsHeader !== '') {
            $response->setHeader('X-Robots-Tag', $robotsHeader);
        }

        $collector = new SeoCollector(new Redactor(), new Clock(), $request, $state);
        $collector->finalize($response);

        return $collector;
    }
}
