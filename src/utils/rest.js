

const axios = require('axios');
//https://api.github.com/graphql
function GET(url, inputheader = null){
    let header = {};
    if (inputheader == null || inputheader == ''){
        header = {
            'User-Agent': 'kwangsing3/github-profilemd-Generater',
            'Referer':'https://github.com/kwangsing3/github-profilemd-Generater',
        };
    }else
        header = inputheader;

        return axios({
            url: 'https://api.github.com/graphql',
            method: 'get',
            headers: header,
            data: data,
        });
}
function POST(header, data){
    return axios({
        url: 'https://api.github.com/graphql',
        method: 'post',
        headers: header,
        data: data,
    });
}

module.exports.GET = GET;
module.exports.POST = POST;

/*
 rest.GET("https://www.google.com")
    .then((res)=>{
        console.log(res.data);
    })
*/