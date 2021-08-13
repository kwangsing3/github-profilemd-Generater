
const { spawn } = require('child_process');
const uti_time = require('../utils/time');
const execCmd = (cmd, args = []) => {
    return new Promise((resolve, reject) => {
        const app = spawn(cmd, args, { stdio: 'pipe' });
        let stdout = '';
        app.stdout.on('data', (data) => {
            stdout = data;
        });
        app.on('close', (code) => {
            if (code !== 0 && !stdout.includes('nothing to commit')) {
                err = new Error(
                    `${cmd} ${args} \n ${stdout} \n Invalid status code: ${code}`
                );
                err.code = code;
                return reject(err);
            }
            return resolve(code);
        });
        app.on('error', reject);
    }).catch((error)=>{
        console.log(`cmd Failed: `+ String(error));
    })
}

async function CommandANDPush(msg = ""){
    await execCmd('git', [
        'config',
        '--global',
        'user.email',
        'bot@example.com',
    ]);
    await execCmd('git', [ 
        'config',
        '--global',
        'user.name',
        'github-profilemd-Generater[bot]',
    ]);
    await execCmd('git', ['add','-A']);

    if (msg == ""){
        msg = 'github-profilemd-Generater[bot] Commited: '+ uti_time.GetCurrentTime();
    }
    await execCmd('git', ['commit', '-m', msg] );
    await execCmd('git', ['remote','rm','origin']);
    await execCmd('git', ['remote','add','origin',`https://github.com/${process.env.USERNAME }/${process.env.GITHUB_REPO_NAME}.git`]);



    await execCmd('git', ['push']);
};

module.exports.CommandANDPush = CommandANDPush;

const readline = require('readline');

const readLineAsync = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output : process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.prompt();
    rl.on('line', (line) => {
      rl.close();
      resolve(line);
    });
  });
};

module.exports.readLineAsync = readLineAsync;