# schema-resume-validator

[![PyPI version](https://img.shields.io/pypi/v/schema-resume-validator.svg)](https://pypi.org/project/schema-resume-validator/)
[![Python versions](https://img.shields.io/pypi/pyversions/schema-resume-validator.svg)](https://pypi.org/project/schema-resume-validator/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Python package for validating resumes against the [Schema Resume](https://schema-resume.org/) JSON Schema.

## Installation

```bash
pip install schema-resume-validator
```

For XML validation support:

```bash
pip install schema-resume-validator[xml]
```

## Usage

### Basic Validation

```python
from schema_resume import validate_resume

resume = {
    "$schema": "https://schema-resume.org/schema.json",
    "basics": {
        "name": "John Doe",
        "label": "Software Engineer",
        "email": "john.doe@example.com"
    },
    "work": [
        {
            "name": "Tech Corp",
            "position": "Senior Developer",
            "startDate": "2020-01"
        }
    ]
}

result = validate_resume(resume)

if result["valid"]:
    print("✓ Resume is valid!")
else:
    print("✗ Validation errors:")
    for error in result["errors"]:
        print(f"  - {error['path']}: {error['message']}")
```

### Using the Validator Class

```python
from schema_resume import ResumeValidator

# Create validator instance
validator = ResumeValidator()

# Validate from dictionary
resume_data = {"basics": {"name": "Jane Doe"}}
result = validator.validate(resume_data)

# Validate from JSON file
result = validator.validate("path/to/resume.json")

# Validate from JSON string
json_string = '{"basics": {"name": "John Smith"}}'
result = validator.validate(json_string)

# Access schema files
schema = validator.get_schema()
meta_schema = validator.get_meta_schema()
context = validator.get_context()
```

### Custom Schema

```python
from pathlib import Path
from schema_resume import ResumeValidator

# Use custom schema file
validator = ResumeValidator(schema_path=Path("custom-schema.json"))
result = validator.validate(resume_data)
```

## API Reference

### `validate_resume(resume)`

Convenience function to validate a resume.

**Parameters:**
- `resume`: Resume data as dict, JSON string, or Path to JSON file

**Returns:** Dictionary with:
- `valid` (bool): Whether the resume is valid
- `errors` (list): List of validation errors (empty if valid)

### `ResumeValidator`

Main validator class.

#### `__init__(schema_path=None)`

Initialize validator with optional custom schema.

**Parameters:**
- `schema_path` (optional): Path to custom schema file

#### `validate(resume)`

Validate a resume document.

**Parameters:**
- `resume`: Resume data as dict, JSON string, or Path to JSON file

**Returns:** Dictionary with validation results

#### `get_schema()`

Returns the JSON Schema dictionary.

#### `get_meta_schema()`

Returns the meta-schema dictionary.

#### `get_context()`

Returns the JSON-LD context dictionary.

## Validation Examples

### Complete Resume Example

```python
from schema_resume import validate_resume

resume = {
    "$schema": "https://schema-resume.org/schema.json",
    "basics": {
        "name": "Jane Smith",
        "label": "Full Stack Developer",
        "email": "jane@example.com",
        "phone": "+1-555-123-4567",
        "url": "https://janesmith.dev",
        "summary": "Experienced developer with 8+ years in web development",
        "location": {
            "city": "San Francisco",
            "countryCode": "US",
            "region": "California"
        }
    },
    "work": [
        {
            "name": "Tech Company",
            "position": "Senior Developer",
            "startDate": "2020-03",
            "highlights": [
                "Led team of 5 developers",
                "Improved performance by 40%"
            ]
        }
    ],
    "education": [
        {
            "institution": "University of Technology",
            "area": "Computer Science",
            "studyType": "Bachelor",
            "startDate": "2012",
            "endDate": "2016"
        }
    ],
    "skills": [
        {
            "name": "Web Development",
            "level": "Expert",
            "keywords": ["JavaScript", "React", "Node.js"]
        }
    ]
}

result = validate_resume(resume)
print(f"Valid: {result['valid']}")
```

### Handling Validation Errors

```python
from schema_resume import ResumeValidator

validator = ResumeValidator()

invalid_resume = {
    "basics": {
        "email": "not-an-email"  # Invalid email format
    }
}

result = validator.validate(invalid_resume)

if not result["valid"]:
    for error in result["errors"]:
        print(f"Field: {error['path']}")
        print(f"Error: {error['message']}")
        print(f"Validator: {error['validator']}")
        print()
```

### Validating from File

```python
from schema_resume import validate_resume
from pathlib import Path

# Validate from file path
result = validate_resume(Path("resume.json"))

# Or using string path
result = validate_resume("resume.json")

if result["valid"]:
    print("Resume file is valid!")
```

## Development

### Running Tests

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run tests with coverage
pytest --cov=schema_resume --cov-report=html
```

### Code Formatting

```bash
# Format code with black
black src/

# Check with flake8
flake8 src/

# Type checking with mypy
mypy src/
```

## Schema Files Included

This package includes all necessary schema files:

- **schema.json** - Main JSON Schema for resume validation
- **meta-schema.json** - Meta-schema for self-validation
- **context.jsonld** - JSON-LD context for semantic web integration
- **schema-resume.xsd** - XML Schema Definition (XSD) for XML validation

## Links

- **Website**: https://schema-resume.org/
- **Documentation**: https://github.com/tradik/schema-resume
- **Online Validator**: https://schema-resume.org/validator.html
- **PyPI**: https://pypi.org/project/schema-resume-validator/
- **Issues**: https://github.com/tradik/schema-resume/issues

## Support

For questions or issues:
- Email: info@schema-resume.org or support@tradik.com
- GitHub Issues: https://github.com/tradik/schema-resume/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://github.com/tradik/schema-resume/blob/main/CONTRIBUTING.md).
