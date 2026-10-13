<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Analysis\Rule;

use Siteation\DebugBar\Analysis\Finding;
use Siteation\DebugBar\Api\RuleInterface;

/**
 * A product page whose structured data states a price, currency or stock the product does not
 * have.
 *
 * Search engines show the offer from the structured data in the result itself, and Google
 * treats a price or availability that differs from the page as misleading. The usual cause is
 * markup that was cached or built from another price than the one the cart charges: before
 * tax instead of after, the parent's price instead of the cheapest variant, or a stock status
 * from before the product sold out.
 *
 * Either tax mode counts as a match, because which one the structured data should show
 * depends on the market, and that is the merchant's call. A range (lowPrice and highPrice)
 * matches when the product's price falls inside it.
 */
class SeoSchemaOfferRule implements RuleInterface
{
    /** Cents rounded either way. */
    private const TOLERANCE = 0.005;

    private const BUYABLE = ['InStock', 'LimitedAvailability', 'OnlineOnly', 'InStoreOnly', 'PreOrder', 'PreSale',
        'BackOrder'];

    private const NOT_BUYABLE = ['OutOfStock', 'SoldOut', 'Discontinued'];

    public function apply(array $profile): array
    {
        $summary = $profile['sections']['seo']['summary'] ?? [];
        $product = $summary['product'] ?? null;
        $offers = array_values(array_filter((array) ($summary['offers'] ?? []), 'is_array'));

        if (!is_array($product) || $offers === [] || (int) ($summary['status'] ?? 0) !== 200) {
            return [];
        }

        return array_values(array_filter([
            $this->price($product, $offers),
            $this->currency($product, $offers),
            $this->stock($product, $offers),
        ]));
    }

    /**
     * @param array<string, mixed> $product
     * @param list<array<string, mixed>> $offers
     */
    private function price(array $product, array $offers): ?Finding
    {
        $prices = array_unique([(float) ($product['price'] ?? 0), (float) ($product['price_excl_tax'] ?? 0)]);
        $stated = [];

        foreach ($offers as $offer) {
            $price = $this->number($offer['price'] ?? '');
            $low = $this->number($offer['low'] ?? '');
            $high = $this->number($offer['high'] ?? '');

            foreach ($prices as $actual) {
                if ($price !== null && abs($price - $actual) < self::TOLERANCE) {
                    return null;
                }

                if ($low !== null && $actual >= $low - self::TOLERANCE
                    && ($high === null || $actual <= $high + self::TOLERANCE)
                ) {
                    return null;
                }
            }

            if ($price !== null) {
                $stated[] = (string) $offer['price'];
            } elseif ($low !== null) {
                $stated[] = $high !== null
                    ? sprintf('%s to %s', $offer['low'], $offer['high'])
                    : sprintf('from %s', $offer['low']);
            }
        }

        if ($stated === []) {
            // No offer states a price, which the Schema view already reports as missing.
            return null;
        }

        return $this->finding(
            'seo.schema_price',
            sprintf(
                'The structured data says this product costs %s, and it sells for %s.',
                implode(' or ', array_unique($stated)),
                $this->money($product)
            ),
            'Search engines show the structured data price in the result, and treat one that differs from '
                . 'the page as misleading.',
            'Find what writes the offer (the theme, or an SEO or rich snippets extension) and make it read the '
                . 'final price. A full page cache entry from before a price change gives this too.',
            [
                'stated' => $stated,
                'price' => $product['price'] ?? null,
                'price_excl_tax' => $product['price_excl_tax'] ?? null,
            ]
        );
    }

    /**
     * @param array<string, mixed> $product
     * @param list<array<string, mixed>> $offers
     */
    private function currency(array $product, array $offers): ?Finding
    {
        $actual = strtoupper((string) ($product['currency'] ?? ''));
        $stated = array_values(array_unique(array_filter(array_map(
            static fn (array $offer): string => strtoupper(trim((string) ($offer['currency'] ?? ''))),
            $offers
        ))));
        $other = array_values(array_diff($stated, [$actual]));

        if ($actual === '' || $other === []) {
            return null;
        }

        return $this->finding(
            'seo.schema_currency',
            sprintf(
                'The structured data prices this product in %s, and this store view shows %s.',
                implode(', ', $other),
                $actual
            ),
            'A price in the wrong currency is a wrong price, whatever the number.',
            'Make the offer use the store view\'s current currency, not the base currency.',
            ['stated' => $other, 'currency' => $actual]
        );
    }

    /**
     * @param array<string, mixed> $product
     * @param list<array<string, mixed>> $offers
     */
    private function stock(array $product, array $offers): ?Finding
    {
        $stated = array_values(array_unique(array_filter(array_map(
            static fn (array $offer): string => (string) ($offer['availability'] ?? ''),
            $offers
        ))));
        $buyable = array_values(array_intersect($stated, self::BUYABLE));
        $notBuyable = array_values(array_intersect($stated, self::NOT_BUYABLE));
        $salable = (bool) ($product['salable'] ?? false);

        // A product with variants can state both. Only a statement with nothing on the
        // product's side is wrong.
        if ($salable ? ($notBuyable === [] || $buyable !== []) : $buyable === []) {
            return null;
        }

        return $this->finding(
            'seo.schema_stock',
            $salable
                ? sprintf('The structured data says %s, and this product can be bought.', implode(', ', $notBuyable))
                : sprintf('The structured data says %s, and this product cannot be bought.', implode(', ', $buyable)),
            'Search engines show availability in the result. A shopper who clicks "in stock" and finds it '
                . 'cannot be bought leaves, and Google can drop the rich result.',
            'Make the offer read the product\'s salable status rather than its stock status alone, and check '
                . 'for a full page cache entry from before the stock changed.',
            ['stated' => $stated, 'salable' => $salable]
        );
    }

    /**
     * @param array<string, mixed> $data
     */
    private function finding(string $id, string $message, string $why, string $fix, array $data): Finding
    {
        return new Finding(
            $id,
            Finding::SEVERITY_WARNING,
            'seo',
            $message,
            $why,
            $fix,
            $data,
            ['label' => 'Review schema', 'section' => 'seo', 'filter' => 'schema']
        );
    }

    private function number(mixed $value): ?float
    {
        $value = str_replace(',', '.', trim((string) $value));

        return is_numeric($value) ? (float) $value : null;
    }

    /**
     * @param array<string, mixed> $product
     */
    private function money(array $product): string
    {
        $currency = (string) ($product['currency'] ?? '');
        $price = (float) ($product['price'] ?? 0);
        $excl = (float) ($product['price_excl_tax'] ?? 0);

        return abs($price - $excl) < self::TOLERANCE
            ? trim(sprintf('%.2f %s', $price, $currency))
            : trim(sprintf('%.2f %s, or %.2f before tax', $price, $currency, $excl));
    }
}
