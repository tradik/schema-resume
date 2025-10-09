# Setup Guide for Schema Resume

This guide will help you set up the Schema Resume repository with GitHub Pages hosting.

## 📋 Prerequisites

- Git installed on your system
- GitHub account
- Node.js 18+ (for local validation)

## 🚀 Initial Setup

### 1. Push to GitHub

If you haven't already pushed the repository to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial commit - schema resume v1.0.0"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/tradik/schema-resume.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/tradik/schema-resume`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
5. Save the settings

The GitHub Actions workflow will automatically deploy your site when you push to the main branch.

### 3. Verify Deployment

After pushing, check the Actions tab:
1. Go to `https://github.com/tradik/schema-resume/actions`
2. You should see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 1-2 minutes)
4. Your site will be available at: `https://tradik.github.io/schema-resume/`

### 4. Test Schema URL

Once deployed, test the schema URL:

```bash
# Using curl
curl https://tradik.github.io/schema-resume/schema.json

# Using wget
wget https://tradik.github.io/schema-resume/schema.json
```

## 🔧 Local Development

### Install Dependencies

```bash
# Install project dependencies (optional - only needed for local development)
npm install

# OR install AJV globally for validation
npm install -g ajv-cli ajv-formats
```

### Validate Schema

```bash
# If you installed project dependencies:
npm run validate        # Validate schema structure
npm run validate:example # Validate example against schema
npm test                # Run all tests

# If you installed AJV globally:
ajv compile -s schema.json --strict=false
ajv validate -s schema.json -d example.json --strict=false
```

### Check JSON Formatting

```bash
npm run format:check
```

## 📝 Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Edit the relevant files:
- `schema.json` - Schema definition
- `example.json` - Example resume
- `README.md` - Documentation
- `CHANGELOG.md` - Version history

### 3. Validate Changes

```bash
npm test
```

### 4. Commit and Push

```bash
git add .
git commit -m "feat: description of your changes"
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to your repository on GitHub
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select your branch
5. Fill in the PR description
6. Submit the PR

## 🔄 Continuous Integration

The repository includes two GitHub Actions workflows:

### 1. Schema Validation (`validate-schema.yml`)

Runs on every push and pull request:
- Validates schema structure
- Validates example.json against schema
- Checks JSON formatting

### 2. GitHub Pages Deployment (`deploy-pages.yml`)

Runs on every push to main branch:
- Deploys the site to GitHub Pages
- Makes schema.json publicly accessible

## 🌐 Using the Schema

### In Your Resume JSON

```json
{
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "Your Name",
    ...
  }
}
```

### Validation with AJV

```bash
# Install AJV CLI globally
npm install -g ajv-cli ajv-formats

# Validate your resume
ajv validate -s https://tradik.github.io/schema-resume/schema.json -d your-resume.json
```

### Validation with Python

```python
import json
import jsonschema
import requests

# Load schema from GitHub Pages
schema_url = "https://tradik.github.io/schema-resume/schema.json"
schema = requests.get(schema_url).json()

# Load your resume
with open('your-resume.json') as f:
    resume = json.load(f)

# Validate
jsonschema.validate(instance=resume, schema=schema)
print("Resume is valid!")
```

## 📊 Version Management

### Creating a New Release

1. Update version in `package.json`
2. Update `CHANGELOG.md` with changes
3. Update version in schema `meta` section (if applicable)
4. Commit changes:
   ```bash
   git add .
   git commit -m "chore: bump version to x.y.z"
   git push
   ```
5. Create a GitHub release:
   - Go to Releases tab
   - Click "Create a new release"
   - Tag: `vx.y.z`
   - Title: `Version x.y.z`
   - Description: Copy from CHANGELOG.md
   - Publish release

## 🐛 Troubleshooting

### GitHub Pages Not Deploying

1. Check Actions tab for errors
2. Ensure GitHub Pages is enabled in Settings
3. Verify workflow file is in `.github/workflows/`
4. Check repository permissions

### Schema Validation Failing

1. Validate JSON syntax:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('schema.json', 'utf8'))"
   ```
2. Check schema structure:
   ```bash
   npm run validate
   ```
3. Review error messages carefully

### Example Not Validating

1. Ensure example.json follows schema structure
2. Check for missing required fields
3. Verify date formats (ISO 8601)
4. Validate URLs and email formats

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [JSON Schema Documentation](https://json-schema.org/)
- [AJV Documentation](https://ajv.js.org/)

## 🆘 Getting Help

If you encounter issues:

1. Check existing [issues](https://github.com/tradik/schema-resume/issues)
2. Review [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

## ✅ Checklist

Before considering setup complete:

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] GitHub Actions workflows running successfully
- [ ] Schema accessible at `https://tradik.github.io/schema-resume/schema.json`
- [ ] Website accessible at `https://tradik.github.io/schema-resume/`
- [ ] Local validation working (`npm test`)
- [ ] Example validates against schema
- [ ] README.md reviewed and accurate
- [ ] CHANGELOG.md up to date

## 🎉 Next Steps

Once setup is complete:

1. Share the schema URL with your team
2. Create additional example resumes
3. Integrate with your applications
4. Contribute improvements
5. Share with the community

---

**Need help?** Open an [issue](https://github.com/tradik/schema-resume/issues) or check the [documentation](./README.md).
