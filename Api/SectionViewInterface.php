<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Api;

/**
 * Draws a section another module adds to the bar, from a stored profile.
 *
 * The bar runs Alpine's CSP build inside a shadow root, so another module cannot ship
 * markup for it. It describes the panel instead, as blocks the bar already knows how to
 * draw, and the bar keeps one look and one set of escaping rules for every section.
 *
 * The block types are listed in docs/developer-guide.md, under "A section from another
 * module". An unknown type is drawn as a note saying so, rather than dropped.
 */
interface SectionViewInterface
{
    /**
     * The whole profile rather than one section of it, so a section can be drawn from its
     * own collector, from the built in ones, or from both.
     *
     * @param array<string, mixed> $profile
     * @return array<string, mixed> `blocks`, or `tabs` that each hold `blocks`
     */
    public function view(array $profile): array;
}
