<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Mcp;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\ProfileComparer;
use Siteation\DebugBar\Analysis\QueryAnalyzer;
use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Mcp\Server;
use Siteation\DebugBar\Mcp\Tool\CompareProfiles;
use Siteation\DebugBar\Mcp\Tool\GetFindings;
use Siteation\DebugBar\Mcp\Tool\GetSection;
use Siteation\DebugBar\Mcp\Tool\GetSeo;
use Siteation\DebugBar\Mcp\Tool\InspectQueries;
use Siteation\DebugBar\Mcp\Tool\ListProfiles;
use Siteation\DebugBar\Model\ProfileStore;
use Siteation\DebugBar\Presentation\McpProfilePresenter;
use Siteation\DebugBar\Presentation\ProfileSummary;

/**
 * The six tools an agent calls, each a schema and a call() that hands its arguments on.
 *
 * Each tool says its defaults twice: once in the schema the agent reads, once in the
 * fallback call() uses when the agent leaves the argument out. Nothing ties the two
 * together, so an edit to one leaves the agent told one thing and given another. The same
 * goes for the section list GetSection offers against the one the presenter reads, and
 * for a tool that is written but never handed to the server, which is simply not there.
 */
class ToolsTest extends TestCase
{
    private const MAX_ITEMS = 30;

    #[Test]
    public function everyToolIsHandedToTheServer(): void
    {
        $registered = [];
        $root = simplexml_load_string((string) file_get_contents(__DIR__ . '/../../../etc/di.xml'));

        foreach ($root->xpath('//type[@name="' . Server::class . '"]//argument[@name="tools"]/item') as $item) {
            $registered[] = trim((string) $item);
        }

        $written = array_map(
            static fn (string $file): string => 'Siteation\\DebugBar\\Mcp\\Tool\\' . basename($file, '.php'),
            glob(__DIR__ . '/../../../Mcp/Tool/*.php') ?: []
        );

        sort($registered);
        sort($written);

        $this->assertCount(6, $written);
        $this->assertSame($written, $registered);
    }

    #[Test]
    public function everyToolHasItsOwnName(): void
    {
        $names = array_map(static fn (McpToolInterface $tool): string => $tool->name(), $this->tools());

        $this->assertSame($names, array_unique($names));

        foreach ($names as $name) {
            $this->assertMatchesRegularExpression('/^[a-z][a-z_]*$/', $name);
        }
    }

    /**
     * @return array<string, array{string, array<string, mixed>, string, list<mixed>}>
     */
    public static function onlyWhatIsRequired(): array
    {
        return [
            'list' => [ListProfiles::class, [], 'list', [
                ['method' => null, 'path' => null, 'status' => null, 'only_with_findings' => false],
                10,
            ]],
            'findings' => [GetFindings::class, ['profile_id' => 'p'], 'findings', ['p', 10]],
            'section' => [
                GetSection::class,
                ['profile_id' => 'p', 'section' => 'queries'],
                'section',
                ['p', 'queries', 0, 10],
            ],
            'queries' => [InspectQueries::class, ['profile_id' => 'p'], 'queries', ['p', 'all', 5]],
            'seo' => [GetSeo::class, ['profile_id' => 'p'], 'seo', ['p', 20]],
            'compare' => [
                CompareProfiles::class,
                ['baseline_profile_id' => 'a', 'subject_profile_id' => 'b'],
                'compare',
                ['a', 'b'],
            ],
        ];
    }

    /**
     * @param class-string<McpToolInterface> $class
     * @param array<string, mixed> $arguments
     * @param list<mixed> $expected
     */
    #[Test]
    #[DataProvider('onlyWhatIsRequired')]
    public function aToolGivenOnlyWhatItRequiresAsksForWhatItRequiredAndNothingElse(
        string $class,
        array $arguments,
        string $method,
        array $expected
    ): void {
        $presenter = $this->createMock(McpProfilePresenter::class);
        $presenter->method('maxItems')->willReturn(self::MAX_ITEMS);
        $presenter->expects($this->once())->method($method)->with(...$expected)->willReturn(['status' => 'ok']);

        (new $class($presenter))->call($arguments);
    }

    /**
     * The defaults in onlyWhatIsRequired() are the ones call() falls back to. This holds the
     * schema to the same values, so the agent is told what it gets.
     *
     * @param class-string<McpToolInterface> $class
     * @param array<string, mixed> $arguments
     * @param list<mixed> $expected
     */
    #[Test]
    #[DataProvider('onlyWhatIsRequired')]
    public function theDefaultsAToolAdvertisesAreTheOnesItUses(
        string $class,
        array $arguments,
        string $method,
        array $expected
    ): void {
        $used = [];
        $presenter = $this->createStub(McpProfilePresenter::class);
        $presenter->method('maxItems')->willReturn(self::MAX_ITEMS);
        $presenter->method($method)->willReturnCallback(
            static function (mixed ...$received) use (&$used): array {
                $used = $received;

                return ['status' => 'ok'];
            }
        );

        $tool = new $class($presenter);
        $tool->call($arguments);
        $advertised = array_filter(
            $tool->inputSchema()['properties'],
            static fn (array $property): bool => array_key_exists('default', $property)
        );

        $this->assertNotSame([], $used, sprintf('%s never reached the presenter', $class));
        $flat = $this->flatten($method, $used);

        foreach ($advertised as $name => $property) {
            $this->assertArrayHasKey($name, $flat, sprintf('%s does not pass %s on', $class, $name));
            $this->assertSame($property['default'], $flat[$name], sprintf('%s default for %s', $class, $name));
        }
    }

