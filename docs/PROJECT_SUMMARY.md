---
title: "Project Summary"
slug: "project-summary"
status: "publish"
type: "page"
description: "What Schema Resume is, what ships with it, and how the specification, the validator packages and the browser tools fit together."
categories: [Documentation]
modified: 2026-08-06
---
# Schema Resume - Project Summary

## 🎯 Project Overview

**Schema Resume** is a self-hosted JSON-LD schema for CV/Resume parsing and validation, designed to be completely independent of external schema definitions while providing semantic web integration.

## ✨ Key Features

### 1. Self-Hosted Architecture
- **No external dependencies**: All schema definitions are hosted within the repository
- **Custom meta-schema**: `meta-schema.json` provides validation rules without relying on json-schema.org
- **Complete control**: Full ownership of the validation and schema evolution

### 2. JSON-LD Integration
- **Semantic web ready**: Full JSON-LD context for RDF conversion
- **Schema.org mapping**: All fields mapped to Schema.org vocabulary
- **Knowledge graph compatible**: Can be integrated into semantic databases

### 3. Comprehensive Coverage
- 13 main sections covering all aspects of a professional resume
- Flexible ISO 8601 date format (year, year-month, full date)
- Extensible with `additionalProperties: true`

## 📁 Repository Structure

```
schema-resume/
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml       # GitHub Pages deployment
│       └── validate-schema.yml    # Schema validation CI
├── schema.json                    # Main schema with JSON-LD context
├── meta-schema.json              # Self-hosted meta-schema
├── context.jsonld                # Standalone JSON-LD context
├── example.json                  # Complete example resume
├── index.html                    # GitHub Pages landing page
├── package.json                  # NPM configuration
├── README.md                     # Main documentation
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guidelines
├── SETUP.md                      # Setup instructions
├── JSON-LD.md                    # JSON-LD integration guide
├── LICENSE                       # MIT License
├── .gitignore                    # Git ignore rules
├── .dockerignore                 # Docker ignore rules
├── .editorconfig                 # Editor configuration
└── .nvmrc                        # Node version specification
```

## 🌐 Hosted URLs

All files are publicly accessible via GitHub Pages:

- **Main Schema**: `https://tradik.github.io/schema-resume/schema.json`
- **Meta Schema**: `https://tradik.github.io/schema-resume/meta-schema.json`
- **JSON-LD Context**: `https://tradik.github.io/schema-resume/context.jsonld`
- **Website**: `https://tradik.github.io/schema-resume/`
- **Example**: `https://tradik.github.io/schema-resume/example.json`

## 🔧 Technical Details

### Schema Structure

The schema includes:
- **@context**: JSON-LD context for semantic web integration
- **$schema**: Reference to self-hosted meta-schema
- **$id**: Canonical URL for the schema
- **definitions**: Reusable patterns (e.g., ISO 8601 dates)
- **properties**: 13 main sections for resume data

### Validation Flow

1. Resume JSON references `schema.json`
2. `schema.json` references `meta-schema.json` for validation rules
3. `meta-schema.json` provides complete validation without external dependencies
4. Optional: `context.jsonld` enables RDF conversion

### JSON-LD Features

- Schema.org vocabulary mapping for all fields
- RDF conversion support
- SPARQL query compatibility
- Knowledge graph integration
- Search engine optimization (SEO) ready

## 📊 Resume Sections

1. **basics**: Personal information, contact details, profiles, nationalities, and work authorization
2. **work**: Employment history and achievements
3. **volunteer**: Volunteer work and community involvement
4. **education**: Academic background and qualifications
5. **awards**: Professional awards and recognitions
6. **certificates**: Professional certifications
7. **publications**: Published works and articles
8. **skills**: Technical and professional skills with proficiency levels and experience tracking
9. **tools**: Specific software and platforms with years of experience
10. **languages**: Language proficiencies
11. **interests**: Personal interests and hobbies
12. **references**: Professional references
13. **projects**: Personal and professional projects
14. **meta**: Schema metadata and versioning

## 🎨 Design Principles

### Clean Code
- **SRP**: Single Responsibility Principle
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple
- **YAGNI**: You Ain't Gonna Need It
- **SOC**: Separation of Concerns

### Accessibility
- **WCAG 2.2 Level AA** compliant
- Contrast ratios exceed minimum requirements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

### Documentation
- Comprehensive README with examples
- Detailed field descriptions
- Integration examples for multiple languages
- Contributing guidelines
- Style guide for design consistency

## 🚀 Getting Started

### For Users

1. Reference the schema in your resume JSON:
```json
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "basics": { ... }
}
```

2. Validate using AJV:
```bash
npm install -g ajv-cli
ajv validate -s https://tradik.github.io/schema-resume/schema.json -d your-resume.json
```

### For Developers

1. Clone the repository:
```bash
git clone https://github.com/tradik/schema-resume.git
cd schema-resume
```

2. Install dependencies:
```bash
npm install
```

3. Run validation:
```bash
npm test
```

## 🔄 CI/CD Pipeline

### Validation Workflow
- Runs on every push and PR
- Validates schema structure
- Validates example against schema
- Checks JSON formatting

### Deployment Workflow
- Runs on push to main branch
- Deploys to GitHub Pages
- Makes all files publicly accessible

## 📈 Use Cases

1. **Job Boards**: Standardized resume format for applicant data
2. **ATS Systems**: Easy parsing and validation of candidate resumes
3. **Resume Builders**: Schema-compliant resume generation
4. **HR Systems**: Integration with existing HR platforms
5. **Knowledge Graphs**: Semantic web integration for professional networks
6. **Research**: Academic studies on career data
7. **Analytics**: Resume data analysis and insights

## 🌟 Advantages Over Alternatives

### vs. JSON Resume
- Self-hosted (no external dependencies)
- JSON-LD integration
- Schema.org mapping
- Custom meta-schema
- More comprehensive documentation

### vs. Schema.org Person
- Specifically designed for resumes/CVs
- More detailed work experience structure
- Skills with proficiency levels
- Project tracking
- Certificate management

## 🔮 Future Roadmap

- [ ] TypeScript type definitions
- [ ] Resume builder web application
- [ ] PDF export functionality
- [ ] Resume comparison tools
- [ ] Multiple resume versions support
- [ ] Dark mode for website
- [ ] Additional language examples
- [ ] GraphQL API integration examples

## 📝 Version History

- **v1.1.0** (2025-10-09): Added nationalities, work authorization, tools section, and enhanced skills tracking
- **v1.0.0** (2025-10-09): Initial release with self-hosted schema and JSON-LD support

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [JSON Resume](https://jsonresume.org/)
- Uses [Schema.org](https://schema.org/) vocabulary
- Follows [JSON-LD](https://json-ld.org/) specification

## 📞 Contact

- **Repository**: https://github.com/tradik/schema-resume
- **Issues**: https://github.com/tradik/schema-resume/issues
- **Website**: https://tradik.github.io/schema-resume/

---

**Made with ❤️ for the developer community**

*Last Updated: 2025-10-09*
