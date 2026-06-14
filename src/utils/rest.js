import axios from 'axios';
import Logger from './logger.js';

const client = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 15000,
    headers: { 'User-Agent': 'github-profilemd-Generater' },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Retry on network failures, 5xx, and GitHub's 403/429 rate-limit responses. */
function isRetryable(err) {
    if (!err.response) return true; // timeout / connection error
    const s = err.response.status;
    return s >= 500 || s === 429 || s === 403;
}

/*
    Run a GraphQL query against the GitHub API.
    Resolves to `data.data`; throws on transport failure or GraphQL errors.
*/
export async function graphql(token, query, variables = {}, retries = 3) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await client.post(
                '/graphql',
                { query, variables },
                { headers: { Authorization: `bearer ${token}` } }
            );
            if (res.data.errors) {
                throw new Error(
                    res.data.errors[0]?.message || 'GraphQL query failed'
                );
            }
            return res.data.data;
        } catch (err) {
            lastErr = err;
            // GraphQL-level errors are not transient — fail fast.
            if (err.response === undefined && err.request === undefined && err.message) {
                if (!/timeout|network|socket/i.test(err.message)) throw err;
            }
            if (attempt < retries && isRetryable(err)) {
                const wait = 1000 * 2 ** attempt;
                Logger.warning(
                    `GitHub API request failed (attempt ${attempt + 1}/${
                        retries + 1
                    }), retrying in ${wait}ms: ${err.message}`
                );
                await sleep(wait);
                continue;
            }
            throw err;
        }
    }
    throw lastErr;
}

export default { graphql };
