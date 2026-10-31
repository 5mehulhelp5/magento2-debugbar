<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\Redactor;

class RedactorTest extends TestCase
{
    private Redactor $redactor;

    protected function setUp(): void
    {
        $this->redactor = new Redactor(maxDepth: 3, maxStringLength: 20, maxItemsPerArray: 3);
    }

    #[Test]
    public function itTruncatesOnACharacterBoundary(): void
    {
        // The bound is a byte bound, so it lands mid-character whenever a multi-byte
        // character straddles it. A half character is not valid UTF-8, and the store encodes
        // the whole profile in one call: one split character used to cost every section.
        // 19 bytes, then a three byte character that straddles the 20 byte bound.
        $split = $this->redactor->clean([str_repeat('a', 19) . "\u{20AC}" . str_repeat('b', 20)]);

        $this->assertSame(str_repeat('a', 19) . '...', $split[0]);

        // 17 bytes, then a three byte character that ends exactly on the bound and must
        // survive it.
        $whole = $this->redactor->clean([str_repeat('a', 17) . "\u{20AC}" . str_repeat('b', 20)]);

        $this->assertSame(str_repeat('a', 17) . "\u{20AC}" . '...', $whole[0]);

        foreach ([$split[0], $whole[0]] as $clean) {
            $this->assertTrue(mb_check_encoding((string) $clean, 'UTF-8'));
        }

        $this->assertIsString(json_encode([$split, $whole], JSON_THROW_ON_ERROR));
    }

    #[Test]
    #[DataProvider('sensitiveKeys')]
    public function itRedactsSensitiveKeys(string $key): void
    {
        $clean = $this->redactor->clean([$key => 'secret-value']);

        $this->assertSame(Redactor::REDACTED, $clean[$key]);
    }

    /**
     * @return array<string, array{string}>
     */
    public static function sensitiveKeys(): array
    {
        return [
            'password' => ['password'],
            'api key' => ['api_key'],
            'token' => ['access_token'],
            'authorization' => ['Authorization'],
            'cookie' => ['cookie'],
            'session' => ['session_id'],
            'form key' => ['form_key'],
            'card number' => ['cc_number'],
            'cvv' => ['cvv'],
            'iban' => ['iban'],
            'email' => ['email'],
            'customer email' => ['customer_email'],
            'e-mail' => ['E-Mail'],
            'e_mail' => ['e_mail'],
            'phone' => ['phone'],
            'telephone' => ['telephone'],
            'dob' => ['dob'],
            'birth date' => ['date_of_birth'],
        ];
    }

    #[Test]
    public function itOverRedactsKeysThatOnlyContainAPersonalDataWord(): void
    {
        // Substring matching is the accepted cost: a template id named after email loses
        // its value too, which is cheaper than missing a personal value.
        $clean = $this->redactor->clean(['email_template_id' => 4]);

        $this->assertSame(Redactor::REDACTED, $clean['email_template_id']);
    }

    #[Test]
    public function itKeepsOrdinaryKeys(): void
    {
        $clean = $this->redactor->clean(['sku' => 'ABC-1', 'qty' => 2]);

        $this->assertSame(['sku' => 'ABC-1', 'qty' => 2], $clean);
    }

    #[Test]
    public function itStripsStringLiteralsFromSql(): void
    {
        // Its own instance: the shared fixture bounds strings hard enough to hide the point.
        $redactor = new Redactor();

        $sql = $redactor->cleanSql(
            "SELECT * FROM customer WHERE email = 'alice@example.com' AND status = 'active'"
        );

        $this->assertStringNotContainsString('alice@example.com', $sql);
        $this->assertStringNotContainsString('active', $sql);
        $this->assertStringContainsString('SELECT * FROM customer WHERE email =', $sql);
    }

    #[Test]
    public function itStillBoundsTheLengthOfHugeSql(): void
    {
        $sql = $this->redactor->cleanSql('SELECT ' . str_repeat('col, ', 200));

        $this->assertLessThanOrEqual(23, strlen($sql));
    }

    #[Test]
    public function itBoundsDepth(): void
    {
        $deep = ['a' => ['b' => ['c' => ['d' => ['e' => 'too far']]]]];

        $this->assertStringContainsString(
            'maximum depth',
            json_encode($this->redactor->clean($deep)) ?: ''
        );
    }

    #[Test]
    public function itBoundsStringLength(): void
    {
        $clean = $this->redactor->clean(str_repeat('x', 100));

        $this->assertSame(23, strlen((string) $clean), 'Twenty characters plus an ellipsis.');
    }

    #[Test]
    public function itBoundsArraySizeAndSaysSo(): void
    {
        $clean = $this->redactor->clean(['a', 'b', 'c', 'd', 'e']);

        $this->assertArrayHasKey('__truncated__', $clean);
        $this->assertSame(2, $clean['__truncated__']);
    }

    #[Test]
    public function fullPolicyKeepsPositionalBindings(): void
    {
        $clean = $this->redactor->cleanBindings(['alice@example.com', 7], Redactor::POLICY_FULL);

        $this->assertSame(['alice@example.com', 7], $clean);
    }

    #[Test]
    public function maskedPolicyDropsTextButKeepsShape(): void
    {
        $clean = $this->redactor->cleanBindings(['alice@example.com', 7], Redactor::POLICY_MASKED);

        $this->assertSame([Redactor::MASKED, 7], $clean, 'Numbers carry little alone and make SQL readable.');
    }

