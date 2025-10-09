# JSON-LD Integration Guide

This document explains how Schema Resume integrates with JSON-LD (JSON for Linking Data) and the Semantic Web.

## 🌐 What is JSON-LD?

JSON-LD is a method of encoding Linked Data using JSON. It allows your resume data to be:
- **Machine-readable** by semantic web applications
- **Interoperable** with other systems using Schema.org vocabulary
- **Discoverable** by search engines and knowledge graphs
- **Portable** across different platforms

## 📋 Schema.org Mapping

Schema Resume maps resume fields to Schema.org vocabulary:

| Resume Field | Schema.org Property | Type |
|--------------|---------------------|------|
| `name` | `schema:name` | Person name |
| `email` | `schema:email` | Email address |
| `phone` | `schema:telephone` | Phone number |
| `url` | `schema:url` | Personal website |
| `label` | `schema:jobTitle` | Job title |
| `summary` | `schema:description` | Description |
| `location` | `schema:address` | Postal address |
| `work` | `schema:worksFor` | Work experience |
| `education` | `schema:alumniOf` | Educational background |
| `skills` | `schema:knowsAbout` | Skills and knowledge |
| `tools` | `schema:knowsAbout` | Tools and software proficiency |
| `languages` | `schema:knowsLanguage` | Language proficiency |
| `awards` | `schema:award` | Awards received |
| `publications` | `schema:publishedBy` | Published works |
| `nationalities` | `schema:nationality` | Citizenship information |
| `workAuthorization` | `schema:hasCredential` | Work authorization and visas |

## 🔗 Using the JSON-LD Context

### Basic Usage

Include the `@context` field in your resume JSON:

```json
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Separate Context File

You can also reference the standalone context file:

```json
{
  "@context": "https://tradik.github.io/schema-resume/context.jsonld",
  "basics": {
    "name": "John Doe"
  }
}
```

## 🛠️ Processing JSON-LD

### Using JSON-LD Playground

Test your resume in the [JSON-LD Playground](https://json-ld.org/playground/):

1. Paste your resume JSON
2. Click "Visualized" tab to see the graph
3. Click "N-Quads" to see RDF triples

### Using Python

```python
from pyld import jsonld
import json
import requests

# Load your resume
with open('resume.json') as f:
    resume = json.load(f)

# Expand the JSON-LD
expanded = jsonld.expand(resume)
print(json.dumps(expanded, indent=2))

# Convert to RDF N-Quads
nquads = jsonld.to_rdf(resume, {'format': 'application/n-quads'})
print(nquads)

# Compact using a different context
context_url = "https://tradik.github.io/schema-resume/context.jsonld"
context = requests.get(context_url).json()
compacted = jsonld.compact(resume, context)
print(json.dumps(compacted, indent=2))
```

### Using JavaScript

```javascript
const jsonld = require('jsonld');
const fs = require('fs');

// Load your resume
const resume = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

// Expand the JSON-LD
jsonld.expand(resume).then(expanded => {
  console.log(JSON.stringify(expanded, null, 2));
});

// Convert to RDF
jsonld.toRDF(resume, {format: 'application/n-quads'}).then(nquads => {
  console.log(nquads);
});

// Compact with context
const contextUrl = 'https://tradik.github.io/schema-resume/context.jsonld';
jsonld.compact(resume, contextUrl).then(compacted => {
  console.log(JSON.stringify(compacted, null, 2));
});
```

## 🔍 Querying with SPARQL

Once converted to RDF, you can query your resume using SPARQL:

```sparql
PREFIX schema: <http://schema.org/>
PREFIX resume: <https://tradik.github.io/schema-resume/>

