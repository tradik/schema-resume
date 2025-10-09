# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- JSON-LD context for semantic web integration
- TypeScript type definitions
- Resume builder web application
- Export to PDF functionality
- Resume comparison tools
- Multiple resume versions support

## [1.0.0] - 2025-10-09

### Added
- Initial release of Schema Resume
- Self-hosted JSON Schema with custom meta-schema (no external dependencies)
- JSON-LD context for semantic web integration
- Schema.org vocabulary mapping
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
