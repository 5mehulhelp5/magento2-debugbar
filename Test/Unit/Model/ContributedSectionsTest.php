<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\Phrase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Siteation\DebugBar\Api\SectionViewInterface;
use Siteation\DebugBar\Model\Config;
use Siteation\DebugBar\Model\ContributedSections;
use Siteation\DebugBar\Model\Config\Source\Sections;
use stdClass;

/**
 * Another module's di.xml is input the bar does not control. A declaration that is wrong
 * must cost that module its section and say why in the log, never cost the bar.
 */
class ContributedSectionsTest extends TestCase
{
    #[Test]
    public function aDeclarationIsReadAsDiXmlWritesIt(): void
    {
        $view = $this->createStub(SectionViewInterface::class);

        $sections = $this->sections([
            'c365' => [
                'label' => new Phrase('Commerce365'),
                'lead' => ' What the page was priced with. ',
                'graded' => true,
                'view' => $view,
                'scripts' => [
                    'head' => ['events' => 'Vendor_Module::js/early.js'],
                    'body' => ['reader' => 'Vendor_Module::js/section.js'],
                ],
            ],
        ]);

        $this->assertSame(['c365'], $sections->ids());
        $this->assertSame([[
            'id' => 'c365',
            'label' => 'Commerce365',
            'lead' => 'What the page was priced with.',
            'graded' => true,
        ]], $sections->definitions());
        $this->assertSame($view, $sections->all()['c365']['view']);
        $this->assertSame(['Vendor_Module::js/early.js'], $sections->scripts('head'));
        $this->assertSame(['Vendor_Module::js/section.js'], $sections->scripts('body'));
    }

    #[Test]
    public function aSectionNeedsNoViewAndNoScripts(): void
    {
        $sections = $this->sections(['live' => ['label' => 'Live only']]);

        $this->assertSame(
            ['id' => 'live', 'label' => 'Live only', 'lead' => '', 'graded' => false],
            $sections->definitions()[0]
        );
        $this->assertNull($sections->all()['live']['view']);
    }

    #[Test]
    public function aWrongDeclarationIsLeftOutAndLogged(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->exactly(6))->method('warning');

        $sections = new ContributedSections($logger, $this->config(), [
            'Bad-Id' => ['label' => 'Not an id'],
            'queries' => ['label' => 'A built in panel'],
            'request' => ['label' => 'A built in collector'],
            'nolabel' => ['lead' => 'Nothing to call it'],
            'notarray' => 'Commerce365',
            'badview' => ['label' => 'Bad view', 'view' => new stdClass()],
            'fine' => ['label' => 'Fine'],
        ]);

        $this->assertSame(['fine'], $sections->ids());
    }

    #[Test]
    public function noBuiltInSectionIdCanBeTaken(): void
    {
        $declared = [];

        foreach (array_keys(Sections::BUILT_IN) as $id) {
            $declared[$id] = ['label' => 'Impostor'];
        }

        $this->assertSame([], $this->sections($declared)->ids());
    }

    #[Test]
    public function aScriptThatIsNotAModuleJsAssetIsLeftOut(): void
    {
        $sections = $this->sections(['c365' => [
            'label' => 'Commerce365',
            'scripts' => ['body' => [
                'https://cdn.example.test/evil.js',
                'Vendor_Module::../../etc/env.js',
                'Vendor_Module::css/section.css',
                'Vendor_Module::js/section.js',
                ['not' => 'a string'],
            ]],
        ]]);

        $this->assertSame(['Vendor_Module::js/section.js'], $sections->scripts('body'));
    }

    #[Test]
    public function aSwitchedOffSectionLoadsNoScriptsAndGetsNoView(): void
    {
        $view = $this->createMock(SectionViewInterface::class);
        $view->expects($this->never())->method('view');

        $sections = new ContributedSections($this->createStub(LoggerInterface::class), $this->config(['queries']), [
            'c365' => [
                'label' => 'Commerce365',
                'view' => $view,
                'scripts' => ['head' => ['Vendor_Module::js/early.js']],
            ],
        ]);

        $this->assertSame([], $sections->scripts('head'));
        $this->assertSame(['id' => 'p'], $sections->withViews(['id' => 'p']));
    }

    #[Test]
    public function aViewIsAddedBesideTheSectionsOwnData(): void
    {
        $view = $this->createStub(SectionViewInterface::class);
        $view->method('view')->willReturnCallback(
            static fn (array $profile): array => ['blocks' => [['type' => 'heading', 'text' => $profile['id']]]]
        );

        $profile = $this->sections(['c365' => ['label' => 'Commerce365', 'view' => $view]])->withViews([
            'id' => 'p1',
            'sections' => ['c365' => [
                'label' => 'Commerce365',
                'summary' => ['count' => 2],
                'payload' => ['items' => [1]],
            ]],
        ]);

        $this->assertSame(['count' => 2], $profile['sections']['c365']['summary']);
        $this->assertSame(['items' => [1]], $profile['sections']['c365']['payload']);
        $this->assertSame(['blocks' => [['type' => 'heading', 'text' => 'p1']]], $profile['sections']['c365']['view']);
    }

    #[Test]
    public function aSectionWithoutACollectorStillGetsItsView(): void
    {
        $view = $this->createStub(SectionViewInterface::class);
        $view->method('view')->willReturn(['blocks' => []]);

        $profile = $this->sections(['derived' => ['label' => 'Derived', 'view' => $view]])
            ->withViews(['id' => 'p', 'sections' => []]);

        $this->assertSame(
            ['label' => 'Derived', 'summary' => [], 'payload' => [], 'view' => ['blocks' => []]],
            $profile['sections']['derived']
        );
    }

    #[Test]
    public function aViewThatThrowsIsANoteInItsOwnPanelAndALogLine(): void
    {
        $view = $this->createStub(SectionViewInterface::class);
        $view->method('view')->willThrowException(new RuntimeException('no price lists'));

        $logger = $this->createMock(LoggerInterface::class);
        $logger->expects($this->once())->method('warning')
            ->with($this->stringContains('no price lists'));

        $profile = (new ContributedSections($logger, $this->config(), [
            'c365' => ['label' => 'Commerce365', 'view' => $view],
        ]))->withViews(['id' => 'p']);

        $this->assertSame('note', $profile['sections']['c365']['view']['blocks'][0]['type']);
        $this->assertStringContainsString('no price lists', $profile['sections']['c365']['view']['blocks'][0]['text']);
    }

    #[Test]
    public function theSectionsSettingOffersContributedSectionsAfterTheBuiltInOnes(): void
    {
        $options = (new Sections($this->sections(['c365' => ['label' => 'Commerce365']])))->toOptionArray();

        $this->assertCount(count(Sections::BUILT_IN) + 1, $options);
        $this->assertSame(['value' => 'c365', 'label' => 'Commerce365'], end($options));
        $this->assertSame('timeline', $options[0]['value']);
    }

    /**
     * @param array<string, mixed> $declared
     */
    private function sections(array $declared): ContributedSections
    {
        return new ContributedSections($this->createStub(LoggerInterface::class), $this->config(), $declared);
    }

    /**
     * @param list<string> $wanted the Sections setting, empty for all
     */
    private function config(array $wanted = []): Config
    {
        $config = $this->createStub(Config::class);
        $config->method('collects')->willReturnCallback(
            static fn (string $id): bool => $wanted === [] || in_array($id, $wanted, true)
        );

        return $config;
    }
}
