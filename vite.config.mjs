import { resolve } from 'node:path';
import { cssFiles, updateCssVersions } from './scripts/update-css-version.mjs';

export default {
    // relative asset URLs so the build also works under https://<user>.github.io/<repo>/
    base: './',
    plugins: [{
        name: 'update-css-versions',
        buildStart() {
            updateCssVersions();
        },
        configureServer(server) {
            server.watcher.add(cssFiles);
            server.watcher.on('change', path => {
                if (cssFiles.includes(resolve(path))) {
                    updateCssVersions();
                }
            });
        }
    }]
};
