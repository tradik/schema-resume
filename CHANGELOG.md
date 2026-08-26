# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed — site build

- `deploy-pages.yml` uses `cloudflare/wrangler-action@v4` with Wrangler pinned to 4.126.0 (v3 of
  the action installed Wrangler 3.90.0). The first `main` deploy after 1.3.0 failed before this
  mattered: the `cloudflare-pages` environment has no `CLOUDFLARE_API_TOKEN` /
  `CLOUDFLARE_ACCOUNT_ID` secrets — see `docs/SETUP.md`.

## [1.3.0] - 2026-08-26

Additive. Every document valid under 1.2.0 is still valid — see the
[migration guide](docs/MIGRATION_v1.3.md).

### Changed — packages

- All six validator packages (npm, PyPI, Go, Maven, RubyGems, Packagist) are **1.3.0** and ship
  the 1.3.0 `schema.json`, `meta-schema.json`, `context.jsonld` and XSD (`tools/sync-schema-files.sh`).
  The XSD carries `version="1.3.0"` to match.
- **npm** no longer calls `ajv.addMetaSchema()` — `schema.json` declares draft-07, which Ajv
  ships with. `metaSchema` is still exported.
- **Ruby** validates again. The `json-schema` gem implements draft-06 at most and refuses any
  `$schema` it does not know — it rejected the old `https://schema-resume.org/meta-schema.json`
  IRI just as it rejects draft-07 — so `Validator` now pins `version: :draft6` and validates a
  copy of the schema without the `$schema` key. Draft-07 adds nothing this schema relies on beyond
  `$comment`, which the gem ignores. The gem constraint is widened to `>= 4.0, < 7`.
  Note: the gem does not enforce `format: email`; type and structure errors are reported.

### Security

- **Java: `jackson-databind` 2.15.2 → 2.22.2.** Closes Dependabot alerts #1–#5 (two high:
  PolymorphicTypeValidator bypass via generic type parameters, array-subtype allowlist bypass;
  three medium: `@JsonIgnore` bypass with a `PropertyNamingStrategy`, case-insensitive
  `@JsonIgnoreProperties` bypass, eager DNS resolution on `InetSocketAddress` deserialization).
  Supersedes Dependabot PR #15, which only went to 2.18.9.

### Fixed — site build

- **The Pages build failed with `open content/site/metadata.json: no such file`.**
  `.gitignore` carried a MkDocs-style `site/` pattern that also matched `content/site/`, so
  the tool and legal pages documented in `docs/SETUP.md` were never committed. The pattern is
  now anchored to the repository root and `content/site/` is tracked: `metadata.json` plus
  `validator`, `converter`, `packages` (metadata only — the markup is in the theme) and the
  legal pages `privacy`, `terms` and `cookies` that the footer and the consent banner link to.
- CI builds with ssg 1.8.51 (was 1.8.23).

### Changed — repository

- `.github/dependabot.yml` was the unedited GitHub template (empty `package-ecosystem`), which
  Dependabot rejects. It now covers GitHub Actions, npm (root, `editor/`, `packages/npm`), pip,
  Go modules, Maven, Bundler and Composer, with weekly grouped updates.

### Changed — Java package

- `json-schema-validator` 1.0.87 → 1.5.9, JUnit 5.10.0 → 5.14.4, `maven-compiler-plugin`
  3.15.0, `maven-surefire-plugin` 3.5.6, `maven-jar-plugin` 3.5.1. Java 11 remains the minimum.
- `ResumeValidator` registers `https://schema-resume.org/meta-schema.json` as a Draft-07 dialect
  with the validator factory, so the embedded schema is never resolved over the network
  (networknt 1.5 tries to fetch an unknown `$schema` IRI; 1.0 silently ignored it). The public
  API is unchanged; `ValidationError.getPath()` now returns the JSON Pointer of the failing
  instance location (`/basics/email` rather than `$.basics.email`).
- Added a JUnit suite (`ResumeValidatorTest`) covering schema loading, a valid minimal resume,
  the repository `example.json`, format and type errors.

### Added — specification

