console.log('📝 form-generator.js loading...');

/**
 * Dynamic Form Generator
 * Generates form fields based on JSON Schema definitions
 */

class FormGenerator {
    constructor(schema, i18n = null) {
        this.schema = schema;
        this.definitions = schema.definitions || {};
        this.i18n = i18n;
    }

    /**
     * Resolve $ref references in schema
     */
    resolveRef(ref) {
        if (!ref || !ref.startsWith('#/')) return null;
        
        const path = ref.substring(2).split('/');
        let current = this.schema;
        
        for (const segment of path) {
            current = current[segment];
            if (!current) return null;
        }
        
        return current;
    }

    /**
     * Get field type from schema property
     */
    getFieldType(property) {
        if (property.$ref) {
            const resolved = this.resolveRef(property.$ref);
            if (resolved) return resolved.type || 'string';
        }
        
        if (property.format === 'email') return 'email';
        if (property.format === 'uri') return 'url';
        if (property.format === 'date-time') return 'datetime-local';
        if (property.type === 'integer' || property.type === 'number') return 'number';
        if (property.type === 'boolean') return 'checkbox';
        
        return property.type || 'string';
    }

    /**
     * Get input attributes from schema property
     */
    getInputAttributes(property, fieldPath) {
        const attrs = {
            'data-field': fieldPath,
            'class': 'form-input'
        };

        if (property.minimum !== undefined) {
            attrs.min = property.minimum;
        }
        
        if (property.maximum !== undefined) {
            attrs.max = property.maximum;
        }

        if (property.pattern) {
            attrs.pattern = property.pattern;
        }

        if (property.format === 'email') {
            attrs.type = 'email';
        } else if (property.format === 'uri') {
            attrs.type = 'url';
        }

        return attrs;
    }

