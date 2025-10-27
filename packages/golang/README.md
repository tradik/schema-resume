# Schema Resume Validator (Go)

[![Go Reference](https://pkg.go.dev/badge/github.com/tradik/schema-resume/validator.svg)](https://pkg.go.dev/github.com/tradik/schema-resume/validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Go package for validating resumes against the [Schema Resume](https://schema-resume.org/) JSON Schema.

## Installation

```bash
go get github.com/tradik/schema-resume/validator
```

## Usage

### Basic Validation

```go
package main

import (
    "fmt"
    "log"

    validator "github.com/tradik/schema-resume/validator"
)

func main() {
    // Create validator
    v, err := validator.NewValidator()
    if err != nil {
        log.Fatal(err)
    }

    // Resume data
    resume := map[string]interface{}{
        "$schema": "https://schema-resume.org/schema.json",
        "basics": map[string]interface{}{
            "name":  "John Doe",
            "label": "Software Engineer",
            "email": "john.doe@example.com",
        },
        "work": []map[string]interface{}{
            {
                "name":      "Tech Corp",
                "position":  "Senior Developer",
                "startDate": "2020-01",
            },
        },
    }

    // Validate
    result, err := v.Validate(resume)
    if err != nil {
        log.Fatal(err)
    }

    if result.Valid {
        fmt.Println("✓ Resume is valid!")
    } else {
        fmt.Println("✗ Validation errors:")
        for _, e := range result.Errors {
            fmt.Printf("  - %s: %s\n", e.Field, e.Description)
        }
    }
}
```

### Validating JSON

```go
package main

import (
    "fmt"
    "log"

    validator "github.com/tradik/schema-resume/validator"
)

func main() {
    resumeJSON := []byte(`{
        "$schema": "https://schema-resume.org/schema.json",
        "basics": {
            "name": "Jane Smith",
            "label": "Full Stack Developer",
            "email": "jane@example.com"
        }
    }`)

    // Validate JSON directly
    result, err := validator.ValidateResumeJSON(resumeJSON)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Valid: %v\n", result.Valid)
}
```

### Using Convenience Functions

```go
package main

import (
    "fmt"
    "log"

    validator "github.com/tradik/schema-resume/validator"
)

func main() {
    resume := map[string]interface{}{
        "basics": map[string]interface{}{
            "name": "John Doe",
        },
    }

    // Use convenience function
    result, err := validator.ValidateResume(resume)
    if err != nil {
        log.Fatal(err)
    }

    if result.Valid {
        fmt.Println("Resume is valid!")
    }
}
```

### Accessing Schema Files

```go
package main

import (
    "fmt"
    "log"

    validator "github.com/tradik/schema-resume/validator"
)

func main() {
    v, err := validator.NewValidator()
    if err != nil {
        log.Fatal(err)
    }

    // Get schema
    schema := v.GetSchema()
    fmt.Printf("Schema version: %v\n", schema["version"])

    // Get meta-schema
    metaSchema := v.GetMetaSchema()
    fmt.Printf("Meta-schema title: %v\n", metaSchema["title"])

    // Get JSON-LD context
    context := v.GetContext()
    fmt.Printf("Context: %v\n", context)
}
```

## API Reference

### Types

#### `Validator`

Main validator type for resume validation.

#### `ValidationResult`

```go
type ValidationResult struct {
    Valid  bool              // Whether the resume is valid
    Errors []ValidationError // List of validation errors
}
```

#### `ValidationError`

```go
type ValidationError struct {
    Field       string // Field path where error occurred
    Type        string // Error type
    Description string // Human-readable error description
    Value       string // Invalid value (if applicable)
}
```

### Functions

#### `NewValidator() (*Validator, error)`

Creates a new validator instance with embedded schemas.

#### `ValidateResume(resume interface{}) (*ValidationResult, error)`

Convenience function to validate a resume without creating a validator instance.

#### `ValidateResumeJSON(resumeJSON []byte) (*ValidationResult, error)`

Convenience function to validate resume from JSON bytes.

### Methods

#### `(*Validator) Validate(resume interface{}) (*ValidationResult, error)`

Validates a resume document (as map or struct).

#### `(*Validator) ValidateJSON(resumeJSON []byte) (*ValidationResult, error)`

Validates a resume from JSON bytes.

#### `(*Validator) GetSchema() map[string]interface{}`

Returns the JSON Schema as a map.

#### `(*Validator) GetMetaSchema() map[string]interface{}`

Returns the meta-schema as a map.

#### `(*Validator) GetContext() map[string]interface{}`

Returns the JSON-LD context as a map.

## Complete Example

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"

    validator "github.com/tradik/schema-resume/validator"
)

func main() {
    // Create validator
    v, err := validator.NewValidator()
    if err != nil {
        log.Fatal(err)
    }

    // Complete resume example
    resume := map[string]interface{}{
        "$schema": "https://schema-resume.org/schema.json",
        "basics": map[string]interface{}{
            "name":    "Jane Smith",
            "label":   "Full Stack Developer",
            "email":   "jane@example.com",
            "phone":   "+1-555-123-4567",
            "url":     "https://janesmith.dev",
            "summary": "Experienced developer with 8+ years in web development",
            "location": map[string]interface{}{
                "city":        "San Francisco",
                "countryCode": "US",
                "region":      "California",
            },
        },
        "work": []map[string]interface{}{
            {
                "name":      "Tech Company",
                "position":  "Senior Developer",
                "startDate": "2020-03",
                "highlights": []string{
                    "Led team of 5 developers",
                    "Improved performance by 40%",
                },
            },
        },
        "skills": []map[string]interface{}{
            {
                "name":     "Web Development",
                "level":    "Expert",
                "keywords": []string{"JavaScript", "React", "Node.js"},
            },
        },
    }

    // Validate
    result, err := v.Validate(resume)
    if err != nil {
        log.Fatal(err)
    }

    // Print results
    if result.Valid {
        fmt.Println("✓ Resume is valid!")
        
        // Pretty print resume
        resumeJSON, _ := json.MarshalIndent(resume, "", "  ")
        fmt.Printf("\nResume:\n%s\n", resumeJSON)
    } else {
        fmt.Println("✗ Validation failed:")
        for i, e := range result.Errors {
            fmt.Printf("\nError %d:\n", i+1)
            fmt.Printf("  Field: %s\n", e.Field)
            fmt.Printf("  Type: %s\n", e.Type)
            fmt.Printf("  Description: %s\n", e.Description)
        }
    }
}
```

## Schema Files Included

This package embeds all necessary schema files:

- **schema.json** - Main JSON Schema for resume validation
- **meta-schema.json** - Meta-schema for self-validation
- **context.jsonld** - JSON-LD context for semantic web integration
- **schema-resume.xsd** - XML Schema Definition (XSD)

## Links

- **Website**: https://schema-resume.org/
- **Documentation**: https://github.com/tradik/schema-resume
- **Online Validator**: https://schema-resume.org/validator.html
- **Go Package**: https://pkg.go.dev/github.com/tradik/schema-resume/validator
- **Issues**: https://github.com/tradik/schema-resume/issues

## Support

For questions or issues:
- Email: info@schema-resume.org or support@tradik.com
- GitHub Issues: https://github.com/tradik/schema-resume/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://github.com/tradik/schema-resume/blob/main/CONTRIBUTING.md).
