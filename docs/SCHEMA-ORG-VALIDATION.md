# Schema.org Validation Guide

## Overview

When validating your resume JSON-LD with **validator.schema.org**, you need to include `@type` properties for structured data entities. This ensures proper semantic web integration and allows validators to understand what type of Schema.org entity each object represents.

## ⚠️ Important: @type for Schema.org Validation

When validating with **validator.schema.org**, you must include `@type` properties for all structured entities. The `@type` field specifies what kind of Schema.org entity each object represents.

### Document-Level Types

You can optionally add document-level type information at the root:

```json
{
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "@type": "DigitalDocument",
  "additionalType": "https://tradik.github.io/schema-resume/Person",
  "basics": {
    "@type": "schema:Person",
    ...
  }
}
```

- **@type**: `"DigitalDocument"` - Indicates this is a digital document (Schema.org type)
- **additionalType**: URL or type providing additional classification for the document
- Validate against the correct Schema.org vocabulary
- Enable proper RDF conversion and semantic web integration
- Support knowledge graph integration

## Common @type Values for Resume Sections

### Resume Sections

For the resume sections, use appropriate Schema.org types based on the section nature:

| Resume Section | @type Value | Description |
|----------------|-------------|-------------|
| `basics` | `schema:Person` | The person/candidate |
| `basics.location` | `schema:PostalAddress` | Physical address |
| `basics.profiles[]` | `schema:ContactPoint` | Social media profiles |
| `basics.nationalities[]` | `schema:Country` | Citizenship information |
| `work[]` | `schema:Organization` | Employer/company |
| `volunteer[]` | `schema:Organization` | Volunteer organization |
| `education[]` | `schema:EducationalOrganization` | Educational institution |
| `awards[]` | `schema:Award` | Professional awards |
| `certificates[]` | `schema:EducationalOccupationalCredential` | Professional certifications |
| `publications[]` | `schema:Article` | Published articles/papers |
| `skills[]` | `schema:DefinedTerm` | Skill categories |
| `tools[]` | `schema:SoftwareApplication` | Software tools |
| `projects[]` | `schema:SoftwareApplication` or `schema:Event` | Projects (see details below) |
| `languages[]` | `schema:Language` | Language proficiency |
| `interests[]` | `schema:Thing` | Personal interests |
| `references[]` | `schema:Review` | Professional recommendations |

### Projects

For the `projects` array, use appropriate Schema.org types based on the project nature:

| Project Type | @type Value | Use Case |
|--------------|-------------|----------|
| Software/Applications | `schema:SoftwareApplication` | Open source projects, libraries, applications |
| General Creative Work | `schema:CreativeWork` | General projects, creative works |
| Events/Workshops | `schema:Event` | Conferences, workshops, presentations |
| Research Papers | `schema:ScholarlyArticle` | Academic research, papers |
| Websites | `schema:WebSite` | Website projects |

### Example with @type

```json
{
  "@context": {
    "@vocab": "https://tradik.github.io/schema-resume/",
    "schema": "http://schema.org/"
  },
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "projects": [
    {
      "@type": "schema:SoftwareApplication",
      "name": "My Awesome Library",
      "description": "An open-source JavaScript library",
      "url": "https://github.com/user/awesome-lib",
      "keywords": ["JavaScript", "Library", "Open Source"]
    },
    {
      "@type": "schema:Event",
      "name": "Tech Conference Talk",
      "description": "Presentation on modern web development",
      "startDate": "2024-06",
      "url": "https://conference.example.com"
    }
  ]
}
```

## Other Sections That May Need @type

While the schema doesn't require `@type` for all sections, you may want to add it for better semantic validation:

### Work Experience
```json
{
  "@type": "schema:Organization",
  "name": "Company Name",
  "position": "Software Engineer"
}
```

### Education
```json
{
  "@type": "schema:EducationalOrganization",
  "institution": "University Name",
  "degree": "Bachelor of Science"
}
```

### Publications
```json
{
  "@type": "schema:Article",
  "name": "Article Title",
  "publisher": "Publisher Name"
}
```

## Validation Tools

### validator.schema.org
- **URL**: https://validator.schema.org/
- **Purpose**: Validates JSON-LD structured data against Schema.org vocabulary
- **Requirement**: Requires `@type` for all entities

### JSON Schema Validators
- **Purpose**: Validates JSON structure against the schema definition
- **Requirement**: Does NOT require `@type` (optional field)

## Important Notes

### streetAddress vs address

For Schema.org compatibility, use `streetAddress` instead of `address` in the location object:

```json
"location": {
  "@type": "schema:PostalAddress",
  "streetAddress": "123 Main Street\nApt 4B",  // ✅ Schema.org compliant
  "city": "San Francisco",
  "postalCode": "94103"
}
```

The `address` property is kept for backwards compatibility but will trigger a warning on validator.schema.org.

## Best Practices

1. **Always include @type when using validator.schema.org**
   - Add `@type` to all structured entities including awards, languages, interests, and nationalities

2. **Use appropriate Schema.org types**
   - Choose the most specific type that matches your content
   - Refer to https://schema.org/ for available types

3. **Prefix with namespace**
   - Use `schema:` prefix: `"@type": "schema:SoftwareApplication"`
   - Or use full URL: `"@type": "http://schema.org/SoftwareApplication"`

4. **Keep it optional for JSON Schema validation**
   - The `@type` field is optional in the schema
   - Only required when validating with Schema.org validators

## Common Errors

### Error: "Unspecified Type (The @type is required and cannot be an empty string.)"

**Cause**: Missing `@type` field in a structured data object

**Solution**: Add appropriate `@type` to the object:
```json
{
  "@type": "schema:SoftwareApplication",
  "name": "Project Name"
}
```

### Error: "Invalid @type value"

**Cause**: Using a non-existent or incorrect Schema.org type

**Solution**: Verify the type exists at https://schema.org/ and use correct format:
- ✅ `"@type": "schema:SoftwareApplication"`
- ✅ `"@type": "http://schema.org/SoftwareApplication"`
- ❌ `"@type": "Application"` (incorrect)

## References

- [Schema.org Vocabulary](https://schema.org/)
- [JSON-LD Specification](https://www.w3.org/TR/json-ld11/)
- [Schema.org Validator](https://validator.schema.org/)
- [Schema Resume Documentation](./README.md)
