# schema-resume-validator

[![npm version](https://img.shields.io/npm/v/schema-resume-validator.svg)](https://www.npmjs.com/package/schema-resume-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official NPM package for validating resumes against the [Schema Resume](https://schema-resume.org/) JSON Schema.

## Installation

```bash
npm install schema-resume-validator
```

## Usage

### Basic Validation

```javascript
const { createValidator } = require('schema-resume-validator');

const validator = createValidator();

const resume = {
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
};

const result = validator.validate(resume);

if (result.valid) {
  console.log('✓ Resume is valid!');
} else {
  console.error('✗ Validation errors:');
  result.errors.forEach(error => {
    console.error(`  - ${error.instancePath}: ${error.message}`);
  });
}
```

### TypeScript Usage

```typescript
import { createValidator, ValidationResult } from 'schema-resume-validator';

const validator = createValidator();

const resume = {
  // Your resume data
};

const result: ValidationResult = validator.validate(resume);

if (result.valid) {
  console.log('Resume is valid!');
}
```

### Accessing Schema Files

```javascript
const { schema, metaSchema, context } = require('schema-resume-validator');

// Get the JSON Schema
console.log(schema);

// Get the meta-schema
console.log(metaSchema);

// Get the JSON-LD context
console.log(context);
```

### Custom Validator Options

```javascript
const validator = createValidator({
  strict: false,
  allErrors: true,
  verbose: true
});
```

## API Reference

### `createValidator(options?)`

Creates a new validator instance.

**Parameters:**
- `options` (optional): AJV configuration options
  - `strict` (boolean): Enable strict mode (default: false)
  - `allErrors` (boolean): Collect all errors (default: true)
  - `verbose` (boolean): Include schema and data in errors (default: true)

**Returns:** Validator instance

### `validator.validate(resume)`

Validates a resume object against the schema.

**Parameters:**
- `resume` (object): Resume data to validate

**Returns:** Object with:
- `valid` (boolean): Whether the resume is valid
- `errors` (array): Array of validation errors (empty if valid)

### `validator.getSchema()`

Returns the JSON Schema object.

### `validator.getMetaSchema()`

Returns the meta-schema object.

### `validator.getContext()`

Returns the JSON-LD context object.

### `validator.getAjv()`

Returns the underlying AJV instance for advanced usage.

## Validation Examples

### Valid Resume Example

```javascript
const validResume = {
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
};

const result = validator.validate(validResume);
console.log(result.valid); // true
```

### Handling Validation Errors

```javascript
const invalidResume = {
  "basics": {
    "email": "not-an-email" // Invalid email format
  }
};

const result = validator.validate(invalidResume);

if (!result.valid) {
  result.errors.forEach(error => {
    console.log('Field:', error.instancePath);
    console.log('Error:', error.message);
    console.log('Schema:', error.schemaPath);
  });
}
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
- **Issues**: https://github.com/tradik/schema-resume/issues

## Support

For questions or issues:
- Email: info@schema-resume.org or support@tradik.com
- GitHub Issues: https://github.com/tradik/schema-resume/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://github.com/tradik/schema-resume/blob/main/CONTRIBUTING.md).
