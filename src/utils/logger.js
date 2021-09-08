
/*
    For some reason below:
    1. Default module console.log seems doesn't work on Github Action log.
    2. Github Action log module "@actions/core" wouldn't log info locally (vscode for example).

    so, make a wrapper as Logger works in whole app.
*/

const core = require('@actions/core');


module.exports.info = function(msg = ""){
    if (process.env.isGithubAction == 'false'){
        console.log(msg);
    }else{
        core.info(msg);
    }
}
module.exports.warning = function(msg = ""){
    if (process.env.isGithubAction == 'false'){
        console.warn(msg);
    }else{
        core.warning(msg);
    }
}
module.exports.error = function(msg = ""){
    if (process.env.isGithubAction == 'false'){
        console.error(msg);
    }else{
        core.error(msg);
        core.setFailed(msg);
    }
    process.exit(1);
}