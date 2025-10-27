# Testing Packages Locally

This guide explains how to test each package locally before publishing to package registries.

## Quick Start

Use the automated test script to test all packages:

```bash
./test-packages.sh
```

Or test a specific package:

```bash
./test-packages.sh npm      # Test NPM package
./test-packages.sh python   # Test Python package
./test-packages.sh go       # Test Go package
./test-packages.sh java     # Test Java package
./test-packages.sh ruby     # Test Ruby package
./test-packages.sh php      # Test PHP package
```

## Manual Testing by Language

### NPM (JavaScript/TypeScript)

```bash
cd packages/npm

# Install dependencies
npm install

# Run tests
npm test

# Run example
node example.js

# Create package tarball (doesn't publish)
npm pack

# Test in another project
npm install /path/to/schema-resume-validator-1.1.0.tgz
```

**Verify installation:**
```javascript
const { createValidator } = require('@schema-resume/validator');
const validator = createValidator();
console.log(validator.getSchema().version); // Should print: 1.1.0
```

### Python

```bash
cd packages/python

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install in development mode (editable)
pip install -e .

# Or build and install from wheel
pip install build
python -m build
pip install dist/schema_resume_validator-1.1.0-py3-none-any.whl

# Run example
python example.py

# Run tests (if pytest is installed)
pip install pytest
pytest
```

**Verify installation:**
```python
from schema_resume import validate_resume, __version__
print(__version__)  # Should print: 1.1.0

result = validate_resume({"basics": {"name": "Test"}})
print(result['valid'])  # Should print: True
```

### Go

```bash
cd packages/golang

# Download dependencies
go mod download
go mod tidy

# Run tests
go test -v ./...

# Run example
cd example
go run main.go
cd ..

# Build
go build
```

**Test in another project:**

Create a test project and add to `go.mod`:
```go
replace github.com/tradik/schema-resume/validator => /absolute/path/to/packages/golang
```

Then:
```go
import "github.com/tradik/schema-resume/validator"

v, _ := validator.NewValidator()
schema := v.GetSchema()
fmt.Println(schema["version"]) // Should print: 1.1.0
```

### Java

```bash
cd packages/java

# Build with Maven
mvn clean install

# Run tests
mvn test

# Package JAR
mvn package

# Install to local Maven repository
mvn install
```

The package will be installed to `~/.m2/repository/org/schema-resume/schema-resume-validator/1.1.0/`

**Test in another project:**

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.schema-resume</groupId>
    <artifactId>schema-resume-validator</artifactId>
    <version>1.1.0</version>
</dependency>
```

Then:
```java
import org.schemaresume.validator.ResumeValidator;

ResumeValidator validator = new ResumeValidator();
JsonNode schema = validator.getSchema();
System.out.println(schema.get("version").asText()); // Should print: 1.1.0
```

### Ruby

```bash
cd packages/ruby

# Build gem
gem build schema-resume-validator.gemspec

# Install locally
gem install ./schema-resume-validator-1.1.0.gem

# Test in irb
irb
```

**Verify installation:**
```ruby
require 'schema_resume'
puts SchemaResume::VERSION  # Should print: 1.1.0

result = SchemaResume.validate({"basics" => {"name" => "Test"}})
puts result[:valid]  # Should print: true
```

**Uninstall when done:**
```bash
gem uninstall schema-resume-validator
```

### PHP

```bash
cd packages/php

# Install dependencies
composer install

# Validate composer.json
composer validate

# Run example
php example.php

# Run tests (if PHPUnit is configured)
./vendor/bin/phpunit
```

**Test in another project:**

Add to `composer.json`:
```json
{
    "repositories": [
        {
            "type": "path",
            "url": "/absolute/path/to/packages/php"
        }
    ],
    "require": {
        "schema-resume/validator": "*"
    }
}
```

Then:
```bash
composer install
```

**Verify installation:**
```php
<?php
require 'vendor/autoload.php';

use SchemaResume\Validator;

$validator = new Validator();
$schema = $validator->getSchema();
echo $schema->version; // Should print: 1.1.0
```

## Validation Checklist

Before publishing, ensure:

- [ ] All schema files are properly symlinked
- [ ] Version numbers match across all files
- [ ] Dependencies are correctly specified
- [ ] Examples run without errors
- [ ] Tests pass (if available)
- [ ] Package builds successfully
- [ ] Documentation is up to date
- [ ] LICENSE file is included

## Common Issues

### Symlinks Not Working

If symlinks don't work (e.g., on Windows), copy the schema files instead:

```bash
# For each package
cp ../../schema.json packages/npm/schema.json
cp ../../meta-schema.json packages/npm/meta-schema.json
cp ../../context.jsonld packages/npm/context.jsonld
cp ../../xml/1.0/schema-resume.xsd packages/npm/schema-resume.xsd
```

### Go Module Issues

If Go can't find the module, ensure:
1. `go.mod` is in the correct location
2. Module path matches: `github.com/tradik/schema-resume/validator`
3. Run `go mod tidy` to clean up dependencies

### Python Import Errors

If Python can't import the module:
1. Ensure you're in the virtual environment
2. Install in editable mode: `pip install -e .`
3. Check `PYTHONPATH` includes the package directory

### Maven Build Failures

If Maven fails:
1. Ensure Java 11+ is installed: `java -version`
2. Clear Maven cache: `mvn clean`
3. Check `pom.xml` syntax

## CI/CD Testing

The GitHub Actions workflow (`.github/workflows/release-packages.yml`) automatically tests packages before publishing. You can trigger it manually:

```bash
# Push a test tag
git tag v1.1.1-test
git push origin v1.1.1-test

# Or use workflow dispatch from GitHub UI
```

## Support

If you encounter issues:
- Check package-specific README in each `packages/*/README.md`
- Review error messages carefully
- Ensure all dependencies are installed
- Contact: info@schema-resume.org or support@tradik.com
