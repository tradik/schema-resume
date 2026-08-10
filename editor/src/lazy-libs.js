/*
 * On-demand loader for the editor's vendored libraries.
 *
 * The editor used to pull Chart.js and Mermaid from jsDelivr in the document
 * head, so every visitor downloaded ~3.7 MB of charting code before the page
 * was usable — for two modals most of them never open. The libraries are now
 * served from our own origin (editor/vendor/, produced by
 * tools/build-vendor.mjs) and fetched the first time a feature needs them.
 *
 * Each loader is idempotent: concurrent callers share one in-flight promise,
 * and a completed load resolves immediately.
 */
(function (global) {
    'use strict';

    var pending = {};
    var manifestPromise = null;

    /**
     * Resolve an asset path through the build's fingerprint manifest.
     *
     * A production build runs with `--fingerprint`, which renames JS and CSS to
     * `name.<hash>.ext` and rewrites the references it can see. It cannot see
     * these ones: they are string literals inside this file, so the rewrite
     * misses them and every lazily-loaded library 404s — but only in a
     * fingerprinted build, which is exactly where nobody looks. The manifest
     * ssg writes alongside the rename is the mapping, so read it.
     *
     * Development builds have no manifest; the fetch fails and the original
     * path is used, which is correct there.
     *
     * @param {string} path Editor-relative path, e.g. "vendor/mermaid.min.js".
     * @returns {Promise<string>} the path to actually request.
     */
    function resolveAsset(path) {
        if (!manifestPromise) {
            manifestPromise = fetch('/assets-manifest.json')
                .then(function (response) {
                    return response.ok ? response.json() : {};
                })
                .catch(function () {
                    return {};
                });
        }
        return manifestPromise.then(function (manifest) {
            var hashed = manifest['editor/' + path];
            return hashed ? '/' + hashed : path;
        });
    }

    /**
     * Insert a classic <script> once and resolve when the global it defines
     * appears.
     *
     * @param {string} src        Editor-relative path.
     * @param {string} globalName Property the script is expected to define.
     * @returns {Promise<*>} the loaded global.
     */
    function loadScript(src, globalName) {
        if (global[globalName]) {
            return Promise.resolve(global[globalName]);
        }
        if (pending[src]) {
            return pending[src];
        }

        pending[src] = resolveAsset(src).then(function (url) {
            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = url;
                script.async = true;

                script.onload = function () {
                    if (global[globalName]) {
                        resolve(global[globalName]);
                    } else {
                        reject(new Error(url + ' loaded but did not define ' + globalName));
                    }
                };
                script.onerror = function () {
                    // Let a later attempt retry rather than caching the failure.
                    delete pending[src];
                    reject(new Error('Failed to load ' + url));
                };

                document.head.appendChild(script);
            });
        });

        return pending[src];
    }

    global.lazyLibs = {
        /** Chart.js — the tools experience chart. */
        chart: function () {
            return loadScript('vendor/chart.umd.min.js', 'Chart');
        },

        /** Mermaid — the career timeline Gantt chart. */
        mermaid: function () {
            return loadScript('vendor/mermaid.min.js', 'mermaid').then(function (mermaid) {
                if (!mermaid.__srInitialised) {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'default',
                        gantt: {
                            titleTopMargin: 25,
                            barHeight: 30,
                            barGap: 10,
                            topPadding: 50,
                            leftPadding: 150,
                            gridLineStartPadding: 35,
                            fontSize: 13,
                            numberSectionStyles: 4,
                            useMaxWidth: true,
                        },
                        themeVariables: { fontSize: '13px' },
                    });
                    mermaid.__srInitialised = true;
                }
                return mermaid;
            });
        },

        /** @tradik/xslt-processor — used when the browser has no XSLTProcessor. */
        xslt: function () {
            return loadScript('vendor/xslt-processor.min.js', 'XsltProcessorLib');
        },
    };
})(window);
