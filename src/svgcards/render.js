import ThemeMap from '../content/theme.js';
import utils_fs from '../utils/fswr.js';

/*
    Render one card across every theme selected in config and write each SVG to
    `<outputDir>/github-profilemd-generater/<theme>/<baseName>.svg`.

    renderFn receives the resolved theme object and returns an SVG string.
*/
export async function writeThemed(config, baseName, renderFn) {
    for (const key of config.themes) {
        const theme = ThemeMap.get(key);
        if (!theme) continue;
        const svg = renderFn(theme);
        await utils_fs.WriteFile(
            `${config.outputDir}/github-profilemd-generater/${key}/${baseName}.svg`,
            svg
        );
    }
}

export default { writeThemed };
