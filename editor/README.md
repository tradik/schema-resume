# UI Resume Editor

A modern, accessible, single-page resume editor built with vanilla JavaScript. Based on JSON Resume Schema with XSLT template rendering.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WCAG 2.2](https://img.shields.io/badge/WCAG-2.2_AA-green.svg)](https://www.w3.org/WAI/WCAG22/quickref/)

## Features

- 📝 Visual resume editor with JSON Resume Schema support
- 🎨 Multiple XSLT templates (Classic, Professional)
- 🌍 Internationalization (i18n) with multiple language support
- 📊 Career timeline visualization (Mermaid.js)
- 📈 Tools experience chart (Chart.js)
- 📄 PDF export and print support
- 💾 LocalStorage persistence
- 🔗 URL parameter support for data loading
- ♿ WCAG 2.2 accessible design

## Browser Compatibility

The editor works on all modern browsers:
- Chrome 90+ (with polyfill for Chrome 143+ deprecation)
- Firefox 88+
- Safari 14+
- Edge 90+

### Chrome XSLT Deprecation Notice

Starting with Chrome 143 (December 2025), Google is deprecating native `XSLTProcessor` support. This application uses a JavaScript XSLT polyfill (`xslt-processor`) that automatically loads when native support is unavailable.

**Timeline:**
- Chrome 143 (Dec 2025): Deprecation warnings
- Chrome 155 (Nov 2026): Native XSLT disabled
- Chrome 164 (Aug 2027): Complete removal

The polyfill ensures the editor continues to work seamlessly across all browsers.

## Quick Start

### Development Server

```bash
# Using Python
npm run start
# or
python3 -m http.server 8000

# Open http://localhost:8000 in your browser
```

### Docker

```bash
# Build and run
npm run docker:build
npm run docker:run

# Stop
npm run docker:stop
```

## Project Structure

```
src/
├── app.js              # Main application logic
├── form-generator.js   # Dynamic form generation from schema
├── i18n.js             # Internationalization manager
├── xslt-wrapper.js     # XSLT processor with polyfill fallback
├── styles.css          # Main stylesheet
└── i18n/               # Language files
    ├── en-GB.json
    ├── en-US.json
    ├── de-DE.json
    ├── pl-PL.json
    └── ...

templates/
├── resume.xslt              # Classic template
├── resume-professional.xslt # Professional template
└── resume-fo.xslt           # FO template for PDF generation
```

## URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `data` | Base64-encoded JSON resume data | `?data=eyJiYXNpY3MiOi...` |
| `url` | URL to fetch JSON resume from | `?url=https://example.com/resume.json` |
| `for` | Company name (sets output filename and title) | `?for=Acme_Corp` |
| `lang` | UI language code | `?lang=pl-PL` |
| `type` | Mode (dev for development features) | `?type=dev` |

## Design System

### Colors

The application uses a modern color palette with WCAG 2.2 AA compliant contrast ratios:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#4361ee` | Buttons, links, accents |
| Success | `#10b981` | Success states, download buttons |
| Danger | `#dc3545` | Error states, delete actions |
| Background | `#f8fafc` | Page background |
| Surface | `#ffffff` | Cards, panels |
| Text | `#1e293b` | Primary text |
| Muted | `#64748b` | Secondary text |

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

## Scripts

```bash
npm run start        # Start development server
npm run format       # Format code with Prettier
npm run lint         # Lint JavaScript with ESLint
npm run lint:css     # Lint CSS with Stylelint
npm run validate     # Validate JSON files
```

## License

MIT License - see LICENSE file for details.

## Related Projects

- [JSON Resume Schema](https://jsonresume.org/)
- [schema-resume.org](https://schema-resume.org/)
