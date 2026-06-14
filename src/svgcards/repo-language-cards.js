import { getLanguageComposition } from '../githubAPI/language-composition.js';
import createHorizontalbarCard from '../templates/horizontal-bar.js';
import { writeThemed } from './render.js';

/* Map the aggregated language map into sorted, filtered card rows. */
export function toLanguageRows(langMap, { hide = [], topN = 8 } = {}) {
    return Object.entries(langMap)
        .map(([name, v]) => ({ name, value: v.size, color: v.color }))
        .filter((d) => !hide.includes(d.name.toLowerCase()))
        .sort((a, b) => b.value - a.value)
        .slice(0, topN);
}

export async function generateLangComposCard(config) {
    const langMap = await getLanguageComposition(config.username, config.token);
    const rows = toLanguageRows(langMap, config);
    if (rows.length === 0) return;
    // horizontal-bar mutates row.value into a percentage, so clone per theme.
    await writeThemed(config, 'langcompos', (theme) =>
        createHorizontalbarCard('Repo Composed', rows.map((r) => ({ ...r })), theme)
    );
}

export default generateLangComposCard;
