<?php

declare(strict_types=1);

namespace Siteation\DebugBarFixture\Presentation;

use Siteation\DebugBar\Api\SectionViewInterface;

/**
 * Draws the stored half of the fixture section from the built in request summary, so the
 * browser suite can check a view reaches the bar with values from the profile it belongs to.
 */
class FixtureView implements SectionViewInterface
{
    /**
     * @param array<string, mixed> $profile
     * @return array<string, mixed>
     */
    public function view(array $profile): array
    {
        $request = (array) ($profile['sections']['request']['summary'] ?? []);
        $rows = [];

        foreach ((array) ($profile['sections'] ?? []) as $key => $section) {
            $rows[] = ['key' => (string) $key, 'label' => (string) ($section['label'] ?? $key)];
        }

        return [
            'count' => 1,
            'tabs' => [[
                'id' => 'stored',
                'label' => 'Stored',
                'blocks' => [
                    ['type' => 'facts', 'items' => [
                        ['label' => 'Profile', 'value' => (string) ($profile['id'] ?? ''), 'mono' => true],
                        ['label' => 'Path', 'value' => (string) ($request['path'] ?? ''), 'mono' => true],
                    ]],
                    ['type' => 'table', 'columns' => ['key', 'label'], 'rows' => $rows],
                ],
            ]],
        ];
    }
}
