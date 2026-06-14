import { test } from 'node:test';
import assert from 'node:assert/strict';

import ThemeMap from '../src/content/theme.js';
import createHorizontalbarCard from '../src/templates/horizontal-bar.js';
import createStatCard from '../src/templates/tags-stats-card.js';
import createOverviewCard from '../src/templates/overview-stats-card.js';
import Icons from '../src/content/icon.js';

const theme = ThemeMap.get('dracula');

test('language bar card renders an svg', () => {
    const svg = createHorizontalbarCard(
        'Repo Composed',
        [
            { name: 'JavaScript', value: 500, color: '#f1e05a' },
            { name: 'CSS', value: 200, color: '#563d7c' },
        ],
        theme
    );
    assert.match(svg, /<svg/);
    assert.match(svg, /JavaScript/);
});

test('tags stat card renders an svg', () => {
    const svg = createStatCard(
        'Topics Perfer:',
        [{ name: 'Unity', value: 3, icon: Icons.TAG, color: 'white', index: 0 }],
        theme
    );
    assert.match(svg, /<svg/);
    assert.match(svg, /Unity/);
});

test('overview card renders an svg and abbreviates big numbers', () => {
    const svg = createOverviewCard(
        'Overview',
        [
            { name: 'Total Stars', value: 12300, icon: Icons.STAR },
            { name: 'Followers', value: 42, icon: Icons.GITHUB },
        ],
        theme
    );
    assert.match(svg, /<svg/);
    assert.match(svg, /Total Stars/);
    assert.match(svg, /12\.3k/); // number-abbreviate output
});
