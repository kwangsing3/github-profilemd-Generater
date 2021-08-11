
const { spawn } = require('child_process');
const uti_time = require('./time');
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
        console.error(error.message);
    })
}

async function CommandANDPush(){
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
    await execCmd('git', ['commit', '-m', ' github-profilemd-Generater[bot] Commited: '+ uti_time.GetCurrentTime()] );
    
    await execCmd('git', ['remote','remove','origin']);
    await execCmd('git', ['remote','set-url','origin',`https://github.com/${process.env.USERNAME}/${process.env.GITHUB_REPO_NAME}.git`]);
    await execCmd('git', ['push']);
};
module.exports.CommandANDPush = CommandANDPush;