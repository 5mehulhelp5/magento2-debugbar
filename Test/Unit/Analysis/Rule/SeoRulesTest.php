<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis\Rule;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\Rule\SeoCanonicalRule;
use Siteation\DebugBar\Analysis\Rule\SeoHeadingRule;
use Siteation\DebugBar\Analysis\Rule\SeoNoindexRule;

/**
 * The SEO findings, and the pages they must stay quiet on.
 *
 * The quiet cases are the half that matters. A cart with no canonical, an account page that
 * asks not to be indexed and a 404 with no H1 are all Magento working as intended, and a
 * finding on each would bury the one on the product page.
 */
class SeoRulesTest extends TestCase
{
    #[Test]
    public function aProductWithNoCanonicalNamesTheSettingThatAddsIt(): void
    {
        $findings = (new SeoCanonicalRule())->apply($this->profile(['canonical_count' => 0]));

        $this->assertCount(1, $findings);
        $finding = $findings[0]->toArray();
        $this->assertSame('seo.canonical_missing', $finding['id']);
        $this->assertStringContainsString('catalog/seo/product_canonical_tag', $finding['next']);
        $this->assertSame('overview', $finding['action']['filter']);
    }

    #[Test]
    public function aMissingCanonicalIsOnlyAFindingWhereMagentoHasOne(): void
    {
        $rule = new SeoCanonicalRule();

        $this->assertSame([], $rule->apply($this->profile(['canonical_count' => 0, 'page_type' => 'cms'])));
        $this->assertSame([], $rule->apply($this->profile(['canonical_count' => 0, 'page_type' => null])));
        $this->assertSame([], $rule->apply($this->profile(['canonical_count' => 0, 'status' => 404])));
    }

    #[Test]
    public function twoCanonicalsAreAFindingOnAnyPage(): void
    {
        $findings = (new SeoCanonicalRule())->apply(
            $this->profile(['canonical_count' => 2, 'page_type' => null])
        );

        $this->assertSame('seo.canonical_multiple', $findings[0]->toArray()['id']);
    }

    #[Test]
    public function noindexOnAPageMeantToBeFoundSaysWhereItCameFrom(): void
    {
        $meta = (new SeoNoindexRule())->apply($this->profile(['noindex' => true, 'robots' => 'NOINDEX,FOLLOW']));
        $header = (new SeoNoindexRule())->apply(
            $this->profile(['noindex' => true, 'robots' => 'INDEX,FOLLOW', 'robots_header' => 'noindex'])
        );

        $this->assertStringContainsString('design/search_engine_robots/default_robots', $meta[0]->toArray()['next']);
        $this->assertStringContainsString('X-Robots-Tag', $header[0]->toArray()['why']);
        $this->assertStringNotContainsString('default_robots', $header[0]->toArray()['next']);
    }

    #[Test]
    public function noindexIsNotAFindingOnPagesThatShouldNotBeFound(): void
    {
        $rule = new SeoNoindexRule();

        $this->assertSame([], $rule->apply($this->profile(['noindex' => true, 'page_type' => null])));
        $this->assertSame([], $rule->apply($this->profile(['noindex' => true, 'status' => 404])));
        $this->assertSame([], $rule->apply($this->profile(['noindex' => false])));
    }

    #[Test]
    public function moreThanOneH1IsAWarningAndNoneIsANote(): void
    {
        $many = (new SeoHeadingRule())->apply($this->profile(['h1_count' => 3, 'page_type' => null]));
        $none = (new SeoHeadingRule())->apply($this->profile(['h1_count' => 0]));

        $this->assertSame('seo.h1_multiple', $many[0]->toArray()['id']);
        $this->assertSame('warning', $many[0]->toArray()['severity']);
        $this->assertSame('headings', $many[0]->toArray()['action']['filter']);
        $this->assertSame('seo.h1_missing', $none[0]->toArray()['id']);
        $this->assertSame('info', $none[0]->toArray()['severity']);
        $this->assertSame([], (new SeoHeadingRule())->apply($this->profile(['h1_count' => 0, 'page_type' => null])));
    }

    #[Test]
    public function aSkippedOrMissingSectionIsNeverAFinding(): void
    {
        $skipped = ['sections' => ['seo' => ['summary' => [
            'skipped' => 'not_html', 'page_type' => 'product', 'status' => 200,
        ]]]];

        foreach ([new SeoCanonicalRule(), new SeoNoindexRule(), new SeoHeadingRule()] as $rule) {
            $this->assertSame([], $rule->apply($skipped), $rule::class);
            $this->assertSame([], $rule->apply(['sections' => []]), $rule::class);
        }
    }

    /**
     * A healthy product page, with the given facts changed.
     *
     * @param array<string, mixed> $facts
     * @return array<string, mixed>
     */
    private function profile(array $facts): array
    {
        return ['sections' => ['seo' => ['summary' => [
            'page_type' => 'product',
            'status' => 200,
            'canonical' => 'https://shop.test/p.html',
            'canonical_count' => 1,
            'robots' => 'INDEX,FOLLOW',
            'robots_header' => '',
            'noindex' => false,
            'h1' => 'P',
            'h1_count' => 1,
            ...$facts,
        ]]]];
    }
}
