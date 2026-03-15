console.log('🌐 i18n.js loading...');

/**
 * Internationalization (i18n) Manager
 * Handles loading and switching between different language translations
 */
class I18nManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en-GB';
        this.translations = {};
        this.availableLanguages = [
            { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
            { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
            { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'pl-PL', name: 'Polski', flag: '🇵🇱' },
            { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
            { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
            { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'ja-JP', name: '日本語', flag: '🇯🇵' }
        ];
    }

    /**
     * Initialize i18n system
     */
    async init() {
        try {
            await this.loadLanguage(this.currentLanguage);
            this.updateUI();
            console.log(`✓ i18n initialized with language: ${this.currentLanguage}`);
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
            // Fallback to English UK
            this.currentLanguage = 'en-GB';
            await this.loadLanguage('en-GB');
        }
    }

    /**
     * Load language translations
     */
    async loadLanguage(languageCode) {
        try {
            const response = await fetch(`src/i18n/${languageCode}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            this.translations = await response.json();
            this.currentLanguage = languageCode;
            localStorage.setItem('selectedLanguage', languageCode);
            console.log(`✓ Loaded translations for ${languageCode}`);
        } catch (error) {
            console.error(`Failed to load language ${languageCode}:`, error);
            throw error;
        }
    }

    /**
     * Switch to a different language
     */
    async switchLanguage(languageCode) {
        if (languageCode === this.currentLanguage) {
            return;
        }

        try {
            await this.loadLanguage(languageCode);
            this.updateUI();
            
            // Trigger custom event for other components to update
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: languageCode }
            }));
            
            console.log(`✓ Switched to ${languageCode}`);
        } catch (error) {
            console.error('Failed to switch language:', error);
            alert(`Failed to load language: ${languageCode}`);
        }
    }

    /**
     * Get translation by key path (e.g., 'header.buttons.import')
     */
    t(keyPath, defaultValue = '') {
        const keys = keyPath.split('.');
        let value = this.translations;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return defaultValue || keyPath;
            }
        }

        return value || defaultValue || keyPath;
    }

    /**
     * Get field label from schema section
     */
    getFieldLabel(section, fieldName) {
        return this.t(`fields.${section}.${fieldName}.label`, this.formatLabel(fieldName));
    }

    /**
     * Get field description from schema section
     */
    getFieldDescription(section, fieldName) {
        return this.t(`fields.${section}.${fieldName}.description`, '');
    }

    /**
     * Format label from camelCase field name
     */
    formatLabel(name) {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Update all UI elements with current translations
     */
    updateUI() {
        // Update page title
        document.title = this.t('app.title') + ' - JSON Resume Schema';

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = this.t('app.description');
        }

        // Update header title
        const appTitle = document.querySelector('.app-title');
        if (appTitle) {
            const titleText = appTitle.childNodes[appTitle.childNodes.length - 1];
            if (titleText && titleText.nodeType === Node.TEXT_NODE) {
                titleText.textContent = ' ' + this.t('app.title');
            }
        }

        // Update template selector
        const templateSelector = document.getElementById('templateSelector');
        if (templateSelector) {
            templateSelector.title = this.t('header.templateSelector.label');
            const options = templateSelector.querySelectorAll('option');
            if (options[0]) options[0].textContent = this.t('header.templateSelector.classic');
            if (options[1]) options[1].textContent = this.t('header.templateSelector.professional');
        }

        // Update buttons
        this.updateButton('uploadCvBtn', 'header.buttons.uploadCV', 'header.tooltips.uploadCV');
        this.updateButton('importLinkedInBtn', 'header.buttons.importLinkedIn', 'header.tooltips.importLinkedIn');
        this.updateButton('importBtn', 'header.buttons.import', 'header.tooltips.import');
        this.updateButton('editJsonBtn', 'header.buttons.editJSON', 'header.tooltips.editJSON');
        this.updateButton('exportBtn', 'header.buttons.export', 'header.tooltips.export');
        this.updateButton('downloadPdfBtn', 'header.buttons.downloadPDF', 'header.tooltips.downloadPDF');
        this.updateButton('printBtn', 'header.buttons.print', 'header.tooltips.print');
        this.updateButton('timelineBtn', 'header.buttons.timeline', 'header.tooltips.timeline');
        this.updateButton('toolsChartBtn', 'header.buttons.tools', 'header.tooltips.tools');

        // Update sidebar
        const panelTitle = document.querySelector('.panel-title');
        if (panelTitle) {
            panelTitle.textContent = this.t('sidebar.title');
        }

        const togglePanel = document.getElementById('togglePanel');
        if (togglePanel) {
            togglePanel.title = this.t('sidebar.togglePanel');
        }

        const showPanelBtn = document.getElementById('showPanelBtn');
        if (showPanelBtn) {
            showPanelBtn.title = this.t('sidebar.showSidebar');
        }

        // Update section tabs
        const sections = ['basics', 'work', 'volunteer', 'education', 'awards', 'certificates', 
                         'publications', 'skills', 'tools', 'languages', 'interests', 'references', 'projects'];
        sections.forEach(section => {
            const tab = document.querySelector(`[data-section="${section}"]`);
            if (tab) {
                tab.textContent = this.t(`sections.${section}`);
            }
        });

        // Update preview controls
        const zoomOut = document.getElementById('zoomOut');
        if (zoomOut) zoomOut.title = this.t('preview.zoomOut');

        const zoomIn = document.getElementById('zoomIn');
        if (zoomIn) zoomIn.title = this.t('preview.zoomIn');

        const resetZoom = document.getElementById('resetZoom');
        if (resetZoom) resetZoom.textContent = this.t('preview.resetZoom');

        const debugBtn = document.getElementById('debugModeBtn');
        if (debugBtn) {
            const debugText = debugBtn.childNodes[debugBtn.childNodes.length - 1];
            if (debugText && debugText.nodeType === Node.TEXT_NODE) {
                debugText.textContent = ' ' + this.t('preview.debug');
            }
        }

        // Update modals
        this.updateModalTitles();
    }

    /**
     * Update button text and tooltip
     */
    updateButton(id, textKey, tooltipKey) {
        const button = document.getElementById(id);
        if (!button) return;

        // Update button text (preserve SVG icon)
        const textNode = button.childNodes[button.childNodes.length - 1];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = ' ' + this.t(textKey);
        }

        // Update tooltip
        if (tooltipKey) {
            button.title = this.t(tooltipKey);
        }
    }

    /**
     * Update modal titles and buttons
     */
    updateModalTitles() {
        // JSON Editor Modal
        const jsonEditorTitle = document.querySelector('#jsonEditorModal .modal-header h2');
        if (jsonEditorTitle) {
            jsonEditorTitle.textContent = this.t('modals.jsonEditor.title');
        }

        const formatJsonBtn = document.getElementById('formatJsonBtn');
        if (formatJsonBtn) {
            const textNode = formatJsonBtn.childNodes[formatJsonBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = ' ' + this.t('modals.jsonEditor.formatJSON');
            }
        }

        const applyJsonBtn = document.getElementById('applyJsonBtn');
        if (applyJsonBtn) {
            const textNode = applyJsonBtn.childNodes[applyJsonBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = ' ' + this.t('modals.jsonEditor.applyChanges');
            }
        }

        // Timeline Modal
        const timelineTitle = document.querySelector('#timelineModal .modal-header h2');
        if (timelineTitle) {
            timelineTitle.textContent = this.t('modals.timeline.title');
        }

        const copyTimelineBtn = document.getElementById('copyTimelineBtn');
        if (copyTimelineBtn) {
            const textNode = copyTimelineBtn.childNodes[copyTimelineBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = ' ' + this.t('modals.timeline.copyCode');
            }
        }

        // Tools Chart Modal
        const toolsChartTitle = document.querySelector('#toolsChartModal .modal-header h2');
        if (toolsChartTitle) {
            toolsChartTitle.textContent = this.t('modals.toolsChart.title');
        }

        const downloadToolsChartBtn = document.getElementById('downloadToolsChartBtn');
        if (downloadToolsChartBtn) {
            const textNode = downloadToolsChartBtn.childNodes[downloadToolsChartBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = ' ' + this.t('modals.toolsChart.downloadPNG');
            }
        }
    }

    /**
     * Create language selector dropdown
     */
    createLanguageSelector() {
        const select = document.createElement('select');
        select.id = 'languageSelector';
        select.className = 'btn btn-secondary';
        select.title = this.t('header.tooltips.language');

        this.availableLanguages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = `${lang.flag} ${lang.name}`;
            if (lang.code === this.currentLanguage) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this.switchLanguage(e.target.value);
        });

        return select;
    }
}

// Export for use in other modules
window.I18nManager = I18nManager;
console.log('✓ i18n.js loaded successfully');