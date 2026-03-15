console.log('🚀 app.js loading...');

class ResumeEditor {
    constructor() {
        console.log('🏗️ ResumeEditor constructor called');
        this.storageKey = 'resumeEditorData';
        this.resumeData = this.loadFromLocalStorage() || this.getFallbackResumeData();
        this.currentSection = 'basics';
        this.zoom = 1.0;
        this.xsltProcessor = null; // Will be XsltProcessorWrapper instance
        this.xsltInitialized = false;
        this.xsltRetryCount = 0;
        this.maxXsltRetries = 50; // Max 5 seconds of retries (50 * 100ms)
        this.schema = null;
        this.formGenerator = null;
        this.currentTemplate = localStorage.getItem('selectedTemplate') || 'resume-professional.xslt';
        this.outputFilename = null; // Will be set from 'for' URL parameter
        this.forParameter = null; // Company/organization name from 'for' URL parameter
        this.originalTitle = 'Resume Editor - JSON Resume Schema'; // Store original title

        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        // Check for lang parameter first, before initializing i18n
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam) {
            // Store the language preference before i18n initialization
            localStorage.setItem('selectedLanguage', langParam);
            console.log('✓ Language set from URL parameter:', langParam);
        }

        // Check for Dev mode
        const typeParam = urlParams.get('type');
        this.isDevMode = (typeParam === 'dev');

        if (this.isDevMode) {
            console.log('✓ Dev mode enabled');
        }

        // Hide Debug button by default (show only in dev mode)
        if (!this.isDevMode) {
            const debugBtn = document.getElementById('debugModeBtn');
            if (debugBtn) {
                debugBtn.style.display = 'none';
            }
        }

        // Initialize i18n (will use the language from localStorage if set above)
        await this.initI18n();

        await this.loadSchema();

        // Priority order: URL params > localStorage > default data
        const urlData = await this.loadFromUrlParams();
        if (urlData) {
            console.log('✓ Loaded resume data from URL parameters');
            this.resumeData = urlData;
            // Optionally save to localStorage for persistence
            this.saveToLocalStorage();
        } else if (!this.loadFromLocalStorage()) {
            console.log('No local storage data found, fetching default resume...');
            this.resumeData = await this.getDefaultResumeData();
        }

        // Update page title after data is loaded
        this.updatePageTitle();

