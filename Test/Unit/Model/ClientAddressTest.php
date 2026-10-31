<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Test\Unit\Model;

use Magento\Framework\App\Request\Http as HttpRequest;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Siteation\DebugBar\Model\ClientAddress;
use Siteation\DebugBar\Model\Config;

class ClientAddressTest extends TestCase
{
    private const PROXY = '10.0.0.1';
    private const INNER_PROXY = '10.0.0.2';
    private const CLIENT = '203.0.113.9';

    #[Test]
    public function withoutTrustedProxiesTheHeaderIsIgnored(): void
    {
        $this->assertSame(self::PROXY, $this->address(self::PROXY, self::CLIENT, []));
    }

    #[Test]
    public function anUntrustedPeerCannotSpoofItsAddress(): void
    {
        $this->assertSame(
            self::CLIENT,
            $this->address(self::CLIENT, '127.0.0.1', [self::PROXY])
        );
    }

    #[Test]
    public function aTrustedPeerHandsOverToTheFirstUntrustedEntryFromTheRight(): void
    {
        $this->assertSame(
            self::CLIENT,
            $this->address(self::PROXY, self::CLIENT . ', ' . self::INNER_PROXY, [self::PROXY, self::INNER_PROXY])
        );
    }

    #[Test]
    public function whatTheClientPrependedIsNotBelieved(): void
    {
        // The client sent "127.0.0.1" itself; the proxy appended the address it really saw.
        $this->assertSame(
            self::CLIENT,
            $this->address(self::PROXY, '127.0.0.1, ' . self::CLIENT, [self::PROXY])
        );
    }

    #[Test]
    public function anAllTrustedChainResolvesToItsLeftMostEntry(): void
    {
        $this->assertSame(
            self::INNER_PROXY,
            $this->address(self::PROXY, self::INNER_PROXY . ',' . self::PROXY, [self::PROXY, self::INNER_PROXY])
        );
    }

    #[Test]
    public function anInvalidEntryStopsAtTheLastBelievableHop(): void
    {
        $trusted = [self::PROXY, self::INNER_PROXY];

        $this->assertSame(self::PROXY, $this->address(self::PROXY, 'garbage', $trusted));
        $this->assertSame(
            self::INNER_PROXY,
            $this->address(self::PROXY, self::CLIENT . ', unknown, ' . self::INNER_PROXY, $trusted),
            'An address to the left of garbage was never vouched for.'
        );
        $this->assertSame(self::PROXY, $this->address(self::PROXY, self::CLIENT . ',,', $trusted));
    }

    #[Test]
    public function aTrustedPeerWithoutAHeaderIsItself(): void
    {
        $this->assertSame(self::PROXY, $this->address(self::PROXY, null, [self::PROXY]));
        $this->assertSame(self::PROXY, $this->address(self::PROXY, '  ', [self::PROXY]));
    }

    #[Test]
    public function noPeerIsNoAddress(): void
    {
        $this->assertNull($this->address(null, self::CLIENT, [self::PROXY]));
        $this->assertNull($this->address('', self::CLIENT, [self::PROXY]));
    }

    #[Test]
    public function ipv6EntriesAreAddressesToo(): void
    {
        $this->assertSame('2001:db8::1', $this->address(self::PROXY, '2001:db8::1', [self::PROXY]));
    }

    /**
     * @param list<string> $trusted
     */
    private function address(?string $peer, ?string $forwardedFor, array $trusted): ?string
    {
        $request = $this->createStub(HttpRequest::class);
        $request->method('getServer')->willReturnMap([
            ['REMOTE_ADDR', null, $peer],
            ['HTTP_X_FORWARDED_FOR', null, $forwardedFor],
        ]);

        $config = $this->createStub(Config::class);
        $config->method('trustedProxies')->willReturn($trusted);

        return (new ClientAddress($request, $config))->get();
    }
}
