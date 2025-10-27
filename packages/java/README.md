# Schema Resume Validator (Java)

[![Maven Central](https://img.shields.io/maven-central/v/org.schema-resume/schema-resume-validator.svg)](https://search.maven.org/artifact/org.schema-resume/schema-resume-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Java package for validating resumes against the [Schema Resume](https://schema-resume.org/) JSON Schema.

## Installation

### Maven

```xml
<dependency>
    <groupId>org.schema-resume</groupId>
    <artifactId>schema-resume-validator</artifactId>
    <version>1.1.0</version>
</dependency>
```

### Gradle

```gradle
implementation 'org.schema-resume:schema-resume-validator:1.1.0'
```

## Usage

### Basic Validation

```java
import org.schemaresume.validator.ResumeValidator;
import org.schemaresume.validator.ResumeValidator.ValidationResult;

public class Example {
    public static void main(String[] args) throws Exception {
        // Create validator
        ResumeValidator validator = new ResumeValidator();
        
        // Resume JSON string
        String resumeJson = """
        {
            "$schema": "https://schema-resume.org/schema.json",
            "basics": {
                "name": "John Doe",
                "label": "Software Engineer",
                "email": "john.doe@example.com"
            }
        }
        """;
        
        // Validate
        ValidationResult result = validator.validateJson(resumeJson);
        
        if (result.isValid()) {
            System.out.println("✓ Resume is valid!");
        } else {
            System.out.println("✗ Validation errors:");
            result.getErrors().forEach(error -> {
                System.out.println("  - " + error);
            });
        }
    }
}
```

### Validating JsonNode

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.schemaresume.validator.ResumeValidator;

public class Example {
    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ResumeValidator validator = new ResumeValidator();
        
        // Create resume as JsonNode
        JsonNode resume = mapper.readTree("""
        {
            "basics": {
                "name": "Jane Smith",
                "email": "jane@example.com"
            }
        }
        """);
        
        // Validate
        ValidationResult result = validator.validate(resume);
        System.out.println("Valid: " + result.isValid());
    }
}
```

### Accessing Schema Files

```java
import com.fasterxml.jackson.databind.JsonNode;
import org.schemaresume.validator.ResumeValidator;

public class Example {
    public static void main(String[] args) throws Exception {
        ResumeValidator validator = new ResumeValidator();
        
        // Get schema
        JsonNode schema = validator.getSchema();
        System.out.println("Schema version: " + schema.get("version").asText());
        
        // Get meta-schema
        JsonNode metaSchema = validator.getMetaSchema();
        System.out.println("Meta-schema title: " + metaSchema.get("title").asText());
        
        // Get JSON-LD context
        JsonNode context = validator.getContext();
        System.out.println("Context: " + context);
    }
}
```

## API Reference

### `ResumeValidator`

Main validator class.

#### Constructor

```java
public ResumeValidator() throws IOException
```

Creates a new validator with embedded schemas.

#### Methods

```java
public ValidationResult validate(JsonNode resume)
```

Validates a resume JsonNode.

```java
public ValidationResult validateJson(String resumeJson) throws IOException
```

Validates a resume from JSON string.

```java
public JsonNode getSchema()
```

Returns the JSON Schema.

```java
public JsonNode getMetaSchema()
```

Returns the meta-schema.

```java
public JsonNode getContext()
```

Returns the JSON-LD context.

### `ValidationResult`

Contains validation outcome.

#### Methods

```java
public boolean isValid()
```

Returns true if validation passed.

```java
public List<ValidationError> getErrors()
```

Returns list of validation errors.

### `ValidationError`

Represents a validation error.

#### Methods

```java
public String getPath()
```

Returns the JSON path where error occurred.

```java
public String getType()
```

Returns the error type.

```java
public String getMessage()
```

Returns the error message.

## Complete Example

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.schemaresume.validator.ResumeValidator;
import org.schemaresume.validator.ResumeValidator.ValidationResult;

public class CompleteExample {
    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ResumeValidator validator = new ResumeValidator();
        
        // Build resume programmatically
        ObjectNode resume = mapper.createObjectNode();
        resume.put("$schema", "https://schema-resume.org/schema.json");
        
        ObjectNode basics = resume.putObject("basics");
        basics.put("name", "Jane Smith");
        basics.put("label", "Full Stack Developer");
        basics.put("email", "jane@example.com");
        
        ArrayNode work = resume.putArray("work");
        ObjectNode job = work.addObject();
        job.put("name", "Tech Company");
        job.put("position", "Senior Developer");
        job.put("startDate", "2020-03");
        
        // Validate
        ValidationResult result = validator.validate(resume);
        
        if (result.isValid()) {
            System.out.println("✓ Resume is valid!");
            System.out.println("\nResume JSON:");
            System.out.println(mapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(resume));
        } else {
            System.out.println("✗ Validation failed:");
            result.getErrors().forEach(System.out::println);
        }
    }
}
```

## Requirements

- Java 11 or higher
- Maven 3.6+ or Gradle 7.0+

## Links

- **Website**: https://schema-resume.org/
- **Documentation**: https://github.com/tradik/schema-resume
- **Online Validator**: https://schema-resume.org/validator.html
- **Maven Central**: https://search.maven.org/artifact/org.schema-resume/schema-resume-validator
- **Issues**: https://github.com/tradik/schema-resume/issues

## Support

For questions or issues:
- Email: info@schema-resume.org or support@tradik.com
- GitHub Issues: https://github.com/tradik/schema-resume/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://github.com/tradik/schema-resume/blob/main/CONTRIBUTING.md).
