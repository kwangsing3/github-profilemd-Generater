import { graphql } from '../utils/rest.js';

const QUERY = `
  query TagsStat($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(isFork: false, ownerAffiliations: OWNER, first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          repositoryTopics(first: 100) {
            edges { node { topic { name } } }
          }
        }
      }
    }
  }
`;

/* Count how many repositories use each topic. Returns { [topic]: count }. */
export function parseTags(nodes) {
    const result = {};
    for (const repo of nodes) {
        const edges = repo?.repositoryTopics?.edges || [];
        for (const edge of edges) {
            const name = edge.node.topic.name;
            result[name] = (result[name] || 0) + 1;
        }
    }
    return result;
}

export async function getTagsStat(username, token = process.env.GITHUB_TOKEN) {
    let cursor = null;
    let nodes = [];
    for (let page = 0; page < 10; page++) {
        const data = await graphql(token, QUERY, { login: username, cursor });
        const repos = data.user.repositories;
        nodes = nodes.concat(repos.nodes);
        if (!repos.pageInfo.hasNextPage) break;
        cursor = repos.pageInfo.endCursor;
    }
    return parseTags(nodes);
}

export default getTagsStat;