- **`basics.demographics`** now holds `age`, `dateOfBirth` and `gender`. These are protected
  characteristics: in the UK and most of the EU a CV should not carry them, employers are
  advised not to request them, and gender may be special-category data under GDPR Article 9.
  They are not removed, because a German or Japanese CV conventionally carries a date of birth
  — grouping them makes including them a deliberate act, and lets a processor drop the whole
  object in one step. The old field names still validate, are marked `deprecated`, and are
  scheduled for removal in 2.0.0.

### Changed — specification

- **`$schema` now names the JSON Schema draft-07 dialect** instead of pointing at this
  project's own `meta-schema.json`. The old value could not be resolved by any validator, so
  `ajv compile -s schema.json`, `check-jsonschema` and IDE validation all failed, and every
  consumer had to register the meta-schema by hand (the npm package still calls
  `ajv.addMetaSchema()` for exactly this reason). `meta-schema.json` is unchanged in purpose
  and still published — it simply stops claiming to be a dialect. `$id` still identifies the
  schema as `https://schema-resume.org/schema.json`.
- **Removed 27 `additionalItems: false` keywords.** Every one sat beside a schema-form `items`,
  where draft-07 ignores `additionalItems` outright. They validated nothing and are removed from
  the specification entirely in 2020-12.
- **Removed the embedded `@context` from `schema.json`.** It held 14 terms: it covered 9 of the
  102 in the canonical `context.jsonld`, defined 7 that do not exist there, and contradicted it
  on `address`. A document's JSON-LD context should point at `context.jsonld`, which is
  unaffected.
- **Removed the non-standard top-level `version` keyword** from `schema.json` and
  `meta-schema.json`. The version is in `title` and in the pinned URL. Together with the two
  changes above, both files now compile under **ajv strict mode with no flags** — `npm test` no
  longer passes `--strict=false`.

### Added — specification

- **Version-pinned URLs.** Every release is published at a permanent address —
  `https://schema-resume.org/1.3/schema.json`, `/1.2/schema.json` and the same for
  `meta-schema.json`, `context.jsonld`, the examples and the XSD — alongside the floating
  `/schema.json`. The XML side has had `/xml/1.0/` since v1.0; the JSON side had no versioned
  address at all, so a breaking release would have invalidated every document pinned to
  `/schema.json` at once. Pinned URLs are served from committed snapshots under `versions/`,
  never from the live files, so a pin cannot change underneath a document. See
  [docs/VERSIONING.md](docs/VERSIONING.md).
- **`example-minimal.json`** — a 30-line document showing the smallest useful resume. The
  validator's "Example" button now loads it instead of the 31 kB reference document.
- **`SECURITY.md` and `/.well-known/security.txt`** (RFC 9116): scope, safe harbour and a
  private reporting route.

### Fixed — specification and tooling

- `npm test` failed at the repository root, on `main`, with
  `no schema with key or ref "https://schema-resume.org/meta-schema.json"`. CI never caught it
  because the release workflow runs `npm test` inside `packages/npm`.
- `tools/compare-schemas.py` printed four field counts in a column (126 / 94 / 82 / 115) that
  are measured in four different units — dotted paths, context terms, top-level properties and
  XML element names. Read as a comparison, they suggest the JSON-LD context covers three
  quarters of the schema. It covers all of it. The tool now reports coverage in comparable
  units and names any field that would produce no RDF triple.
- `tools/lint-schemas.py` treated a self-referential `$schema` as correct and warned when it was
  not. It now requires a recognised dialect.
- 108 field labels across six editor locales were squashed camelCase — `dateOfBirth` rendered as
  "Dateofbirth". The Spanish, French, Hindi and Japanese files carried the mangled English
  strings unchanged, which is worth knowing separately: those fields were never translated.

### Changed — website

