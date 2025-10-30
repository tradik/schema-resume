# Schema Resume Packages

This directory contains official packages for Schema Resume validator in multiple programming languages.

## Available Packages

### NPM (JavaScript/TypeScript)
- **Package**: `schema-resume-validator`
- **Registry**: [npmjs.com](https://www.npmjs.com/package/schema-resume-validator)
- **Installation**: `npm install schema-resume-validator`
- **Documentation**: [npm/README.md](./npm/README.md)
- **Features**: Full TypeScript support, AJV-based validation, embedded schemas

### Python
- **Package**: `schema-resume-validator`
- **Registry**: [PyPI](https://pypi.org/project/schema-resume-validator/)
- **Installation**: `pip install schema-resume-validator`
- **Documentation**: [python/README.md](./python/README.md)
- **Features**: Python 3.8+, jsonschema validation, type hints

### Go
- **Package**: `github.com/tradik/schema-resume/validator`
- **Registry**: [pkg.go.dev](https://pkg.go.dev/github.com/tradik/schema-resume/validator)
- **Installation**: `go get github.com/tradik/schema-resume/validator`
- **Documentation**: [golang/README.md](./golang/README.md)
- **Features**: Go 1.21+, embedded schemas, zero dependencies

### Java
- **Package**: `org.schema-resume:schema-resume-validator`
- **Registry**: [Maven Central](https://search.maven.org/artifact/org.schema-resume/schema-resume-validator)
- **Installation**: Maven/Gradle (see documentation)
- **Documentation**: [java/README.md](./java/README.md)
- **Features**: Java 11+, Maven/Gradle support, Jackson integration

### Ruby
- **Package**: `schema-resume-validator`
- **Registry**: [RubyGems](https://rubygems.org/gems/schema-resume-validator)
- **Installation**: `gem install schema-resume-validator`
- **Documentation**: [ruby/README.md](./ruby/README.md)
- **Features**: Ruby 2.7+, json-schema validation

### PHP
- **Package**: `schema-resume/validator`
- **Registry**: [Packagist](https://packagist.org/packages/schema-resume/validator)
- **Installation**: `composer require schema-resume/validator`
- **Documentation**: [php/README.md](./php/README.md)
- **Features**: PHP 8.0+, Composer support, PSR-4 autoloading

## Package Contents

All packages include the following schema files:

- **schema.json** - Main JSON Schema for resume validation
- **meta-schema.json** - Meta-schema for self-validation
- **context.jsonld** - JSON-LD context for semantic web integration
- **schema-resume.xsd** - XML Schema Definition (XSD)

## Common Features

All packages provide:

✅ **Validation** - Validate resume JSON against Schema Resume specification  
✅ **Error Reporting** - Detailed validation errors with field paths  
✅ **Schema Access** - Programmatic access to schema files  
✅ **Examples** - Working code examples and usage guides  
✅ **Documentation** - Comprehensive API reference  
✅ **Testing** - Unit tests and validation examples  

## Quick Start Examples

### JavaScript/TypeScript
```javascript
const { createValidator } = require('schema-resume-validator');
const validator = createValidator();
const result = validator.validate(resumeData);
```

### Python
```python
from schema_resume import validate_resume
result = validate_resume(resume_data)
```

### Go
```go
import "github.com/tradik/schema-resume/validator"
v, _ := validator.NewValidator()
result, _ := v.Validate(resume)
```

### Java
```java
import org.schemaresume.validator.ResumeValidator;
ResumeValidator validator = new ResumeValidator();
ValidationResult result = validator.validate(resume);
```

### Ruby
```ruby
require 'schema_resume'
result = SchemaResume.validate(resume)
```

### PHP
```php
use SchemaResume\Validator;
$validator = new Validator();
$result = $validator->validate($resume);
```

## Release Process

Packages are automatically released via GitHub Actions when a version tag is pushed:

```bash
git tag v1.1.0
git push origin v1.1.0
```

The workflow (`.github/workflows/release-packages.yml`) will:
1. Build and test all packages
2. Publish to respective package registries
3. Create GitHub release with notes

## Package Metadata

- **URL**: https://schema-resume.org/
- **Email**: info@schema-resume.org or support@tradik.com
- **Repository**: https://github.com/tradik/schema-resume
- **License**: MIT
- **Version**: 1.1.0

## Schema File Synchronization

**Important**: Schema files in packages are copies, not symlinks. After updating any schema file, run:

```bash
./sync-schema-files.sh
```

This ensures all packages have the latest schema files.

## Testing Packages Locally

Before publishing, test packages locally using the automated script:

```bash
# Test all packages
./test-packages.sh

# Test specific package
./test-packages.sh npm
```

For detailed testing instructions, see [TESTING.md](./TESTING.md).

For package maintenance and release procedures, see [MAINTENANCE.md](./MAINTENANCE.md).

## Support

For questions or issues:
- **Email**: info@schema-resume.org or support@tradik.com
- **Issues**: https://github.com/tradik/schema-resume/issues
- **Documentation**: https://github.com/tradik/schema-resume

## Contributing

Contributions are welcome! Please see the main [Contributing Guide](../CONTRIBUTING.md).

## License

All packages are released under the MIT License. See [LICENSE](../LICENSE) for details.