    /**
     * Format label from property name
     */
    formatLabel(name) {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Get translated label for a field
     */
    getLabel(section, fieldName) {
        if (this.i18n) {
            return this.i18n.getFieldLabel(section, fieldName);
        }
        return this.formatLabel(fieldName);
    }

    /**
     * Get translated description for a field
     */
    getDescription(section, fieldName, defaultDescription = '') {
        if (this.i18n) {
            const translated = this.i18n.getFieldDescription(section, fieldName);
            return translated || defaultDescription;
        }
        return defaultDescription;
    }

    /**
     * Generate form field HTML for a single property
     */
    generateField(name, property, value = '', fieldPath = '') {
        const fullPath = fieldPath ? `${fieldPath}.${name}` : name;
        
        // Extract section from fieldPath for i18n lookup
        const section = fieldPath ? fieldPath.split('.')[0] : 'basics';
        const label = this.getLabel(section, name);
        const description = this.getDescription(section, name, property.description || '');
        const fieldType = this.getFieldType(property);

        // Skip @type and @context fields
        if (name.startsWith('@')) {
            return '';
        }

        let html = `<div class="form-group">`;
        html += `<label class="form-label" title="${this.escapeHtml(description)}">${this.escapeHtml(label)}</label>`;

        if (fieldType === 'array') {
            // Handle array fields
            const items = property.items;
            if (items && items.type === 'string') {
                // Simple string array - use textarea with one item per line
                const arrayValue = Array.isArray(value) ? value.join('\n') : '';
                html += `<textarea class="form-textarea" data-field="${fullPath}" data-type="array" placeholder="${this.escapeHtml(description)}">${this.escapeHtml(arrayValue)}</textarea>`;
            } else if (items && items.type === 'object') {
                // Complex object array - handled separately
                html += `<div class="array-placeholder" data-field="${fullPath}">Complex array - handled by array editor</div>`;
            }
        } else if (fieldType === 'object') {
            // Nested object - render as subsection
            html += `<div class="nested-object" data-field="${fullPath}">`;
            if (property.properties) {
                for (const [propName, propSchema] of Object.entries(property.properties)) {
                    const propValue = value && typeof value === 'object' ? value[propName] : '';
                    html += this.generateField(propName, propSchema, propValue, fullPath);
                }
            }
            html += `</div>`;
        } else if (fieldType === 'boolean') {
            const checked = value === true ? 'checked' : '';
            html += `<label class="checkbox-label">
                <input type="checkbox" class="form-checkbox" data-field="${fullPath}" ${checked} />
                <span>${this.escapeHtml(description)}</span>
            </label>`;
        } else if (fieldType === 'string' && description.length > 100) {
            // Long text field
            html += `<textarea class="form-textarea" data-field="${fullPath}" placeholder="${this.escapeHtml(description)}">${this.escapeHtml(value)}</textarea>`;
        } else if (property.enum) {
            // Enum field - use select
            html += `<select class="form-input" data-field="${fullPath}">`;
            html += `<option value="">Select...</option>`;
            for (const option of property.enum) {
                const selected = value === option ? 'selected' : '';
                html += `<option value="${this.escapeHtml(option)}" ${selected}>${this.escapeHtml(option)}</option>`;
            }
            html += `</select>`;
        } else {
            // Regular input field
            const attrs = this.getInputAttributes(property, fullPath);
            const type = attrs.type || (fieldType === 'number' || fieldType === 'integer' ? 'number' : 'text');
            const step = fieldType === 'number' ? 'step="0.1"' : '';
            
            let attrsStr = '';
            for (const [key, val] of Object.entries(attrs)) {
                if (key !== 'type') {
                    attrsStr += ` ${key}="${this.escapeHtml(val)}"`;
                }
            }
            
            html += `<input type="${type}" ${step} ${attrsStr} value="${this.escapeHtml(value)}" placeholder="${this.escapeHtml(description)}" />`;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Generate form for basics section
     */
    generateBasicsForm(data = {}) {
        const basicsSchema = this.schema.properties.basics;
        if (!basicsSchema || !basicsSchema.properties) return '';

        let html = '';
        
        // Generate fields for all properties in basics
        for (const [name, property] of Object.entries(basicsSchema.properties)) {
            if (property.type === 'object' && name === 'location') {
                // Special handling for location - make it collapsible
                const locationData = data.location || {};
                const locationLabel = this.getLabel('basics', 'location');
                html += `
                    <details class="collapsible-section">
                        <summary class="section-subtitle">${this.escapeHtml(locationLabel)}</summary>
                        <div class="section-content">`;
                for (const [locName, locProp] of Object.entries(property.properties || {})) {
                    html += this.generateField(locName, locProp, locationData[locName], 'basics.location');
                }
                html += `
                        </div>
                    </details>
                `;
            } else if (property.type === 'array' && name === 'profiles') {
                // Profiles - render as collapsible array editor
                const profilesLabel = this.getLabel('basics', 'profiles');
                html += `
                    <details class="collapsible-section">
                        <summary class="section-subtitle">${this.escapeHtml(profilesLabel)}</summary>
                        <div class="section-content">
                            ${this.generateBasicsArrayEditor('profiles', property, data.profiles || [])}
                        </div>
                    </details>
                `;
            } else if (property.type === 'array' && name === 'nationalities') {
                // Nationalities - render as collapsible array editor (it's an array of objects)
                const nationalitiesLabel = this.getLabel('basics', 'nationalities');
                html += `
                    <details class="collapsible-section">
                        <summary class="section-subtitle">${this.escapeHtml(nationalitiesLabel)}</summary>
                        <div class="section-content">
                            ${this.generateBasicsArrayEditor('nationalities', property, data.nationalities || [])}
                        </div>
                    </details>
                `;
            } else if (property.type === 'array' && name === 'workAuthorization') {
                // Work authorization - render as collapsible array editor
                const workAuthLabel = this.getLabel('basics', 'workAuthorization');
                html += `
                    <details class="collapsible-section">
                        <summary class="section-subtitle">${this.escapeHtml(workAuthLabel)}</summary>
                        <div class="section-content">
                            ${this.generateBasicsArrayEditor('workAuthorization', property, data.workAuthorization || [])}
                        </div>
                    </details>
                `;
            } else {
                html += this.generateField(name, property, data[name], 'basics');
            }
        }

        return html;
    }

    /**
     * Generate array editor for basics section arrays (profiles, workAuthorization)
     */
    generateBasicsArrayEditor(fieldName, property, data = []) {
        const items = Array.isArray(data) ? data : [];
        const itemSchema = property.items;

        if (!itemSchema || !itemSchema.properties) return '';

        let html = '<div class="array-container">';
        
        items.forEach((item, index) => {
            // Determine title field based on array type
            let titleField, itemTitle;
            if (fieldName === 'profiles') {
                titleField = 'network';
                itemTitle = item[titleField] || item['username'] || `Profile #${index + 1}`;
            } else if (fieldName === 'nationalities') {
                titleField = 'country';
                const bornIndicator = item['born'] ? ' (Born)' : '';
                itemTitle = (item[titleField] || `Nationality #${index + 1}`) + bornIndicator;
            } else if (fieldName === 'workAuthorization') {
                titleField = 'country';
                itemTitle = item[titleField] || `Work Authorization #${index + 1}`;
            } else {
                itemTitle = `${this.formatLabel(fieldName)} #${index + 1}`;
            }
            
            html += `
                <div class="array-item" data-index="${index}">
                    <div class="array-item-header">
                        <span class="array-item-title">${this.escapeHtml(itemTitle)}</span>
                        <div class="array-actions">
                            <button class="btn-icon btn-remove" data-section="basics.${fieldName}" data-index="${index}" title="Remove">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
            `;
            
            // Generate fields for this item
            for (const [propName, propSchema] of Object.entries(itemSchema.properties)) {
                if (propName.startsWith('@')) continue;
                const value = item[propName] || '';
                const fieldPath = `basics.${fieldName}.${index}.${propName}`;
                html += this.generateField(propName, propSchema, value, `basics.${fieldName}.${index}`);
            }
            
            html += `</div>`;
        });
        
        html += `
            <button class="btn btn-success btn-add" data-section="basics.${fieldName}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add ${this.formatLabel(fieldName)}
            </button>
        `;
        
        html += '</div>';
        return html;
    }

    /**
     * Generate form for array item
     */
    generateArrayItemForm(sectionName, itemSchema, itemData = {}, index = 0) {
        if (!itemSchema || !itemSchema.properties) return '';

        let html = '';
        
        for (const [name, property] of Object.entries(itemSchema.properties)) {
            // Skip @type fields in the form
            if (name.startsWith('@')) continue;
            
            const value = itemData[name] || '';
            const fieldPath = `${sectionName}.${index}.${name}`;
            
            if (property.type === 'array' && property.items?.type === 'string') {
                // String array - use textarea
                const arrayValue = Array.isArray(value) ? value.join('\n') : '';
                html += `<div class="form-group">`;
                html += `<label class="form-label" title="${this.escapeHtml(property.description || '')}">${this.escapeHtml(this.formatLabel(name))}</label>`;
                html += `<textarea class="form-textarea" data-field="${fieldPath}" data-type="array" placeholder="${this.escapeHtml(property.description || '')}">${this.escapeHtml(arrayValue)}</textarea>`;
                html += `</div>`;
            } else if (property.type === 'object') {
                // Nested object - make it collapsible
                html += `
                    <details class="nested-object-collapsible">
                        <summary class="subsection-title">${this.escapeHtml(this.formatLabel(name))}</summary>
                        <div class="nested-object-content">`;
                if (property.properties) {
                    for (const [subName, subProp] of Object.entries(property.properties)) {
                        const subValue = value && typeof value === 'object' ? value[subName] : '';
                        html += this.generateField(subName, subProp, subValue, fieldPath);
                    }
                }
                html += `
                        </div>
                    </details>
                `;
            } else {
                html += this.generateField(name, property, value, `${sectionName}.${index}`);
            }
        }

        return html;
    }

    /**
     * Get item title for display
     */
    getItemTitle(sectionName, item, index) {
        const titleFields = {
            work: 'position',
            volunteer: 'organization',
            education: 'institution',
            awards: 'title',
            certificates: 'name',
            publications: 'name',
            skills: 'name',
            tools: 'name',
            languages: 'language',
            interests: 'name',
            references: 'name',
            projects: 'name'
        };

        const field = titleFields[sectionName];
        if (field && item[field]) {
            return item[field];
        }

        return `${this.formatLabel(sectionName)} #${index + 1}`;
    }

    /**
     * Get section label
     */
    getSectionLabel(sectionName) {
        const labels = {
            work: 'Work Experience',
            volunteer: 'Volunteer Experience',
            education: 'Education',
            awards: 'Award',
            certificates: 'Certificate',
            publications: 'Publication',
            skills: 'Skill',
            tools: 'Tool',
            languages: 'Language',
            interests: 'Interest',
            references: 'Reference',
            projects: 'Project'
        };
        return labels[sectionName] || this.formatLabel(sectionName);
    }

    /**
     * Generate array editor (for work, education, etc.)
     */
    generateArrayEditor(sectionName, data = []) {
        const sectionSchema = this.schema.properties[sectionName];
        if (!sectionSchema || sectionSchema.type !== 'array') return '';

        const items = Array.isArray(data) ? data : [];
        const itemSchema = sectionSchema.items;

        let html = '<div class="array-container">';
        
        items.forEach((item, index) => {
            html += `
                <details class="array-item-collapsible" data-index="${index}">
                    <summary class="array-item-header">
                        <span class="array-item-title">${this.escapeHtml(this.getItemTitle(sectionName, item, index))}</span>
                        <div class="array-actions">
                            <button class="btn-icon btn-remove" data-section="${sectionName}" data-index="${index}" title="Remove" onclick="event.stopPropagation();">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </summary>
                    <div class="array-item-content">
                        ${this.generateArrayItemForm(sectionName, itemSchema, item, index)}
                    </div>
                </details>
            `;
        });
        
        html += `
            <button class="btn btn-success btn-add" data-section="${sectionName}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add ${this.getSectionLabel(sectionName)}
            </button>
        `;
        
        html += '</div>';
        return html;
    }

    /**
     * Get default value for a property
     */
    getDefaultValue(property) {
        if (property.type === 'array') return [];
        if (property.type === 'object') return {};
        if (property.type === 'boolean') return false;
        if (property.type === 'number' || property.type === 'integer') return 0;
        return '';
    }

    /**
     * Get empty item template for array section
     */
    getEmptyItem(sectionName) {
        const sectionSchema = this.schema.properties[sectionName];
        if (!sectionSchema || !sectionSchema.items || !sectionSchema.items.properties) {
            return {};
        }

        const item = {};
        for (const [name, property] of Object.entries(sectionSchema.items.properties)) {
            item[name] = this.getDefaultValue(property);
        }

        return item;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormGenerator;
}
