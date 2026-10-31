<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\App\Area;
use Magento\Framework\App\AreaList;
use Magento\Framework\App\Request\Http as HttpRequest;

/**
 * Decides whether a request should produce a profile at all, and whether one may be read.
 *
 * Both questions in one place because they have to give the same answer. An endpoint that
 * hands out a profile to someone the bar would not have collected for is a way around the
 * gate rather than a thing behind it, and while the check was written out three times in
 * three controllers it was one edit away from becoming exactly that.
 *
 * The bar's own endpoints are excluded from collection, otherwise fetching a profile would
 * store another one and a handful of clicks would push the real profiles out of the ring.
 */
class RequestEligibility
{
    public const FRONT_NAME = 'siteation_debugbar';

    public function __construct(
        private readonly Config $config,
        private readonly HttpRequest $request,
        private readonly AreaList $areaList,
        private readonly AccessKey $accessKey,
        private readonly ClientAddress $client
    ) {
    }

    /** Whether this request should be profiled. */
    public function allows(): bool
    {
        if (!$this->allowsRead()) {
            return false;
        }

        if (!$this->config->allowsArea($this->area())) {
            return false;
        }

        return !$this->isOwnRequest();
    }

    /**
     * Whether this request may read what was collected.
     *
     * The area list is deliberately not consulted: it says which areas are worth profiling,
     * not who may look, and a profile of an area no longer being collected is still a
     * profile that was collected for this developer.
     *
     * Keyless means a developer machine, so with neither a key nor an address list the bar
     * answers only an address that cannot come from the internet. Developer mode is all that
     * allows keyless, and plenty of shared staging servers run in it: on one of those,
     * "nothing to prove" meant anyone who could reach the site read every profile. Docker,
     * Warden and DDEV put a private address in front of the store, so they still qualify.
     */
    public function allowsRead(): bool
    {
        $ip = $this->clientIp();

        return $this->config->isEnabled()
            && $this->config->allowsIp($ip)
            && $this->accessKey->allows()
            && ($this->config->accessKey() !== '' || $this->config->allowedIps() !== [] || $this->isLocal($ip));
    }

    /**
     * Whether this request may read this particular profile, once allowsRead() has said yes.
     *
     * An admin profile holds what the admin did, and the storefront endpoints answer without a
     * login. The admin controllers run the same code behind the admin session, so from the
     * admin every profile is readable and from the storefront every one but the admin's.
     *
     * @param array<string, mixed> $profile
     */
    public function allowsReadOf(array $profile): bool
    {
        return ($profile['sections']['request']['summary']['area'] ?? null) !== Area::AREA_ADMINHTML
            || $this->area() === Area::AREA_ADMINHTML;
    }

    /**
     * Resolved the same way App\Http::launch() does, because the decision has to be made
     * before launch() gets round to setting the area.
     */
    public function area(): ?string
    {
        try {
            return $this->areaList->getCodeByFrontName((string) $this->request->getFrontName());
        } catch (\Throwable) {
            return null;
        }
    }

    /** @see ClientAddress for when X-Forwarded-For is believed. */
    public function clientIp(): ?string
    {
        return $this->client->get();
    }

    /**
     * Loopback, private and link local addresses, IPv4 and IPv6 alike: the reserved ranges
     * PHP knows hold loopback and link local, the private ones hold RFC 1918 and ULA.
     */
    private function isLocal(?string $ip): bool
    {
        return $ip !== null
            && filter_var($ip, FILTER_VALIDATE_IP) !== false
            && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false;
    }

    /**
     * The route is the first segment of the path, except in the admin, where the admin front
     * name comes first. Only that one segment is compared: a page whose URL merely mentions
     * the front name further along is somebody else's page and still worth profiling.
     */
    private function isOwnRequest(): bool
    {
        $segments = explode('/', trim((string) $this->request->getPathInfo(), '/'));

        if ($this->area() === Area::AREA_ADMINHTML) {
            array_shift($segments);
        }

        return ($segments[0] ?? '') === self::FRONT_NAME;
    }
}
