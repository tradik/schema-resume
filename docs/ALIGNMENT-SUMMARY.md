---
title: "File Alignment Summary"
slug: "alignment-summary"
status: "publish"
type: "page"
description: "How schema.json, meta-schema.json, context.jsonld and the XSD stay aligned on Schema.org @type support, and how to verify it."
categories: [Documentation]
modified: 2026-08-06
---
# Schema Resume - File Alignment Summary

This document verifies that all files in the Schema Resume project are aligned with the `@type` additions for Schema.org validation support.

## ✅ Files Updated and Aligned

### 1. Core Schema Files

#### `schema.json`
- ✅ Added `@type` field documentation to all sections:
  - basics → `schema:Person`
  - basics.location → `schema:PostalAddress`
  - basics.profiles[] → `schema:ContactPoint`
  - work[] → `schema:Organization`
  - volunteer[] → `schema:Organization`
  - education[] → `schema:EducationalOrganization`
  - certificates[] → `schema:EducationalOccupationalCredential`
  - publications[] → `schema:Article`
  - skills[] → `schema:DefinedTerm`
  - tools[] → `schema:SoftwareApplication`
  - projects[] → `schema:SoftwareApplication` or `schema:Event`
  - references[] → `schema:Review`

#### `meta-schema.json`
- ✅ Added `@type` property definition
- ✅ Description: "JSON-LD type annotation for semantic web compatibility"

#### `context.jsonld`
- ✅ Added `@type` mapping to RDF type
- ✅ Maps to `rdf:type` with `@id` type

### 2. Example Files

#### `example.json`
- ✅ Added `@type` to all applicable sections
- ✅ All 12 section types properly annotated
- ✅ Validates against Schema.org requirements

#### `example-with-local-context.json`
- ✅ Added `@type` to all applicable sections
- ✅ Demonstrates local context definition with FOAF and Dublin Core
- ✅ Shows extended vocabulary usage
- ✅ All 12 section types properly annotated

### 3. Documentation Files

#### `README.md`
- ✅ Added warning notice about Schema.org validation requirements
- ✅ Added Projects section field reference table with `@type`
- ✅ Linked to SCHEMA-ORG-VALIDATION.md guide
- ✅ Updated JSON-LD & Semantic Web section

#### `SCHEMA-ORG-VALIDATION.md` (NEW)
- ✅ Created comprehensive validation guide
- ✅ Complete @type mapping table for all sections
- ✅ Full working example with all @type fields
- ✅ Troubleshooting section for common errors
- ✅ Best practices and recommendations

#### `JSON-LD.md`
- ✅ Added @type requirement section at the top
- ✅ Updated all code examples to include @type
- ✅ Added @type mapping table
- ✅ Updated tips section with @type reminder
- ✅ Linked to SCHEMA-ORG-VALIDATION.md

#### `CHANGELOG.md`
- ✅ Added comprehensive entry for @type additions
- ✅ Listed all 12 @type properties added
- ✅ Documented new files (SCHEMA-ORG-VALIDATION.md, example-with-local-context.json)
- ✅ Noted context.jsonld and meta-schema.json updates

## 📋 Complete @type Mapping Reference

| Resume Section | @type Value | Schema.org Type |
|----------------|-------------|-----------------|
| `basics` | `schema:Person` | Person entity |
| `basics.location` | `schema:PostalAddress` | Physical address |
| `basics.profiles[]` | `schema:ContactPoint` | Social media/contact |
| `work[]` | `schema:Organization` | Employer/company |
| `volunteer[]` | `schema:Organization` | Volunteer org |
| `education[]` | `schema:EducationalOrganization` | School/university |
| `certificates[]` | `schema:EducationalOccupationalCredential` | Certification |
| `publications[]` | `schema:Article` | Published work |
| `skills[]` | `schema:DefinedTerm` | Skill category |
| `tools[]` | `schema:SoftwareApplication` | Software tool |
| `projects[]` | `schema:SoftwareApplication` / `schema:Event` | Project type |
| `references[]` | `schema:Review` | Recommendation |

## 🔗 File Relationships

```
schema.json (defines @type fields)
    ↓
meta-schema.json (validates @type property)
    ↓
context.jsonld (maps @type to RDF)
    ↓
example.json (demonstrates @type usage)
example-with-local-context.json (demonstrates extended @type usage)
    ↓
README.md (documents @type requirement)
JSON-LD.md (explains @type in JSON-LD context)
SCHEMA-ORG-VALIDATION.md (complete @type guide)
CHANGELOG.md (tracks @type additions)
```

## ✅ Validation Checklist

- [x] All schema sections have `@type` field defined
- [x] Meta-schema includes `@type` property
- [x] Context.jsonld maps `@type` to RDF
- [x] Both example files include all `@type` values
- [x] README.md warns about Schema.org validation
- [x] JSON-LD.md updated with @type examples
- [x] SCHEMA-ORG-VALIDATION.md created with complete guide
- [x] CHANGELOG.md documents all changes
- [x] All code examples updated to include @type
- [x] Documentation cross-references are consistent

## 🎯 Consistency Verification

### Schema.org Type Usage
All files consistently use the `schema:` prefix for Schema.org types:
- ✅ `schema:Person` (not `Person` or `http://schema.org/Person`)
- ✅ `schema:Organization` (not `Organization`)
- ✅ `schema:SoftwareApplication` (not `SoftwareApplication`)

### Documentation Cross-References
All documentation files properly reference each other:
- ✅ README.md → SCHEMA-ORG-VALIDATION.md
- ✅ JSON-LD.md → SCHEMA-ORG-VALIDATION.md
- ✅ SCHEMA-ORG-VALIDATION.md → README.md, JSON-LD.md
- ✅ All files reference example.json and example-with-local-context.json

### Field Descriptions
All `@type` field descriptions are consistent:
- ✅ Schema.json: "Schema.org type, should be 'X' for validator.schema.org compatibility"
- ✅ Meta-schema: "JSON-LD type annotation for semantic web compatibility"
- ✅ Documentation: "Required for validator.schema.org"

## 🚀 Ready for Use

All files are now aligned and ready for:
1. ✅ JSON Schema validation (ajv, jsonschema)
2. ✅ Schema.org validation (validator.schema.org)
3. ✅ JSON-LD processing (jsonld.js, PyLD)
4. ✅ RDF conversion and SPARQL queries
5. ✅ Semantic web integration

## 📝 Notes

- The `@type` field is **optional** for JSON Schema validation
- The `@type` field is **required** for Schema.org validation (validator.schema.org)
- All examples demonstrate proper `@type` usage
- Documentation clearly explains when `@type` is needed
- Users can choose to include or omit `@type` based on their validation needs

---

**Last Updated**: 2025-10-15
**Schema Version**: v1.1.0 (with @type support)
