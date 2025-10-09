# Schema Resume

[![JSON Schema](https://img.shields.io/badge/JSON%20Schema-draft--07-blue.svg)](https://json-schema.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success.svg)](https://tradik.github.io/schema-resume/)
[![Validation](https://img.shields.io/badge/Schema-Valid-brightgreen.svg)](https://tradik.github.io/schema-resume/schema.json)

A comprehensive, self-hosted JSON-LD schema for CV/Resume parsing and validation. This schema provides a standardized format for representing professional resumes in JSON format with semantic web integration, making it easy to parse, validate, and exchange resume data between systems without relying on external schema definitions.

## 🚀 Features

- **Comprehensive Coverage**: Supports all standard resume sections including work experience, education, skills, certifications, publications, and more
- **Flexible Date Format**: ISO 8601 date format with optional precision (year, year-month, or full date)
- **Extensible**: Additional properties allowed for custom fields
- **Well-Documented**: Detailed descriptions and examples for all fields
- **Self-Hosted**: Complete validation without external dependencies
- **JSON-LD Compatible**: Semantic web integration with Schema.org mapping
- **GitHub Pages Hosted**: Publicly accessible schema URL for validation

## 📋 Schema Sections

The schema includes the following main sections:

- **basics**: Personal information, contact details, social profiles, nationalities, and work authorization
- **work**: Work experience and employment history
- **volunteer**: Volunteer work and community involvement
- **education**: Academic background and qualifications
- **awards**: Professional awards and recognitions
- **certificates**: Professional certifications
- **publications**: Published works and articles
- **skills**: Technical and professional skills with experience levels
- **tools**: Specific software and tools used professionally
- **languages**: Language proficiencies
- **interests**: Personal interests and hobbies
- **references**: Professional references
- **projects**: Personal and professional projects
- **meta**: Schema metadata and versioning

## 🔗 Schema URLs

The schema and related files are hosted on GitHub Pages:

- **Main Schema**: `https://tradik.github.io/schema-resume/schema.json`
- **Meta Schema**: `https://tradik.github.io/schema-resume/meta-schema.json`
- **JSON-LD Context**: `https://tradik.github.io/schema-resume/context.jsonld`

The schema is **self-contained** and does not rely on external JSON Schema definitions.

## 📖 Usage

### Basic Example

Create a JSON file with your resume data and reference the schema:

```json
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "John Doe",
    "label": "Software Engineer",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "url": "https://johndoe.dev",
    "summary": "Experienced software engineer with 10+ years in full-stack development.",
    "location": {
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "johndoe",
        "url": "https://linkedin.com/in/johndoe"
      }
    ]
  },
  "work": [
    {
      "name": "Tech Corp",
      "position": "Senior Software Engineer",
      "startDate": "2020-03",
      "summary": "Lead development of microservices architecture",
      "highlights": [
        "Reduced API response time by 40%",
        "Mentored team of 5 junior developers"
      ]
    }
  ],
  "skills": [
    {
      "name": "Backend Development",
      "level": "Expert",
      "keywords": ["Node.js", "Python", "PostgreSQL"]
    }
  ]
}
```

See [example.json](./example.json) for a complete example.

### Validation

You can validate your resume JSON against this schema using various tools:

#### Using AJV (Node.js)

```bash
# Install AJV CLI globally
npm install -g ajv-cli ajv-formats

# Validate against local schema
ajv validate -s schema.json -d your-resume.json --strict=false

# Validate against hosted schema
ajv validate -s https://tradik.github.io/schema-resume/schema.json -d your-resume.json --strict=false
```

#### Using Python

```python
import json
import jsonschema
import requests

# Load schema
schema_url = "https://tradik.github.io/schema-resume/schema.json"
schema = requests.get(schema_url).json()

# Load your resume
with open('your-resume.json') as f:
    resume = json.load(f)

# Validate
jsonschema.validate(instance=resume, schema=schema)
print("Resume is valid!")
```

#### Using Online Validators

- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
- [JSON Schema Lint](https://jsonschemalint.com/)

## 📚 Field Descriptions

### Basics Section

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Full name |
| `label` | string | Professional title (e.g., "Web Developer") |
| `image` | string | URL to profile photo (JPEG or PNG) |
| `email` | string | Email address |
| `phone` | string | Phone number (any format) |
| `url` | string | Personal website URL |
| `summary` | string | Professional summary (2-3 sentences) |
| `location` | object | Address and location details |
| `profiles` | array | Social media profiles |
| `nationalities` | array | Citizenship information with country codes and birth country |
| `workAuthorization` | object | Work authorization including right to work countries and active visas |

### Work Section

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Company name |
| `location` | string | Work location |
| `description` | string | Company description |
| `position` | string | Job title |
| `url` | string | Company website |
| `startDate` | string | Start date (ISO 8601) |
| `endDate` | string | End date (ISO 8601, optional for current position) |
| `summary` | string | Role overview |
| `highlights` | array | Key accomplishments |

### Skills Section

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill category (e.g., "Web Development") |
| `level` | string | Proficiency level (e.g., "Expert", "Advanced") |
| `yearsOfExperience` | number | Years of practical experience with this skill |
| `comment` | string | Additional context or notes about the skill |
| `keywords` | array | Specific technologies and tools |

### Tools Section

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the tool or software |
| `yearsOfExperience` | number | Years using this tool professionally |
| `comment` | string | Additional details about usage and proficiency |
| `url` | string | Link to the tool's website or documentation |

For complete field descriptions, see the [schema.json](./schema.json) file.

## 🎨 Date Format

Dates follow ISO 8601 format with flexible precision:

- Full date: `2024-03-15`
- Year and month: `2024-03`
- Year only: `2024`

This allows representing dates when exact day or month is not relevant.

## 🔧 Integration Examples

### Node.js/TypeScript

```typescript
import Ajv from 'ajv';
import schema from './schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const resume = {
  // Your resume data
};

if (validate(resume)) {
  console.log('Resume is valid!');
} else {
  console.error('Validation errors:', validate.errors);
}
```

### Python

```python
import json
from jsonschema import validate, ValidationError

with open('schema.json') as schema_file:
    schema = json.load(schema_file)

with open('resume.json') as resume_file:
    resume = json.load(resume_file)

try:
    validate(instance=resume, schema=schema)
    print("Resume is valid!")
except ValidationError as e:
    print(f"Validation error: {e.message}")
```

### PHP

```php
<?php
use JsonSchema\Validator;
use JsonSchema\Constraints\Constraint;

$resume = json_decode(file_get_contents('resume.json'));
$schema = json_decode(file_get_contents('schema.json'));

$validator = new Validator();
$validator->validate($resume, $schema, Constraint::CHECK_MODE_NORMAL);

if ($validator->isValid()) {
    echo "Resume is valid!\n";
} else {
    foreach ($validator->getErrors() as $error) {
        echo sprintf("[%s] %s\n", $error['property'], $error['message']);
    }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow clean code principles (SRP, DRY, KISS, YAGNI)
- Update CHANGELOG.md for all changes
- Ensure schema remains valid JSON Schema Draft 07
- Add examples for new fields
- Update documentation
- Follow [STYLE_GUIDE.md](./STYLE_GUIDE.md) for design and accessibility

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [JSON Resume](https://jsonresume.org/) - Similar resume schema project
- [JSON-LD](https://json-ld.org/) - JSON for Linking Data
- [Schema.org Person](https://schema.org/Person) - Schema.org vocabulary for people

## 🌐 JSON-LD & Semantic Web

Schema Resume includes full JSON-LD support for semantic web integration. See [JSON-LD.md](./JSON-LD.md) for:
- Schema.org vocabulary mapping
- RDF conversion examples
- SPARQL query examples
- Integration with knowledge graphs

## 📞 Support

For questions, issues, or suggestions:

- Open an [issue](https://github.com/tradik/schema-resume/issues)
- Submit a [pull request](https://github.com/tradik/schema-resume/pulls)

## 🎯 Roadmap

- [ ] Add JSON-LD context for semantic web integration
- [ ] Create TypeScript type definitions
- [ ] Add validation examples for more languages
- [ ] Create resume builder web application
- [ ] Add support for multiple resume versions
- [ ] Implement resume comparison tools
- [ ] Add export to PDF functionality
- [ ] Create resume templates

## 📊 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## 🌟 Acknowledgments

This schema is inspired by and compatible with the [JSON Resume](https://jsonresume.org/) project, with additional fields and enhanced validation rules for comprehensive CV parsing.

---

**Made with ❤️ for the developer community**
