/*
    ncc emits an ESM bundle that still references Node built-ins through bare
    `require("os")` shims, but never defines `require` in ESM scope. It does
    import `createRequire`, so we materialise a real `require` from it.

    Without this the action crashes at startup with
    "ReferenceError: require is not defined in ES module scope".
*/
import { readFile, writeFile } from 'fs/promises';

const file = new URL('../dist/index.js', import.meta.url);
const src = await readFile(file, 'utf8');

const marker = 'from "module";';
const shim =
    '\nconst require = __WEBPACK_EXTERNAL_createRequire(import.meta.url);' +
    "\nconst __filename = require('url').fileURLToPath(import.meta.url);" +
    "\nconst __dirname = require('path').dirname(__filename);\n";

if (src.includes('const require = __WEBPACK_EXTERNAL_createRequire')) {
    console.log('postbuild: require shim already present.');
} else if (src.includes(marker)) {
    const patched = src.replace(marker, marker + shim);
    await writeFile(file, patched);
    console.log('postbuild: injected createRequire shim into dist/index.js');
} else {
    console.error('postbuild: could not find createRequire import; bundle layout changed.');
    process.exit(1);
}
