/**
 * XSLT Processor Wrapper
 *
 * This module provides a unified interface for XSLT transformations.
 * It uses native XSLTProcessor when available, and falls back to
 * @tradik/xslt-processor library from CDN when native support is not available.
 *
 * Background: Chrome and other browsers are deprecating native XSLTProcessor
 * (Chrome 143+, full removal by Chrome 164 in August 2027).
 * This wrapper ensures the application continues to work regardless of browser support.
 */

class XsltProcessorWrapper {
    constructor() {
        this.nativeSupported = this.checkNativeSupport();
        this.libraryLoaded = false;
        this.processor = null;
        this.stylesheet = null;
        this.stylesheetString = null;

        console.log(`XSLT Wrapper initialized. Native support: ${this.nativeSupported}`);
    }

    /**
     * Check if native XSLTProcessor is actually functional
     * Chrome 145+ has XSLTProcessor defined but non-functional
     */
    checkNativeSupport() {
        if (typeof XSLTProcessor === 'undefined') {
            return false;
        }

        try {
            const testProcessor = new XSLTProcessor();
            const parser = new DOMParser();
            const testXslt = parser.parseFromString(
                `<?xml version="1.0"?>
        <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
          <xsl:template match="/"><test/></xsl:template>
        </xsl:stylesheet>`,
                'application/xml'
            );

            testProcessor.importStylesheet(testXslt);

            const testXml = parser.parseFromString('<root/>', 'application/xml');
            const result = testProcessor.transformToFragment(testXml, document);

            return result !== null && result.childNodes.length > 0;
        } catch (error) {
            console.warn('Native XSLTProcessor exists but is non-functional:', error.message);
            return false;
        }
    }

    /**
     * Load the @tradik/xslt-processor library via script tag from CDN
     * Library exposes XsltProcessorLib global with XSLTProcessor class
     */
    async loadLibrary() {
        if (this.libraryLoaded) {
            return true;
        }

        // Check if library is already loaded globally
        if (typeof XsltProcessorLib !== 'undefined' && XsltProcessorLib.XSLTProcessor) {
            this.libraryLoaded = true;
            console.log('XsltProcessorLib already available');
            return true;
        }

        return new Promise((resolve) => {
            console.log('Loading @tradik/xslt-processor library from CDN...');

            const script = document.createElement('script');
            // Use jsDelivr CDN for @tradik/xslt-processor
            // Version 1.x - library exposes XsltProcessorLib global
            script.src = 'https://cdn.jsdelivr.net/npm/@tradik/xslt-processor@1.0.3/dist/xslt-processor.browser.min.js';
            script.async = true;

            script.onload = () => {
                // Check if XsltProcessorLib is now available
                if (typeof XsltProcessorLib !== 'undefined' && XsltProcessorLib.XSLTProcessor) {
                    this.libraryLoaded = true;
                    console.log('XsltProcessorLib loaded successfully from CDN');
                    console.log('Available exports:', Object.keys(XsltProcessorLib).join(', '));
                    resolve(true);
                } else {
                    console.error('Script loaded but XsltProcessorLib not found');
                    console.error('window.XsltProcessorLib:', typeof XsltProcessorLib);
                    resolve(false);
                }
            };

            script.onerror = (error) => {
                console.error('Failed to load xslt-processor library from CDN:', error);
                resolve(false);
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Import a stylesheet from XSLT XML document
     * @param {Document|string} xsltDoc - The XSLT document (DOM or string)
     */
    async importStylesheet(xsltDoc) {
        let xsltDocument = xsltDoc;
        let xsltString = xsltDoc;

        if (typeof xsltDoc === 'string') {
            const parser = new DOMParser();
            xsltDocument = parser.parseFromString(xsltDoc, 'application/xml');
        } else {
            const serializer = new XMLSerializer();
            xsltString = serializer.serializeToString(xsltDoc);
        }

        // Store both forms for potential fallback
        this.stylesheet = xsltDocument;
        this.stylesheetString = xsltString;

        if (this.nativeSupported) {
            try {
                this.processor = new XSLTProcessor();
                this.processor.importStylesheet(xsltDocument);
                console.log('Stylesheet imported using native XSLTProcessor');
                return true;
            } catch (error) {
                console.warn('Native XSLTProcessor failed, falling back to JS library:', error.message);
                this.nativeSupported = false;
            }
        }

        // Load library if needed
        if (!this.libraryLoaded) {
            const loaded = await this.loadLibrary();
            if (!loaded) {
                throw new Error('Failed to load XSLT library');
            }
        }

        // Create processor from library - use XsltProcessorLib.XSLTProcessor directly
        const LibXSLTProcessor = XsltProcessorLib.XSLTProcessor;
        this.processor = new LibXSLTProcessor();
        this.processor.importStylesheet(xsltDocument);
        console.log('Stylesheet imported using @tradik/xslt-processor library');

        return true;
    }

    /**
     * Transform XML document using the imported stylesheet
     * @param {Document|string} xmlDoc - The XML document to transform
     * @param {Document} outputDoc - The document to use for creating output nodes
     * @returns {Promise<DocumentFragment>} The transformed result as a DocumentFragment
     */
    async transformToFragment(xmlDoc, outputDoc) {
        if (!this.processor) {
            throw new Error('No stylesheet imported. Call importStylesheet first.');
        }

        let xmlDocument = xmlDoc;

        if (typeof xmlDoc === 'string') {
            const parser = new DOMParser();
            xmlDocument = parser.parseFromString(xmlDoc, 'application/xml');
        }

        // Both native and library use same API
        const result = this.processor.transformToFragment(xmlDocument, outputDoc);

        if (result) {
            const source = this.nativeSupported
                ? 'native XSLTProcessor'
                : '@tradik/xslt-processor library';
            console.log(`Transform completed using ${source}`);
            console.log(`Result has ${result.childNodes.length} child nodes`);
        } else {
            console.error('Transform returned null result');
        }

        return result;
    }

    /**
     * Set a parameter for the XSLT transformation
     * @param {string|null} namespaceURI - Namespace URI (null for no namespace)
     * @param {string} localName - Parameter name
     * @param {*} value - Parameter value
     */
    setParameter(namespaceURI, localName, value) {
        if (this.processor) {
            this.processor.setParameter(namespaceURI, localName, value);
        }
    }

    /**
     * Get a parameter value
     * @param {string|null} namespaceURI - Namespace URI
     * @param {string} localName - Parameter name
     * @returns {*} Parameter value
     */
    getParameter(namespaceURI, localName) {
        if (this.processor) {
            return this.processor.getParameter(namespaceURI, localName);
        }
        return '';
    }

    /**
     * Clear all parameters
     */
    clearParameters() {
        if (this.processor) {
            this.processor.clearParameters();
        }
    }

    /**
     * Reset the processor
     */
    reset() {
        if (this.processor) {
            this.processor.reset();
        }
        this.processor = null;
        this.stylesheet = null;
        this.stylesheetString = null;
    }

    /**
     * Check if XSLT processing is available (native or library)
     */
    async isAvailable() {
        if (this.nativeSupported) {
            return true;
        }

        return await this.loadLibrary();
    }

    /**
     * Get a status message about XSLT support
     */
    getStatusMessage() {
        if (this.nativeSupported) {
            return 'Using native XSLTProcessor';
        } else if (this.libraryLoaded) {
            return 'Using @tradik/xslt-processor library (CDN)';
        } else {
            return 'XSLT processing not available';
        }
    }
}

window.XsltProcessorWrapper = XsltProcessorWrapper;
