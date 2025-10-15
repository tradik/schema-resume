# Schema Resume XML/XSD v1.0

This directory contains the XML Schema Definition (XSD) and example files for Schema Resume.

## Files

- **schema-resume.xsd** - Complete XSD schema definition for resume validation
- **example.xml** - Comprehensive example resume in XML format

## Usage

### Basic XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<resume xmlns="https://tradik.github.io/schema-resume/xml/1.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="https://tradik.github.io/schema-resume/xml/1.0
                            https://tradik.github.io/schema-resume/xml/1.0/schema-resume.xsd">
  <!-- Your resume content here -->
</resume>
```

### Namespace

- **Target Namespace**: `https://tradik.github.io/schema-resume/xml/1.0`
- **Schema Location**: `https://tradik.github.io/schema-resume/xml/1.0/schema-resume.xsd`

## Validation

### Using xmllint (Linux/Mac)

```bash
# Validate against hosted XSD
xmllint --schema https://tradik.github.io/schema-resume/xml/1.0/schema-resume.xsd your-resume.xml --noout

# Validate against local XSD
xmllint --schema schema-resume.xsd your-resume.xml --noout
```

### Using Python (lxml)

```python
from lxml import etree
import requests

# Load XSD schema
xsd_url = "https://tradik.github.io/schema-resume/xml/1.0/schema-resume.xsd"
xsd_doc = etree.parse(requests.get(xsd_url, stream=True).raw)
xsd_schema = etree.XMLSchema(xsd_doc)

# Load and validate XML
xml_doc = etree.parse('your-resume.xml')
if xsd_schema.validate(xml_doc):
    print("XML is valid!")
else:
    print("Validation errors:", xsd_schema.error_log)
```

### Using Java

```java
import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.*;
import java.io.File;
import java.net.URL;

public class ResumeValidator {
    public static void main(String[] args) throws Exception {
        SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
        Schema schema = factory.newSchema(
            new URL("https://tradik.github.io/schema-resume/xml/1.0/schema-resume.xsd")
        );
        
        Validator validator = schema.newValidator();
        validator.validate(new StreamSource(new File("your-resume.xml")));
        System.out.println("XML is valid!");
    }
}
```

## Features

### Data Types

- **iso8601DateType**: Flexible date format (YYYY, YYYY-MM, or YYYY-MM-DD)
- **countryCodeType**: ISO-3166-1 ALPHA-2 country codes (e.g., GB, US, FR)
- **workTypeEnum**: Enumerated work types (remote, hybrid, onsite, full-time, part-time, contract, freelance, internship, temporary)
- **proficiencyLevelType**: Skill levels (Beginner, Intermediate, Advanced, Expert)
- **languageFluencyType**: Language proficiency (Native, Fluent, Intermediate, Basic)

### Sections Supported

- **basics**: Personal information, contact details, location, profiles, nationalities, work authorization
- **work**: Employment history with positions, dates, and highlights
- **volunteer**: Volunteer work and community involvement
- **education**: Academic qualifications and courses
- **awards**: Professional awards and recognitions
- **certificates**: Professional certifications
- **publications**: Published works and articles
- **skills**: Technical and professional skills with keywords
- **tools**: Software tools and platforms
- **languages**: Language proficiencies
- **interests**: Personal interests and hobbies
- **references**: Professional references
- **projects**: Personal and professional projects
- **meta**: Document metadata (version, dates, canonical URL)

## Differences from JSON Schema

1. **Array representation**: Arrays use wrapper elements with `<item>` children
   - JSON: `"keywords": ["AWS", "Docker"]`
   - XML: `<keywords><item>AWS</item><item>Docker</item></keywords>`

2. **Namespace requirement**: XML requires explicit namespace declaration
3. **Attribute vs Element**: Schema version can be an attribute on root element
4. **Character escaping**: Special characters must be escaped (&amp;, &lt;, &gt;, etc.)

## Version History

- **v1.0** (2025-10-15): Initial XSD release based on JSON Schema v1.1.0

## License

MIT License - See main repository LICENSE file

## Links

- [Main Repository](https://github.com/tradik/schema-resume)
- [Documentation](https://tradik.github.io/schema-resume/)
- [JSON Schema](https://tradik.github.io/schema-resume/schema.json)
