/*
    Logger wrapper.

    Reasons for a wrapper:
    1. console.log is unreliable in the GitHub Action log.
    2. "@actions/core" log helpers do nothing useful when run locally.

    Environment is detected via the canonical `GITHUB_ACTIONS` variable that the
    runner always sets to "true", so callers no longer have to thread a custom
    flag around. Logging never terminates the process; the entrypoint decides
    when to fail (so cleanup / multiple errors can be reported first).
*/
import * as core from '@actions/core';

const inAction = () => process.env.GITHUB_ACTIONS === 'true';

export function info(msg = '') {
    inAction() ? core.info(String(msg)) : console.log(msg);
}

export function warning(msg = '') {
    inAction() ? core.warning(String(msg)) : console.warn(msg);
}

export function error(msg = '') {
    inAction() ? core.error(String(msg)) : console.error(msg);
}

/* Mark the whole action as failed (red check). Does not exit by itself. */
export function setFailed(msg = '') {
    if (inAction()) core.setFailed(String(msg));
    else console.error(msg);
}

export default { info, warning, error, setFailed };
