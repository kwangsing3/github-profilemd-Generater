const G_API_getLangC = require('../githubAPI/language-composition');
const utils_fs = require('../utils/fswr');
const createHorizontalbarCard = require('../templates/horizontal-bar');
const Theme = require('../content/theme');

const FetchLanguageData = async function (username) {
    let langMap = {};
    try{
        langMap = await G_API_getLangC(username);
    }catch(err){
        throw err;
    }
    let langData = [];

    
    //Object to array
    for (let key in langMap) {
        langData.push({
            name: key,
            value: langMap[key]['size'],
            color: langMap[key]['color'],
        });
    }


    langData.sort(function (a, b) {
        return b.value - a.value;
    });
    //langData = langData.slice(0, 5); // get top 5
    return langData;
};

const GenerateLangComposCard = async function (username) {
    let card = {};
    try{
        card = await FetchLanguageData(username);
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
            await utils_fs.WriteFile(`./output/${key}/langcompos.svg`, ThemeCards[i]);
            i++;
            if(i > ThemeCards.length)
                break;
        }catch(err){
            throw err;
        }
    }
};

const TOSVG = function (input, theme) {
    let svgString = {};
    try{
        svgString = createHorizontalbarCard(
            'Repo Composed',
            input,
            theme,
        );
    }catch(err){
        throw err;
    }
    return svgString;
};





module.exports = GenerateLangComposCard;