    /**
     * @return array<string, array{string, array<string, mixed>, string, list<mixed>}>
     */
    public static function everythingGiven(): array
    {
        return [
            'list' => [
                ListProfiles::class,
                [
                    'limit' => 3,
                    'method' => 'POST',
                    'path' => '/checkout',
                    'status' => 500,
                    'only_with_findings' => true,
                ],
                'list',
                [['method' => 'POST', 'path' => '/checkout', 'status' => 500, 'only_with_findings' => true], 3],
            ],
            'findings' => [GetFindings::class, ['profile_id' => 'p', 'limit' => 4], 'findings', ['p', 4]],
            'section' => [
                GetSection::class,
                ['profile_id' => 'p', 'section' => 'blocks', 'cursor' => 20, 'limit' => 5],
                'section',
                ['p', 'blocks', 20, 5],
            ],
            'queries' => [
                InspectQueries::class,
                ['profile_id' => 'p', 'filter' => 'slow', 'limit' => 2],
                'queries',
                ['p', 'slow', 2],
            ],
            'seo' => [GetSeo::class, ['profile_id' => 'p', 'headings' => 0], 'seo', ['p', 0]],
            'compare' => [
                CompareProfiles::class,
                ['baseline_profile_id' => 'before', 'subject_profile_id' => 'after'],
                'compare',
                ['before', 'after'],
            ],
        ];
    }

    /**
     * @param class-string<McpToolInterface> $class
     * @param array<string, mixed> $arguments
     * @param list<mixed> $expected
     */
    #[Test]
    #[DataProvider('everythingGiven')]
    public function aToolPassesOnWhatItWasGiven(string $class, array $arguments, string $method, array $expected): void
    {
        $presenter = $this->createMock(McpProfilePresenter::class);
        $presenter->method('maxItems')->willReturn(self::MAX_ITEMS);
        $presenter->expects($this->once())->method($method)->with(...$expected)->willReturn(['status' => 'ok']);

        (new $class($presenter))->call($arguments);
    }

    #[Test]
    public function everySchemaRequiresOnlyWhatItDescribesAndRefusesTheRest(): void
    {
        foreach ($this->tools() as $tool) {
            $schema = $tool->inputSchema();

            $this->assertSame('object', $schema['type'], $tool->name());
            $this->assertFalse($schema['additionalProperties'], $tool->name());

            foreach ($schema['required'] ?? [] as $required) {
                $this->assertArrayHasKey($required, $schema['properties'], $tool->name());
            }
        }
    }

    #[Test]
    public function everyLimitStopsWhereThePresenterStops(): void
    {
        $bounded = 0;

        foreach ($this->tools() as $tool) {
            foreach ($tool->inputSchema()['properties'] as $name => $property) {
                if (isset($property['maximum'])) {
                    $bounded++;
                    $this->assertSame(self::MAX_ITEMS, $property['maximum'], $tool->name() . ' ' . $name);
                    $this->assertLessThanOrEqual($property['maximum'], $property['default'], $tool->name());
                }
            }
        }

        // list, findings, section, queries and seo. A schema that lost its maximum would
        // otherwise pass by having nothing to check.
        $this->assertSame(5, $bounded);
    }

    #[Test]
    public function everySectionGetSectionOffersCanBeRead(): void
    {
        $offered = (new GetSection($this->presenter(null)))->inputSchema()['properties']['section']['enum'];
        $sections = [];

        foreach ($offered as $section) {
            $sections[$section] = ['summary' => [], 'payload' => ['items' => []]];
        }

        $tool = new GetSection($this->presenter(['id' => 'p', 'sections' => $sections]));

        foreach ($offered as $section) {
            $result = $tool->call(['profile_id' => 'p', 'section' => $section]);

            $this->assertSame('ok', $result['status'], $section . ': ' . ($result['error'] ?? ''));
        }
    }

    #[Test]
    public function aSectionNotOnOfferIsAnErrorThatSaysWhatIs(): void
    {
        $tool = new GetSection($this->presenter([
            'id' => 'p',
            'sections' => ['request' => ['summary' => []], 'queries' => ['summary' => []]],
        ]));

        $result = $tool->call(['profile_id' => 'p', 'section' => 'secrets']);

        $this->assertSame('error', $result['status']);
        $this->assertStringContainsString('secrets', $result['error']);
        $this->assertSame(['request', 'queries'], $result['available_sections']);
    }

