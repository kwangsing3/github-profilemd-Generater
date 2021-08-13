const rest = require('../utils/rest');


const fetcher = (token, variables) => {
    // contain private repo need token permission
    return rest.POST(
        {
            Authorization: `bearer ${token}`,
            'User-Agent':'kwangsing3/github-profilemd-Generater',
        },
        {
            query: `
      query ReposPerLanguage($login: String!,$endCursor: String) {
        user(login: $login) {
          repositories(isFork: false, first: 100, after: $endCursor,ownerAffiliations: OWNER) {
            nodes {
              primaryLanguage {
                name
                color
              }
            }
            pageInfo{
                endCursor
                hasNextPage
            }
          }
        }
      }
      `,
            variables,
        }
    );
};

async function GetPerLanguage(username = ""){
    let hasNextPage = true;
    let cursor = null;
    const languageMap = new Map();
    const nodes = [];

    while (hasNextPage) {
        const res = await fetcher(process.env.GITHUB_TOKEN, {
            login: username,
            endCursor: cursor,
        });

        if (res.data.errors) {
            throw Error(res.data.errors[0].message || 'GetRepoLanguage fail');
        }
        cursor = res.data.data.user.repositories.pageInfo.endCursor;
        hasNextPage = res.data.data.user.repositories.pageInfo.hasNextPage;
        nodes.push(...res.data.data.user.repositories.nodes);
    }

    nodes.forEach((node) => {
        if (node.primaryLanguage) {
            const langName = node.primaryLanguage.name;
            if (languageMap.has(langName)) {
                const lang = languageMap.get(langName);
                lang.count += 1;
            } else {
                languageMap.set(langName, {
                    count: 1,
                    color: node.primaryLanguage.color
                        ? node.primaryLanguage.color
                        : '#586e75',
                });
            }
        }
    });

    let langData= [];
    // make array
    for (const [key, value] of languageMap) {
        langData.push({
            name: key,
            value: value.count,
            color: value.color,
        });
    }

    return langData;
}

module.exports = GetPerLanguage;