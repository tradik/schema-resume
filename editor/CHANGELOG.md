# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.3] - 2026-01-27

### Added
- **Extended HTML debug output** - Added additional console logging to show actual HTML content
  - Logs first 3000 chars of serialized HTML from XSLT transformation
  - Logs first 2000 chars of rendered preview innerHTML
  - Logs total number of div elements found in output
  - Helps identify if XSLT transformation produces empty sections

## [1.2.2] - 2026-01-27

### Fixed
- **Improved XSLT result extraction** - Fixed issue where only `basics.name` was visible in preview
  - Serialize DocumentFragment to HTML string for reliable cross-browser parsing
  - Added fallback for `.resume-container` when `<body>` element is not found
  - Added comprehensive debug logging for data sections, XML generation, and HTML output
  - Fixed HTML structure extraction to properly handle different browser behaviors

### Added
- **Enhanced debugging** - Added detailed console logging for troubleshooting
  - Logs data sections present (work, education, skills counts)
  - Logs generated XML length and preview
  - Logs found section titles and work items in output

## [1.2.1] - 2026-01-27

### Changed
- **Switched to @tradik/xslt-processor CDN** - Updated XSLT library loading to use jsDelivr CDN
  - Uses `https://cdn.jsdelivr.net/npm/@tradik/xslt-processor@1/dist/xslt-processor.browser.min.js`
  - Library replaces global XSLTProcessor after loading (1:1 native API compatibility)
  - Automatic fallback when native XSLT is deprecated/unavailable
  - Removed local file dependency - no need to bundle library with app

## [1.2.0] - 2026-01-27

### Changed
- **Switched to local xslt-processor library** - Replaced external CDN dependency with local JavaScript XSLT implementation
  - Uses `XsltProcessorLib` from `/services/xslt-processor/`
  - Native-compatible API (1:1 with browser XSLTProcessor)
  - Automatic fallback when native XSLT is deprecated/unavailable
  - Removed dependency on DesignLiquido/xslt-processor which had compatibility issues
  - Renamed internal variables from "polyfill" to "library" terminology

## [1.1.1] - 2026-01-27

### Fixed
- **Chrome 145+ XSLT compatibility** - Fixed "xsltProcess is not a function" error
  - Added runtime detection for non-functional XSLTProcessor (Chrome 145+ has defined but broken XSLTProcessor)
  - Changed to xslt-processor v2.3.1 UMD build from unpkg CDN (ESM builds have bundling issues)
  - Uses script tag injection instead of dynamic import for reliability
  - API: `XmlParser.xmlParse()` + `Xslt.xsltProcess()`
  - `checkNativeSupport()` now performs actual transformation test instead of just checking if XSLTProcessor exists
  - `renderPreview()` is now async to support async transformation

## [1.1.0] - 2026-01-26

### Added
- **JavaScript XSLT Polyfill** - Implemented `XsltProcessorWrapper` class that provides automatic fallback to JavaScript-based XSLT processing when native `XSLTProcessor` is not available
  - Uses native `XSLTProcessor` when available (best performance)
  - Falls back to `xslt-processor` library from CDN when native is unavailable
  - Chrome 143+ deprecates native XSLT support, full removal planned for Chrome 164 (August 2027)
  - Works seamlessly in Firefox, Safari, Edge and older Chrome versions

### Fixed
- **PDF Download 404 error** - Fixed XSLT template path for PDF generation to use relative path instead of absolute
  - Changed `/templates/resume-fo.xslt` to `templates/resume-fo.xslt` to respect `<base>` href
  - PDF download now works correctly when app is served at subpaths like `/resume-editor/`
- **XSLTProcessor compatibility** - Application now works in browsers that have deprecated native XSLT support
  - Added `xsltInitialized` flag for proper initialization tracking
  - Added retry limit (50 retries / 5 seconds) to prevent infinite retry loops
  - Improved error messages with "Refresh Page" button
  - Console logging shows which XSLT processor is being used (native vs polyfill)

### Changed
- Refactored `loadXSLT()` to use `XsltProcessorWrapper` instead of direct `XSLTProcessor` usage
- Refactored `renderPreview()` to check `xsltInitialized` flag
- Error messages updated to reflect new architecture

## [1.0.0] - Initial Release

### Added
- Visual resume editor based on JSON Resume Schema
- XSLT template rendering for resume preview
- Multiple template support (Classic, Professional)
- i18n internationalization support
- Timeline visualization feature
- Tools chart feature
- Export to JSON, PDF
- Import from JSON, LinkedIn
- LocalStorage persistence
- URL parameter support for data loading
- Responsive design with resizable panels
