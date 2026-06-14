//- File system read / write helpers -//
import { promises as fs } from 'fs';
import path from 'path';
import Logger from './logger.js';

/* Write a file, creating parent directories as needed. */
export async function WriteFile(targetPath, content, log = false) {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, content);
    if (log) Logger.info(`Generated ${targetPath}`);
}

export async function ReadFile(targetPath) {
    return fs.readFile(targetPath, 'utf8');
}

export default { WriteFile, ReadFile };