- **The site is now generated by [spagu/ssg](https://github.com/spagu/ssg)** instead of being
  four hand-maintained HTML files copied verbatim to the host. Header, footer, `<head>` and
  social metadata live in one place; the packages page is generated from `data/packages.yaml`;
  and `docs/*.md` is published as HTML through `content_sources` rather than only downloadable
  as raw Markdown.
- **Every third-party CDN is gone.** The pages loaded six libraries from three CDNs, one of them
  (`lucide@latest`) unpinned and one (`ajv@6.12.6`) four years stale. All are pinned in
  `package-lock.json` and served from our own origin:
  - Tailwind's browser compiler (~100 kB of JavaScript that built CSS on every page load) is
    replaced by a hand-written stylesheet;
  - the complete Lucide icon set is replaced by the 26 glyphs actually used, inlined at build
    time (4.1 kB);
  - Ajv 6.12.6 is replaced by a bundled Ajv 8 plus `ajv-formats`;
  - Chart.js, Mermaid and `@tradik/xslt-processor` are vendored into the editor and loaded on
    first use rather than on every page load, which removes ~3.7 MB from the editor's initial
    load;
  - Google Fonts is dropped from the editor in favour of the platform UI font.
- **Deployment moved to Cloudflare Pages**, with a real build step in CI instead of uploading
  the repository as-is.
- **The design system is unified on the blue palette** (`#2563eb`). The validator and converter
  previously used a separate dark-red identity while carrying the blue `theme-color`.

### Added — website

- Cookie consent banner backed by an ssg Pages Function: geo-gated to the EEA and the UK,
  Consent Mode v2 defaults of `denied`, "Reject" the same weight as "Accept", and a
  proof-of-consent record that stores the IP only as a salted hash.
- Privacy policy, cookie policy and terms of use (`/privacy.html`, `/cookies.html`,
  `/terms.html`).
- A social preview image. Every page had referenced `/og-image.png` since v1.0; the file had
  never existed, so shares rendered as bare links.
- Build-time SEO and accessibility gates: internal link checking, `<title>`/description
  presence and length, image `alt` attributes, and orphan-page detection.
- `Makefile` with the full build, validation and release workflow.

### Fixed — website

- `/validator.html` was about to be overwritten by `docs/VALIDATOR.md`, which claimed the same
  slug once the documentation was published as HTML.
- Documentation URLs use hyphens instead of underscores (`/project-summary.html`, not
  `/project_summary.html`).
- Every page carried the same `<h1>` ("Schema Resume"), so no page had a heading describing its
  own subject. The brand is now a link, and the `<h1>` is the page title.
- The CV editor's header rendered its title twice ("Resume Editor Resume Editor"): the i18n code
  wrote the translated title into the whitespace after the link rather than into the link.
- The CV editor loaded the schema cross-origin from production and fell back to
  `editor/schema.json`, a second copy that had already drifted — it was missing
  `basics.legalNote`. That copy is deleted; the editor reads the one `schema.json`.
- The sitemap's `<lastmod>` came from the build date, telling crawlers every page changed on
  every deploy. It now comes from each file's last commit.
- **Canonical URLs now match what the host serves.** Cloudflare Pages serves `/validator.html`
  at `/validator` and answers the `.html` form with a `308`, so every canonical, `og:url`,
  JSON-LD `url` and sitemap entry named a URL the host redirects — the one thing a canonical
  must not do, and invisible locally because resolving against the output directory is not how
  Pages answers. The `.html` URLs published since v1.0 keep working; they `308` to the
  canonical form, carrying their link equity with them.
- **The editor's lazily-loaded libraries 404'd in production only.** `--fingerprint` renames
  JS and rewrites the references it can see; it cannot see string literals inside JavaScript,
  so Chart.js, Mermaid and the XSLT processor were requested under names that no longer
  existed. They now resolve through the build's asset manifest, which also keeps development
  builds working unchanged. The timeline, the tools chart and the XSLT fallback were all
  affected — and the fallback is the whole reason the wrapper exists on Chrome 143+.
- The home page had a "Getting Started" section and a "Quick Start" section that opened with the
  same snippet. They are one section.
- The CV editor offered no visible way back to the site; the only link was the title itself.
- Development scripts moved from the repository root into `tools/`.
- `docs/STYLE_GUIDE.md` and `docs/SEO.md` are removed. The style guide declared a red palette the
  site had already abandoned while its own contrast table measured the blue one; the design
  tokens and their measured ratios now live in `templates/schema-resume/css/tokens.css`, next to
  the code that uses them. The SEO guidance is enforced by the build instead of described.
- `docs/ALIGNMENT-SUMMARY.md`, `docs/DOMAIN-MIGRATION-SUMMARY.md` and `docs/PROJECT_SUMMARY.md`
  stay in the repository but are no longer published: they are working notes, not documentation.

### Added
- **Official packages for multiple programming languages**:
  - **NPM Package** (schema-resume-validator): JavaScript/TypeScript validator with full TypeScript definitions
  - **Python Package** (schema-resume-validator): Python validator with pip installation support
  - **Go Package** (github.com/tradik/schema-resume/validator): Go module with embedded schemas
  - **Java Package** (org.schema-resume:schema-resume-validator): Maven/Gradle compatible Java library
  - **Ruby Gem** (schema-resume-validator): Ruby gem with RubyGems distribution
  - **PHP Package** (schema-resume/validator): Composer package for PHP 8.0+
  - All packages include schema.json, meta-schema.json, context.jsonld, and schema-resume.xsd
  - Each package has comprehensive documentation with usage examples and validation guides
  - Packages support validation from JSON strings, objects, and files
- **Automated release workflow**:
  - GitHub Actions workflow for multi-language package releases (`.github/workflows/release-packages.yml`)
  - Matrix build strategy for parallel package publishing
  - Automated tagging and version management
  - Release to NPM, PyPI, Go modules, Maven Central, RubyGems, and Packagist
  - Automated GitHub release creation with comprehensive release notes
  - Release status summary job that reports success/failure for each package
  - Proper error handling - workflow now fails on authentication or publishing errors
- **Package documentation**:
  - Individual README.md for each package with installation and usage instructions
  - Code examples demonstrating validation in each language
  - API reference documentation for all packages
  - Error handling and troubleshooting guides
  - TESTING.md with comprehensive local testing instructions
  - MAINTENANCE.md with package maintenance and release procedures
- **Package maintenance tools**:
  - `sync-schema-files.sh` script to copy schema files to all packages
  - `test-packages.sh` automated testing script for all packages
  - Schema files are now copies instead of symlinks for better compatibility
  - Updated .gitignore to track package schema files
- **Python package improvements**:
  - Added MANIFEST.in to ensure all schema files are included in distribution
  - Added `--skip-existing` flag to PyPI upload to handle version conflicts gracefully
  - Improved package metadata and file inclusion configuration
- **legalNote field implementation**:
  - Added `legalNote` object to basics section in schema.json with properties: text, country, type, and url
  - Added `LegalNoteType` complex type to XSD schema (schema-resume.xsd)
  - Added JSON-LD mapping for legalNote in context.jsonld
  - Added legalNote examples to both example.json and example-with-local-context.json
  - Supports legal disclaimers, GDPR consent statements, and data processing notes with optional country-specific context
- **Google Analytics tracking**:
  - Added Google Analytics (gtag.js) tracking code to all HTML pages
  - Tracking ID: G-NG0TH0GXV1
  - Implemented on index.html, validator.html, and converter.html

### Changed
- **Design system update:
  - Updated color scheme to red (#990000) from blue
  - Changed primary font to Verdana 
  - Updated all HTML pages (index.html, validator.html, converter.html) with new design
  - Modified button styles with 10px border-radius and bold fonts
  - Updated code blocks to use tan/beige background (#eeddcc)
  - Changed card backgrounds to light gray (#eeeeee)
  - Updated STYLE_GUIDE.md to reflect design system
  - Maintained WCAG 2.2 accessibility compliance
  - Added Tailwind CSS configuration for colors in validator and converter pages
- **Primary domain migration**:
  - Changed primary domain from `https://tradik.github.io/schema-resume/` to `https://schema-resume.org/`
  - Updated all HTML files (index.html, validator.html, converter.html) with new canonical URLs and Open Graph metadata
  - Updated schema.json and meta-schema.json to use new primary domain in $id, $schema, and @context
  - Updated example files (example.json, example-with-local-context.json) to reference new domain
  - Updated XML schema (schema-resume.xsd) and example (example.xml) to use new namespace `https://schema-resume.org/xml/1.0`
  - Updated sitemap.xml with new primary URLs and xhtml:link alternate references to GitHub Pages
  - Updated robots.txt to reference both domains (primary and alternate)
  - GitHub Pages domain (`https://tradik.github.io/schema-resume/`) maintained as alternate/secondary domain
  - All files include $comment or annotations noting both domains for backward compatibility
- **workAuthorization structure** in basics section:
  - Changed from object to array to support multiple countries
  - Each entry now includes: country, status, rightToWork flag, visaType, validFrom, validTo, and notes
  - Allows specifying work authorization details separately for each country
  - More flexible structure for complex immigration scenarios

### Added
- **XML Schema (XSD) support**:
  - Added comprehensive XSD schema definition at `xml/1.0/schema-resume.xsd`
  - Created XML example file at `xml/1.0/example.xml`
  - Full support for all resume sections in XML format
  - Proper namespace definition: `https://tradik.github.io/schema-resume/xml/1.0`
  - ISO 8601 date format validation in XSD
  - Enumerated types for work types, proficiency levels, and language fluency
  - Country code validation (ISO-3166-1 ALPHA-2)
  - Comprehensive documentation in README.md with validation examples
  - Support for xmllint, Python (lxml), Java, and online validators
- **Converter tool**:
  - Added converter.html - real-time JSON to JSON-LD/XML converter
  - Dual-panel editor with live conversion as you type
  - Support for remote schema reference or inline context
  - JSON-LD output with Schema.org context
  - XML output with proper structure and escaping
  - Real-time validation with error reporting
  - Character and line count statistics
  - Copy to clipboard functionality
  - Load example data feature
- **Schema.org validation support**:
  - Added `@type` field to all schema sections for validator.schema.org compatibility
  - `@type` property in basics (schema:Person)
  - `@type` property in location (schema:PostalAddress)
  - `@type` property in profiles[] (schema:ContactPoint)
  - `@type` property in nationalities[] (schema:Country)
  - `@type` property in work[] (schema:Organization)
  - `@type` property in volunteer[] (schema:Organization)
  - `@type` property in education[] (schema:EducationalOrganization)
  - `@type` property in awards[] (schema:Award)
  - `@type` property in certificates[] (schema:EducationalOccupationalCredential)
  - `@type` property in publications[] (schema:Article)
  - `@type` property in skills[] (schema:DefinedTerm)
  - `@type` property in tools[] (schema:SoftwareApplication)
  - `@type` property in projects[] (schema:SoftwareApplication or schema:Event)
  - `@type` property in languages[] (schema:Language)
  - `@type` property in interests[] (schema:Thing)
  - `@type` property in references[] (schema:Review)
  - `streetAddress` property in location for Schema.org compliance (address kept for backwards compatibility)
  - Document-level `@type` property (e.g., "DigitalDocument") for document classification
  - Document-level `additionalType` property for additional type information
- **Documentation enhancements**:
  - Added SCHEMA-ORG-VALIDATION.md guide with complete @type mapping
  - Added second example file (example-with-local-context.json) demonstrating local context definition
  - Updated JSON-LD.md with @type requirements and examples
  - Added @type support to context.jsonld and meta-schema.json
- **Basics section enhancements**:
  - `title` field for honorific title or prefix (e.g., Dr., Prof., Mr., Ms., Mx.)
  - `dateOfBirth` field for date of birth in ISO 8601 format
  - `age` field for current age in years (integer)
  - `placeOfBirth` object for birthplace location with city, county, state, province, region, country, and countryCode
  - `sex` field for biological sex or gender identity
  - `legalNote` object for legal disclaimers or notes with country-specific context
  - `keyAchievements` array for notable career achievements
  - `coreCompetencies` array for core professional competencies and areas of expertise
- **Education section enhancements**:
  - `school` field (alias for `institution`)
  - `degree` field (alias for `studyType`)
  - `description` field for additional educational details
  - `gpa` field (alias for `score`)
  - `location` field for institution's geographic location
  - `country` field for institution's country (ISO-3166-1 ALPHA-2)
- **Tools section enhancements**:
  - `group` field for categorizing tools (e.g., "Monitoring & Logging", "Web & Servers")
  - `category` field (alias for `group`)
  - `level` field for proficiency level with the tool
- **Work experience enhancements**:
  - `industry` field for industry sector or business domain (e.g., 'Financial Technology', 'Healthcare', 'E-commerce')
  - `location` object for structured workplace address with:
    - `address` - Street address
    - `city` - City name
    - `region` - State/province/region
    - `postalCode` - Postal/ZIP code
    - `countryCode` - ISO-3166-1 ALPHA-2 country code
    - `country` - Full country name (optional)
    - `@type` - Schema.org type (schema:PostalAddress)
  - `contactDetails` object for organization contact information with:
    - `email` - Organization contact email
    - `phone` - Organization contact phone
    - `fax` - Organization fax number (optional)
  - `workLocation` field retained for backward compatibility (use `location` object for structured data)
  - `workType` field for work arrangement type with multiple options:
    - Location: remote, hybrid, onsite
    - Employment: full-time, part-time, contract, freelance, internship, temporary
- **Meta section enhancements**:
  - `dateCreated` field for document creation timestamp in ISO 8601 format

### Planned
- TypeScript type definitions
- Resume builder web application
- Export to PDF functionality
- Resume comparison tools
- Multiple resume versions support

## [1.2.0] - 2026-07-15

### Added
- **`positions` array in the `work` section** ([#11](https://github.com/tradik/schema-resume/issues/11)):
  - Represent multiple roles held at the **same** organization over time (career progression / promotions) without repeating organization-level details such as `name`, `location`, `url`, and `industry`
  - Each position entry supports `@type` (`schema:EmployeeRole`), `position`, `workType`, `startDate`, `endDate`, `summary`, and `highlights`
  - Fully **additive and backwards compatible**: the singular top-level `position`, `startDate`, `endDate`, `summary`, and `highlights` fields remain valid for single-role entries
  - Mirrored across all schema representations: `schema.json`, `editor/schema.json`, `context.jsonld` (mapped to `schema:hasOccupation`), and the XSD (`PositionListType` / `PositionType`)
  - New examples in `example.json`, `example-with-local-context.json`, and `xml/1.0/example.xml`
- **Positions validation test suite** (`tests/positions/`) with valid and invalid fixtures and a runner script (`run-positions-tests.sh`)
- **Migration guide** `docs/MIGRATION_v1.2.md` describing how to adopt the `positions` array

### Fixed
- **XSD `LegalNoteType` was undefined**: the `legalNote` element in `BasicsType` referenced a `sr:LegalNoteType` complex type that did not exist, which prevented `schema-resume.xsd` from compiling as a valid XSD. Added the missing `LegalNoteType` definition so the XSD now compiles and validates cleanly.

### Changed
- Bumped schema version from **1.1.0 → 1.2.0** across `schema.json`, `meta-schema.json`, `editor/schema.json`, `xml/1.0/schema-resume.xsd`, `package.json`, `index.html`, `validator.html`, and `README.md`

## [1.1.1] - 2025-10-09

### Added
- **Online Validator/Linter** (`validator.html`)
  - Real-time JSON Schema validation against Schema Resume v1.1.0
  - JSON-LD compatibility checks for @context and Schema.org mapping
  - ISO 8601 date format validation
  - Detailed error messages with suggestions
  - Example CV loader for quick testing
  - JSON formatting tool
  - CV statistics display
  - Modern UI with TailwindCSS and Lucide icons
  - Responsive design for mobile and desktop
  - Hosted at: `https://tradik.github.io/schema-resume/validator.html`
- **Unified header across all pages**:
  - Updated validator.html and converter.html with same header design as index.html
  - Consistent red header with logo and navigation links
  - Active page highlighting in navigation
  - Page title section below header on all pages
  - Improved navigation consistency across the site
- **Unified footer across all pages**:
  - Updated validator.html and converter.html with same footer design as index.html
  - Consistent styling with red links (#990000)
  - Same link structure: GitHub, Issues, License, Validator, Converter
  - Verdana font and gray text (#737373)
  - Hover effects on footer links
  - Complete visual consistency across all pages

### Changed
- Updated README.md with online validator section
- Updated roadmap to mark JSON-LD context and validator as completed

## [1.1.0] - 2025-10-09

### Added
- **nationalities** field in basics section for citizenship information
  - Country code using ISO-3166-1 ALPHA-2
  - Born flag to indicate country of birth
- **workAuthorization** field in basics section
  - `rightToWork` array for countries with unrestricted work rights
  - `visas` array for active work visas and permits with expiration dates
- **yearsOfExperience** field in skills section
- **comment** field in skills section for additional context
- **tools** section for specific software and platforms
  - Tool name
  - Years of experience
  - Comment field for usage details
  - URL to tool documentation

### Changed
- Updated example.json with new fields and UK-focused data
- Enhanced skills section with experience tracking
- Improved documentation for work authorization scenarios

## [1.0.0] - 2025-10-09

### Added
- Initial release of Schema Resume
- Self-hosted JSON Schema with custom meta-schema (no external dependencies)
- JSON-LD context for semantic web integration
- Schema.org vocabulary mapping
- Original descriptions for all schema fields (no copied content)
- Comprehensive resume sections:
  - `basics`: Personal information and contact details
  - `work`: Work experience and employment history
  - `volunteer`: Volunteer work and community involvement
  - `education`: Academic background and qualifications
  - `awards`: Professional awards and recognitions
  - `certificates`: Professional certifications
  - `publications`: Published works and articles
  - `skills`: Technical and professional skills
  - `languages`: Language proficiencies
  - `interests`: Personal interests and hobbies
  - `references`: Professional references
  - `projects`: Personal and professional projects
  - `meta`: Schema metadata and versioning
- ISO 8601 date format with flexible precision (year, year-month, full date)
- Extensible schema with `additionalProperties: true`
- Comprehensive field descriptions and examples
- Example resume JSON file (`example.json`)
- JSON-LD context file (`context.jsonld`)
- Self-hosted meta-schema (`meta-schema.json`)
- README.md with usage instructions and integration examples
- GitHub Pages hosting configuration
- Schema URLs:
  - Main schema: `https://tradik.github.io/schema-resume/schema.json`
  - Meta schema: `https://tradik.github.io/schema-resume/meta-schema.json`
  - JSON-LD context: `https://tradik.github.io/schema-resume/context.jsonld`

### Documentation
- Complete README with usage examples
- Integration examples for Node.js, Python, and PHP
- Field descriptions table
- Validation instructions
- Contributing guidelines
- Roadmap and future plans

### Infrastructure
- GitHub repository setup
- GitHub Pages configuration
- MIT License
- Version tracking with CHANGELOG.md

## [0.1.0] - 2025-10-09

### Added
- Initial schema structure
- Basic field definitions
- Draft schema for internal review

---

## Version History Summary

- **1.0.0** (2025-10-09): Initial public release with complete schema and documentation
- **0.1.0** (2025-10-09): Initial draft version

## Migration Guides

### Migrating to 1.0.0

This is the first stable release. If you were using an earlier draft version:

1. Update your `$schema` reference to: `https://tradik.github.io/schema-resume/schema.json`
2. Ensure all dates follow ISO 8601 format (YYYY-MM-DD, YYYY-MM, or YYYY)
3. Review the example.json file for proper structure
4. Validate your resume JSON against the new schema

## Contributing

When contributing changes:

1. Update this CHANGELOG.md with your changes under the `[Unreleased]` section
2. Follow the format: `### Added/Changed/Deprecated/Removed/Fixed/Security`
3. Include the date when releasing a new version
4. Move items from `[Unreleased]` to the new version section
5. Update version numbers according to Semantic Versioning

### Version Numbering

- **MAJOR** version: Incompatible schema changes
- **MINOR** version: New fields or features in a backwards-compatible manner
- **PATCH** version: Backwards-compatible bug fixes or documentation updates

---

[Unreleased]: https://github.com/tradik/schema-resume/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tradik/schema-resume/releases/tag/v1.0.0
[0.1.0]: https://github.com/tradik/schema-resume/releases/tag/v0.1.0
