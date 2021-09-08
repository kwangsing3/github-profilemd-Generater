const core = require('@actions/core');
const uti_time = require('./utils/time');
const uti_fs = require('./utils/fswr');
const uti_cli = require('./utils/cli');
const Logger = require('./utils/logger');

const FETCHandGENERATELangageComposition = require('./svgcards/repo-language-cards');
const FETCHandGENERATETagsStat = require('./svgcards/stat-card');
const ThemeMap = require('./content/theme');

/*function MapToString(map){
    return [...map].reduce((acc, val) => {
        acc[val[0]] = val[1];
        return acc;
      }, {});
}*/


const main = async()=>{
    
    var GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME = core.getInput('GITHUB_REPO_NAME');
    let USERNAME         = process.env.USERNAME = core.getInput('USERNAME');
    process.env.isGithubAction = false;
    // Entry reroute
    if(GITHUB_REPO_NAME != "" && USERNAME != "" && process.env.GITHUB_TOKEN != ""){
        process.env.isGithubAction = true;
    }else {
        process.env.isGithubAction = false;   // launch via /.vscode/launch.json
        let args = process.argv;
        for (let i = 0; i < args.length; i++) {
            const element = args[i];
            switch (i) {
                case 2:
                    USERNAME = element;
                    break;
                case 3:
                    GITHUB_REPO_NAME = element;
                    break;
                case 4:
                    process.env.GITHUB_TOKEN = element;
                    break;
            }
        }
    }
    if (process.env.GITHUB_TOKEN == undefined){
        Logger.error(`Error: TOKEN was Empty, make sure name secrets as "MY_GITHUB_TOKEN"`);
        return;
    }else if(USERNAME == ""){
        Logger.error(`Error: Get username:${USERNAME}, try to make sure input was correct。`);
        return;
    }

    Logger.info("Start Generate Cards...");
    //1. Languages Composition
    try{
        await FETCHandGENERATELangageComposition(USERNAME);
    }catch(err){
        Logger.error(err);
    }
    //2. Tags Stat
    try{
        await FETCHandGENERATETagsStat(USERNAME);
    }catch(err){
        Logger.error(err);
    }

    /*Time cache*/
    let content =`cache: `+ uti_time.GetCurrentTime() +`<br/><br/>`;
    let keys = ThemeMap.keys();
    for(let key of keys){
        content += `![](./github-profilemd-generater/${key}/langCompos.svg)`+`<br/>`;
        content += `![](./github-profilemd-generater/${key}/tagsstat.svg)`+`<br/><br/>`;
    };

    try{
        await uti_fs.WriteFile('./output/README.md', content, true)
    }catch(err){
        Logger.error(err);
    }


    // Git Commit
    try{
        if(process.env.isGithubAction != 'false')
            await uti_cli.CommandANDPush(process.env.isGithubAction);
    }catch(error){
        Logger.error(error);
    }

}
main();
