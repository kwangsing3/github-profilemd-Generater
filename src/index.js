const core = require('@actions/core');
const uti_time = require('./utils/time');
const uti_fs = require('./utils/fswr');
const uti_cli = require('./utils/cli');

const getCommitLanguage = require('./githubAPI/language-composition');

const main = async()=>{
    
    var GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME = core.getInput('GITHUB_REPO_NAME');
    let USERNAME         = process.env.USERNAME = core.getInput('USERNAME');
    let isGithubAction = false;
    // Entry reroute
    if(process.argv.length >= 2){
        isGithubAction = false;
        USERNAME = process.argv[2];
        GITHUB_REPO_NAME = process.argv[3];
        process.env.GITHUB_TOKEN = process.argv[4];
    }else if(GITHUB_REPO_NAME != "" && USERNAME != ""){
        isGithubAction = true;
    }


    //GetInfo
    let LangComData = {};
    try{
        LangComData = await getCommitLanguage(USERNAME);
    }catch(err){
        core.error(err);
    }

    // Generate
    core.info("Start Generate...");
    try{
        let currentTime = uti_time.GetCurrentTime();
        let content =`cache: `+ currentTime;
        await uti_fs.WriteFile('README.md', content, true)
            .catch((err)=>{
                throw err;
            });

        //lang compos
        let langD = JSON.stringify(MapToString(LangComData));
        await uti_fs.WriteFile('output/LANGCOMPOS.md', langD, true)
            .catch((err)=>{
                throw err;
            });


    }catch(error){
        core.error(error);
    }
    // Commit
    try{
        await uti_cli.CommandANDPush(isGithubAction)
            .then(()=>{
                core.info("Git push Successful!...");
            }).catch((err)=>{
                throw err;
            });
    }catch(error){
        core.error(error);
    }

}
main();



function MapToString(map){
    return [...map].reduce((acc, val) => {
        acc[val[0]] = val[1];
        return acc;
      }, {});
}