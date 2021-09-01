const core = require('@actions/core');
const uti_time = require('./utils/time');
const uti_fs = require('./utils/fswr');
const uti_cli = require('./utils/cli');


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
    let isGithubAction = false;
    // Entry reroute
    if(GITHUB_REPO_NAME != "" && USERNAME != "" && process.env.GITHUB_TOKEN != ""){
        isGithubAction = true;
    }else {
        isGithubAction = false;   // launch via /.vscode/launch.json
        USERNAME = process.argv[2];
        GITHUB_REPO_NAME = process.argv[3];
        process.env.GITHUB_TOKEN = process.argv[4];
    }

    core.info("Start Generate Cards...");
    //1. Languages Composition
    try{
        await FETCHandGENERATELangageComposition(USERNAME);
    }catch(err){
        console.error(err);
        core.setFailed(err);
    }
    //2. Tags Stat
    try{
        await FETCHandGENERATETagsStat(USERNAME);
    }catch(err){
        console.error(err);
        core.setFailed(err);
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
        console.error(err);
        core.setFailed(err);
    }


    // Git Commit
    try{
        if(isGithubAction)
            await uti_cli.CommandANDPush(isGithubAction);
    }catch(error){
        console.error(error);
        core.setFailed(error);
    }

}
main();



