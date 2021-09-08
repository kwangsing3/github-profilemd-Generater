
/*
    For some reason below:
    1. Default module console.log seems doesn't work on Github Action log.
    2. Github Action log module "@actions/core" wouldn't log info locally (vscode for example).

    so, make a wrapper as Logger works in whole app.
*/

const core = require('@actions/core');


module.exports.info = function(msg = ""){
    if (process.env.isGithubAction){
        core.info(msg);
    }else{
        console.log(msg);
    }
}
module.exports.warning = function(msg = ""){
    if (process.env.isGithubAction){
        core.warning(msg);
    }else{
        console.warn(msg);
    }
}
module.exports.error = function(msg = ""){
    if (process.env.isGithubAction){
        core.error(msg);
        core.setFailed(msg);
    }else{
        console.error(msg);
    }
    process.exit(1);
}