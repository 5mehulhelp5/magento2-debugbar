<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Presentation;

use Laminas\Http\Header\ContentType;
use Magento\Framework\HTTP\PhpEnvironment\Response as HttpResponse;
use Magento\Framework\UrlInterface;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Model\AdminEditLink;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ContributedSections;
use Siteation\DebugBar\Model\Redactor;
use Siteation\DebugBar\Presentation\AssetUrl;
use Siteation\DebugBar\Presentation\BarInjector;

class BarInjectorTest extends TestCase
{
    private BarInjector $injector;

    protected function setUp(): void
    {
        $assets = $this->createStub(AssetUrl::class);
        $assets->method('for')->willReturnCallback(
            static fn (string $file): string => 'https://example.test/static/' . $file
        );

        $url = $this->createStub(UrlInterface::class);
        $url->method('getUrl')->willReturn('https://example.test/siteation_debugbar/profile/view/');

        $config = $this->createStub(Config::class);
        $config->method('valuePolicy')->willReturn(Redactor::POLICY_MASKED);

        $adminEditLink = $this->createStub(AdminEditLink::class);
        $adminEditLink->method('forCurrentPage')
            ->willReturn('https://example.test/admin/siteation_debugbar/entity/edit/id/7/?a=1&b=2');

        $contributed = new ContributedSections($this->createStub(LoggerInterface::class), $config);

        $this->injector = new BarInjector($assets, $url, $config, $adminEditLink, $contributed);
    }

    #[Test]
    public function itPublishesTheAdminEditLinkEscaped(): void
    {
        $response = $this->response('<html><head></head><body></body></html>');

        $this->injector->inject($response, $this->profile());

        $this->assertStringContainsString(
            'data-admin-edit="https://example.test/admin/siteation_debugbar/entity/edit/id/7/?a=1&amp;b=2"',
            $response->getContent()
        );
    }

    #[Test]
    public function itInjectsIntoHtml(): void
    {
        $response = $this->response('<html><head></head><body><p>Hello</p></body></html>');

        $this->injector->inject($response, $this->profile());

        $body = $response->getContent();
        $this->assertStringContainsString('<siteation-debugbar data-css=', $body);
        $this->assertStringContainsString('</siteation-debugbar>', $body);
        $this->assertStringContainsString('type="application/json"', $body);
        $this->assertStringContainsString('debugbar-early.js', $body);
        $this->assertStringContainsString(
            'data-value-policy="masked"',
            $body,
            'The Alpine section redacts in the browser, so it has to be told the policy.'
        );
        $this->assertStringContainsString('<p>Hello</p>', $body, 'The page itself must survive.');
    }

    #[Test]
    public function aResponseCarryingDebugDataIsNeverShared(): void
    {
        // The promise the module treats as non-negotiable, and the one whose failure is
        // invisible on a developer machine: with no cache in front, dropping these headers
        // changes nothing you can see and every other test stays green. It only shows up on
        // the one installation that matters, a live site behind a CDN serving one
        // developer's profile id to everybody.
        foreach ([$this->response('<html><body></body></html>'), $this->response('{}', 'application/json')] as $response) {
            $response->setHeader('X-Magento-Tags', 'cat_p_1');

            $this->injector->inject($response, $this->profile());

            $cacheControl = $response->getHeader('Cache-Control');

            $this->assertNotFalse($cacheControl);
            $this->assertStringContainsString('no-store', $cacheControl->getFieldValue());
            $this->assertFalse(
                $response->getHeader('X-Magento-Tags'),
                'A tagged response is one Varnish would store and serve to someone else.'
            );
        }
    }

    #[Test]
    public function itAlwaysSetsTheProfileHeader(): void
    {
        $response = $this->response('{"data":1}', 'application/json');

        $this->injector->inject($response, $this->profile());

        $header = $response->getHeader(BarInjector::PROFILE_HEADER);
        $this->assertNotFalse($header);
        $this->assertSame('11111111-1111-4111-8111-111111111111', $header->getFieldValue());
    }

    #[Test]
    public function itLeavesNonHtmlBodiesAlone(): void
    {
        $response = $this->response('{"data":1}', 'application/json');

        $this->injector->inject($response, $this->profile());

        $this->assertSame('{"data":1}', $response->getContent());
    }

