<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Analysis\Rule;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Analysis\Rule\SeoCanonicalRule;
use Siteation\DebugBar\Analysis\Rule\SeoHeadingRule;
use Siteation\DebugBar\Analysis\Rule\SeoNoindexRule;
use Siteation\DebugBar\Analysis\Rule\SeoSchemaOfferRule;

/**
 * The SEO findings, and the pages they must stay quiet on.
 *
 * The quiet cases are the half that matters. A cart with no canonical, an account page that
 * asks not to be indexed and a 404 with no H1 are all Magento working as intended, and a
 * finding on each would bury the one on the product page.
 */
class SeoRulesTest extends TestCase
{
    private const PRODUCT = ['type' => 'simple', 'price' => 36.3, 'price_excl_tax' => 30.0, 'currency' => 'EUR',
        'salable' => true];

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

    #[Test]
    public function aSchemaPriceThePageDoesNotChargeIsAFinding(): void
    {
        $findings = (new SeoSchemaOfferRule())->apply($this->profile([
            'product' => self::PRODUCT,
            'offers' => [$this->offer(['price' => '39.99'])],
        ]));

        $this->assertSame(['seo.schema_price'], array_map(static fn ($f) => $f->toArray()['id'], $findings));
        $this->assertStringContainsString('costs 39.99', $findings[0]->toArray()['message']);
        $this->assertStringContainsString('36.30 EUR, or 30.00 before tax', $findings[0]->toArray()['message']);
        $this->assertSame('schema', $findings[0]->toArray()['action']['filter']);
    }

    #[Test]
    public function aSchemaPriceInEitherTaxModeOrARangeAroundItIsRight(): void
    {
        $rule = new SeoSchemaOfferRule();

        $offers = static fn (array ...$offers): array => ['product' => self::PRODUCT, 'offers' => $offers];

        $this->assertSame([], $rule->apply($this->profile($offers($this->offer(['price' => '36.30'])))));
        $this->assertSame([], $rule->apply($this->profile($offers($this->offer(['price' => '30'])))));
        $this->assertSame([], $rule->apply($this->profile(['product' => self::PRODUCT, 'offers' => [
            $this->offer(['price' => '', 'low' => '25.00', 'high' => '40.00']),
        ]])));
        $this->assertSame([], $rule->apply($this->profile(['product' => self::PRODUCT, 'offers' => [
            $this->offer(['price' => '50.00']),
            $this->offer(['price' => '36,30']),
        ]])), 'one variant at the product price is enough');
        $this->assertSame(
            [],
            $rule->apply($this->profile(['product' => self::PRODUCT, 'offers' => [$this->offer(['price' => ''])]])),
            'no stated price is the Schema view\'s finding, not this one'
        );
    }

    #[Test]
    public function aSchemaCurrencyOrStockThePageDoesNotHaveIsAFinding(): void
    {
        $findings = (new SeoSchemaOfferRule())->apply($this->profile([
            'product' => [...self::PRODUCT, 'salable' => false],
            'offers' => [$this->offer(['currency' => 'USD', 'availability' => 'InStock'])],
        ]));
        $ids = array_map(static fn ($f) => $f->toArray()['id'], $findings);

        $this->assertSame(['seo.schema_currency', 'seo.schema_stock'], $ids);
        $this->assertStringContainsString(
            'says InStock, and this product cannot be bought',
            $findings[1]->toArray()['message']
        );

        $sellable = (new SeoSchemaOfferRule())->apply($this->profile([
            'product' => self::PRODUCT,
            'offers' => [$this->offer(['availability' => 'OutOfStock'])],
        ]));
        $this->assertSame(['seo.schema_stock'], array_map(static fn ($f) => $f->toArray()['id'], $sellable));
    }

    #[Test]
    public function theOfferRuleIsQuietWithoutAProductOrOffersOrOnAnErrorPage(): void
    {
        $rule = new SeoSchemaOfferRule();
        $wrong = [$this->offer(['price' => '1.00', 'availability' => 'OutOfStock'])];

        $this->assertSame([], $rule->apply($this->profile(['offers' => $wrong])), 'a cached page has no product facts');
        $this->assertSame([], $rule->apply($this->profile(['product' => self::PRODUCT, 'offers' => []])));
        $this->assertSame([], $rule->apply($this->profile([
            'product' => self::PRODUCT,
            'offers' => $wrong,
            'status' => 404,
        ])));
        $this->assertSame([], $rule->apply($this->profile([
            'product' => self::PRODUCT,
            'offers' => [$this->offer(['availability' => 'InStock']), $this->offer(['availability' => 'OutOfStock'])],
        ])), 'variants can disagree with each other');
    }

    /**
     * @param array<string, string> $values
     * @return array<string, string>
     */
    private function offer(array $values): array
    {
        return [
            'price' => '36.30',
            'low' => '',
            'high' => '',
            'currency' => 'EUR',
            'availability' => 'InStock',
            ...$values,
        ];
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
