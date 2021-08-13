const core = require('@actions/core');
const uti_cli  = require('./utils/clis');
const uti_time = require('./utils/time');
const uti_fs = require('./utils/fswr');
const path = require('path');
const Account = require('./model/account');



const main = async()=>{
    let GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME = core.getInput('GITHUB_REPO_NAME');
    let USERNAME         = process.env.USERNAME = core.getInput('USERNAME');
    let isGithubAction = false;

    //Dev args
    if(process.argv.length == 4){
        USERNAME = process.argv[2];
        GITHUB_REPO_NAME = process.argv[3];
    }


    // Entry reroute
    if (GITHUB_REPO_NAME != "" && USERNAME != "") {
        isGithubAction = true;
    }

    /* 1. launch from local. */
    if (USERNAME == "" && !isGithubAction){
        core.info("【---Launch Without Username---】");
        core.info("Enter Github Account (username): ");
        USERNAME = await uti_cli.readLineAsync();
    }
    /* 2. launch from Github Action */
    if (isGithubAction){
        if(GITHUB_REPO_NAME != USERNAME){
            // Rewrite action.yml to cancel schedule trigger.
            core.info("【---Action with dev README---】");
            let paths = path.join('./.github/workflows');
            await uti_fs.ClearFolder(paths,()=>{
                core.info('Clear action.yml');
            },(err)=>{
                core.setFailed(`Clear Failed...: ${err}`)
            });
           /* let conts = "# Rewrited by github-profilemd-Generater[bot].";
            await uti_fs.WriteFile('./.github/workflows/action.yml',conts,()=>{
                core.info('Rewrite action.yml...');
            },(err)=>{
                core.setFailed(`Rewrite Failed...: ${err}`)
            });*/
        }else if(GITHUB_REPO_NAME == USERNAME){
            // Rewrite action.yml to launch schedule trigger.
            core.info("【---Action with deploy README---】");
            await uti_fs.WriteFile('./.github/workflows/action.yml',defaultActionYML,()=>{
                core.info('Copy action.yml...');
            },(err)=>{
                core.setFailed(`Copy Failed...: ${err}`)
            });
        }
    }
    if(USERNAME.includes('@')){
        let tmp_name = "";
        for(let str = 0; str< USERNAME.length;str++){
            if (USERNAME[str] == "@")
                break;
            tmp_name += USERNAME[str];
        }
        USERNAME = tmp_name;
    }
    core.info(`[bot]: Generated with-> ${USERNAME}`);
    if(USERNAME == "" || process.env.GITHUB_TOKEN == ''){
        core.setFailed("Unexpected Failed, Please leave your issue at:  https://github.com/kwangsing3/github-profilemd-Generater/issues")
        process.exit(0);
    }

    // Generate cards
    core.info("Start Generate...");
    let account = new Account(USERNAME);
    account.SetTheme(0);
    try{
        await account.GenerateCard();
    }catch(error){
        core.setFailed(error);
    }

    // Write to File
    let content = account.GetContent();
    core.info( JSON.stringify(content));
    let tarPath = (isGithubAction && GITHUB_REPO_NAME==USERNAME)||true? "README.md":'./output/README.md';
    await uti_fs.WriteFile(tarPath , JSON.stringify(content) ,()=>{
        core.info("[bot]: Generated "+ tarPath);
    },()=>{
        core.setFailed("[bot]: Generated Failed...")
    });

    // Commit
    await uti_cli.CommandANDPush('github-profilemd-Generater[bot] Commited: '+ uti_time.GetCurrentTime())
    .then(()=>{
        core.info("[bot]: Git push done!...");
    }).catch(()=>{
        core.setFailed("[bot]: Git push Failed...")
    });
}
main();



var defaultActionYML = `

# This is a basic workflow to help you get started with Actions

name:  Schedule Run

# Controls when the workflow will run
on:
  schedule: # execute every 24 hours
    - cron: '* */24 * * *'
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
    
  workflow_dispatch:
  # Allows you to run this workflow manually from the Actions tab


# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    name: generate
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - uses: kwangsing3/github-profilemd-Generater@main
        env: # default use \${{ secrets.GITHUB_TOKEN }}, you can change to your personal access token
          GITHUB_TOKEN: \${{ secrets.MY_GITHUB_TOKEN }}
        with:
          USERNAME: \${{ github.repository_owner }}
          GITHUB_REPO_NAME: \${{ github.event.repository.name }} 
      # Runs a single command using the runners shell
      - name: Run a one-line script
        run: echo Action done

`;