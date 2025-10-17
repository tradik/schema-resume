# Schema Validation Guide

This document describes the validation tools and processes for the schema-resume project.

## Overview

The project includes comprehensive validation tools to ensure all schema files remain synchronized and error-free:

- **4 Schema Files**: `schema.json`, `context.jsonld`, `meta-schema.json`, `schema-resume.xsd`
- **2 Validation Scripts**: Linting and comparison
- **2 GitHub Actions Workflows**: Full validation and quick checks

## Validation Scripts

### 1. Linting (`lint-schemas.py`)

Validates syntax and structure of all schema files.

**Checks performed:**

#### schema.json
- ✅ Valid JSON syntax
- ✅ Required fields ($schema, $id, properties)
- ✅ Definitions section exists
- ✅ ISO8601 regex pattern validation
- ✅ Basics section structure
- ⚠️ Missing recommended fields

#### context.jsonld
- ✅ Valid JSON syntax
- ✅ @context field present
- ✅ Required namespaces (schema, xsd)
- ✅ @vocab URL validation
- ✅ Field mapping count
- ⚠️ Non-standard @id mappings

#### meta-schema.json
- ✅ Valid JSON syntax
- ✅ Self-referential check
- ✅ Standard definitions present
- ✅ JSON Schema keywords
- ✅ Property definitions count

#### schema-resume.xsd
- ✅ Valid XML syntax
- ✅ Root element validation
- ✅ targetNamespace check
- ✅ ComplexType/SimpleType counts
- ✅ BasicsType validation
- ⚠️ Unknown type prefixes

**Usage:**
```bash
./run-lint.sh
# or
python3 lint-schemas.py
```

**Exit codes:**
- `0` - All checks passed
- `1` - Errors found (will fail CI)

### 2. Comparison (`compare-schemas.py`)

Compares fields across all schema files to ensure consistency.

**Sections compared:**
- Basics section (17 fields)
- Location sub-fields (6 fields)
- Meta section (6 fields)
- All other sections

**Output:**
- Field-by-field comparison table
- ✅/❌ indicators for each file
- ⚠️ warnings for mismatches
- Summary of missing fields

**Usage:**
```bash
./run-comparison.sh
# or
python3 compare-schemas.py
```

**Exit codes:**
- `0` - Comparison completed (informational only)

### 3. Full Validation (`validate-all.sh`)

Runs both linting and comparison in sequence.

**Usage:**
```bash
./validate-all.sh
```

**Output:**
- Formatted report with both linting and comparison results
- Summary of all checks
- Overall pass/fail status

## GitHub Actions Workflows

### 1. Full Validation (`validate-schemas.yml`)

**Triggers:**
- Push to main/master/develop (when schema files change)
- Pull requests (when schema files change)
- Manual dispatch

**Jobs:**
1. **lint-schemas** - Comprehensive linting
2. **compare-schemas** - Field comparison
3. **validate-json** - JSON syntax validation
4. **validate-xml** - XML schema validation
5. **full-validation** - Complete validation suite
6. **summary** - Validation summary

**Artifacts:**
- Linting report (30 days retention)
- Comparison report (30 days retention)

### 2. Quick Check (`quick-check.yml`)

**Triggers:**
- Every push
- Every pull request

**Jobs:**
- Quick linting
- Schema comparison
- JSON syntax validation

**Purpose:** Fast feedback on commits

## Local Development Workflow

### Before Committing

```bash
# 1. Make your changes to schema files
vim schema.json

# 2. Run validation
./validate-all.sh

# 3. Fix any errors
# (scripts will show exactly what needs to be fixed)

# 4. Commit when all checks pass
git add .
git commit -m "Update schema"
git push
```

### Continuous Validation

```bash
# Watch for changes and auto-validate
watch -n 5 ./run-lint.sh
```

## CI/CD Integration

### Status Badges

Add to README.md:
```markdown
![Validate Schemas](https://github.com/tradik/schema-resume/actions/workflows/validate-schemas.yml/badge.svg)
![Quick Check](https://github.com/tradik/schema-resume/actions/workflows/quick-check.yml/badge.svg)
```

### Pull Request Checks

All PRs must pass:
- ✅ Linting (no errors)
- ✅ JSON syntax validation
- ✅ XML validation
- ℹ️ Comparison (informational)

### Branch Protection

Recommended settings:
- Require status checks to pass before merging
- Require "lint-schemas" job to pass
- Require "validate-json" job to pass
- Require "validate-xml" job to pass

## Troubleshooting

### Common Issues

#### 1. JSON Syntax Error
```
❌ JSON syntax error: Expecting ',' delimiter
```
**Fix:** Check for missing commas, trailing commas, or quote issues

#### 2. Missing Field
```
⚠️ streetAddress ❌ ✅ ❌ ✅
```
**Fix:** Add the field to the file showing ❌

#### 3. XML Validation Error
```
❌ XML syntax error: mismatched tag
```
**Fix:** Check XML structure, ensure all tags are properly closed

### Getting Help

1. Check validation output for specific error messages
2. Review the comparison report to see which files need updates
3. Look at example files for proper structure
4. Open an issue if you need assistance

## Best Practices

1. **Always run validation before committing**
   ```bash
   ./validate-all.sh
   ```

2. **Keep schemas synchronized**
   - When adding a field to one schema, add it to all
   - Use comparison tool to verify

3. **Test with example files**
   ```bash
   python3 -m json.tool example.json > /dev/null
   ```

4. **Review CI logs**
   - Check GitHub Actions for detailed error messages
   - Download artifacts for full reports

5. **Update documentation**
   - Document new fields in README
   - Update CHANGELOG.md

## Version Control

### Pre-commit Hook (Optional)

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
./run-lint.sh
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Commit aborted."
    exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Maintenance

### Regular Tasks

- [ ] Review validation reports weekly
- [ ] Update validation scripts as needed
- [ ] Monitor CI/CD performance
- [ ] Update dependencies (Python, actions)
- [ ] Review and close validation-related issues

### Updating Validation Rules

1. Modify `lint-schemas.py` or `compare-schemas.py`
2. Test locally
3. Update this documentation
4. Commit changes
5. Monitor CI for issues

---

**Last Updated:** 2025-10-17
**Maintained By:** Schema Resume Team
