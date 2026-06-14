import { graphql } from '../utils/rest.js';

// contributionsCollection defaults to the last year (commits this year).
const QUERY = `
  query Overview($login: String!, $cursor: String) {
    user(login: $login) {
      followers { totalCount }
      pullRequests { totalCount }
      issues { totalCount }
      contributionsCollection { totalCommitContributions }
      repositories(first: 100, after: $cursor, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        pageInfo { hasNextPage endCursor }
        nodes { stargazerCount }
      }
    }
  }
`;

export function sumStars(nodes) {
    return nodes.reduce((acc, n) => acc + (n.stargazerCount || 0), 0);
}

/*
    Returns a flat object of headline profile numbers:
    { repos, stars, followers, commits, pullRequests, issues }
*/
export async function getOverview(username, token = process.env.GITHUB_TOKEN) {
    let cursor = null;
    let stars = 0;
    let first = null;
    for (let page = 0; page < 10; page++) {
        const data = await graphql(token, QUERY, { login: username, cursor });
        if (!first) first = data.user;
        stars += sumStars(data.user.repositories.nodes);
        const pi = data.user.repositories.pageInfo;
        if (!pi.hasNextPage) break;
        cursor = pi.endCursor;
    }
    return {
        repos: first.repositories.totalCount,
        stars,
        followers: first.followers.totalCount,
        commits: first.contributionsCollection.totalCommitContributions,
        pullRequests: first.pullRequests.totalCount,
        issues: first.issues.totalCount,
    };
}

export default getOverview;
