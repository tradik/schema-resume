/*
 * Schema Resume validator.
 *
 * Everything runs in the browser: the CV never leaves the page. Ajv 8 and
 * ajv-formats are bundled into /js/vendor/ajv.js by tools/build-vendor.mjs,
 * and the icon geometry into /js/vendor/icons.js — this page used to pull both
 * from CDNs, on an Ajv release from 2020.
 */
(function () {
    'use strict';

    var SCHEMA_URL = '/schema.json';

    var ajv = null;
    var validate = null;

    var jsonInput = document.getElementById('jsonInput');
    var resultsDiv = document.getElementById('results');

    /* ── Schema ─────────────────────────────────────────────────────────── */

    /**
     * Ajv validates JSON Schema; the JSON-LD keywords in schema.json are not
     * part of that vocabulary and $schema points at our own meta-schema, which
     * Ajv would try to fetch. Strip all three before compiling.
     */
    function compilableSchema(schema) {
        var clean = Object.assign({}, schema);
        delete clean['@context'];
        delete clean.$schema;
        delete clean.$id;
        return clean;
    }

    async function loadSchema() {
        try {
            var response = await fetch(SCHEMA_URL);
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            var schema = await response.json();

            // Ajv 8 removed the built-in formats that Ajv 6 enabled with
            // `format: 'full'`; ajv-formats is that behaviour, unbundled.
            ajv = new window.SchemaResumeAjv.Ajv({
                allErrors: true,
                verbose: true,
                strict: false,
            });
            window.SchemaResumeAjv.addFormats(ajv);

            validate = ajv.compile(compilableSchema(schema));
        } catch (error) {
            showError('Could not load the validation schema (' + error.message + '). Reload the page to try again.');
        }
    }

    /* ── Validation ─────────────────────────────────────────────────────── */

    function validateJSON() {
        if (!validate) {
            showError('The schema is still loading. Try again in a moment.');
            return;
        }

        var input = jsonInput.value.trim();
        if (!input) {
            showError('Paste your JSON-LD CV first.');
            return;
        }

        var data;
        try {
            data = JSON.parse(input);
        } catch (error) {
            showParseError(error);
            return;
        }

        var valid = validate(data);
        var jsonLdIssues = validateJSONLD(data);

        if (valid && jsonLdIssues.length === 0) {
            showValidationSuccess(data);
        } else {
            showValidationErrors(validate.errors || [], jsonLdIssues);
        }
    }

    /** JSON-LD conventions the JSON Schema itself cannot express. */
    function validateJSONLD(data) {
        var issues = [];

        if (!data['@context']) {
            issues.push({
                type: 'warning',
                message: 'Missing @context field',
                suggestion: 'Add "@context": "https://schema-resume.org/context.jsonld" for JSON-LD compatibility.',
                path: '/@context',
            });
        }

        if (!data.$schema) {
            issues.push({
                type: 'warning',
                message: 'Missing $schema field',
                suggestion: 'Add "$schema": "https://schema-resume.org/schema.json" so editors and CI can validate the file.',
                path: '/$schema',
            });
        }

        findDateFields(data).forEach(function (field) {
            if (!isValidISO8601(field.value)) {
                issues.push({
                    type: 'error',
                    message: 'Invalid date format at ' + field.path,
                    suggestion: 'Use ISO 8601: YYYY-MM-DD, YYYY-MM or YYYY.',
                    path: field.path,
                });
            }
        });

        return issues;
    }

    var DATE_FIELDS = ['startDate', 'endDate', 'date', 'releaseDate', 'validTo', 'lastModified'];

    function findDateFields(value, path) {
        var found = [];
        if (value === null || typeof value !== 'object') {
            return found;
        }
        Object.keys(value).forEach(function (key) {
            var currentPath = path ? path + '/' + key : key;
            var child = value[key];
            if (DATE_FIELDS.indexOf(key) !== -1 && typeof child === 'string') {
                found.push({ path: currentPath, value: child });
            } else if (child !== null && typeof child === 'object') {
                found = found.concat(findDateFields(child, currentPath));
            }
        });
        return found;
    }

    function isValidISO8601(value) {
        return /^([1-2]\d{3}-[0-1]\d-[0-3]\d|[1-2]\d{3}-[0-1]\d|[1-2]\d{3})$/.test(value);
    }

    /* ── Rendering ──────────────────────────────────────────────────────── */

    function icon(name, size, className) {
        return window.srIcon(name, size, className);
    }

    function render(html) {
        resultsDiv.innerHTML = html;
    }

    function showParseError(error) {
        render(
            '<div class="result result--error">' +
                icon('circle-x', 24) +
                '<div>' +
                    '<h3>JSON parse error</h3>' +
                    '<p>' + escapeHtml(error.message) + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="hint">' +
                '<h3>Common causes</h3>' +
                '<ul class="disc-list">' +
                    '<li>Missing or extra commas</li>' +
                    '<li>Unclosed brackets or braces</li>' +
                    '<li>Unquoted keys or values</li>' +
                    '<li>Trailing commas, which JSON does not allow</li>' +
                '</ul>' +
            '</div>'
        );
    }

    function showValidationSuccess(data) {
        var stats = getDataStats(data).map(function (stat) {
            return '<div class="stat">' +
                '<div class="stat-value">' + stat.value + '</div>' +
                '<div class="stat-label">' + stat.label + '</div>' +
            '</div>';
        }).join('');

        render(
            '<div class="result result--success">' +
                icon('circle-check', 24) +
                '<div>' +
                    '<h3>Validation passed</h3>' +
                    '<p>Your JSON-LD CV conforms to the Schema Resume specification.</p>' +
                '</div>' +
            '</div>' +
            (stats
                ? '<div class="stat-panel">' +
                      '<h3>' + icon('chart-column', 20) + 'CV statistics</h3>' +
                      '<div class="stat-grid">' + stats + '</div>' +
                  '</div>'
                : '') +
            '<div class="hint">' +
                '<h3>' + icon('lightbulb', 18) + 'Next steps</h3>' +
                '<ul class="check-list">' +
                    '<li>' + icon('check', 16) + '<span>Test your CV in the <a href="https://json-ld.org/playground/">JSON-LD Playground</a></span></li>' +
                    '<li>' + icon('check', 16) + '<span>Validate with the <a href="https://validator.schema.org/">Schema.org validator</a></span></li>' +
                    '<li>' + icon('check', 16) + '<span>Embed it in your website so search engines can read it</span></li>' +
                '</ul>' +
            '</div>'
        );
    }

    var STAT_SECTIONS = [
        { key: 'work', label: 'Work experiences' },
        { key: 'education', label: 'Education' },
        { key: 'skills', label: 'Skills' },
        { key: 'projects', label: 'Projects' },
        { key: 'languages', label: 'Languages' },
        { key: 'certificates', label: 'Certificates' },
    ];

    function getDataStats(data) {
        return STAT_SECTIONS.filter(function (section) {
            return Array.isArray(data[section.key]);
        }).map(function (section) {
            return { label: section.label, value: data[section.key].length };
        });
    }

    function showValidationErrors(schemaErrors, jsonLdIssues) {
        var all = schemaErrors.map(function (error) {
            return {
                type: 'error',
                message: error.message,
                // Ajv 8 renamed dataPath to instancePath.
                path: error.instancePath || '/',
                params: error.params,
                keyword: error.keyword,
            };
        }).concat(jsonLdIssues);

        var errorCount = all.filter(function (e) { return e.type === 'error'; }).length;
        var warningCount = all.length - errorCount;

        var summary = errorCount + (errorCount === 1 ? ' error' : ' errors');
        if (warningCount > 0) {
            summary += ' and ' + warningCount + (warningCount === 1 ? ' warning' : ' warnings');
        }

        render(
            '<div class="result result--error">' +
                icon('circle-alert', 24) +
                '<div>' +
                    '<h3>Validation failed</h3>' +
                    '<p>Found ' + summary + '.</p>' +
                '</div>' +
            '</div>' +
            all.map(renderIssue).join('') +
            '<div class="hint">' +
                '<h3>' + icon('circle-help', 18) + 'Need help?</h3>' +
                '<ul class="disc-list">' +
                    '<li>Read the <a href="/json-ld.html">JSON-LD documentation</a></li>' +
                    '<li>Review the <a href="/schema.json">schema definition</a></li>' +
                    '<li>Load the example CV to see the expected shape</li>' +
                '</ul>' +
            '</div>'
        );
    }

    function renderIssue(issue) {
        var isError = issue.type === 'error';
        return '<div class="result result--' + (isError ? 'error' : 'warning') + '">' +
            icon(isError ? 'circle-x' : 'triangle-alert', 20) +
            '<div>' +
                '<div class="result-tags">' +
                    '<span class="result-tag">' + escapeHtml(issue.path) + '</span>' +
                    (issue.keyword ? '<span class="result-tag">' + escapeHtml(issue.keyword) + '</span>' : '') +
                '</div>' +
                '<p>' + escapeHtml(issue.message) + '</p>' +
                (issue.suggestion
                    ? '<p class="result-suggestion">' + escapeHtml(issue.suggestion) + '</p>'
                    : '') +
                (issue.params
                    ? '<details><summary>Show details</summary><pre>' +
                          escapeHtml(JSON.stringify(issue.params, null, 2)) +
                      '</pre></details>'
                    : '') +
            '</div>' +
        '</div>';
    }

    function showError(message) {
        render(
            '<div class="result result--error">' +
                icon('circle-x', 24) +
                '<div><h3>Error</h3><p>' + escapeHtml(message) + '</p></div>' +
            '</div>'
        );
    }

    function showToast(message) {
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.innerHTML = icon('check', 20) + '<span>' + escapeHtml(message) + '</span>';
        document.body.appendChild(toast);
        window.setTimeout(function () { toast.remove(); }, 3000);
    }

    function showEmptyState() {
        render(
            '<div class="results-empty">' +
                icon('arrow-left', 48) +
                '<p>Paste your JSON-LD and select “Validate”</p>' +
                '<p>The validator checks your CV against the Schema Resume specification.</p>' +
            '</div>'
        );
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    /* ── Actions ────────────────────────────────────────────────────────── */

    function formatJSON() {
        try {
            jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value), null, 2);
            showToast('JSON formatted');
        } catch (error) {
            showError('Invalid JSON: ' + error.message);
        }
    }

    /**
     * The example is one of the repository's own example files rather than a
     * copy embedded here that could drift from the specification.
     *
     * The minimal one is the default: example.json is a 31 kB reference
     * document that exercises every section, which is the wrong first thing to
     * drop in front of someone meeting the format.
     */
    async function loadExample() {
        try {
            var response = await fetch('/example-minimal.json');
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            jsonInput.value = JSON.stringify(await response.json(), null, 2);
            showToast('Example CV loaded');
        } catch (error) {
            showError('Could not load the example (' + error.message + ').');
        }
    }

    function clearInput() {
        jsonInput.value = '';
        showEmptyState();
        jsonInput.focus();
    }

    document.getElementById('validateBtn').addEventListener('click', validateJSON);
    document.getElementById('formatBtn').addEventListener('click', formatJSON);
    document.getElementById('loadExample').addEventListener('click', loadExample);
    document.getElementById('clearInput').addEventListener('click', clearInput);

    loadSchema();
})();
