#!/usr/bin/env node
/**
 * Self-host every third-party runtime the site and the editor need.
 *
 * Before this, six libraries were fetched from three CDNs at page load — one of
 * them (`lucide@latest`) unpinned, and `ajv@6.12.6` four years stale. Each is
 * now pinned in package-lock.json and served from our own origin:
 *
 *   ajv 8 + ajv-formats  → templates/schema-resume/js/vendor/ajv.js  (bundled)
 *   chart.js             → editor/vendor/chart.umd.min.js            (copied)
 *   mermaid              → editor/vendor/mermaid.min.js              (copied)
 *   @tradik/xslt-processor → editor/vendor/xslt-processor.min.js     (copied)
 *
 * Everything written here is generated and gitignored. Run via
 * `npm run build:assets`.
 */

import { copyFile, mkdir, stat, writeFile, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const require = createRequire(import.meta.url);
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const SITE_VENDOR = join(repoRoot, 'templates', 'schema-resume', 'js', 'vendor');
const EDITOR_VENDOR = join(repoRoot, 'editor', 'vendor');

/**
 * Resolve a file inside an installed package.
 *
 * `require.resolve('<pkg>/package.json')` is the tidy way, but several packages
 * (chart.js among them) restrict `exports` and refuse that subpath, so fall
 * back to the install path. npm hoists dependencies to the root node_modules,
 * which is where both live.
 */
function fromPackage(pkg, ...segments) {
    try {
        return join(dirname(require.resolve(`${pkg}/package.json`)), ...segments);
    } catch {
        return join(repoRoot, 'node_modules', pkg, ...segments);
    }
}

async function packageVersion(pkg) {
    return JSON.parse(await readFile(fromPackage(pkg, 'package.json'), 'utf8')).version;
}

async function kb(path) {
    return ((await stat(path)).size / 1024).toFixed(0);
}

/**
 * Bundle Ajv for the browser.
 *
 * Ajv 8 ships no prebuilt browser bundle, which is why the pages were pinned to
 * the last version that did (6.12.6, 2020). Bundling it here gets the current
 * release plus ajv-formats, which Ajv 8 split out — the validator relied on
 * Ajv 6's built-in `format: 'full'`.
 */
async function buildAjv() {
    const outfile = join(SITE_VENDOR, 'ajv.js');
    await mkdir(SITE_VENDOR, { recursive: true });

    await esbuild.build({
        stdin: {
            contents: `
                import Ajv from 'ajv';
                import addFormats from 'ajv-formats';
                export { Ajv, addFormats };
            `,
            resolveDir: repoRoot,
            loader: 'js',
        },
        bundle: true,
        minify: true,
        format: 'iife',
        globalName: 'SchemaResumeAjv',
        target: ['es2019'],
        legalComments: 'none',
        outfile,
        banner: {
            js: `/* Ajv ${await packageVersion('ajv')} + ajv-formats ${await packageVersion('ajv-formats')} — MIT. Bundled by tools/build-vendor.mjs. */`,
        },
    });

    console.log(`✅ ajv: bundled Ajv 8 + ajv-formats (${await kb(outfile)} kB)`);
}

/**
 * Copy a prebuilt browser bundle out of an installed package.
 *
 * These three ship ready-made single-file browser builds, so bundling them
 * again would only risk changing them.
 */
async function copyVendor(pkg, source, targetName, targetDir = EDITOR_VENDOR) {
    await mkdir(targetDir, { recursive: true });
    const target = join(targetDir, targetName);
    await copyFile(fromPackage(pkg, source), target);
    console.log(`✅ ${pkg}: ${targetName} ${await packageVersion(pkg)} (${await kb(target)} kB)`);
    return target;
}

/**
 * Record what was vendored and from which version, so a reader of the editor's
 * markup can tell where /vendor/mermaid.min.js came from without running npm.
 */
async function writeManifest(entries) {
    await writeFile(
        join(EDITOR_VENDOR, 'VENDOR.json'),
        `${JSON.stringify({ generatedBy: 'tools/build-vendor.mjs', packages: entries }, null, 2)}\n`
    );
}

async function main() {
    await buildAjv();

    await copyVendor('chart.js', join('dist', 'chart.umd.min.js'), 'chart.umd.min.js');
    // The UMD build is one self-contained file. The ESM build is smaller to
    // start but resolves ~200 lazy chunks (16 MB on disk), which is a poor
    // trade for a site that draws exactly one Gantt chart. Both are loaded on
    // demand by editor/src/lazy-libs.js, not at page load.
    await copyVendor('mermaid', join('dist', 'mermaid.min.js'), 'mermaid.min.js');
    await copyVendor(
        '@tradik/xslt-processor',
        join('dist', 'xslt-processor.browser.min.js'),
        'xslt-processor.min.js'
    );

    await writeManifest({
        'chart.js': await packageVersion('chart.js'),
        mermaid: await packageVersion('mermaid'),
        '@tradik/xslt-processor': await packageVersion('@tradik/xslt-processor'),
        ajv: await packageVersion('ajv'),
        'ajv-formats': await packageVersion('ajv-formats'),
    });
}

main().catch((error) => {
    console.error(`❌ build-vendor: ${error.message}`);
    process.exitCode = 1;
});
