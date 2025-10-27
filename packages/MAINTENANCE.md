# Package Maintenance Guide

This guide explains how to maintain the packages in this repository.

## Schema File Synchronization

**Important**: Schema files in packages are **copies**, not symlinks. This ensures compatibility with GitHub Pages and package registries.

### When to Sync

Run the sync script whenever you update any of these files:
- `schema.json`
- `meta-schema.json`
- `context.jsonld`
- `xml/1.0/schema-resume.xsd`
- `LICENSE`

### How to Sync

From the repository root:

```bash
./sync-schema-files.sh
```

This will copy the latest schema files to all package directories:
- `packages/npm/`
- `packages/python/src/schema_resume/schemas/`
- `packages/golang/schemas/`
- `packages/java/src/main/resources/schemas/`
- `packages/ruby/schemas/`
- `packages/php/schemas/`

### Automated Sync

You can add this to your workflow:

```bash
# Before committing schema changes
./sync-schema-files.sh
git add packages/*/schemas/* packages/*/*.json packages/*/*.jsonld packages/*/*.xsd
git commit -m "Sync schema files to packages"
```

## Version Updates

When releasing a new version (e.g., 1.1.1), update the version in these files:

### Root Files
- [ ] `package.json` - line 3
- [ ] `schema.json` - version field
- [ ] `meta-schema.json` - version field and title

### Package Files
- [ ] `packages/npm/package.json` - version field
- [ ] `packages/python/setup.py` - version parameter
- [ ] `packages/python/pyproject.toml` - version field
- [ ] `packages/python/src/schema_resume/__init__.py` - __version__
- [ ] `packages/python/src/schema_resume/version.py` - VERSION
- [ ] `packages/java/pom.xml` - version tag
- [ ] `packages/ruby/schema-resume-validator.gemspec` - spec.version
- [ ] `packages/ruby/lib/schema_resume/version.rb` - VERSION
- [ ] `packages/php/composer.json` - version field

### XML Schema
- [ ] `xml/1.0/schema-resume.xsd` - version attribute

### After Version Update

1. Sync schema files: `./sync-schema-files.sh`
2. Test all packages: `./test-packages.sh`
3. Commit changes
4. Create and push tag: `git tag v1.1.1 && git push origin v1.1.1`

## Testing Before Release

Always test packages locally before releasing:

```bash
# Test all packages
./test-packages.sh

# Or test individually
./test-packages.sh npm
./test-packages.sh python
./test-packages.sh go
./test-packages.sh java
./test-packages.sh ruby
./test-packages.sh php
```

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## Release Checklist

Before creating a release:

- [ ] Update version numbers in all files
- [ ] Run `./sync-schema-files.sh`
- [ ] Run `./test-packages.sh` - all tests pass
- [ ] Update CHANGELOG.md
- [ ] Commit all changes
- [ ] Create git tag: `git tag v1.x.x`
- [ ] Push tag: `git push origin v1.x.x`
- [ ] GitHub Actions will automatically publish packages

## Package-Specific Maintenance

### NPM
- Update dependencies: `cd packages/npm && npm update`
- Check for vulnerabilities: `npm audit`

### Python
- Update dependencies in `setup.py` and `pyproject.toml`
- Test with multiple Python versions: `tox` (if configured)

### Go
- Update dependencies: `cd packages/golang && go get -u && go mod tidy`
- Check for vulnerabilities: `go list -m all | nancy sleuth`

### Java
- Update dependencies in `pom.xml`
- Check for updates: `mvn versions:display-dependency-updates`

### Ruby
- Update dependencies in `.gemspec`
- Check for vulnerabilities: `bundle audit`

### PHP
- Update dependencies: `cd packages/php && composer update`
- Check for vulnerabilities: `composer audit`

## Common Issues

### Schema Files Out of Sync

If packages have outdated schema files:

```bash
./sync-schema-files.sh
git add packages/
git commit -m "Sync schema files"
```

### Broken Symlinks

We don't use symlinks anymore. If you see broken symlinks:

```bash
# Remove all symlinks in packages
find packages -type l -delete

# Sync files
./sync-schema-files.sh
```

### GitHub Pages Deployment Fails

If tar complains about missing files:
1. Ensure schema files are copied, not symlinked
2. Run `./sync-schema-files.sh`
3. Commit and push changes

### Version Mismatch

If different packages have different versions:
1. Check all version files listed above
2. Update to match
3. Run `./sync-schema-files.sh`
4. Test with `./test-packages.sh`

## Automation Ideas

Consider creating:

1. **Pre-commit hook** to sync schema files automatically
2. **Version bump script** to update all version numbers at once
3. **CI check** to verify schema files are in sync

## Support

For questions about package maintenance:
- Email: info@schema-resume.org or support@tradik.com
- Issues: https://github.com/tradik/schema-resume/issues
