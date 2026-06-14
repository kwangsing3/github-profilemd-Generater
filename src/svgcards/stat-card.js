import { getTagsStat } from '../githubAPI/tags-stat.js';
import createStatCard from '../templates/tags-stats-card.js';
import Icons from '../content/icon.js';
import { writeThemed } from './render.js';

const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

/* Map the topic-count map into sorted, indexed card rows. */
export function toTagRows(tagMap, { topN = 6 } = {}) {
    return Object.entries(tagMap)
        .map(([name, value]) => ({
            name: cap(name),
            value,
            icon: Icons.TAG,
            color: 'white',
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, topN)
        .map((row, index) => ({ ...row, index }));
}

export async function generateTagsStatCard(config) {
    const tagMap = await getTagsStat(config.username, config.token);
    const rows = toTagRows(tagMap, config);
    if (rows.length === 0) return;
    await writeThemed(config, 'tagsstat', (theme) =>
        createStatCard('Topics Perfer:', rows, theme)
    );
}

export default generateTagsStatCard;