    /**
     * @return array<string, array{string, array<string, mixed>}>
     */
    public static function toolsThatReadOneProfile(): array
    {
        return [
            'findings' => [GetFindings::class, ['profile_id' => 'gone']],
            'section' => [GetSection::class, ['profile_id' => 'gone', 'section' => 'request']],
            'queries' => [InspectQueries::class, ['profile_id' => 'gone']],
            'seo' => [GetSeo::class, ['profile_id' => 'gone']],
            'compare' => [CompareProfiles::class, ['baseline_profile_id' => 'gone', 'subject_profile_id' => 'gone']],
        ];
    }

    /**
     * @param class-string<McpToolInterface> $class
     * @param array<string, mixed> $arguments
     */
    #[Test]
    #[DataProvider('toolsThatReadOneProfile')]
    public function aProfileThatIsNotThereIsAnErrorThatNamesIt(string $class, array $arguments): void
    {
        $result = (new $class($this->presenter(null)))->call($arguments);

        $this->assertSame('error', $result['status']);
        $this->assertStringContainsString('"gone"', $result['error']);
        $this->assertStringContainsString('list_debug_profiles', $result['hint']);
    }

    #[Test]
    public function aCompareNamesTheProfileThatIsMissingAndNotTheOneThatIsThere(): void
    {
        $store = $this->createStub(ProfileStore::class);
        $store->method('get')->willReturnCallback(
            static fn (string $id): ?array => $id === 'before' ? ['id' => 'before', 'sections' => []] : null
        );
        $tool = new CompareProfiles(new McpProfilePresenter($store, new ProfileSummary(), $this->comparer()));

        $result = $tool->call(['baseline_profile_id' => 'before', 'subject_profile_id' => 'after']);

        $this->assertSame('error', $result['status']);
        $this->assertStringContainsString('"after"', $result['error']);
        $this->assertStringNotContainsString('"before"', $result['error']);
    }

    #[Test]
    public function anEmptyStoreIsAnEmptyListAndNotAnError(): void
    {
        $store = $this->createStub(ProfileStore::class);
        $store->method('recent')->willReturn([]);
        $tool = new ListProfiles(new McpProfilePresenter($store, new ProfileSummary(), $this->comparer()));

        $result = $tool->call([]);

        $this->assertSame('ok', $result['status']);
        $this->assertSame([], $result['profiles']);
        $this->assertSame(0, $result['total_matching']);
    }

    #[Test]
    public function aToolErrorReachesTheAgentAsAnErrorResult(): void
    {
        // The status in the payload is what an agent's client acts on only once the server
        // has turned it into isError. A tool that reported errors as ok would look found.
        $server = new Server($this->tools(null));

        $response = json_decode((string) $server->handleLine(
            '{"jsonrpc":"2.0","id":1,"method":"tools/call",'
            . '"params":{"name":"get_debug_findings","arguments":{"profile_id":"gone"}}}'
        ), true);

        $this->assertTrue($response['result']['isError']);
        $this->assertSame('error', json_decode($response['result']['content'][0]['text'], true)['status']);
        $this->assertStringContainsString('gone', $response['result']['content'][0]['text']);
    }

    /**
     * Arguments by the names the schema gives them, from the positional call the presenter got.
     *
     * @param list<mixed> $used
     * @return array<string, mixed>
     */
    private function flatten(string $method, array $used): array
    {
        return match ($method) {
            'list' => [...$used[0], 'limit' => $used[1]],
            'findings' => ['profile_id' => $used[0], 'limit' => $used[1]],
            'section' => ['profile_id' => $used[0], 'section' => $used[1], 'cursor' => $used[2], 'limit' => $used[3]],
            'queries' => ['profile_id' => $used[0], 'filter' => $used[1], 'limit' => $used[2]],
            'seo' => ['profile_id' => $used[0], 'headings' => $used[1]],
            'compare' => ['baseline_profile_id' => $used[0], 'subject_profile_id' => $used[1]],
        };
    }

    /**
     * @param array<string, mixed>|null $profile
     * @return list<McpToolInterface>
     */
    private function tools(?array $profile = null): array
    {
        $presenter = $this->presenter($profile);

        return [
            new ListProfiles($presenter),
            new GetFindings($presenter),
            new GetSection($presenter),
            new InspectQueries($presenter),
            new CompareProfiles($presenter),
            new GetSeo($presenter),
        ];
    }

    /**
     * @param array<string, mixed>|null $profile
     */
    private function presenter(?array $profile): McpProfilePresenter
    {
        $store = $this->createStub(ProfileStore::class);
        $store->method('get')->willReturn($profile);
        $store->method('recent')->willReturn([]);

        return new McpProfilePresenter($store, new ProfileSummary(), $this->comparer(), self::MAX_ITEMS);
    }

    private function comparer(): ProfileComparer
    {
        return new ProfileComparer(new QueryAnalyzer(), new ProfileSummary());
    }
}
