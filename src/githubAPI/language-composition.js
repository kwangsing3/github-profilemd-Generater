const request = require('../utils/rest');

const fetcher = (token, variables) => {
    return request(
        {
            Authorization: `bearer ${token}`,
        },
        {
            query: `
                  query LanguageCompositionQuery($login: String!) {
                    user(login: $login) {
                      repositories(isFork: false, first: 100) {
                        nodes {
                          primaryLanguage {
                            name
                            color
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
async function getCommitLanguage(username) {
    let res = {};
    try{
        res = await fetcher(process.env.GITHUB_TOKEN, {
            login: username,
        });
    }catch(err){
        throw err;
    }

    if (res.data.errors) {
        throw Error(res.data.errors[0].message || 'GetCommitLanguage failed');
    }

    let json = JSON.stringify(res.data.data);
    json = JSON.parse(json);

    /*
    {
        user:{
            repositories:{
                edges:[
                    {
                        node:{
                            name:"",
                            primaryLanguage:{
                                "color": "",
                                "name": "",
                            },
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
        if( arry[index]['primaryLanguage'] == null)
            continue;
        let lang_name = arry[index]['primaryLanguage']['name'];
        let lang_color = arry[index]['primaryLanguage']['color'];
        if(result.hasOwnProperty(lang_name)){
            result[lang_name]['size'] += 1;
        }else{
            result[lang_name] = {
                color: lang_color ? lang_color : '#586e75',
                size: 1,
            };
        }
    }

    return result;
}

module.exports = getCommitLanguage;
