const core = require('@actions/core');
const uti_time = require('./utils/time');
const uti_fs = require('./utils/fswr');
const uti_cli = require('./utils/cli');


const main = async()=>{
    
    var GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME = core.getInput('GITHUB_REPO_NAME');
    let USERNAME         = process.env.USERNAME = core.getInput('USERNAME');
    let isGithubAction = false;
    // Entry reroute
   
    // Generate
    console.info("Start Generate...");
    try{
        let currentTime = uti_time.GetCurrentTime();
        let content =`cache: `+ currentTime;
        await uti_fs.WriteFile('README.md',content,()=>{
            console.log('Generated readme...');
        },()=>{
            console.error("Generated Failed...")
        });
    }catch(error){
        core.setFailed(error);
    }

    // Commit
    try{
        await uti_cli.CommandANDPush()
            .then(()=>{
                console.log("Git push Successful!...");
            }).catch(()=>{
                console.error("Git push Failed...")
            });
    }catch(error){
        core.setFailed(error);
    }

}
main();