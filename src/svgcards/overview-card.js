import { getOverview } from '../githubAPI/profile-details.js';
import createOverviewCard from '../templates/overview-stats-card.js';
import Icons from '../content/icon.js';
import { writeThemed } from './render.js';

/* Map the overview numbers into ordered, icon-tagged card rows. */
export function toOverviewRows(o) {
    return [
        { name: 'Total Stars', value: o.stars, icon: Icons.STAR },
        { name: 'Public Repos', value: o.repos, icon: Icons.REPOS },
        { name: 'Followers', value: o.followers, icon: Icons.GITHUB },
        { name: 'Commits (1y)', value: o.commits, icon: Icons.COMMIT },
        { name: 'Pull Requests', value: o.pullRequests, icon: Icons.PULL_REQUEST },
        { name: 'Issues', value: o.issues, icon: Icons.ISSUE },
    ];
}

export async function generateOverviewCard(config) {
    const overview = await getOverview(config.username, config.token);
    const rows = toOverviewRows(overview);
    await writeThemed(config, 'overview', (theme) =>
        createOverviewCard('Overview', rows, theme)
    );
}

export default generateOverviewCard;
