const G_API_gettagsS = require('../githubAPI/tags-stat');
const utils_fs = require('../utils/fswr');

const createStatCard = require('../templates/tags-stats-card');
const Theme = require('../content/theme');
const icon = require('../content/icon');

const FetchTagsData = async function (username) {
    let dataMap = {};
    try{
        dataMap = await G_API_gettagsS(username);
    }catch(err){
        throw err;
    }
    let dataArr = [];
    
    //Object to array
    for (let key in dataMap) {
        dataArr.push({
            name: String(key).charAt(0).toUpperCase() + String(key).slice(1),
            value: dataMap[key],
            icon: icon.TAG,
            color: 'white',
        });
    }
    dataArr.sort(function (a, b) {
        return b.value - a.value;
    });
    let index = 0;
    for (let key in dataArr) {
        dataArr[key]['index'] = index;
        index++;
    }

    //Get limit: 7
    dataArr = dataArr.slice(0,6);
    return dataArr;
};

const GenerateTagsStatCard = async function (username) {
    let card = {};
    try{
        card = await FetchTagsData(username);
    }catch(err){
        throw err;
    }
    let ThemeCards = [];
    for (let element of Theme.values()){
        let svgString = TOSVG(card, element);
        ThemeCards.push(svgString);
    }
    // Length check before loop
    if(ThemeCards.length != Theme.size){
        throw Error("Deadly Error: Length wasn't equl.");
    }
    let i = 0;
    let keys = Theme.keys();
    for(let key of keys){
        try{
            await utils_fs.WriteFile(`./output/github-profilemd-generater/${key}/tagsstat.svg`, ThemeCards[i]);
            i++;
            if(i > ThemeCards.length)
                break;
        }catch(err){
            throw err;
        }
    }
};

const TOSVG = function (input, theme) {
    const svgString = createStatCard(
        'Topics Perfer:',
        input,
        theme,
    );
    return svgString;
};





module.exports = GenerateTagsStatCard;