import { graphql } from '../utils/rest.js';

const QUERY = `
  query LanguageComposition($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(isFork: false, ownerAffiliations: OWNER, first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

/*
    Aggregate real language byte sizes across a list of repository nodes.
    Returns { [language]: { size, color } } where size is total bytes.
*/
export function parseLanguages(nodes) {
    const result = {};
    for (const repo of nodes) {
        const edges = repo?.languages?.edges || [];
        for (const edge of edges) {
            const name = edge.node.name;
            const color = edge.node.color || '#586e75';
            if (!result[name]) result[name] = { color, size: 0 };
            result[name].size += edge.size;
        }
    }
    return result;
}

/* Fetch every owned, non-fork repository (paginated) and aggregate languages. */
export async function getLanguageComposition(username, token = process.env.GITHUB_TOKEN) {
    let cursor = null;
    let nodes = [];
    // Cap at 10 pages (1000 repos) as a safety valve.
    for (let page = 0; page < 10; page++) {
        const data = await graphql(token, QUERY, { login: username, cursor });
        const repos = data.user.repositories;
        nodes = nodes.concat(repos.nodes);
        if (!repos.pageInfo.hasNextPage) break;
        cursor = repos.pageInfo.endCursor;
    }
    return parseLanguages(nodes);
}

export default getLanguageComposition;
