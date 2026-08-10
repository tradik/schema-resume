/*
 * Schema Resume converter: JSON resume → JSON-LD or XML, live, in the browser.
 *
 * Ajv 8 and ajv-formats come from /js/vendor/ajv.js, bundled by
 * tools/build-vendor.mjs. The page previously loaded Ajv 6.12.6 from a CDN and
 * probed three different global names hoping one of them existed.
 */
(function () {
    'use strict';

    var SCHEMA_URL = 'https://schema-resume.org/schema.json';
    var CONTEXT_URL = 'https://schema-resume.org/context.jsonld';
    var XML_NAMESPACE = 'https://schema-resume.org/xml/1.0';
    var XSD_URL = 'https://schema-resume.org/xml/1.0/schema-resume.xsd';

    var inputJson = document.getElementById('inputJson');
    var outputJson = document.getElementById('outputJson');
    var outputFormat = document.getElementById('outputFormat');
    var contextType = document.getElementById('contextType');
    var messagesDiv = document.getElementById('messages');
    var outputFormatLabel = document.getElementById('outputFormatLabel');

    var inputStatus = document.getElementById('inputStatus');
    var inputStatusText = document.getElementById('inputStatusText');
    var outputStatus = document.getElementById('outputStatus');
    var outputStatusText = document.getElementById('outputStatusText');
    var inputChars = document.getElementById('inputChars');
    var outputChars = document.getElementById('outputChars');
    var inputLines = document.getElementById('inputLines');
    var outputLines = document.getElementById('outputLines');

    var context = null;
    var validate = null;

    /* ── Schema ─────────────────────────────────────────────────────────── */

    async function loadSchema() {
        try {
            var responses = await Promise.all([fetch('/schema.json'), fetch('/context.jsonld')]);
            responses.forEach(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
            });

            var schema = await responses[0].json();
            context = await responses[1].json();

            var ajv = new window.SchemaResumeAjv.Ajv({
                allErrors: true,
                verbose: true,
                strict: false,
            });
            window.SchemaResumeAjv.addFormats(ajv);

            // JSON-LD keywords and the $schema pointer are not part of the JSON
            // Schema vocabulary; compiling with them makes Ajv resolve our
            // meta-schema over the network.
            var compilable = Object.assign({}, schema);
            delete compilable.$schema;
            delete compilable['@context'];
            delete compilable.$id;

            // Compiled once, not per keystroke: this used to recompile the whole
            // schema on every input event.
            validate = ajv.compile(compilable);
        } catch (error) {
            showMessage('error', 'Could not load the schema: ' + error.message);
        }
    }

    /* ── Conversion ─────────────────────────────────────────────────────── */

    function convertToJsonLd(data, useInlineContext) {
        var output = Object.assign({}, data);
        output['@context'] = useInlineContext && context ? context['@context'] : CONTEXT_URL;
        if (!output.$schema) {
            output.$schema = SCHEMA_URL;
        }
        return output;
    }

    function convertToXml(data, useInlineContext, indent) {
        indent = indent || 0;
        var pad = '  '.repeat(indent);
        var xml = '';

        if (indent === 0) {
            xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<resume xmlns="' + XML_NAMESPACE + '"\n';
            xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
            xml += useInlineContext
                ? '>\n'
                : '\n        xsi:schemaLocation="' + XML_NAMESPACE + '\n' +
                  '                            ' + XSD_URL + '">\n';
        }

        Object.keys(data).forEach(function (key) {
            if (key.charAt(0) === '@' || key.charAt(0) === '$') {
                return;
            }
            var value = data[key];
            if (value === null || value === undefined) {
                return;
            }

            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return;
                }
                if (typeof value[0] === 'object' && value[0] !== null) {
                    value.forEach(function (item) {
                        xml += pad + '  <' + key + '>\n';
                        xml += convertToXml(item, useInlineContext, indent + 2);
                        xml += pad + '  </' + key + '>\n';
                    });
                } else {
                    xml += pad + '  <' + key + '>\n';
                    value.forEach(function (item) {
                        xml += pad + '    <item>' + escapeXml(String(item)) + '</item>\n';
                    });
                    xml += pad + '  </' + key + '>\n';
                }
            } else if (typeof value === 'object') {
                xml += pad + '  <' + key + '>\n';
                xml += convertToXml(value, useInlineContext, indent + 2);
                xml += pad + '  </' + key + '>\n';
            } else {
                xml += pad + '  <' + key + '>' + escapeXml(String(value)) + '</' + key + '>\n';
            }
        });

        if (indent === 0) {
            xml += '</resume>';
        }
        return xml;
    }

    function escapeXml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /* ── Pipeline ───────────────────────────────────────────────────────── */

    function processInput() {
        var input = inputJson.value.trim();
        updateStats(input, 'input');

        if (!input) {
            clearOutput();
            setStatus('input', 'ready', 'Ready');
            messagesDiv.innerHTML = '';
            return;
        }

        var data;
        try {
            data = JSON.parse(input);
        } catch (error) {
            setStatus('input', 'error', 'Invalid JSON');
            showMessage('error', 'JSON parse error: ' + error.message);
            clearOutput();
            return;
        }

        setStatus('input', 'success', 'Valid JSON');

        if (validate) {
            // @context is JSON-LD, not part of the schema's own vocabulary.
            var forValidation = Object.assign({}, data);
            delete forValidation['@context'];

            if (validate(forValidation)) {
                showMessage('success', 'JSON is valid and matches the schema.');
            } else {
                var count = (validate.errors || []).length;
                showMessage('warning', 'JSON parses, but has ' + count +
                    (count === 1 ? ' schema validation error.' : ' schema validation errors.'));
                setStatus('input', 'warning', count + (count === 1 ? ' error' : ' errors'));
            }
        }

        var useInlineContext = contextType.value === 'inline';
        var output;
        if (outputFormat.value === 'jsonld') {
            output = JSON.stringify(convertToJsonLd(data, useInlineContext), null, 2);
            setStatus('output', 'success', 'JSON-LD generated');
        } else {
            output = convertToXml(data, useInlineContext);
            setStatus('output', 'success', 'XML generated');
        }

        outputJson.value = output;
        updateStats(output, 'output');
    }

    /* ── UI state ───────────────────────────────────────────────────────── */

    function updateStats(text, panel) {
        var chars = text.length;
        var lines = text ? text.split('\n').length : 0;
        if (panel === 'input') {
            inputChars.textContent = chars.toLocaleString() + ' chars';
            inputLines.textContent = lines + ' lines';
        } else {
            outputChars.textContent = chars.toLocaleString() + ' chars';
            outputLines.textContent = lines + ' lines';
        }
    }

    function setStatus(panel, state, text) {
        var dot = panel === 'input' ? inputStatus : outputStatus;
        var label = panel === 'input' ? inputStatusText : outputStatusText;
        dot.className = 'status-dot' + (state === 'ready' ? '' : ' ' + state);
        label.textContent = text;
    }

    function showMessage(type, text) {
        var div = document.createElement('div');
        div.className = 'message message--' + type;
        div.textContent = text;
        messagesDiv.innerHTML = '';
        messagesDiv.appendChild(div);
    }

    function clearOutput() {
        outputJson.value = '';
        updateStats('', 'output');
        setStatus('output', 'ready', 'Waiting for input');
    }

    function updateFormatLabel() {
        var isXml = outputFormat.value === 'xml';
        outputFormatLabel.textContent = isXml ? '(XML)' : '(JSON-LD)';
        document.getElementById('contextTypeLabel').textContent = isXml ? 'Schema location' : 'Context type';
        document.getElementById('inlineOption').textContent = isXml
            ? 'No schema location'
            : 'Inline context';
    }

    /* ── Actions ────────────────────────────────────────────────────────── */

    async function loadExample() {
        try {
            var response = await fetch('/example.json');
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            inputJson.value = JSON.stringify(await response.json(), null, 2);
            processInput();
        } catch (error) {
            showMessage('error', 'Could not load the example: ' + error.message);
        }
    }

    async function copyOutput() {
        if (!outputJson.value) {
            showMessage('warning', 'There is nothing to copy yet.');
            return;
        }
        try {
            await navigator.clipboard.writeText(outputJson.value);
            showMessage('success', 'Copied to the clipboard.');
        } catch (error) {
            // Clipboard access is denied outside a secure context or without
            // permission; selecting the text still lets the reader copy it.
            outputJson.select();
            showMessage('warning', 'Clipboard access was blocked — the output is selected, press ⌘/Ctrl+C.');
        }
    }

    inputJson.addEventListener('input', processInput);
    outputFormat.addEventListener('change', function () {
        updateFormatLabel();
        processInput();
    });
    contextType.addEventListener('change', processInput);
    document.getElementById('loadExample').addEventListener('click', loadExample);
    document.getElementById('clearBtn').addEventListener('click', function () {
        inputJson.value = '';
        processInput();
        inputJson.focus();
    });
    document.getElementById('copyOutput').addEventListener('click', copyOutput);

    loadSchema();
    updateFormatLabel();
    updateStats('', 'input');
    updateStats('', 'output');
})();