    #[Test]
    public function nonePolicyStoresNothing(): void
    {
        $this->assertSame([], $this->redactor->cleanBindings(['secret'], Redactor::POLICY_NONE));
    }

    #[Test]
    public function namedBindingsAreStillRedactedUnderFullPolicy(): void
    {
        $clean = $this->redactor->cleanBindings([':password' => 'hunter2'], Redactor::POLICY_FULL);

        $this->assertSame(Redactor::REDACTED, $clean[':password']);
    }

    #[Test]
    public function objectsBecomeTheirClassName(): void
    {
        $this->assertSame(self::class, $this->redactor->clean($this));
    }
    #[Test]
    public function itStripsALiteralWhicheverQuotesItWore(): void
    {
        // Magento's adapter only emits single quotes. The second is for hand written SQL
        // from a module that chose the other one, which would otherwise keep its values.
        // Default bounds: the shared instance truncates at twenty characters.
        $redactor = new Redactor();

        $this->assertSame(
            "SELECT * FROM t WHERE email = '?'",
            $redactor->cleanSql("SELECT * FROM t WHERE email = 'jane@example.com'")
        );
        $this->assertSame(
            'SELECT * FROM t WHERE email = "?"',
            $redactor->cleanSql('SELECT * FROM t WHERE email = "jane@example.com"')
        );
    }

    #[Test]
    #[DataProvider('sqlLiterals')]
    public function itStripsSqlLiteralsAccordingToThePolicy(
        string $sql,
        string $full,
        string $masked,
        string $none
    ): void {
        $redactor = new Redactor();

        $this->assertSame($full, $redactor->cleanSql($sql), 'full is the default');
        $this->assertSame($full, $redactor->cleanSql($sql, Redactor::POLICY_FULL));
        $this->assertSame($masked, $redactor->cleanSql($sql, Redactor::POLICY_MASKED));
        $this->assertSame($none, $redactor->cleanSql($sql, Redactor::POLICY_NONE));
    }

    /**
     * @return array<string, array{string, string, string, string}>
     */
    public static function sqlLiterals(): array
    {
        return [
            'integer' => [
                'SELECT * FROM t WHERE id = 42',
                'SELECT * FROM t WHERE id = 42',
                'SELECT * FROM t WHERE id = 42',
                'SELECT * FROM t WHERE id = ?',
            ],
            'identifiers with digits' => [
                'SELECT t0.value FROM catalog_product_entity_int AS t0 JOIN table1 ON t0.id = table1.id',
                'SELECT t0.value FROM catalog_product_entity_int AS t0 JOIN table1 ON t0.id = table1.id',
                'SELECT t0.value FROM catalog_product_entity_int AS t0 JOIN table1 ON t0.id = table1.id',
                'SELECT t0.value FROM catalog_product_entity_int AS t0 JOIN table1 ON t0.id = table1.id',
            ],
            'backticked identifiers' => [
                'SELECT `store_1`.`2fa` FROM `store_1` WHERE `store_1`.`store_id` = 1',
                'SELECT `store_1`.`2fa` FROM `store_1` WHERE `store_1`.`store_id` = 1',
                'SELECT `store_1`.`2fa` FROM `store_1` WHERE `store_1`.`store_id` = 1',
                'SELECT `store_1`.`2fa` FROM `store_1` WHERE `store_1`.`store_id` = ?',
            ],
            'decimals and exponents' => [
                'SELECT * FROM t WHERE price > 19.95 AND weight < .5 AND ratio = 1.5e-3',
                'SELECT * FROM t WHERE price > 19.95 AND weight < .5 AND ratio = 1.5e-3',
                'SELECT * FROM t WHERE price > 19.95 AND weight < .5 AND ratio = 1.5e-3',
                'SELECT * FROM t WHERE price > ? AND weight < ? AND ratio = ?',
            ],
            'negative number keeps its minus' => [
                'SELECT * FROM t WHERE balance = -12',
                'SELECT * FROM t WHERE balance = -12',
                'SELECT * FROM t WHERE balance = -12',
                'SELECT * FROM t WHERE balance = -?',
            ],
            'hex' => [
                "SELECT * FROM t WHERE hash = 0xDEADBEEF OR hash = X'CAFE'",
                "SELECT * FROM t WHERE hash = 0xDEADBEEF OR hash = X'?'",
                "SELECT * FROM t WHERE hash = ? OR hash = X'?'",
                "SELECT * FROM t WHERE hash = ? OR hash = X'?'",
            ],
            'limit and offset' => [
                'SELECT * FROM t LIMIT 20 OFFSET 40',
                'SELECT * FROM t LIMIT 20 OFFSET 40',
                'SELECT * FROM t LIMIT 20 OFFSET 40',
                'SELECT * FROM t LIMIT ? OFFSET ?',
            ],
            'in list next to a string' => [
                "SELECT * FROM t WHERE id IN (1, 2,3) AND sku = 'A-100'",
                "SELECT * FROM t WHERE id IN (1, 2,3) AND sku = '?'",
                "SELECT * FROM t WHERE id IN (1, 2,3) AND sku = '?'",
                "SELECT * FROM t WHERE id IN (?, ?,?) AND sku = '?'",
            ],
        ];
    }
}