    #[Test]
    public function itLeavesRedirectsAlone(): void
    {
        $response = $this->response('<html><body></body></html>');
        $response->setHttpResponseCode(302);

        $this->injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function itLeavesAttachmentsAlone(): void
    {
        $response = $this->response('<html><body></body></html>');
        $response->setHeader('Content-Disposition', 'attachment; filename="export.html"');

        $this->injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function itLeavesBodylessResponsesAlone(): void
    {
        $response = $this->response('<html><head></head></html>');

        $this->injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('<siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function aBodyCloseInsideScriptDataIsNotTheDocumentClose(): void
    {
        // Inert as long as nothing writes into it. The bar's own </script> landing in here
        // would close the island early and turn the image into markup.
        $island = '<script type="application/json">{"q":"</body><img src=x onerror=probe()>"}</script>';
        $response = $this->response('<html><head></head><body>' . $island . '<p>Page</p></body></html>');

        $this->injector->inject($response, $this->profile());

        $body = $response->getContent();
        $this->assertStringContainsString($island, $body, 'The island must reach the browser untouched.');
        $this->assertGreaterThan(strpos($body, '<p>Page</p>'), strpos($body, '<siteation-debugbar'));
        $this->assertStringEndsWith('</script></body></html>', $body);
    }

    #[Test]
    public function aBrowserFindsNoMarkupInTheIslandAfterInjection(): void
    {
        if (!class_exists(\Dom\HTMLDocument::class)) {
            $this->markTestSkipped('The HTML5 parser arrived in PHP 8.4.');
        }

        $island = '<script type="application/json">{"q":"</body><img src=x onerror=probe()>"}</script>';
        $response = $this->response('<html><head></head><body>' . $island . '</body></html>');

        $this->injector->inject($response, $this->profile());

        $document = \Dom\HTMLDocument::createFromString($response->getContent(), LIBXML_NOERROR);
        $this->assertCount(0, $document->querySelectorAll('img'), 'The island turned into markup.');
        $this->assertCount(1, $document->querySelectorAll('siteation-debugbar'));
    }

    #[Test]
    public function aHeadCloseInsideAHeadScriptIsNotTheHeadClose(): void
    {
        $island = '<script type="text/x-magento-init">{"q":"</head><img src=x onerror=probe()>"}</script>';
        $response = $this->response('<html><head>' . $island . '<title>t</title></head><body></body></html>');

        $this->injector->inject($response, $this->profile());

        $body = $response->getContent();
        $this->assertStringContainsString($island, $body);
        $this->assertGreaterThan(strpos($body, '<title>t</title>'), strpos($body, 'debugbar-early.js'));
    }

    #[Test]
    public function closingTagsInCommentsStylesAndTitlesAreSkipped(): void
    {
        $response = $this->response(
            '<html><head><title>a </head> b</title><style>/* </body> */</style></head>'
            . '<body><title-bar>x</title-bar><!-- </body> --><textarea></body></textarea></BODY ></html>'
        );

        $this->injector->inject($response, $this->profile());

        $body = $response->getContent();
        $this->assertStringContainsString('<title>a </head> b</title><style>/* </body> */</style><script', $body);
        $this->assertStringContainsString('<!-- </body> --><textarea></body></textarea><siteation-debugbar', $body);
        $this->assertStringEndsWith('</script></BODY ></html>', $body, 'Case and whitespace still close it.');
    }

    #[Test]
    public function aCloseTagOnlyInsideScriptDataIsNoBodyAtAll(): void
    {
        $page = '<html><head></head><script>var s = "</body>";</script></html>';
        $response = $this->response($page);

        $this->injector->inject($response, $this->profile());

        $this->assertSame($page, $response->getContent());
    }

    #[Test]
    public function aLargeInlineScriptStillGetsTheBar(): void
    {
        $script = '<script>' . str_repeat('var a = "x";', 200000) . '</script>';
        $response = $this->response('<html><head>' . $script . '</head><body>' . $script . '</body></html>');

        $this->injector->inject($response, $this->profile());

        $this->assertStringContainsString($script . '<siteation-debugbar', $response->getContent());
    }

    #[Test]
    public function itSurvivesBackslashesInThePayload(): void
    {
        $response = $this->response('<html><head></head><body></body></html>');
        $profile = $this->profile();
        $profile['sections']['observers'] = [
            'label' => 'Observers',
            'summary' => ['count' => 1],
            'payload' => ['items' => [['instance' => 'Vendor\\Module\\Observer\\Thing']]],
        ];

        $this->injector->inject($response, $profile);

        preg_match(
            '#<script type="application/json" id="siteation-debugbar-profile">(.*?)</script>#s',
            $response->getContent(),
            $matches
        );

        $this->assertNotEmpty($matches, 'The JSON island must be present.');
        $this->assertIsArray(
            json_decode($matches[1], true),
            'preg_replace would read the backslashes as escapes and break the JSON.'
        );
    }

    #[Test]
    public function itEmbedsSummariesButNotItems(): void
    {
        $response = $this->response('<html><head></head><body></body></html>');
        $profile = $this->profile();
        $profile['sections']['queries']['payload']['items'] = [['sql' => 'SELECT needle']];

        $this->injector->inject($response, $profile);

        $this->assertStringNotContainsString('SELECT needle', $response->getContent());
        $this->assertStringContainsString('"count":42', $response->getContent());
    }

    /**
     * The framework's App\Response\Http needs five collaborators to construct. Its parent
     * already implements App\Response\HttpInterface, which is all the injector asks for.
     */
    #[Test]
    public function contributedSectionsAreListedAndTheirScriptsLoadAroundTheBars(): void
    {
        $injector = $this->injectorWith(['c365' => [
            'label' => 'Commerce365 <prices>',
            'scripts' => [
                'head' => ['Vendor_Module::js/early.js'],
                'body' => ['Vendor_Module::js/section.js'],
            ],
        ]]);
        $response = $this->response('<html><head><title>t</title></head><body></body></html>');

        $injector->inject($response, $this->profile());
        $body = $response->getContent();

        $this->assertStringContainsString(
            'data-extensions="[{&quot;id&quot;:&quot;c365&quot;,'
            . '&quot;label&quot;:&quot;Commerce365 &lt;prices&gt;&quot;',
            $body,
            'The list travels as an escaped attribute, never as markup.'
        );

        $early = strpos($body, 'static/js/debugbar-early.js');
        $sectionEarly = strpos($body, 'static/Vendor_Module::js/early.js');
        $head = strpos($body, '</head>');
        $this->assertNotFalse($early);
        $this->assertNotFalse($sectionEarly);
        $this->assertTrue(
            $early < $sectionEarly && $sectionEarly < $head,
            'A head script registers with the watcher early.js installs, so it comes after it, in the head.'
        );

        $reader = strpos(
            $body,
            '<script type="module" src="https://example.test/static/Vendor_Module::js/section.js" defer>'
        );
        $bar = strpos($body, 'static/js/debugbar.js');
        $this->assertNotFalse($reader);
        $this->assertTrue(
            $reader < $bar,
            'Modules run in document order, so the reader is registered before the bar starts.'
        );
        $this->assertStringNotContainsString('<script>', $body, 'Still no inline script.');
    }

    #[Test]
    public function aSwitchedOffContributedSectionLoadsNothing(): void
    {
        $injector = $this->injectorWith(['c365' => [
            'label' => 'Commerce365',
            'scripts' => ['head' => ['Vendor_Module::js/early.js'], 'body' => ['Vendor_Module::js/section.js']],
        ]], ['queries']);
        $response = $this->response('<html><head></head><body></body></html>');

        $injector->inject($response, $this->profile());

        $this->assertStringNotContainsString('Vendor_Module', $response->getContent());
    }

    /**
     * @param array<string, mixed> $declared
     * @param list<string> $wanted the Sections setting, empty for all
     */
    private function injectorWith(array $declared, array $wanted = []): BarInjector
    {
        $assets = $this->createStub(AssetUrl::class);
        $assets->method('for')->willReturnCallback(
            static fn (string $file): string => 'https://example.test/static/' . $file
        );
        $assets->method('forAsset')->willReturnCallback(
            static fn (string $asset): string => 'https://example.test/static/' . $asset
        );

        $url = $this->createStub(UrlInterface::class);
        $url->method('getUrl')->willReturn('https://example.test/siteation_debugbar/profile/view/');

        $config = $this->createStub(Config::class);
        $config->method('valuePolicy')->willReturn(Redactor::POLICY_FULL);
        $config->method('collects')->willReturnCallback(
            static fn (string $id): bool => $wanted === [] || in_array($id, $wanted, true)
        );

        return new BarInjector(
            $assets,
            $url,
            $config,
            $this->createStub(AdminEditLink::class),
            new ContributedSections($this->createStub(LoggerInterface::class), $config, $declared)
        );
    }

    private function response(string $body, string $contentType = 'text/html'): HttpResponse
    {
        $response = new HttpResponse();
        $response->setContent($body);
        $response->getHeaders()->addHeader(new ContentType($contentType));

        return $response;
    }

    /**
     * @return array<string, mixed>
     */
    private function profile(): array
    {
        return [
            'id' => '11111111-1111-4111-8111-111111111111',
            'version' => 1,
            'metrics' => ['duration_ms' => 10.0],
            'sections' => [
                'queries' => [
                    'label' => 'Queries',
                    'summary' => ['count' => 42],
                    'payload' => ['items' => []],
                ],
            ],
            'findings' => [],
        ];
    }
}
