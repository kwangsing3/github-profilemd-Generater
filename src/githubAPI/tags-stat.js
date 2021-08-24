const request = require('../utils/rest');

const fetcher = (token, variables) => {
    return request(
        {
            Authorization: `bearer ${token}`,
        },
        {
            query: `
                  query tagsStat($login: String!) {
                    user(login: $login) {
                      repositories(first: 100, isFork: false) {
                        nodes {
                          repositoryTopics(first: 100) {
                            edges {
                              node {
                                topic {
                                  name
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
            `,
            variables,
        }
    );
};

// repos per language
async function getTagsStat(username) {
    let res = {};
    try{
        res = await fetcher(process.env.GITHUB_TOKEN, {
            login: username,
        });
    }catch(err){
        throw err;
    }

    if (res.data.errors) {
        throw Error(res.data.errors[0].message || 'GetgetTagsStat failed');
    }

    let json = JSON.stringify(res.data.data);
    json = JSON.parse(json);

    /*
    {
        user:{
            repositories:{
                nodes:[
                    {
                        repositoryTopics:{
                            "edges": [
                                {
                                    "node": {
                                        "topic": {
                                        "name": "unity"
                                        }
                                    }
                                },
                                ...
                            ]
                        }
                    },
                    ...
                ]
            }
        }
    }
    */
    let result = {};
    let arry = json['user']['repositories']['nodes'];
    for (let index in arry){
        let tags = arry[index]['repositoryTopics']['edges'];
        for(let ele in tags){
            let tag_name = tags[ele]['node']['topic']['name'];
            if(result.hasOwnProperty(tag_name)){
                result[tag_name] += 1;
            }else{
                result[tag_name] = 1;
            }
        }
    }

    return result;
}

module.exports = getTagsStat;
