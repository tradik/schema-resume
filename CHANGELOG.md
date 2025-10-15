# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