SELECT ?name ?email ?jobTitle
WHERE {
  ?person a schema:Person ;
          schema:name ?name ;
          schema:email ?email ;
          schema:jobTitle ?jobTitle .
}
```

## 🌟 Benefits of JSON-LD Integration

### 1. Search Engine Optimization (SEO)

Search engines like Google can understand structured data:

```html
<script type="application/ld+json">
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "John Doe",
    "jobTitle": "Software Engineer",
    "url": "https://johndoe.dev"
  }
}
</script>
```

### 2. Knowledge Graph Integration

Your resume can be integrated into knowledge graphs:
- Company HR systems
- Professional networks
- Academic databases
- Research platforms

### 3. Data Portability

Easy conversion between formats:
- JSON-LD → RDF/XML
- JSON-LD → Turtle
- JSON-LD → N-Triples
- JSON-LD → N-Quads

### 4. Semantic Queries

Query across multiple resumes:

```sparql
# Find all people who know Python
SELECT ?name ?skill
WHERE {
  ?person schema:name ?name ;
          schema:knowsAbout ?skill .
  FILTER(CONTAINS(LCASE(?skill), "python"))
}
```

## 📊 Example: Expanded JSON-LD

Original:
```json
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Expanded (RDF):
```json
[
  {
    "http://schema.org/name": [
      {
        "@value": "John Doe"
      }
    ],
    "http://schema.org/email": [
      {
        "@value": "john@example.com"
      }
    ]
  }
]
```

## 🔧 Custom Context

You can extend the context for custom fields:

```json
{
  "@context": [
    "https://tradik.github.io/schema-resume/context.jsonld",
    {
      "customField": "https://example.com/vocab#customField"
    }
  ],
  "basics": {
    "name": "John Doe",
    "customField": "Custom value"
  }
}
```

## 🎯 Use Cases

### 1. Resume Aggregation

Aggregate resumes from multiple sources:

```python
import rdflib

g = rdflib.Graph()

# Load multiple resumes
g.parse('resume1.json', format='json-ld')
g.parse('resume2.json', format='json-ld')
g.parse('resume3.json', format='json-ld')

# Query all names
query = """
    PREFIX schema: <http://schema.org/>
    SELECT ?name WHERE {
        ?person schema:name ?name .
    }
"""
for row in g.query(query):
    print(row.name)
```

### 2. Skill Matching

Match candidates to job requirements:

```sparql
PREFIX schema: <http://schema.org/>

SELECT ?person ?name (COUNT(?skill) as ?matchCount)
WHERE {
  ?person schema:name ?name ;
          schema:knowsAbout ?skill .
  VALUES ?requiredSkill { "Python" "JavaScript" "Docker" }
  FILTER(?skill = ?requiredSkill)
}
GROUP BY ?person ?name
ORDER BY DESC(?matchCount)
```

### 3. Network Analysis

Build professional networks:

```sparql
PREFIX schema: <http://schema.org/>

SELECT ?person1 ?person2
WHERE {
  ?person1 schema:worksFor ?org .
  ?person2 schema:worksFor ?org .
  FILTER(?person1 != ?person2)
}
```

## 📚 Resources

### Tools
- [JSON-LD Playground](https://json-ld.org/playground/)
- [JSON-LD.org](https://json-ld.org/)
- [Schema.org](https://schema.org/)

### Libraries

**JavaScript:**
- [jsonld.js](https://github.com/digitalbazaar/jsonld.js)
- [rdf.js](https://rdf.js.org/)

**Python:**
- [PyLD](https://github.com/digitalbazaar/pyld)
- [rdflib](https://github.com/RDFLib/rdflib)

**PHP:**
- [JSON-LD PHP](https://github.com/lanthaler/JsonLD)

**Java:**
- [Titanium JSON-LD](https://github.com/filip26/titanium-json-ld)

### Validators
- [JSON-LD Validator](https://json-ld.org/playground/)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## 🔐 Privacy Considerations

When using JSON-LD:
- Be aware that data becomes more discoverable
- Consider what information to make public
- Use appropriate access controls
- Follow GDPR and privacy regulations
- Provide clear consent mechanisms

## 🚀 Next Steps

1. **Test your resume** in the JSON-LD Playground
2. **Validate** with Schema.org validator
3. **Convert to RDF** for graph databases
4. **Query with SPARQL** for advanced analytics
5. **Integrate** with semantic web applications

## 💡 Tips

- Always include `@context` for JSON-LD compatibility
- Use Schema.org vocabulary when possible
- Test with multiple JSON-LD processors
- Validate your data regularly
- Keep context files versioned
- Document custom extensions

---

**For more information**, see:
- [README.md](./README.md) - General documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [schema.json](./schema.json) - Main schema file
- [context.jsonld](./context.jsonld) - JSON-LD context
