<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Request\Http as HttpRequest;

/**
 * The address a request actually came from.
 *
 * X-Forwarded-For is a claim, and anyone can make it. An allowlist that trusts a client
 * supplied header is not an allowlist, and neither is a lockout that a guesser can step out
 * of by changing one header. So the header is read only when the direct peer is a proxy the
 * store has named in trusted_proxies, and only as far as that chain of named proxies vouches
 * for it.
 *
 * Each proxy appends the address it received the request from, so the header is walked from
 * the right. Every entry a trusted proxy wrote is believed; the first one that is not itself
 * a trusted proxy is the client, and everything to the left of it is whatever that client
 * chose to send. An entry that is not an address stops the walk at the last hop that could
 * be believed, which is the answer the store would have had without the setting: a garbled
 * header must never resolve to somebody else's address.
 *
 * One definition because two readers depend on it meaning the same thing: the allowlist
 * decides who may be answered, and the attempt counter decides who has stopped being
 * answered. A difference between them would be a way around one of the two.
 *
 * Behind a load balancer that is not named, this is the balancer, so every client shares one
 * bucket. That is why the key's length floor is the defence and the counter is only depth: a
 * shared bucket can be filled deliberately, and the cost of that is the developer waiting
 * out a window, not a store that stops working.
 */
class ClientAddress
{
    public function __construct(
        private readonly HttpRequest $request,
        private readonly Config $config
    ) {
    }

    public function get(): ?string
    {
        $peer = $this->request->getServer('REMOTE_ADDR');

        if (!is_string($peer) || $peer === '') {
            return null;
        }

        $trusted = $this->config->trustedProxies();

        if ($trusted === [] || !in_array($peer, $trusted, true)) {
            return $peer;
        }

        $address = $peer;

        foreach (array_reverse($this->forwardedFor()) as $entry) {
            if (filter_var($entry, FILTER_VALIDATE_IP) === false) {
                return $address;
            }

            $address = $entry;

            if (!in_array($entry, $trusted, true)) {
                return $entry;
            }
        }

        return $address;
    }

    /**
     * @return list<string>
     */
    private function forwardedFor(): array
    {
        $header = $this->request->getServer('HTTP_X_FORWARDED_FOR');

        if (!is_string($header) || trim($header) === '') {
            return [];
        }

        return array_map('trim', explode(',', $header));
    }
}
