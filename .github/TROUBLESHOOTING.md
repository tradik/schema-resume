# GitHub Actions Troubleshooting

## Common Issues and Solutions

### Issue: "Dependencies lock file is not found"

**Error Message:**
```
Dependencies lock file is not found in /home/runner/work/schema-resume/schema-resume. 
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```

**Solution:**
This warning appears when using `cache: 'npm'` in the setup-node action without a lock file. We've resolved this by:
1. Removing the `cache: 'npm'` option from the workflow
2. Installing dependencies globally instead of locally
3. Adding `package-lock.json` to the repository (optional)

**Current Configuration:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    # No cache option - we install globally

- name: Install dependencies
  run: |
    npm install -g ajv-cli ajv-formats
```

### Issue: Schema Validation Fails

**Possible Causes:**
1. Invalid JSON syntax in schema.json or example.json
2. Schema doesn't follow JSON Schema specification
3. Example doesn't match schema requirements

**Solution:**
```bash
# Test locally first
ajv compile -s schema.json --strict=false
ajv validate -s schema.json -d example.json --strict=false

# Check JSON syntax
node -e "JSON.parse(require('fs').readFileSync('schema.json', 'utf8'))"
node -e "JSON.parse(require('fs').readFileSync('example.json', 'utf8'))"
```

### Issue: GitHub Pages Not Deploying

**Possible Causes:**
1. GitHub Pages not enabled in repository settings
2. Workflow permissions not set correctly
3. Branch protection rules blocking deployment

**Solution:**
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Ensure workflow has correct permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Issue: Workflow Fails on Push

**Check:**
1. Workflow file syntax is valid YAML
2. All referenced files exist
3. Node.js version is supported (we use Node 20)

**Debug Steps:**
```bash
# Validate YAML syntax locally
npm install -g js-yaml
js-yaml .github/workflows/validate-schema.yml

# Test commands locally
ajv compile -s schema.json --strict=false
ajv validate -s schema.json -d example.json --strict=false
```

## Workflow Files

### validate-schema.yml
- **Purpose**: Validates schema structure and example
- **Triggers**: Push to main/develop, PRs, manual dispatch
- **Dependencies**: ajv-cli, ajv-formats (installed globally)

### deploy-pages.yml
- **Purpose**: Deploys to GitHub Pages
- **Triggers**: Push to main, manual dispatch
- **Permissions**: Requires pages write access

## Best Practices

1. **Test Locally First**: Always validate changes locally before pushing
2. **Use --strict=false**: Our self-hosted schema doesn't need strict mode
3. **Check Actions Tab**: Monitor workflow runs in GitHub Actions tab
4. **Read Error Messages**: GitHub Actions provides detailed error logs

## Getting Help

If you encounter issues not covered here:

1. Check the [Actions tab](../../actions) for detailed logs
2. Review [SETUP.md](../../SETUP.md) for setup instructions
3. Open an [issue](../../issues) with:
   - Error message
   - Workflow run link
   - Steps to reproduce

## Useful Commands

```bash
# Validate schema locally
npm test

# Check JSON syntax
npm run format:check

# Install dependencies globally
npm install -g ajv-cli ajv-formats

# Validate against hosted schema
ajv validate -s https://tradik.github.io/schema-resume/schema.json -d your-resume.json --strict=false
```

## Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AJV Documentation](https://ajv.js.org/)
- [JSON Schema Specification](https://json-schema.org/)
