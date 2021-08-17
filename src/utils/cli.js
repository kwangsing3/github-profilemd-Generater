
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
        throw error;
    })
}

async function CommandANDPush(isAction = false){
    if (!isAction){
        /*console.warn("(Ignore git commit)");
        return;*/
    }else{
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
    }
    
    await execCmd('git', ['add','-A']);
    await execCmd('git', ['commit', '-m', ' github-profilemd-Generater[bot] Commited: '+ uti_time.GetCurrentTime()] );
    await execCmd('git', ['push']);
};
module.exports.CommandANDPush = CommandANDPush;