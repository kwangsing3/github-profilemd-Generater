import { spawn } from 'child_process';
import uti_time from './time.js';
import Logger from './logger.js';

/* Run a command, accumulating stdout/stderr. Never rejects; returns the code. */
function exec(cmd, args = []) {
    return new Promise((resolve) => {
        const app = spawn(cmd, args, { stdio: 'pipe' });
        let stdout = '';
        let stderr = '';
        app.stdout.on('data', (d) => (stdout += d.toString()));
        app.stderr.on('data', (d) => (stderr += d.toString()));
        app.on('error', (err) => resolve({ code: 1, stdout, stderr: String(err) }));
        app.on('close', (code) => resolve({ code, stdout, stderr }));
    });
}

async function run(cmd, args) {
    const res = await exec(cmd, args);
    if (res.code !== 0) {
        throw new Error(
            `\`${cmd} ${args.join(' ')}\` exited ${res.code}\n${res.stdout}\n${res.stderr}`
        );
    }
    return res;
}

/*
    Stage the output directory and commit + push only when something changed.
    Returns true if a commit was pushed, false if there was nothing to do.
*/
export async function CommandANDPush(outputDir = 'output') {
    await run('git', ['config', '--global', 'user.email', 'bot@example.com']);
    await run('git', [
        'config',
        '--global',
        'user.name',
        'github-profilemd-Generater[bot]',
    ]);

    await run('git', ['add', '-A', outputDir]);

    // Nothing staged -> skip the commit entirely (no noise commits).
    const staged = await exec('git', ['diff', '--cached', '--quiet']);
    if (staged.code === 0) {
        Logger.info('No card changes detected, skipping commit.');
        return false;
    }

    await run('git', [
        'commit',
        '-m',
        `github-profilemd-Generater[bot] update cards: ${uti_time.GetCurrentTime()}`,
    ]);

    // Push without --force; if the branch moved, rebase once and retry.
    const push = await exec('git', ['push']);
    if (push.code !== 0) {
        Logger.warning('Push rejected, rebasing onto remote and retrying...');
        await run('git', ['pull', '--rebase']);
        await run('git', ['push']);
    }
    Logger.info('Git push done.');
    return true;
}

export default { CommandANDPush };
