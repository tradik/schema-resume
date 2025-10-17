# GitHub Actions Workflows

This directory contains automated validation workflows for the schema-resume project.

## Workflows

### 1. `validate-schemas.yml` - Full Validation Suite

**Triggers:**
- Push to main/master/develop branches (when schema files change)
- Pull requests to main/master/develop branches (when schema files change)
- Manual workflow dispatch

**Jobs:**
1. **lint-schemas** - Runs comprehensive linting on all 4 schema files
2. **compare-schemas** - Compares fields across all schema files
3. **validate-json** - Validates JSON syntax for all JSON files
4. **validate-xml** - Validates XML schema syntax
5. **full-validation** - Runs complete validation suite
6. **summary** - Posts validation summary

**Artifacts:**
- Linting report (retained for 30 days)
- Comparison report (retained for 30 days)

### 2. `quick-check.yml` - Quick Validation

**Triggers:**
- Every push
- Every pull request

**Jobs:**
- Quick linting check
- Schema comparison
- JSON syntax validation

This runs faster and provides immediate feedback on commits.

## Local Testing

Before pushing, you can run the same checks locally:

```bash
# Run linting
./run-lint.sh

# Run comparison
./run-comparison.sh

# Run both
./validate-all.sh
```

## Exit Codes

- **0** - All checks passed
- **1** - Linting errors found (will fail CI)
- Comparison is informational only (won't fail CI)

## Badges

You can add these badges to your README.md:

```markdown
![Validate Schemas](https://github.com/tradik/schema-resume/actions/workflows/validate-schemas.yml/badge.svg)
![Quick Check](https://github.com/tradik/schema-resume/actions/workflows/quick-check.yml/badge.svg)
```

## Files Monitored

The workflows monitor changes to:
- `schema.json`
- `context.jsonld`
- `meta-schema.json`
- `xml/1.0/schema-resume.xsd`
- Workflow files themselves

## Requirements

- Python 3.11+
- No external dependencies (uses standard library only)
- xmllint (for XML validation, installed automatically in CI)
