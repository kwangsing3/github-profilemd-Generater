import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseLanguages } from '../src/githubAPI/language-composition.js';
import { parseTags } from '../src/githubAPI/tags-stat.js';
import { sumStars } from '../src/githubAPI/profile-details.js';
import { toLanguageRows } from '../src/svgcards/repo-language-cards.js';
import { toTagRows } from '../src/svgcards/stat-card.js';
import { toOverviewRows } from '../src/svgcards/overview-card.js';

test('parseLanguages aggregates real byte sizes across repos', () => {
    const nodes = [
        { languages: { edges: [
            { size: 100, node: { name: 'JavaScript', color: '#f1e05a' } },
            { size: 50, node: { name: 'CSS', color: '#563d7c' } },
        ] } },
        { languages: { edges: [
            { size: 400, node: { name: 'JavaScript', color: '#f1e05a' } },
        ] } },
        { languages: { edges: [] } },
    ];
    const out = parseLanguages(nodes);
    assert.equal(out.JavaScript.size, 500);
    assert.equal(out.CSS.size, 50);
    assert.equal(out.JavaScript.color, '#f1e05a');
});

test('toLanguageRows sorts by size, hides, and limits', () => {
    const map = {
        JavaScript: { size: 500, color: '#f1e05a' },
        CSS: { size: 50, color: '#563d7c' },
        HTML: { size: 9999, color: '#e34c26' },
    };
    const rows = toLanguageRows(map, { hide: ['html'], topN: 1 });
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, 'JavaScript'); // HTML hidden, JS is biggest left
});

test('parseTags counts topic frequency', () => {
    const nodes = [
        { repositoryTopics: { edges: [
            { node: { topic: { name: 'unity' } } },
            { node: { topic: { name: 'game' } } },
        ] } },
        { repositoryTopics: { edges: [
            { node: { topic: { name: 'unity' } } },
        ] } },
    ];
    const out = parseTags(nodes);
    assert.equal(out.unity, 2);
    assert.equal(out.game, 1);
});

test('toTagRows capitalizes, sorts, limits and indexes', () => {
    const rows = toTagRows({ unity: 2, game: 1, web: 5 }, { topN: 2 });
    assert.equal(rows.length, 2);
    assert.equal(rows[0].name, 'Web');
    assert.equal(rows[0].index, 0);
    assert.equal(rows[1].index, 1);
});

test('sumStars totals stargazerCount', () => {
    assert.equal(sumStars([{ stargazerCount: 3 }, { stargazerCount: 7 }, {}]), 10);
});

test('toOverviewRows produces the six headline stats', () => {
    const rows = toOverviewRows({
        stars: 1, repos: 2, followers: 3, commits: 4, pullRequests: 5, issues: 6,
    });
    assert.equal(rows.length, 6);
    assert.deepEqual(rows.map((r) => r.value), [1, 2, 3, 4, 5, 6]);
});
