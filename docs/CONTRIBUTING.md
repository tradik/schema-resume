# Contributing to Schema Resume

Thank you for your interest in contributing to Schema Resume! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

### Reporting Issues

- Use the [GitHub issue tracker](https://github.com/tradik/schema-resume/issues)
- Check if the issue already exists before creating a new one
- Provide clear description and examples
- Include schema version and validation tool used

### Suggesting Enhancements

- Open an issue with the `enhancement` label
- Clearly describe the proposed feature
- Explain the use case and benefits
- Provide examples if possible

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/tradik/schema-resume.git
   cd schema-resume
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards below
   - Update documentation as needed
   - Add examples for new fields

4. **Test your changes**
   ```bash
   # Validate schema
   ajv compile -s schema.json --strict=false
   
   # Validate example
   ajv validate -s schema.json -d example.json --strict=false
   ```

5. **Update CHANGELOG.md**
   - Add your changes under the `[Unreleased]` section
   - Follow the existing format

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Wait for review and address feedback

## 📋 Coding Standards

### JSON Schema Guidelines

- **Follow JSON Schema Draft 07 specification**
- **Use descriptive field names** in camelCase
- **Provide detailed descriptions** for all fields
- **Include examples** in descriptions where helpful
- **Set appropriate types** and formats
- **Use `additionalProperties: true`** for extensibility
- **Define reusable patterns** in `definitions` section

### Field Naming Conventions

- Use camelCase: `startDate`, `countryCode`
- Be descriptive: `institution` not `inst`
- Match common industry terms
- Maintain consistency with existing fields

### Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md for all changes
- Add examples for new fields
- Keep documentation clear and concise

### Example Format

When adding new fields, include examples:

```json
"fieldName": {
  "type": "string",
  "description": "Clear description of the field. e.g. Example value"
}
```

## 🧪 Testing

Before submitting a PR:

1. **Validate schema structure**
   ```bash
   ajv compile -s schema.json --strict=false
   ```

2. **Validate example against schema**
   ```bash
   ajv validate -s schema.json -d example.json --strict=false
   ```

3. **Check JSON formatting**
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('schema.json', 'utf8'))"
   ```

4. **Test with your own resume data**

## 🎯 Clean Code Principles

We follow these principles:

### Separation of Concerns (SOC)
- Keep schema definitions modular
- Use `definitions` for reusable patterns

### Single Responsibility Principle (SRP)
- Each field should have one clear purpose
- Avoid overloading field meanings

### Documentation Your Code (DYC)
- All fields must have descriptions
- Include examples where helpful
- Keep README.md up to date

### Don't Repeat Yourself (DRY)
- Use `$ref` for repeated patterns
- Define common types in `definitions`

### Keep It Simple (KIS)
- Avoid unnecessary complexity
- Use standard formats (ISO 8601, RFC 3986)
- Make fields optional when appropriate

### You Ain't Gonna Need It (YAGNI)
- Only add fields that serve clear use cases
- Avoid speculative features

## 📝 Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

Examples:
```
feat: add certification expiry date field
fix: correct ISO 8601 date pattern
docs: update integration examples
```

## 🔄 Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes to schema structure
- **MINOR** (0.x.0): New fields or features (backwards-compatible)
- **PATCH** (0.0.x): Bug fixes and documentation (backwards-compatible)

## 🚫 What Not to Do

- Don't remove existing fields without discussion
- Don't change field types without major version bump
- Don't add fields without clear use cases
- Don't submit PRs without updating CHANGELOG.md
- Don't ignore validation errors
- Don't hardcode values or reduce flexibility

## 📚 Resources

- [JSON Schema Documentation](https://json-schema.org/)
- [JSON Schema Draft 07 Spec](https://json-schema.org/draft-07/json-schema-release-notes.html)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 💬 Questions?

- Open an [issue](https://github.com/tradik/schema-resume/issues)
- Start a [discussion](https://github.com/tradik/schema-resume/discussions)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions
- Help others learn and grow

## 🎉 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to Schema Resume! 🙏