        this.loadXSLT();
        this.setupEventListeners();
        this.renderEditor();
        this.renderPreview();
    }

    /**
     * Initialize i18n system
     */
    async initI18n() {
        try {
            console.log('Initializing i18n system...');
            console.log('I18nManager available:', typeof I18nManager);
            this.i18n = new I18nManager();
            await this.i18n.init();
            console.log('✓ i18n system initialized successfully');
            console.log('Current language:', this.i18n.currentLanguage);
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
            console.error('Error stack:', error.stack);
            // Continue without i18n
            this.i18n = null;
        }
    }

    /**
     * Load JSON Resume Schema
     */
    async loadSchema() {
        try {
            // Try loading from external URL first
            console.log('Loading schema from external URL...');
            const response = await fetch('https://schema-resume.org/schema.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.schema = await response.json();
            this.formGenerator = new FormGenerator(this.schema, this.i18n);
            console.log('✓ Schema loaded successfully from external URL');
        } catch (error) {
            console.warn('Failed to load external schema:', error);
            console.log('Attempting to load local schema.json...');

            try {
                // Fallback to local schema.json
                const localResponse = await fetch('schema.json');
                if (!localResponse.ok) throw new Error(`HTTP ${localResponse.status}`);
                this.schema = await localResponse.json();
                this.formGenerator = new FormGenerator(this.schema, this.i18n);
                console.log('✓ Schema loaded successfully from local file');
            } catch (localError) {
                console.error('Failed to load local schema:', localError);
                alert('Failed to load schema.json from both external and local sources. The editor may not work properly.');
                // Set a minimal fallback schema to prevent complete failure
                this.schema = { properties: {} };
                this.formGenerator = new FormGenerator(this.schema, this.i18n);
            }
        }
    }

    /**
     * Get default resume data structure
     * First tries to fetch from schema-resume.org, falls back to local John Doe data
     */
    async getDefaultResumeData() {
        try {
            console.log('Attempting to fetch example resume from schema-resume.org...');
            const response = await fetch('https://schema-resume.org/example.json');

            if (response.ok) {
                const data = await response.json();
                console.log('Successfully loaded example resume from schema-resume.org');
                return data;
            } else {
                console.warn('Failed to fetch from schema-resume.org, using fallback data');
                return this.getFallbackResumeData();
            }
        } catch (error) {
            console.warn('Error fetching from schema-resume.org:', error.message);
            console.log('Using fallback John Doe data');
            return this.getFallbackResumeData();
        }
    }

    /**
     * Sanitize text for filename - remove spaces, special chars, UTF-8
     */
    sanitizeFilename(text) {
        if (!text) return null;

        // Convert to lowercase
        let sanitized = text.toLowerCase();

        // Remove UTF-8 characters by converting to ASCII
        // This handles characters like ł, ą, ö, etc.
        sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Replace common UTF-8 characters manually
        const utf8Map = {
            'ł': 'l', 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
            'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 'ss', 'é': 'e', 'è': 'e', 'ê': 'e', 'à': 'a', 'â': 'a',
            'î': 'i', 'ï': 'i', 'ô': 'o', 'û': 'u', 'ù': 'u', 'ç': 'c', 'ñ': 'n'
        };

        for (const [utf8Char, asciiChar] of Object.entries(utf8Map)) {
            sanitized = sanitized.replace(new RegExp(utf8Char, 'g'), asciiChar);
        }

        // Remove any remaining non-alphanumeric characters (except hyphens and underscores)
        sanitized = sanitized.replace(/[^a-z0-9_-]/g, '_');

        // Replace multiple underscores/hyphens with single underscore
        sanitized = sanitized.replace(/[_-]+/g, '_');

        // Remove leading/trailing underscores
        sanitized = sanitized.replace(/^_+|_+$/g, '');

        // Limit length
        return sanitized.substring(0, 50);
    }

    /**
     * Load resume data from URL parameters
     * Supports multiple modes:
     * 1. ?data=<base64-encoded-json> - Direct JSON data (base64 encoded)
     * 2. ?url=<remote-json-url> - Fetch JSON from remote URL
     * 3. ?dataUrl=<remote-json-url> - Alternative parameter name for remote URL
     * 4. ?for=<company-name> - Sets output filename for PDF download and updates page title
     * 5. ?lang=<language-code> - Sets the UI language (e.g., en-GB, pl-PL)
     */
    async loadFromUrlParams() {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            // Check for 'for' parameter (company name for output filename and page title)
            const forParam = urlParams.get('for');
            if (forParam) {
                this.forParameter = forParam;
                this.outputFilename = this.sanitizeFilename(forParam);
                console.log('✓ Output filename set from "for" parameter:', this.outputFilename);
                console.log('✓ Page title will include company name:', forParam);
            }

            // Check for localStorage key (preferred for large data)
            const storageKey = urlParams.get('key');
            if (storageKey) {
                console.log('Loading resume data from localStorage with key:', storageKey);
                try {
                    const jsonString = localStorage.getItem(storageKey);
                    if (!jsonString) {
                        throw new Error('Data not found in localStorage');
                    }
                    const data = JSON.parse(jsonString);
                    console.log('✓ Successfully loaded data from localStorage');
                    console.log('JSON size:', jsonString.length, 'bytes');

                    // Clean up old basecv entries (keep only last 5)
                    const allKeys = Object.keys(localStorage);
                    const basecvKeys = allKeys.filter(k => k.startsWith('basecv_')).sort();
                    if (basecvKeys.length > 5) {
                        basecvKeys.slice(0, basecvKeys.length - 5).forEach(k => localStorage.removeItem(k));
                    }

                    return data;
                } catch (error) {
                    console.error('Failed to load data from localStorage:', error);
                    alert(`Failed to load Base CV data: ${error.message}`);
                    return null;
                }
            }

            // Check for direct base64 encoded data (fallback for small data)
            const base64Data = urlParams.get('data');
            if (base64Data) {
                console.log('Loading resume data from URL parameter (base64)...');
                console.log('Base64 data length:', base64Data.length);

                // Check if URL might be too long
                if (window.location.href.length > 8000) {
                    console.warn('⚠ URL length is very long:', window.location.href.length, 'characters');
                    console.warn('Consider using ?key= parameter instead for large JSON files');
                }

                try {
                    // Decode base64 with UTF-8 support
                    const jsonString = decodeURIComponent(escape(atob(base64Data)));
                    const data = JSON.parse(jsonString);
                    console.log('✓ Successfully decoded and parsed base64 JSON data');
                    console.log('JSON size:', jsonString.length, 'bytes');
                    return data;
                } catch (error) {
                    console.error('Failed to decode/parse base64 data:', error);
                    const errorMsg = `Invalid data parameter: Unable to decode JSON data from URL.\n\n` +
                        `Error: ${error.message}\n\n` +
                        `Tip: For large JSON files, use the ?key= parameter with localStorage.`;
                    alert(errorMsg);
                    return null;
                }
            }

            // Check for remote URL (support both 'url' and 'dataUrl' parameters)
            const remoteUrl = urlParams.get('url') || urlParams.get('dataUrl');
            if (remoteUrl) {
                console.log('Loading resume data from remote URL:', remoteUrl);
                try {
                    const response = await fetch(remoteUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    const data = await response.json();
                    console.log('✓ Successfully fetched and parsed JSON from remote URL');
                    return data;
                } catch (error) {
                    console.error('Failed to fetch data from remote URL:', error);
                    alert(`Failed to load resume from URL: ${error.message}`);
                    return null;
                }
            }

            // No URL parameters found
            return null;
        } catch (error) {
            console.error('Error processing URL parameters:', error);
            return null;
        }
    }

    /**
     * Update page title based on URL parameters and resume data
     * Format: 
     * - With 'for' parameter: "{for} - {name} | {original title}"
     * - With 'data' parameter only: "{name} | {original title}"
     * - Default: "{original title}"
     */
    updatePageTitle() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const hasDataParam = urlParams.has('data') || urlParams.has('url') || urlParams.has('dataUrl');

            // Get the person's name from resume data
            const name = this.resumeData?.basics?.name || '';

            // Get the base title from i18n or use original
            const baseTitle = this.i18n ? this.i18n.t('app.title') : 'Resume Editor';
            const fullBaseTitle = `${baseTitle} - JSON Resume Schema`;

            let newTitle = fullBaseTitle;

            if (this.forParameter && name) {
                // Format: "{for} - {name} | {original title}"
                newTitle = `${this.forParameter} - ${name} | ${fullBaseTitle}`;
                console.log('✓ Page title updated with for parameter and name:', newTitle);
            } else if (hasDataParam && name) {
                // Format: "{name} | {original title}"
                newTitle = `${name} | ${fullBaseTitle}`;
                console.log('✓ Page title updated with name:', newTitle);
            }

            document.title = newTitle;
        } catch (error) {
            console.error('Error updating page title:', error);
        }
    }

    /**
     * Fallback resume data (John Doe)
     */
    getFallbackResumeData() {
        return {
            basics: {
                name: 'John Doe',
                label: 'Full Stack Developer',
                image: '',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                url: 'https://johndoe.com',
                summary: 'Experienced software developer with a passion for creating elegant solutions to complex problems.',
                keyAchievements: [],
                coreCompetencies: [],
                location: {
                    address: '',
                    postalCode: '',
                    city: '',
                    countryCode: 'US',
                    region: ''
                },
                profiles: [],
                nationalities: [],
                workAuthorization: []
            },
            work: [],
            volunteer: [],
            education: [],
            awards: [],
            certificates: [],
            publications: [],
            skills: [],
            tools: [],
            languages: [],
            interests: [],
            references: [],
            projects: [],
            meta: {
                canonical: '',
                version: '1.0.0',
                lastModified: new Date().toISOString()
            }
        };
    }

    /**
     * Load XSLT template
     */
    async loadXSLT(templateName) {
        try {
            // Initialize XSLT wrapper if not already done
            if (!this.xsltProcessor) {
                if (typeof XsltProcessorWrapper === 'undefined') {
                    console.error('❌ XsltProcessorWrapper not loaded. Please check if xslt-wrapper.js is included.');
                    this.showXsltNotSupportedError();
                    return;
                }
                this.xsltProcessor = new XsltProcessorWrapper();
            }

            // Check if XSLT processing is available
            const isAvailable = await this.xsltProcessor.isAvailable();
            if (!isAvailable) {
                console.error('❌ XSLT processing is not available (neither native nor polyfill)');
                this.showXsltNotSupportedError();
                return;
            }

            const template = templateName || this.currentTemplate;
            // Add cache-busting parameter
            const cacheBuster = new Date().getTime();
            const response = await fetch(`templates/${template}?v=${cacheBuster}`);
            const xsltText = await response.text();
            const parser = new DOMParser();
            const xsltDoc = parser.parseFromString(xsltText, 'application/xml');

            // Check for parsing errors
            const parseError = xsltDoc.querySelector('parsererror');
            if (parseError) {
                console.error('XSLT parsing error:', parseError.textContent);
                throw new Error('Failed to parse XSLT template');
            }

            await this.xsltProcessor.importStylesheet(xsltDoc);
            this.xsltInitialized = true;
            this.xsltRetryCount = 0; // Reset retry count on successful load
            console.log(`✓ Loaded template: ${template} (v${cacheBuster})`);
            console.log(`📊 ${this.xsltProcessor.getStatusMessage()}`);
        } catch (error) {
            console.error('Error loading XSLT:', error);
            this.showXsltNotSupportedError();
        }
    }

    /**
     * Show error message when XSLTProcessor is not supported
     */
    showXsltNotSupportedError() {
        const previewContainer = document.getElementById('resumePreview');
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #dc3545;">
                    <h2 style="margin-bottom: 20px;">⚠️ XSLT Processing Error</h2>
                    <p style="margin-bottom: 15px; color: #666;">Unable to initialize XSLT processor for resume preview.</p>
                    <p style="margin-bottom: 15px; color: #666;">This may happen if:</p>
                    <ul style="text-align: left; display: inline-block; color: #666;">
                        <li>The JavaScript XSLT library failed to load</li>
                        <li>There's a network issue preventing library download</li>
                        <li>Your browser is blocking external scripts</li>
                    </ul>
                    <p style="margin-top: 20px;">
                        <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer; border: 1px solid #007bff; background: #007bff; color: white; border-radius: 4px;">Refresh Page</button>
                    </p>
                    <p style="margin-top: 15px; color: #999; font-size: 0.9em;">Note: Chrome is deprecating native XSLT support. We use a JavaScript fallback.</p>
                </div>
            `;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        try {
            // Tab navigation
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchSection(e.target.dataset.section);
                });
            });

            // Header actions - with null checks
            const importBtn = document.getElementById('importBtn');
            if (importBtn) importBtn.addEventListener('click', () => this.importJSON());

            const editJsonBtn = document.getElementById('editJsonBtn');
            if (editJsonBtn) editJsonBtn.addEventListener('click', () => this.openJsonEditor());

            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) exportBtn.addEventListener('click', () => this.exportJSON());

            const printBtn = document.getElementById('printBtn');
            if (printBtn) printBtn.addEventListener('click', () => this.printResume());

            // JSON Editor modal handlers - with null checks
            const closeJsonEditor = document.getElementById('closeJsonEditor');
            if (closeJsonEditor) closeJsonEditor.addEventListener('click', () => this.closeJsonEditor());

            const formatJsonBtn = document.getElementById('formatJsonBtn');
            if (formatJsonBtn) formatJsonBtn.addEventListener('click', () => this.formatJson());

            const applyJsonBtn = document.getElementById('applyJsonBtn');
            if (applyJsonBtn) applyJsonBtn.addEventListener('click', () => this.applyJsonChanges());

            // Close modal on background click
            const jsonEditorModal = document.getElementById('jsonEditorModal');
            if (jsonEditorModal) {
                jsonEditorModal.addEventListener('click', (e) => {
                    if (e.target.id === 'jsonEditorModal') {
                        this.closeJsonEditor();
                    }
                });
            }

            // Close modal on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const jsonModal = document.getElementById('jsonEditorModal');
                    const timelineModal = document.getElementById('timelineModal');
                    const toolsChartModal = document.getElementById('toolsChartModal');

                    if (jsonModal && jsonModal.style.display !== 'none') {
                        this.closeJsonEditor();
                    } else if (timelineModal && timelineModal.style.display === 'flex') {
                        this.closeTimelineModal();
                    } else if (toolsChartModal && toolsChartModal.style.display === 'flex') {
                        this.closeToolsChartModal();
                    }
                }
            });

            // Zoom controls - with null checks
            const zoomIn = document.getElementById('zoomIn');
            if (zoomIn) zoomIn.addEventListener('click', () => this.adjustZoom(0.1));

            const zoomOut = document.getElementById('zoomOut');
            if (zoomOut) zoomOut.addEventListener('click', () => this.adjustZoom(-0.1));

            const resetZoom = document.getElementById('resetZoom');
            if (resetZoom) resetZoom.addEventListener('click', () => this.resetContent());

            // Panel toggle - with null checks
            const togglePanel = document.getElementById('togglePanel');
            if (togglePanel) togglePanel.addEventListener('click', () => this.togglePanel());

            const showPanelBtn = document.getElementById('showPanelBtn');
            if (showPanelBtn) showPanelBtn.addEventListener('click', () => this.togglePanel());

            // File inputs - with null checks
            const fileInput = document.getElementById('fileInput');
            if (fileInput) fileInput.addEventListener('change', (e) => this.handleFileImport(e));

            // Template selector - with null checks
            const templateSelector = document.getElementById('templateSelector');
            if (templateSelector) {
                templateSelector.addEventListener('change', (e) => this.changeTemplate(e.target.value));
                // Set initial template value
                templateSelector.value = this.currentTemplate;
            }

            // Debug mode button (if it exists)
            const debugBtn = document.getElementById('debugModeBtn');
            if (debugBtn) {
                debugBtn.addEventListener('click', () => this.toggleDebugMode());
            }

            // Timeline button
            const timelineBtn = document.getElementById('timelineBtn');
            if (timelineBtn) {
                timelineBtn.addEventListener('click', () => this.showTimeline());
            }

            // Tools Chart button
            const toolsChartBtn = document.getElementById('toolsChartBtn');
            if (toolsChartBtn) {
                toolsChartBtn.addEventListener('click', () => this.showToolsChart());
            }

            // Timeline modal controls
            const closeTimelineModal = document.getElementById('closeTimelineModal');
            if (closeTimelineModal) {
                closeTimelineModal.addEventListener('click', () => this.closeTimelineModal());
            }

            const copyTimelineBtn = document.getElementById('copyTimelineBtn');
            if (copyTimelineBtn) {
                copyTimelineBtn.addEventListener('click', () => this.copyTimelineCode());
            }

            // Close timeline modal on background click
            const timelineModal = document.getElementById('timelineModal');
            if (timelineModal) {
                timelineModal.addEventListener('click', (e) => {
                    if (e.target.id === 'timelineModal') {
                        this.closeTimelineModal();
                    }
                });
            }

            // Tools Chart modal controls
            const closeToolsChartModal = document.getElementById('closeToolsChartModal');
            if (closeToolsChartModal) {
                closeToolsChartModal.addEventListener('click', () => this.closeToolsChartModal());
            }

            const downloadToolsChartBtn = document.getElementById('downloadToolsChartBtn');
            if (downloadToolsChartBtn) {
                downloadToolsChartBtn.addEventListener('click', () => this.downloadToolsChart());
            }

            // Close tools chart modal on background click
            const toolsChartModal = document.getElementById('toolsChartModal');
            if (toolsChartModal) {
                toolsChartModal.addEventListener('click', (e) => {
                    if (e.target.id === 'toolsChartModal') {
                        this.closeToolsChartModal();
                    }
                });
            }

            // Language selector
            const languageSelector = document.getElementById('languageSelector');
            console.log('Language selector found:', !!languageSelector, 'i18n initialized:', !!this.i18n);

            if (languageSelector && this.i18n) {
                // Set current language
                languageSelector.value = this.i18n.currentLanguage;
                console.log('Set language selector to:', this.i18n.currentLanguage);

                languageSelector.addEventListener('change', async (e) => {
                    console.log('Language changed to:', e.target.value);
                    await this.i18n.switchLanguage(e.target.value);
                    // Re-render editor to update field labels
                    this.renderEditor();
                });
            } else {
                console.warn('Language selector not set up - selector:', !!languageSelector, 'i18n:', !!this.i18n);
            }

            // Listen for language change events from i18n
            window.addEventListener('languageChanged', () => {
                // Re-render editor to update field labels
                this.renderEditor();
                // Update page title with new language
                this.updatePageTitle();
            });

            // Resize handle
            this.setupResizeHandle();

            console.log('✓ Event listeners setup complete');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
            alert('Some features may not work properly. Please refresh the page.');
        }
    }

    /**
     * Setup resize handle for side panel
     */
    setupResizeHandle() {
        const resizeHandle = document.getElementById('resizeHandle');
        const sidePanel = document.getElementById('sidePanel');

        // Check if elements exist before setting up resize
        if (!resizeHandle || !sidePanel) {
            console.warn('Resize handle or side panel not found, skipping resize setup');
            return;
        }

        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidePanel.offsetWidth;
            resizeHandle.classList.add('resizing');
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const delta = e.clientX - startX;
            const newWidth = startWidth + delta;
            const minWidth = 300;
            const maxWidth = 800;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                sidePanel.style.width = `${newWidth}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizeHandle.classList.remove('resizing');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    /**
     * Change template
     */
    async changeTemplate(templateName) {
        this.currentTemplate = templateName;
        localStorage.setItem('selectedTemplate', templateName);
        await this.loadXSLT(templateName);
        this.renderPreview();
    }

    /**
     * Switch between sections
     */
    switchSection(section) {
        this.currentSection = section;

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

        this.renderEditor();
    }

    /**
     * Render the editor for current section
     */
    renderEditor() {
        if (!this.formGenerator) {
            console.warn('Form generator not initialized yet');
            return;
        }

        const container = document.getElementById('editorContainer');
        if (!container) {
            console.error('Editor container not found');
            return;
        }

        const section = this.currentSection;
        const data = this.resumeData[section];

        let html = '';

        if (section === 'basics') {
            html = this.formGenerator.generateBasicsForm(data);
        } else {
            html = this.formGenerator.generateArrayEditor(section, data);
        }

        container.innerHTML = html;
        this.attachEditorListeners();
    }

    /**
     * Get item title for display (delegated to form generator)
     */
    getItemTitle(section, item, index) {
        if (this.formGenerator) {
            return this.formGenerator.getItemTitle(section, item, index);
        }
        return `Item #${index + 1}`;
    }

    /**
     * Get section label (delegated to form generator)
     */
    getSectionLabel(section) {
        if (this.formGenerator) {
            return this.formGenerator.getSectionLabel(section);
        }
        return section;
    }

    /**
     * Load resume data from localStorage
     */
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                console.log('Loaded resume data from localStorage');
                return data;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        return null;
    }

    /**
     * Save resume data to localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.resumeData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Clear localStorage data
     */
    clearLocalStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Cleared resume data from localStorage');
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    /**
     * Attach event listeners to editor elements
     */
    attachEditorListeners() {
        // Input changes
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });

        // Checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleInputChange(e));
        });

        // Add buttons
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.addArrayItem(section);
            });
        });

        // Remove buttons
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeArrayItem(section, index);
            });
        });
    }

    /**
     * Handle input changes
     */
    handleInputChange(e) {
        const field = e.target.dataset.field;
        const type = e.target.dataset.type;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        // Handle array types
        if (type === 'array') {
            value = value.split('\n').filter(v => v.trim());
        } else if (type === 'array-comma') {
            value = value.split(',').map(v => v.trim()).filter(v => v);
        }

        this.setNestedValue(this.resumeData, field, value);
        this.saveToLocalStorage();
        this.renderPreview();

        // Update page title if the name field changed
        if (field === 'basics.name') {
            this.updatePageTitle();
        }
    }

    /**
     * Add array item
     */
    addArrayItem(section) {
        if (!Array.isArray(this.resumeData[section])) {
            this.resumeData[section] = [];
        }

        // Use schema-based empty item template from FormGenerator
        const emptyItem = this.formGenerator ?
            this.formGenerator.getEmptyItem(section) :
            {};

        this.resumeData[section].push(emptyItem);
        this.saveToLocalStorage();
        this.renderEditor();
        this.renderPreview();
    }

    /**
     * Remove array item
     */
    removeArrayItem(section, index) {
        if (Array.isArray(this.resumeData[section])) {
            this.resumeData[section].splice(index, 1);
            this.saveToLocalStorage();
            this.renderEditor();
            this.renderPreview();
        }
    }

    /**
     * Get empty item template for basics array fields
     */
    getEmptyItemForBasicsArray(fieldName) {
        if (!this.schema || !this.schema.properties || !this.schema.properties.basics) {
            return {};
        }

        const basicsSchema = this.schema.properties.basics;
        const fieldSchema = basicsSchema.properties?.[fieldName];

        if (!fieldSchema || !fieldSchema.items || !fieldSchema.items.properties) {
            return {};
        }

        const item = {};
        for (const [propName, propSchema] of Object.entries(fieldSchema.items.properties)) {
            if (propSchema.type === 'array') {
                item[propName] = [];
            } else if (propSchema.type === 'object') {
                item[propName] = {};
            } else if (propSchema.type === 'boolean') {
                item[propName] = false;
            } else if (propSchema.type === 'number' || propSchema.type === 'integer') {
                item[propName] = 0;
            } else {
                item[propName] = '';
            }
        }

        return item;
    }

    /**
     * Set nested value in object
     */
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = isNaN(keys[i + 1]) ? {} : [];
            }
            current = current[key];
        }

        current[keys[keys.length - 1]] = value;
    }

    /**
     * Render preview using XSLT
     */
    async renderPreview() {
        // Check if XSLT processor is initialized
        if (!this.xsltProcessor || !this.xsltInitialized) {
            this.xsltRetryCount++;

            // Limit retries to prevent infinite loop
            if (this.xsltRetryCount > this.maxXsltRetries) {
                console.error('❌ XSLT processor failed to initialize after maximum retries');
                const previewContainer = document.getElementById('resumePreview');
                if (previewContainer) {
                    previewContainer.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: #dc3545;">
                            <h2 style="margin-bottom: 20px;">⚠️ Preview Error</h2>
                            <p style="color: #666;">Failed to initialize XSLT processor. Please refresh the page.</p>
                            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer; border: 1px solid #007bff; background: #007bff; color: white; border-radius: 4px;">Refresh Page</button>
                        </div>
                    `;
                }
                return;
            }

            console.log(`XSLT processor not ready, retrying... (${this.xsltRetryCount}/${this.maxXsltRetries})`);
            setTimeout(() => this.renderPreview(), 100);
            return;
        }

        try {
            console.log('Rendering preview with data:', this.resumeData);

            // Debug: Log key data sections
            const dataSections = Object.keys(this.resumeData).filter(k => k !== 'meta' && k !== '$schema');
            console.log('📊 Data sections present:', dataSections);
            if (this.resumeData.work) {
                console.log('📊 Work items:', this.resumeData.work.length);
            }
            if (this.resumeData.education) {
                console.log('📊 Education items:', this.resumeData.education.length);
            }
            if (this.resumeData.skills) {
                console.log('📊 Skills items:', this.resumeData.skills.length);
            }

            // Convert resume data to XML
            console.log('🔄 Converting JSON to XML...');
            const xmlString = this.jsonToXML(this.resumeData);
            console.log('✅ Generated XML length:', xmlString.length);
            console.log('✅ Generated XML (first 100000 chars):', xmlString.substring(0, 100000));

            // Check for invalid characters in XML before parsing
            const invalidCharsRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/;
            if (invalidCharsRegex.test(xmlString)) {
                console.error('❌ XML contains invalid characters!');
                const matches = xmlString.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g);
                console.error('Invalid chars found:', matches.map(c => `char ${c.charCodeAt(0)}`));
            }

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

            // Check for XML parsing errors
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                console.error('❌ XML Parsing Error:', parseError.textContent);
                console.error('📄 Full XML output:', xmlString);
                throw new Error('XML parsing error: ' + parseError.textContent);
            }

            console.log('✅ XML parsed successfully');

            // Transform with XSLT (async for polyfill support)
            const resultDoc = await this.xsltProcessor.transformToFragment(xmlDoc, document);
            console.log('🔍 XSLT transformation result:', resultDoc);
            console.log('🔍 Result childNodes:', resultDoc.childNodes.length);
            console.log('🔍 Result first child:', resultDoc.firstChild);

            const previewContainer = document.getElementById('resumePreview');
            if (!previewContainer) {
                throw new Error('Preview container not found');
            }

            previewContainer.innerHTML = '';

            // Serialize the fragment to HTML string for more reliable parsing
            // This handles cases where the fragment structure differs between browsers
            const serializer = new XMLSerializer();
            let htmlString = '';
            resultDoc.childNodes.forEach(node => {
                htmlString += serializer.serializeToString(node);
            });
            console.log('🔍 Serialized HTML length:', htmlString.length);
            console.log('🔍 Serialized HTML (first 3000 chars):', htmlString.substring(0, 3000));

            // Parse the HTML to extract body and style content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString;

            // Try to find body element (direct child or nested)
            let bodyElement = tempDiv.querySelector('body');
            const styleElement = tempDiv.querySelector('style');

            console.log('🔍 Found body element:', !!bodyElement);
            console.log('🔍 Found style element:', !!styleElement);

            // Add style element if present (for inline CSS from XSLT)
            if (styleElement) {
                const styleClone = styleElement.cloneNode(true);
                previewContainer.appendChild(styleClone);
                console.log('✅ Added style element');
            }

            // Add body content
            if (bodyElement) {
                // Move all children from body to preview container
                while (bodyElement.firstChild) {
                    previewContainer.appendChild(bodyElement.firstChild);
                }
                console.log('✅ Extracted body content from XSLT result');
            } else {
                // Check if we have resume-container directly (some browsers may not preserve html/body)
                const resumeContainer = tempDiv.querySelector('.resume-container');
                if (resumeContainer) {
                    // Add style first if we have it
                    previewContainer.appendChild(resumeContainer);
                    console.log('✅ Found and added .resume-container directly');
                } else {
                    // Last fallback: use the entire parsed content
                    while (tempDiv.firstChild) {
                        previewContainer.appendChild(tempDiv.firstChild);
                    }
                    console.log('⚠️ No body or .resume-container found, using entire content');
                }
            }

            console.log('🔍 Preview container innerHTML length:', previewContainer.innerHTML.length);
            console.log('🔍 Preview HTML (first 10000 chars):', previewContainer.innerHTML.substring(0, 10000));

            // Debug: Check for specific sections in the output
            const sectionTitles = previewContainer.querySelectorAll('.section-title');
            console.log('🔍 Found section titles:', sectionTitles.length, Array.from(sectionTitles).map(s => s.textContent));
            const workItems = previewContainer.querySelectorAll('.work-item');
            console.log('🔍 Found work items:', workItems.length);

            // Check for any divs at all
            const allDivs = previewContainer.querySelectorAll('div');
            console.log('🔍 Total divs found:', allDivs.length);

            // Add click-to-edit functionality
            this.addPreviewClickHandlers();

            // Refresh timeline if modal is open
            this.refreshTimelineIfOpen();
        } catch (error) {
            console.error('Error rendering preview:', error);
            const previewContainer = document.getElementById('resumePreview');
            if (previewContainer) {
                previewContainer.innerHTML = '<div class="loading">Error rendering preview: ' + error.message + '</div>';
            }
        }
    }

    /**
     * Toggle debug mode - shows field names on preview elements
     */
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        const btn = document.getElementById('debugModeBtn');

        if (this.debugMode) {
            btn.classList.add('active');
            btn.style.backgroundColor = 'var(--color-danger)';
            btn.style.color = 'white';
            this.showDebugOverlays();
        } else {
            btn.classList.remove('active');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            this.hideDebugOverlays();
        }
    }

    /**
     * Show debug overlays on all clickable elements
     */
    showDebugOverlays() {
        const previewContainer = document.getElementById('resumePreview');
        if (!previewContainer) return;

        // Remove existing overlays
        document.querySelectorAll('.debug-overlay').forEach(el => el.remove());

        // Strategy 1: Find elements with data-field attribute (from XSLT)
        const elementsWithDataField = previewContainer.querySelectorAll('[data-field]');

        elementsWithDataField.forEach(element => {
            const fieldPath = element.getAttribute('data-field');
            if (!fieldPath) return;
            this.createDebugOverlay(element, fieldPath, previewContainer);
        });

        // Strategy 2: Auto-detect fields by matching content to schema (fallback for templates without data-field)
        if (elementsWithDataField.length === 0) {
            this.autoDetectFields(previewContainer);
        }
    }

    /**
     * Auto-detect fields by analyzing content and matching to schema
     */
    autoDetectFields(previewContainer) {
        const editableSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'a', 'strong', 'em', 'div'
        ];

        editableSelectors.forEach(selector => {
            previewContainer.querySelectorAll(selector).forEach(element => {
                if (!element.textContent.trim() || element.children.length > 3) return;
                if (element.dataset.debugged) return; // Skip if already processed

                const text = this.getMostSpecificText(element);
                if (!text) return;

                // Find the field path for this element
                let fieldPath = null;
                if (this.contentToFieldMap) {
                    fieldPath = this.contentToFieldMap[text];
                }
                if (!fieldPath) {
                    fieldPath = this.guessFieldPathFromElement(element, text);
                }
                if (!fieldPath) {
                    fieldPath = this.findFieldPathByValue(this.resumeData, text);
                }

                if (fieldPath) {
                    this.createDebugOverlay(element, fieldPath, previewContainer);
                }
            });
        });
    }

    /**
     * Create a debug overlay for an element
     */
    createDebugOverlay(element, fieldPath, previewContainer) {
        const overlay = document.createElement('div');
        overlay.className = 'debug-overlay';
        overlay.setAttribute('data-field-name', fieldPath);

        // Position it relative to the element
        const rect = element.getBoundingClientRect();
        const containerRect = previewContainer.getBoundingClientRect();

        overlay.style.position = 'absolute';
        overlay.style.left = (rect.left - containerRect.left + previewContainer.scrollLeft) + 'px';
        overlay.style.top = (rect.top - containerRect.top + previewContainer.scrollTop) + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.pointerEvents = 'none';

        // Mark element as debugged
        element.dataset.debugged = 'true';

        previewContainer.appendChild(overlay);
    }

    /**
     * Hide debug overlays
     */
    hideDebugOverlays() {
        document.querySelectorAll('.debug-overlay').forEach(el => el.remove());
        document.querySelectorAll('[data-debugged]').forEach(el => {
            delete el.dataset.debugged;
        });
    }

    /**
     * Add click handlers to preview elements for click-to-edit functionality
     */
    addPreviewClickHandlers() {
        const previewContainer = document.getElementById('resumePreview');
        if (!previewContainer) return;

        // Create a mapping of content to field paths for better accuracy (fallback)
        this.contentToFieldMap = this.buildContentToFieldMap();

        // Strategy 1: Add click handlers to elements with data-field attribute (from XSLT)
        const elementsWithDataField = previewContainer.querySelectorAll('[data-field]');

        if (elementsWithDataField.length > 0) {
            // Template has data-field attributes - use them
            elementsWithDataField.forEach(element => {
                this.addClickHandler(element, element.getAttribute('data-field'));
            });
        } else {
            // Strategy 2: Fallback to auto-detection for templates without data-field
            this.addAutoDetectedClickHandlers(previewContainer);
        }
    }

    /**
     * Add click handler to an element
     */
    addClickHandler(element, fieldPath) {
        // Skip if already has handler
        if (element.dataset.clickHandlerAdded) return;

        element.style.cursor = 'pointer';
        element.title = fieldPath ? 'Click to edit: ' + fieldPath : 'Click to edit';
        element.dataset.clickHandlerAdded = 'true';

        element.addEventListener('click', (e) => {
            e.stopPropagation();
            if (fieldPath) {
                this.focusFieldDirect(fieldPath);
            } else {
                this.handlePreviewClick(element);
            }
        });

        // Add hover effect
        element.addEventListener('mouseenter', () => {
            element.style.outline = '2px dashed var(--color-primary)';
            element.style.outlineOffset = '2px';
            element.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.outline = 'none';
            element.style.backgroundColor = '';
        });
    }

    /**
     * Add auto-detected click handlers for templates without data-field
     */
    addAutoDetectedClickHandlers(previewContainer) {
        const editableSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'a', 'strong', 'em', 'div'
        ];

        editableSelectors.forEach(selector => {
            previewContainer.querySelectorAll(selector).forEach(element => {
                if (!element.textContent.trim() || element.children.length > 3) return;
                this.addClickHandler(element, null);
            });
        });
    }

    /**
     * Focus field directly by path (used when data-field attribute is present)
     */
    focusFieldDirect(fieldPath) {
        const pathParts = fieldPath.split('.');
        if (pathParts.length >= 3 && !isNaN(pathParts[1])) {
            // This is a specific field in an array item (e.g., work.0.position)
            this.focusField(fieldPath);
        } else if (pathParts.length >= 2 && !isNaN(pathParts[1])) {
            // This is an array item reference
            this.focusArrayItem(pathParts[0], parseInt(pathParts[1]));
        } else {
            this.focusField(fieldPath);
        }
    }

    /**
     * Handle click on preview element - focus corresponding form field
     */
    handlePreviewClick(element) {
        const text = element.textContent.trim();
        if (!text) return;

        // Get the most specific (smallest) text content
        const specificText = this.getMostSpecificText(element);

        // Try multiple strategies to find the field
        let fieldPath = null;

        // Strategy 1: Check content map for exact match with specific text
        if (this.contentToFieldMap) {
            // Try exact match first with the specific text
            fieldPath = this.contentToFieldMap[specificText];

            // If no match, try with full text
            if (!fieldPath) {
                fieldPath = this.contentToFieldMap[text];
            }
        }

        // Strategy 2: Use element class or context to guess field
        if (!fieldPath) {
            fieldPath = this.guessFieldPathFromElement(element, specificText);
        }

        // Strategy 3: Search by value with specific text first
        if (!fieldPath) {
            fieldPath = this.findFieldPathByValue(this.resumeData, specificText);
        }

        // Strategy 4: Try with full text as fallback
        if (!fieldPath) {
            fieldPath = this.findFieldPathByValue(this.resumeData, text);
        }

        // If we found a field path that's part of an array, check if we should focus specific field or whole item
        if (fieldPath) {
            const pathParts = fieldPath.split('.');
            if (pathParts.length >= 3 && !isNaN(pathParts[1])) {
                // This is a specific field in an array item (e.g., work.0.position)
                // Focus the specific field, not the whole item
                this.focusField(fieldPath);
            } else if (pathParts.length >= 2 && !isNaN(pathParts[1])) {
                // This is an array item reference
                this.focusArrayItem(pathParts[0], parseInt(pathParts[1]));
            } else {
                this.focusField(fieldPath);
            }
        } else {
            console.log('Could not find field for:', specificText, '(or)', text);
        }
    }

    /**
     * Get the most specific text from element (prefer direct text over nested)
     */
    getMostSpecificText(element) {
        // If element has only text nodes (no child elements), use its text
        const childElements = Array.from(element.children);
        if (childElements.length === 0) {
            return element.textContent.trim();
        }

        // If element has children, try to get direct text nodes only
        let directText = '';
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                directText += node.textContent;
            }
        }

        directText = directText.trim();
        return directText || element.textContent.trim();
    }

    /**
     * Detect if element is within an array item by analyzing structure
     */
    detectArrayItemFromElement(element) {
        // Look for common array item container patterns in the preview
        let current = element;
        const maxDepth = 10;
        let depth = 0;

        while (current && current !== document.getElementById('resumePreview') && depth < maxDepth) {
            const classList = Array.from(current.classList || []);

            // Check for common array item container classes
            for (const className of classList) {
                // Work experience
                if (className.includes('work-item') || className.includes('experience-item') || className.includes('job')) {
                    return this.findArrayItemIndex(current, 'work');
                }
                // Education
                if (className.includes('education-item') || className.includes('degree')) {
                    return this.findArrayItemIndex(current, 'education');
                }
                // Projects
                if (className.includes('project-item') || className.includes('project')) {
                    return this.findArrayItemIndex(current, 'projects');
                }
                // Skills
                if (className.includes('skill-item')) {
                    return this.findArrayItemIndex(current, 'skills');
                }
                // Volunteer
                if (className.includes('volunteer-item')) {
                    return this.findArrayItemIndex(current, 'volunteer');
                }
                // Awards
                if (className.includes('award-item')) {
                    return this.findArrayItemIndex(current, 'awards');
                }
                // Certificates
                if (className.includes('certificate-item')) {
                    return this.findArrayItemIndex(current, 'certificates');
                }
            }

            current = current.parentElement;
            depth++;
        }

        return null;
    }

    /**
     * Find array item index by reading data-index attribute
     */
    findArrayItemIndex(element, section) {
        // First try to get index from data-index attribute
        if (element.dataset && element.dataset.index !== undefined) {
            return { section, index: parseInt(element.dataset.index) };
        }

        // Fallback: find by counting siblings with same class
        const parent = element.parentElement;
        if (!parent) return { section, index: 0 };

        const siblings = Array.from(parent.children).filter(child =>
            child.classList.contains('array-item-collapsible') ||
            child.classList.contains(element.className)
        );
        const index = siblings.indexOf(element);

        return { section, index: Math.max(0, index) };
    }

    /**
     * Focus on an array item container
     */
    focusArrayItem(section, index) {
        // Switch to the appropriate tab
        this.switchToSection(section);

        // Focus the array item container after a short delay
        setTimeout(() => {
            // Try both old and new selectors for compatibility
            const arrayItem = document.querySelector(`.array-item-collapsible[data-index="${index}"]`) ||
                document.querySelector(`.array-item[data-index="${index}"]`);

            if (arrayItem) {
                // Expand the collapsible item if it's collapsed
                if (arrayItem.tagName === 'DETAILS' && !arrayItem.open) {
                    arrayItem.open = true;
                }

                // Scroll the array item into view
                arrayItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Highlight the entire array item
                arrayItem.style.outline = '3px solid var(--color-primary)';
                arrayItem.style.outlineOffset = '4px';
                arrayItem.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
                arrayItem.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    arrayItem.style.outline = '';
                    arrayItem.style.outlineOffset = '';
                    arrayItem.style.backgroundColor = '';
                }, 2000);

                // Focus the first input in the array item
                const firstInput = arrayItem.querySelector('input, textarea, select');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }, 150);
    }

    /**
     * Focus a field by its path
     */
    focusField(fieldPath) {
        // Switch to the appropriate tab
        const section = fieldPath.split('.')[0];
        this.switchToSection(section);

        // Focus the field after a short delay to allow tab switch
        setTimeout(() => {
            const field = document.querySelector(`[data-field="${fieldPath}"]`);
            if (field) {
                // If it's in a collapsed section, expand it first
                const collapsibleParent = field.closest('details');
                if (collapsibleParent && !collapsibleParent.open) {
                    collapsibleParent.open = true;
                }

                field.focus();
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Highlight the field briefly
                field.style.boxShadow = '0 0 0 4px rgba(0, 102, 204, 0.3)';
                field.style.transition = 'box-shadow 0.3s ease';
                setTimeout(() => {
                    field.style.boxShadow = '';
                }, 1500);

                // Select text if it's an input
                if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                    field.select();
                }
            }
        }, 150);
    }

    /**
     * Build a map of content to field paths for faster lookup
     */
    buildContentToFieldMap() {
        const map = {};

        const traverse = (obj, currentPath = '') => {
            for (const [key, val] of Object.entries(obj)) {
                const newPath = currentPath ? `${currentPath}.${key}` : key;

                if (typeof val === 'string' && val.trim()) {
                    map[val.trim()] = newPath;
                } else if (Array.isArray(val)) {
                    val.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            traverse(item, `${newPath}.${index}`);
                        }
                    });
                } else if (typeof val === 'object' && val !== null) {
                    traverse(val, newPath);
                }
            }
        };

        traverse(this.resumeData);
        return map;
    }

    /**
     * Guess field path from element context and classes
     */
    guessFieldPathFromElement(element, text) {
        const classList = Array.from(element.classList);
        text = text || element.textContent.trim();

        // Common field mappings based on class names
        const classToFieldMap = {
            'name': 'basics.name',
            'label': 'basics.label',
            'summary': 'basics.summary',
            'email': 'basics.email',
            'phone': 'basics.phone',
            'url': 'basics.url',
            'position': 'work.0.position',
            'company': 'work.0.name',
            'institution': 'education.0.institution',
            'area': 'education.0.area'
        };

        for (const className of classList) {
            if (classToFieldMap[className]) {
                return classToFieldMap[className];
            }
        }

        // Check parent elements for context
        let parent = element.parentElement;
        while (parent && parent !== document.getElementById('resumePreview')) {
            const parentClasses = Array.from(parent.classList);
            for (const className of parentClasses) {
                if (className.includes('work')) return this.findFieldInSection('work', text);
                if (className.includes('education')) return this.findFieldInSection('education', text);
                if (className.includes('skill')) return this.findFieldInSection('skills', text);
                if (className.includes('project')) return this.findFieldInSection('projects', text);
            }
            parent = parent.parentElement;
        }

        return null;
    }

    /**
     * Find field in a specific section
     */
    findFieldInSection(section, value) {
        const sectionData = this.resumeData[section];
        if (!sectionData) return null;

        if (Array.isArray(sectionData)) {
            for (let i = 0; i < sectionData.length; i++) {
                const result = this.findFieldPathByValue(sectionData[i], value, `${section}.${i}`);
                if (result) return result;
            }
        } else if (typeof sectionData === 'object') {
            return this.findFieldPathByValue(sectionData, value, section);
        }

        return null;
    }

    /**
     * Find field path by searching for matching value in resume data
     */
    findFieldPathByValue(obj, value, currentPath = '') {
        for (const [key, val] of Object.entries(obj)) {
            const newPath = currentPath ? `${currentPath}.${key}` : key;

            if (typeof val === 'string' && val.trim() === value) {
                return newPath;
            } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                const result = this.findFieldPathByValue(val, value, newPath);
                if (result) return result;
            }
        }
        return null;
    }

    /**
     * Switch to a specific section tab
     */
    switchToSection(sectionName) {
        const tabBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }

    /**
     * Convert JSON to XML for XSLT processing (dynamic based on schema)
     */
    jsonToXML(data) {
        if (!this.schema) {
            console.warn('Schema not loaded, using basic XML conversion');
            return this.jsonToXML_legacy(data);
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Schema_Resume_v1.1.0>\n';

        // Iterate through all properties defined in schema
        for (const [key, value] of Object.entries(data)) {
            if (key === 'meta' || key === '$schema') continue; // Skip meta fields
            xml += this.convertToXML(key, value, 1);
        }

        xml += '</Schema_Resume_v1.1.0>';
        return xml;
    }

    /**
     * Sanitize key name for XML element
     */
    sanitizeXMLKey(key) {
        const original = String(key);

        // Remove or replace invalid XML characters
        let sanitized = original
            .replace(/[^a-zA-Z0-9_\-\.]/g, '_') // Replace invalid chars with underscore
            .replace(/^[^a-zA-Z_]/g, '_'); // Ensure it starts with letter or underscore

        // Ensure it's not empty
        sanitized = sanitized || 'field';

        // Log if sanitization changed the key
        if (sanitized !== original) {
            console.log(`Sanitized XML key: "${original}" -> "${sanitized}"`);
        }

        return sanitized;
    }

    /**
     * Recursively convert JSON to XML based on data type
     */
    convertToXML(key, value, depth) {
        const indent = '  '.repeat(depth);
        const sanitizedKey = this.sanitizeXMLKey(key);
        let xml = '';

        if (value === null || value === undefined) {
            return `${indent}<${sanitizedKey}></${sanitizedKey}>\n`;
        }

        if (Array.isArray(value)) {
            // Array of items
            xml += `${indent}<${sanitizedKey}>\n`;
            value.forEach(item => {
                xml += `${indent}  <item>\n`;
                if (typeof item === 'object') {
                    for (const [k, v] of Object.entries(item)) {
                        xml += this.convertToXML(k, v, depth + 2);
                    }
                } else {
                    xml += `${indent}    ${this.escapeXML(String(item))}\n`;
                }
                xml += `${indent}  </item>\n`;
            });
            xml += `${indent}</${sanitizedKey}>\n`;
        } else if (typeof value === 'object') {
            // Nested object
            xml += `${indent}<${sanitizedKey}>\n`;
            for (const [k, v] of Object.entries(value)) {
                xml += this.convertToXML(k, v, depth + 1);
            }
            xml += `${indent}</${sanitizedKey}>\n`;
        } else if (typeof value === 'boolean') {
            xml += `${indent}<${sanitizedKey}>${value ? 'true' : 'false'}</${sanitizedKey}>\n`;
        } else {
            // Primitive value (string, number)
            xml += `${indent}<${sanitizedKey}>${this.escapeXML(String(value))}</${sanitizedKey}>\n`;
        }

        return xml;
    }

    /**
     * Legacy JSON to XML conversion (fallback)
     */
    jsonToXML_legacy(data) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Schema_Resume_v1.1.0>\n';

        // Basics
        if (data.basics) {
            xml += '  <basics>\n';
            xml += `    <title>${this.escapeXML(data.basics.title || '')}</title>\n`;
            xml += `    <name>${this.escapeXML(data.basics.name || '')}</name>\n`;
            xml += `    <label>${this.escapeXML(data.basics.label || '')}</label>\n`;
            xml += `    <email>${this.escapeXML(data.basics.email || '')}</email>\n`;
            xml += `    <phone>${this.escapeXML(data.basics.phone || '')}</phone>\n`;
            xml += `    <url>${this.escapeXML(data.basics.url || '')}</url>\n`;
            xml += `    <summary>${this.escapeXML(data.basics.summary || '')}</summary>\n`;

            if (data.basics.location) {
                xml += '    <location>\n';
                xml += `      <region>${this.escapeXML(data.basics.location.region || '')}</region>\n`;
                xml += `      <countryCode>${this.escapeXML(data.basics.location.countryCode || '')}</countryCode>\n`;
                xml += `      <remote>${data.basics.location.remote ? 'true' : 'false'}</remote>\n`;
                xml += '    </location>\n';
            }

            if (data.basics.profiles && data.basics.profiles.length > 0) {
                xml += '    <profiles>\n';
                data.basics.profiles.forEach(profile => {
                    xml += '      <item>\n';
                    xml += `        <network>${this.escapeXML(profile.network || '')}</network>\n`;
                    xml += `        <username>${this.escapeXML(profile.username || '')}</username>\n`;
                    xml += `        <url>${this.escapeXML(profile.url || '')}</url>\n`;
                    xml += '      </item>\n';
                });
                xml += '    </profiles>\n';
            }

            xml += '  </basics>\n';
        }

        // Work
        if (data.work && data.work.length > 0) {
            xml += '  <work>\n';
            data.work.forEach(item => {
                xml += '    <item>\n';
                xml += `      <position>${this.escapeXML(item.position || '')}</position>\n`;
                xml += `      <name>${this.escapeXML(item.name || '')}</name>\n`;
                xml += `      <location>${this.escapeXML(item.location || '')}</location>\n`;
                xml += `      <startDate>${this.escapeXML(item.startDate || '')}</startDate>\n`;
                xml += `      <endDate>${this.escapeXML(item.endDate || '')}</endDate>\n`;
                xml += `      <summary>${this.escapeXML(item.summary || '')}</summary>\n`;

                if (item.highlights && item.highlights.length > 0) {
                    xml += '      <highlights>\n';
                    item.highlights.forEach(highlight => {
                        xml += `        <item>${this.escapeXML(highlight)}</item>\n`;
                    });
                    xml += '      </highlights>\n';
                }

                xml += '    </item>\n';
            });
            xml += '  </work>\n';
        }

        // Education
        if (data.education && data.education.length > 0) {
            xml += '  <education>\n';
            data.education.forEach(item => {
                xml += '    <item>\n';
                xml += `      <institution>${this.escapeXML(item.institution || '')}</institution>\n`;
                xml += `      <studyType>${this.escapeXML(item.studyType || '')}</studyType>\n`;
                xml += `      <area>${this.escapeXML(item.area || '')}</area>\n`;
                xml += `      <startDate>${this.escapeXML(item.startDate || '')}</startDate>\n`;
                xml += `      <endDate>${this.escapeXML(item.endDate || '')}</endDate>\n`;
                xml += '    </item>\n';
            });
            xml += '  </education>\n';
        }

        // Skills
        if (data.skills && data.skills.length > 0) {
            xml += '  <skills>\n';
            data.skills.forEach(item => {
                xml += '    <item>\n';
                xml += `      <name>${this.escapeXML(item.name || '')}</name>\n`;

                if (item.keywords && item.keywords.length > 0) {
                    xml += '      <keywords>\n';
                    item.keywords.forEach(keyword => {
                        xml += `        <item>${this.escapeXML(keyword)}</item>\n`;
                    });
                    xml += '      </keywords>\n';
                }

                xml += '    </item>\n';
            });
            xml += '  </skills>\n';
        }

        // Projects
        if (data.projects && data.projects.length > 0) {
            xml += '  <projects>\n';
            data.projects.forEach(item => {
                xml += '    <item>\n';
                xml += `      <name>${this.escapeXML(item.name || '')}</name>\n`;
                xml += `      <startDate>${this.escapeXML(item.startDate || '')}</startDate>\n`;
                xml += `      <endDate>${this.escapeXML(item.endDate || '')}</endDate>\n`;
                xml += `      <summary>${this.escapeXML(item.summary || '')}</summary>\n`;

                if (item.highlights && item.highlights.length > 0) {
                    xml += '      <highlights>\n';
                    item.highlights.forEach(highlight => {
                        xml += `        <item>${this.escapeXML(highlight)}</item>\n`;
                    });
                    xml += '      </highlights>\n';
                }

                xml += '    </item>\n';
            });
            xml += '  </projects>\n';
        }

        // Certificates
        if (data.certificates && data.certificates.length > 0) {
            xml += '  <certificates>\n';
            data.certificates.forEach(item => {
                xml += '    <item>\n';
                xml += `      <name>${this.escapeXML(item.name || '')}</name>\n`;
                xml += `      <date>${this.escapeXML(item.date || '')}</date>\n`;
                xml += `      <issuer>${this.escapeXML(item.issuer || '')}</issuer>\n`;
                xml += '    </item>\n';
            });
            xml += '  </certificates>\n';
        }

        xml += '</Schema_Resume_v1.1.0>';
        return xml;
    }

    /**
     * Escape XML special characters and remove invalid XML characters
     */
    escapeXML(str) {
        if (!str) return '';

        const original = String(str);

        // Remove invalid XML characters (control characters except tab, newline, carriage return)
        // Valid XML chars: #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
        let cleaned = original.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

        // Debug: Log if invalid characters were found
        if (cleaned !== original) {
            const invalidChars = [];
            for (let i = 0; i < original.length; i++) {
                const charCode = original.charCodeAt(i);
                if (charCode < 0x20 && charCode !== 0x09 && charCode !== 0x0A && charCode !== 0x0D) {
                    invalidChars.push(`char ${charCode} at position ${i}`);
                }
            }
            console.warn('⚠️ Invalid XML characters removed:', {
                field: 'unknown',
                invalidChars: invalidChars,
                original: original.substring(0, 100),
                cleaned: cleaned.substring(0, 100)
            });
        }

        // Escape XML special characters
        return cleaned
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Import JSON file
     */
    importJSON() {
        document.getElementById('fileInput').click();
    }

    /**
     * Handle file import
     */
    handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const defaultData = await this.getDefaultResumeData();
                this.resumeData = { ...defaultData, ...data };
                this.saveToLocalStorage();
                this.renderEditor();
                this.renderPreview();
                // Update page title with new data
                this.updatePageTitle();
                alert('Resume imported successfully!');
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    /**
     * Export JSON file
     */
    exportJSON() {
        const dataStr = JSON.stringify(this.resumeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Print resume
     */
    printResume() {
        // Get the resume content
        const resumeContent = document.getElementById('resumePreview');
        if (!resumeContent) {
            alert('No resume content to print');
            return;
        }

        // Clone the content
        const printContent = resumeContent.cloneNode(true);

        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (!printWindow) {
            // Fallback to regular print if popup blocked
            window.print();
            return;
        }

        // Write the content to the new window
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Resume</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 2cm;
                    }
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'DejaVu Sans', 'Segoe UI', Arial, sans-serif;
                        font-size: 10pt;
                        line-height: 1.5;
                        color: #333;
                        background: white;
                    }
                    
                    /* Allow content to flow across pages */
                    .section {
                        page-break-inside: auto;
                        break-inside: auto;
                    }
                    
                    .work-item,
                    .education-item,
                    .cert-item,
                    .skill-item {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        margin-bottom: 1em;
                    }
                    
                    .section-title {
                        page-break-after: avoid;
                        break-after: avoid;
                        margin-top: 1em;
                    }
                    
                    /* Enable color printing */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();

        // Wait for content to load, then print
        printWindow.onload = function () {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        };
    }

    /**
     * Adjust zoom level
     */
    adjustZoom(delta) {
        this.setZoom(this.zoom + delta);
    }

    /**
     * Set zoom level
     */
    setZoom(level) {
        this.zoom = Math.max(0.5, Math.min(2.0, level));
        const page = document.querySelector('.a4-page');
        if (page) {
            page.style.transform = `scale(${this.zoom})`;
        }
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoom * 100)}%`;
    }

    /**
     * Reset content - clear all JSON data and reset form
     */
    resetContent() {
        if (confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
            // Create empty resume data structure
            this.resumeData = {
                basics: {
                    name: '',
                    label: '',
                    image: '',
                    email: '',
                    phone: '',
                    url: '',
                    summary: '',
                    location: {
                        address: '',
                        postalCode: '',
                        city: '',
                        countryCode: '',
                        region: ''
                    },
                    profiles: [],
                    nationalities: [],
                    workAuthorization: []
                },
                work: [],
                volunteer: [],
                education: [],
                awards: [],
                certificates: [],
                publications: [],
                skills: [],
                tools: [],
                languages: [],
                interests: [],
                references: [],
                projects: []
            };

            // Update the form
            this.updateForm();

            // Render the preview
            this.renderPreview();

            // Reset zoom
            this.setZoom(1.0);

            console.log('✓ Content cleared and reset to empty state');
        }
    }

    /**
     * Toggle side panel
     */
    togglePanel() {
        const panel = document.getElementById('sidePanel');
        const showBtn = document.getElementById('showPanelBtn');
        const isCollapsed = panel.classList.toggle('collapsed');

        // Show the restore button when panel is collapsed, hide it when panel is visible
        showBtn.style.display = isCollapsed ? 'flex' : 'none';
    }

    /**
     * Open JSON editor modal
     */
    openJsonEditor() {
        const modal = document.getElementById('jsonEditorModal');
        const textarea = document.getElementById('jsonEditorTextarea');
        const errorDiv = document.getElementById('jsonEditorError');

        // Populate textarea with current JSON
        textarea.value = JSON.stringify(this.resumeData, null, 2);

        // Clear any previous errors
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        // Show modal
        modal.style.display = 'flex';

        // Focus textarea
        setTimeout(() => textarea.focus(), 100);
    }

    /**
     * Close JSON editor modal
     */
    closeJsonEditor() {
        const modal = document.getElementById('jsonEditorModal');
        modal.style.display = 'none';
    }

    /**
     * Format JSON in the editor
     */
    formatJson() {
        const textarea = document.getElementById('jsonEditorTextarea');
        const errorDiv = document.getElementById('jsonEditorError');

        try {
            const json = JSON.parse(textarea.value);
            textarea.value = JSON.stringify(json, null, 2);
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        } catch (error) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Invalid JSON: ${error.message}`;
        }
    }

    /**
     * Apply JSON changes from the editor
     */
    applyJsonChanges() {
        const textarea = document.getElementById('jsonEditorTextarea');
        const errorDiv = document.getElementById('jsonEditorError');

        try {
            // Parse and validate JSON
            const newData = JSON.parse(textarea.value);

            // Update resume data
            this.resumeData = newData;

            // Save to localStorage
            this.saveToLocalStorage();

            // Regenerate form
            this.renderEditor();

            // Update preview
            this.renderPreview();

            // Update page title with new data
            this.updatePageTitle();

            // Close modal
            this.closeJsonEditor();

            // Show success message
            console.log('JSON updated successfully');

        } catch (error) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Invalid JSON: ${error.message}`;
        }
    }

    /**
     * Show timeline modal with Mermaid Gantt diagram
     */
    async showTimeline() {
        const modal = document.getElementById('timelineModal');
        const container = document.getElementById('timelineContainer');

        if (!modal || !container) return;

        // Show modal
        modal.style.display = 'flex';

        // Show loading state
        container.innerHTML = '<div class="loading">Generating timeline...</div>';

        try {
            // Generate Mermaid diagram
            const mermaidCode = this.generateTimelineMermaid();

            // Store the code for copying
            this.currentMermaidCode = mermaidCode;

            // Wait for mermaid to be available
            if (!window.mermaid) {
                throw new Error('Mermaid library not loaded');
            }

            // Create a unique ID for this diagram
            const diagramId = 'timeline-' + Date.now();

            // Render the diagram
            container.innerHTML = `<div class="mermaid" id="${diagramId}">${mermaidCode}</div>`;

            // Initialize mermaid on this specific element
            await window.mermaid.run({
                nodes: [document.getElementById(diagramId)]
            });

        } catch (error) {
            console.error('Error generating timeline:', error);
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--color-danger);">
                    <p><strong>Error generating timeline:</strong></p>
                    <p>${error.message}</p>
                    <p style="margin-top: 1rem; color: var(--color-text-muted); font-size: 0.875rem;">
                        Make sure you have date information in your Work, Education, or other sections.
                    </p>
                </div>
            `;
        }
    }

    /**
     * Close timeline modal
     */
    closeTimelineModal() {
        const modal = document.getElementById('timelineModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Refresh timeline if modal is currently open
     */
    refreshTimelineIfOpen() {
        const modal = document.getElementById('timelineModal');
        if (modal && modal.style.display === 'flex') {
            // Silently refresh the timeline without showing loading state
            this.showTimeline();
        }
    }

    /**
     * Generate Mermaid Gantt diagram code from resume data
     */
    generateTimelineMermaid() {
        const events = this.extractTimelineEvents();

        if (events.length === 0) {
            throw new Error('No timeline events found in your resume data');
        }

        // Get the person's name from basics
        const name = this.resumeData.basics?.name || 'Career Timeline';

        // Find date range
        const years = events.map(e => e.startYear).filter(y => y);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years.map(e => e.endYear || new Date().getFullYear()));

        // Start building Mermaid code
        let mermaid = `gantt\n`;
        mermaid += `    title Career Timeline — ${name} (${minYear}–${maxYear})\n`;
        mermaid += `    dateFormat  YYYY-MM-DD\n`;
        mermaid += `    axisFormat  %Y\n\n`;

        // Group events by section
        const sections = {};
        events.forEach(event => {
            if (!sections[event.section]) {
                sections[event.section] = [];
            }
            sections[event.section].push(event);
        });

        // Add each section
        Object.keys(sections).forEach(sectionName => {
            mermaid += `    section ${sectionName}\n`;

            sections[sectionName].forEach(event => {
                // Ensure dates are in full YYYY-MM-DD format
                let startDate = event.startDate || `${event.startYear}-01-01`;
                let endDate = event.endDate || (event.endYear ? `${event.endYear}-12-31` : this.formatDate(new Date()));

                // Convert year-only dates to full format (YYYY -> YYYY-01-01)
                startDate = this.normalizeDate(startDate);
                endDate = this.normalizeDate(endDate);

                // Sanitize title for Mermaid (remove special characters that might break syntax)
                const title = event.title.replace(/[:\n]/g, ' ').substring(0, 60);
                const id = event.id || title.toLowerCase().replace(/[^a-z0-9]/g, '');

                mermaid += `    ${title} :${id}, ${startDate}, ${endDate}\n`;
            });

            mermaid += `\n`;
        });

        return mermaid;
    }

    /**
     * Extract timeline events from resume data
     */
    extractTimelineEvents() {
        const events = [];

        // Extract work experience
        if (this.resumeData.work && Array.isArray(this.resumeData.work)) {
            this.resumeData.work.forEach((item, index) => {
                if (item.startDate || item.endDate) {
                    const start = this.parseDate(item.startDate);
                    const end = item.endDate ? this.parseDate(item.endDate) : null;

                    events.push({
                        section: 'Work Experience',
                        title: `${item.position || 'Position'} — ${item.name || item.company || 'Company'}`,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        startYear: start?.year,
                        endYear: end?.year,
                        id: `work${index}`
                    });
                }
            });
        }

        // Extract education
        if (this.resumeData.education && Array.isArray(this.resumeData.education)) {
            this.resumeData.education.forEach((item, index) => {
                if (item.startDate || item.endDate) {
                    const start = this.parseDate(item.startDate);
                    const end = item.endDate ? this.parseDate(item.endDate) : null;

                    events.push({
                        section: 'Education',
                        title: `${item.institution || 'Institution'} (${item.studyType || item.area || 'Study'})`,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        startYear: start?.year,
                        endYear: end?.year,
                        id: `edu${index}`
                    });
                }
            });
        }

        // Extract volunteer work
        if (this.resumeData.volunteer && Array.isArray(this.resumeData.volunteer)) {
            this.resumeData.volunteer.forEach((item, index) => {
                if (item.startDate || item.endDate) {
                    const start = this.parseDate(item.startDate);
                    const end = item.endDate ? this.parseDate(item.endDate) : null;

                    events.push({
                        section: 'Volunteer',
                        title: `${item.position || 'Position'} — ${item.organization || 'Organization'}`,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        startYear: start?.year,
                        endYear: end?.year,
                        id: `vol${index}`
                    });
                }
            });
        }

        // Extract projects with dates
        if (this.resumeData.projects && Array.isArray(this.resumeData.projects)) {
            this.resumeData.projects.forEach((item, index) => {
                if (item.startDate || item.endDate) {
                    const start = this.parseDate(item.startDate);
                    const end = item.endDate ? this.parseDate(item.endDate) : null;

                    events.push({
                        section: 'Projects',
                        title: item.name || `Project ${index + 1}`,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        startYear: start?.year,
                        endYear: end?.year,
                        id: `proj${index}`
                    });
                }
            });
        }

        // Extract awards with dates
        if (this.resumeData.awards && Array.isArray(this.resumeData.awards)) {
            this.resumeData.awards.forEach((item, index) => {
                if (item.date) {
                    const parsed = this.parseDate(item.date);

                    events.push({
                        section: 'Awards',
                        title: item.title || `Award ${index + 1}`,
                        startDate: item.date,
                        endDate: item.date,
                        startYear: parsed?.year,
                        endYear: parsed?.year,
                        id: `award${index}`
                    });
                }
            });
        }

        // Extract certificates with dates
        if (this.resumeData.certificates && Array.isArray(this.resumeData.certificates)) {
            this.resumeData.certificates.forEach((item, index) => {
                if (item.date) {
                    const parsed = this.parseDate(item.date);

                    events.push({
                        section: 'Certificates',
                        title: item.name || `Certificate ${index + 1}`,
                        startDate: item.date,
                        endDate: item.date,
                        startYear: parsed?.year,
                        endYear: parsed?.year,
                        id: `cert${index}`
                    });
                }
            });
        }

        // Extract publications with dates
        if (this.resumeData.publications && Array.isArray(this.resumeData.publications)) {
            this.resumeData.publications.forEach((item, index) => {
                if (item.releaseDate) {
                    const parsed = this.parseDate(item.releaseDate);

                    events.push({
                        section: 'Publications',
                        title: item.name || `Publication ${index + 1}`,
                        startDate: item.releaseDate,
                        endDate: item.releaseDate,
                        startYear: parsed?.year,
                        endYear: parsed?.year,
                        id: `pub${index}`
                    });
                }
            });
        }

        // Sort events by start date
        events.sort((a, b) => {
            if (!a.startYear) return 1;
            if (!b.startYear) return -1;
            return a.startYear - b.startYear;
        });

        return events;
    }

    /**
     * Parse date string to extract year, month, day
     */
    parseDate(dateStr) {
        if (!dateStr) return null;

        // Try to parse ISO date format (YYYY-MM-DD)
        const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            return {
                year: parseInt(isoMatch[1]),
                month: parseInt(isoMatch[2]),
                day: parseInt(isoMatch[3])
            };
        }

        // Try to extract just year (YYYY)
        const yearMatch = dateStr.match(/(\d{4})/);
        if (yearMatch) {
            return {
                year: parseInt(yearMatch[1]),
                month: 1,
                day: 1
            };
        }

        return null;
    }

    /**
     * Normalize date string to YYYY-MM-DD format
     * Converts year-only dates (YYYY) to YYYY-01-01
     */
    normalizeDate(dateStr) {
        if (!dateStr) return null;

        // Already in full format (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        // Year only (YYYY) - convert to YYYY-01-01
        if (/^\d{4}$/.test(dateStr)) {
            return `${dateStr}-01-01`;
        }

        // Year-Month only (YYYY-MM) - convert to YYYY-MM-01
        if (/^\d{4}-\d{2}$/.test(dateStr)) {
            return `${dateStr}-01`;
        }

        // Try to extract year and default to January 1st
        const yearMatch = dateStr.match(/(\d{4})/);
        if (yearMatch) {
            return `${yearMatch[1]}-01-01`;
        }

        return dateStr;
    }

    /**
     * Format date as YYYY-MM-DD
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Show tools chart modal with Chart.js horizontal bar chart
     */
    async showToolsChart() {
        const modal = document.getElementById('toolsChartModal');
        const canvas = document.getElementById('toolsChartCanvas');

        if (!modal || !canvas) return;

        // Show modal
        modal.style.display = 'flex';

        try {
            // Extract tools data
            const tools = this.extractToolsExperience();

            if (tools.length === 0) {
                throw new Error('No tools with experience data found in your resume');
            }

            // Sort by years of experience (descending)
            tools.sort((a, b) => b.years - a.years);

            // Destroy existing chart if it exists
            if (this.toolsChart) {
                this.toolsChart.destroy();
            }

            // Prepare data for Chart.js
            const labels = tools.map(t => t.name);
            const data = tools.map(t => t.years);

            // Get person's name
            const name = this.resumeData.basics?.name || 'Your';

            // Create Chart.js horizontal bar chart
            const ctx = canvas.getContext('2d');
            this.toolsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Years of Experience',
                        data: data,
                        backgroundColor: '#0066cc',
                        borderColor: '#004080',
                        borderWidth: 2,
                        barThickness: 30
                    }]
                },
                options: {
                    indexAxis: 'y', // Horizontal bars
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: `${name} - Tools & Technologies Experience`,
                            font: {
                                size: 18,
                                weight: 'bold'
                            },
                            color: '#212529',
                            padding: 20
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.parsed.x + ' year' + (context.parsed.x !== 1 ? 's' : '');
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Years of Experience',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                },
                                color: '#495057'
                            },
                            ticks: {
                                stepSize: 1,
                                color: '#6c757d'
                            },
                            grid: {
                                color: '#e9ecef'
                            }
                        },
                        y: {
                            ticks: {
                                font: {
                                    size: 13
                                },
                                color: '#495057'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });

            // Set canvas height based on number of tools
            const height = Math.max(400, tools.length * 50 + 100);
            canvas.style.height = height + 'px';

        } catch (error) {
            console.error('Error generating tools chart:', error);
            const container = canvas.parentElement;
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--color-danger);">
                    <p><strong>Error generating chart:</strong></p>
                    <p>${error.message}</p>
                    <p style="margin-top: 1rem; color: var(--color-text-muted); font-size: 0.875rem;">
                        Make sure you have tools with yearsOfExperience in your resume data.
                    </p>
                </div>
            `;
        }
    }

    /**
     * Close tools chart modal
     */
    closeToolsChartModal() {
        const modal = document.getElementById('toolsChartModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Extract tools with experience from resume data
     */
    extractToolsExperience() {
        const toolsList = [];

        // Extract from tools section
        if (this.resumeData.tools && Array.isArray(this.resumeData.tools)) {
            this.resumeData.tools.forEach(tool => {
                if (tool.name && tool.yearsOfExperience) {
                    toolsList.push({
                        name: tool.name,
                        years: parseFloat(tool.yearsOfExperience) || 0,
                        level: tool.level || ''
                    });
                }
            });
        }

        // Also extract from skills section if it has yearsOfExperience
        if (this.resumeData.skills && Array.isArray(this.resumeData.skills)) {
            this.resumeData.skills.forEach(skill => {
                if (skill.name && skill.yearsOfExperience) {
                    toolsList.push({
                        name: skill.name,
                        years: parseFloat(skill.yearsOfExperience) || 0,
                        level: skill.level || ''
                    });
                }
            });
        }

        // Remove duplicates (keep the one with higher years)
        const uniqueTools = {};
        toolsList.forEach(tool => {
            if (!uniqueTools[tool.name] || uniqueTools[tool.name].years < tool.years) {
                uniqueTools[tool.name] = tool;
            }
        });

        return Object.values(uniqueTools);
    }

    /**
     * Download tools chart as PNG
     */
    async downloadToolsChart() {
        if (!this.toolsChart) {
            alert('No chart to download');
            return;
        }

        try {
            const canvas = document.getElementById('toolsChartCanvas');
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'tools-experience-chart.png';
            link.href = url;
            link.click();

            // Show success feedback
            const btn = document.getElementById('downloadToolsChartBtn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Downloaded!
                `;

                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to download chart:', error);
            alert('Failed to download chart');
        }
    }

    async copyTimelineCode() {
        if (!this.currentMermaidCode) {
            alert('No timeline code to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentMermaidCode);

            // Show success feedback
            const btn = document.getElementById('copyTimelineBtn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                `;

                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
            alert('Failed to copy to clipboard');
        }
    }
}

// Initialize application when DOM is ready
// Since this script is loaded dynamically, DOMContentLoaded may have already fired
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📅 DOMContentLoaded event fired');
        new ResumeEditor();
    });
} else {
    // DOM is already loaded (interactive or complete), initialize immediately
    console.log('📅 DOM already loaded (readyState: ' + document.readyState + '), initializing immediately');
    new ResumeEditor();
}
