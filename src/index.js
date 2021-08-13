const core = require('@actions/core');
const uti_cli  = require('./utils/clis');
const uti_time = require('./utils/time');
const uti_fs = require('./utils/fswr');
const rest = require('./utils/rest');


const main = async()=>{
    console.warn("Start Generate...");
    var GITHUB_REPO_NAME = "";
    let USERNAME         = "";
    let isGithubAction = false;
    // Entry reroute
    /*
        rest.GET("https://www.google.com")
            .then((res)=>{
                console.log(res.data);
            })
    */
    if (process.argv.length == 2) {
        try {
            USERNAME = core.getInput('USERNAME');
            GITHUB_REPO_NAME = core.getInput('GITHUB_REPO_NAME');
            isGithubAction = true;
        } catch (error) {
            throw Error(error.message);
        }
    }

   
    // Generate
    let currentTime = uti_time.GetCurrentTime();
    let content =`cache: `+ currentTime
    await uti_fs.WriteFile('README.md',content,()=>{
        console.log('Generated readme...');
    },()=>{
        console.error("Generated Failed...")
    });

    // Commit
    await uti_cli.CommandANDPush()
    .then(()=>{
        console.log("Git push Successful!...");
    }).catch(()=>{
        
        console.error("Git push Failed...")
    });
}
main();