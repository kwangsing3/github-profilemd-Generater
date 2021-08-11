

const axios = require('axios');
//https://api.github.com/graphql
async function GET(url, header){
    return axios({
        url: url,
        method: 'get',
        headers: header,
    });
}
async function POST(url, header, data){
    return axios({
        url: url,
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