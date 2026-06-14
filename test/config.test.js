import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/utils/config.js';

function clearInputs() {
    for (const k of Object.keys(process.env)) {
        if (k.startsWith('INPUT_')) delete process.env[k];
    }
    delete process.env.GITHUB_TOKEN;
}

beforeEach(clearInputs);

test('falls back to positional CLI args', () => {
    const cfg = loadConfig(['node', 'index.mjs', 'alice', 'alice', 'tok123']);
    assert.equal(cfg.username, 'alice');
    assert.equal(cfg.repoName, 'alice');
    assert.equal(cfg.token, 'tok123');
});

test('THEME=all expands to every known theme', () => {
    process.env.INPUT_USERNAME = 'bob';
    const cfg = loadConfig(['node', 'index.mjs']);
    assert.ok(cfg.themes.length >= 10);
    assert.ok(cfg.themes.includes('dracula'));
});

test('THEME accepts a comma list and drops unknown keys', () => {
    process.env.INPUT_THEME = 'dracula, nope, github_dark';
    const cfg = loadConfig(['node', 'index.mjs', 'bob']);
    assert.deepEqual(cfg.themes, ['dracula', 'github_dark']);
});

test('TOP_N and HIDE are parsed', () => {
    process.env.INPUT_TOP_N = '5';
    process.env.INPUT_HIDE = 'HTML, CSS';
    const cfg = loadConfig(['node', 'index.mjs', 'bob']);
    assert.equal(cfg.topN, 5);
    assert.deepEqual(cfg.hide, ['html', 'css']);
});

test('OUTPUT_DIR trailing slashes are trimmed', () => {
    process.env.INPUT_OUTPUT_DIR = 'public/cards/';
    const cfg = loadConfig(['node', 'index.mjs', 'bob']);
    assert.equal(cfg.outputDir, 'public/cards');
});
