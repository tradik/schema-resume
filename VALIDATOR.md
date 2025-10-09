# Schema Resume Validator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-validator.html-blue.svg)](https://tradik.github.io/schema-resume/validator.html)
[![Schema Version](https://img.shields.io/badge/Schema-v1.1.0-blue.svg)](https://tradik.github.io/schema-resume/schema.json)

A modern, client-side JSON-LD CV/Resume validator and linter for the Schema Resume specification.

## 🚀 Features

### Core Validation
- **JSON Schema Validation**: Validates against Schema Resume v1.1.0 specification using Ajv
- **JSON-LD Checks**: Verifies @context and Schema.org compatibility
- **Date Format Validation**: Ensures ISO 8601 compliance (YYYY-MM-DD, YYYY-MM, YYYY)
- **Format Validation**: Checks email, URL, and URI formats

### User Experience
- **Real-time Feedback**: Instant validation results with detailed error messages
- **Helpful Suggestions**: Provides actionable recommendations for fixing errors
- **Example CV**: Pre-loaded example to understand the correct format
- **JSON Formatter**: Auto-format JSON with proper indentation
- **Statistics Display**: Shows CV content statistics (work experience, skills, etc.)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Technical Features
- **Client-side Only**: No data sent to servers, complete privacy
- **Modern UI**: Built with TailwindCSS and Lucide icons
- **Fast Performance**: Instant validation with no server round-trips
- **Accessible**: WCAG 2.2 compliant with proper contrast and color usage

## 🎯 Usage

### Online
Visit: [https://tradik.github.io/schema-resume/validator.html](https://tradik.github.io/schema-resume/validator.html)

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/tradik/schema-resume.git
cd schema-resume
```

2. Open `validator.html` in your browser:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Or simply open the file
open validator.html  # macOS
xdg-open validator.html  # Linux
start validator.html  # Windows
```

3. Navigate to `http://localhost:8000/validator.html`

## 📋 Validation Types

### 1. JSON Schema Validation
Validates the structure and data types according to the Schema Resume specification:
- Required fields
- Data types (string, number, array, object)
- Format constraints (email, URL, date)
- Enum values
- Array item types

### 2. JSON-LD Validation
Checks JSON-LD specific requirements:
- Presence of `@context` field
- Presence of `$schema` field
- Schema.org vocabulary compatibility

### 3. Date Format Validation
Ensures all date fields follow ISO 8601 format:
- Full date: `2024-03-15`
- Year-month: `2024-03`
- Year only: `2024`

## 🔧 Technical Stack

- **Ajv v8.12.0**: JSON Schema validator
- **Ajv Formats v2.1.1**: Format validation (email, URL, URI)
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful open-source icon library
- **Vanilla JavaScript**: No framework dependencies

## 📊 Validation Results

### Success State
When validation passes, the validator displays:
- ✓ Success message
- CV statistics (work experiences, education, skills, etc.)
- Next steps and recommendations
- Links to additional validators

### Error State
When validation fails, the validator shows:
- Error count and warning count
- Detailed error messages for each issue
- Field path where the error occurred
- Suggestions for fixing the error
- Additional details (expandable)

### Warning State
Non-critical issues are shown as warnings:
- Missing optional but recommended fields (@context, $schema)
- Best practice suggestions
- JSON-LD compatibility notes

## 🎨 UI Components

### Input Section
- Large textarea for JSON input
- Example loader button
- Clear button
- Validate button
- Format button

### Results Section
- Color-coded messages (green for success, red for errors, yellow for warnings)
- Expandable error details
- Statistics cards
- Help links

### Info Cards
- JSON Schema validation info
- JSON-LD support info
- Instant feedback info

## 🔒 Privacy & Security

- **No Server Communication**: All validation happens in the browser
- **No Data Storage**: Your CV data is never stored or transmitted
- **No Analytics**: No tracking or analytics scripts
- **Open Source**: Fully transparent code

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📱 Mobile Support

Fully responsive design works on:
- iOS Safari
- Android Chrome
- Mobile Firefox
- Samsung Internet

## 🤝 Contributing

Contributions are welcome! To improve the validator:

1. Fork the repository
2. Create a feature branch
3. Make your changes to `validator.html`
4. Test thoroughly across browsers
5. Submit a pull request

### Development Guidelines
- Maintain WCAG 2.2 accessibility standards
- Keep the UI clean and intuitive
- Add helpful error messages
- Test on multiple browsers
- Follow the existing code style

## 🐛 Known Issues

None currently. Please [report issues](https://github.com/tradik/schema-resume/issues) if you find any.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## 🔗 Related Links

- [Schema Resume](https://github.com/tradik/schema-resume)
- [JSON-LD Guide](./JSON-LD.md)
- [Schema Definition](./schema.json)
- [Example CV](./example.json)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Ajv](https://ajv.js.org/) for JSON Schema validation
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- The JSON-LD and Schema.org communities

---

**Made with ❤️ for the developer community**
