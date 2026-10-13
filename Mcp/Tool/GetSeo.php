<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Mcp\Tool;

use Siteation\DebugBar\Api\McpToolInterface;
use Siteation\DebugBar\Presentation\McpProfilePresenter;

class GetSeo implements McpToolInterface
{
    public function __construct(private readonly McpProfilePresenter $profiles)
    {
    }

    public function name(): string
    {
        return 'get_debug_seo';
    }

    public function description(): string
    {
        return 'Read what one storefront page told search engines in the HTML the server sent: '
            . 'title, description, canonical, robots, language alternates, headings, social tags '
            . 'and structured data types, with the SEO findings. Changes made by JavaScript after '
            . 'the page loaded are not in it.';
    }

    public function inputSchema(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'profile_id' => [
                    'type' => 'string',
                    'description' => 'Profile id, as returned by list_debug_profiles or the '
                        . 'X-Siteation-DebugBar-Profile response header.',
                ],
                'headings' => [
                    'type' => 'integer',
                    'minimum' => 0,
                    'maximum' => $this->profiles->maxItems(),
                    'default' => 20,
                    'description' => 'How many headings to return, in page order.',
                ],
            ],
            'required' => ['profile_id'],
            'additionalProperties' => false,
        ];
    }

    public function call(array $arguments): array
    {
        return $this->profiles->seo(
            (string) ($arguments['profile_id'] ?? ''),
            (int) ($arguments['headings'] ?? 20)
        );
    }
}
