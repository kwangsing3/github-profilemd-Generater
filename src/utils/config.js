/*
    Resolve all runtime configuration in one place.

    Inputs are read with @actions/core (which maps `with:` keys to INPUT_*),
    and fall back to positional CLI args so the tool stays runnable locally:

        node dist/index.mjs <username> <repo_name> <github_token>
*/
import * as core from '@actions/core';
import ThemeMap from '../content/theme.js';

function input(name, fallback = '') {
    const v = core.getInput(name);
    return v !== '' ? v : fallback;
}

/* Split a comma/space separated list into a trimmed, non-empty array. */
function list(raw) {
    return String(raw || '')
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

export function loadConfig(argv = process.argv) {
    let username = input('USERNAME');
    let repoName = input('GITHUB_REPO_NAME');
    let token = process.env.GITHUB_TOKEN || '';

    // Local fallback: node dist/index.mjs <username> <repo> <token>
    if (!username && argv[2]) username = argv[2];
    if (!repoName && argv[3]) repoName = argv[3];
    if (!token && argv[4]) token = argv[4];

    // THEME: "all" (default) or a comma list of theme keys.
    const themeRaw = input('THEME', 'all').toLowerCase();
    const known = [...ThemeMap.keys()];
    let themes;
    if (themeRaw === 'all' || themeRaw === '') {
        themes = known;
    } else {
        themes = list(themeRaw).filter((t) => known.includes(t));
        if (themes.length === 0) themes = known; // guard against typos
    }

    const topN = Math.max(1, parseInt(input('TOP_N', '8'), 10) || 8);
    const hide = list(input('HIDE')).map((s) => s.toLowerCase());
    const outputDir = (input('OUTPUT_DIR', 'output') || 'output').replace(/[\\/]+$/, '');

    return {
        username,
        repoName,
        token,
        themes,
        topN,
        hide,
        outputDir,
        isAction: process.env.GITHUB_ACTIONS === 'true',
    };
}

export default { loadConfig };
