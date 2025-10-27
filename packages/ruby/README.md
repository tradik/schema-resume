# Schema Resume Validator (Ruby)

[![Gem Version](https://badge.fury.io/rb/schema-resume-validator.svg)](https://badge.fury.io/rb/schema-resume-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Ruby gem for validating resumes against the [Schema Resume](https://schema-resume.org/) JSON Schema.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'schema-resume-validator'
```

And then execute:

```bash
bundle install
```

Or install it yourself as:

```bash
gem install schema-resume-validator
```

## Usage

### Basic Validation

```ruby
require 'schema_resume'

resume = {
  "$schema" => "https://schema-resume.org/schema.json",
  "basics" => {
    "name" => "John Doe",
    "label" => "Software Engineer",
    "email" => "john.doe@example.com"
  },
  "work" => [
    {
      "name" => "Tech Corp",
      "position" => "Senior Developer",
      "startDate" => "2020-01"
    }
  ]
}

result = SchemaResume.validate(resume)

if result[:valid]
  puts "✓ Resume is valid!"
else
  puts "✗ Validation errors:"
  result[:errors].each do |error|
    puts "  - #{error[:path]}: #{error[:message]}"
  end
end
```

### Using the Validator Class

```ruby
require 'schema_resume'

# Create validator instance
validator = SchemaResume::Validator.new

# Validate from hash
resume_data = { "basics" => { "name" => "Jane Doe" } }
result = validator.validate(resume_data)

# Validate from JSON string
json_string = '{"basics": {"name": "John Smith"}}'
result = validator.validate(json_string)

# Access schema files
schema = validator.get_schema
meta_schema = validator.get_meta_schema
context = validator.get_context
```

### Custom Schema

```ruby
require 'schema_resume'

# Use custom schema file
validator = SchemaResume::Validator.new(schema_path: 'custom-schema.json')
result = validator.validate(resume_data)
```

## API Reference

### `SchemaResume.validate(resume)`

Convenience method to validate a resume.

**Parameters:**
- `resume` (Hash or String): Resume data as hash or JSON string

**Returns:** Hash with:
- `:valid` (Boolean): Whether the resume is valid
- `:errors` (Array): List of validation errors (empty if valid)

### `SchemaResume::Validator`

Main validator class.

#### `new(schema_path: nil)`

Initialize validator with optional custom schema.

**Parameters:**
- `schema_path` (String, optional): Path to custom schema file

#### `validate(resume)`

Validate a resume document.

**Parameters:**
- `resume` (Hash or String): Resume data

**Returns:** Hash with validation results

#### `get_schema`

Returns the JSON Schema as a hash.

#### `get_meta_schema`

Returns the meta-schema as a hash.

#### `get_context`

Returns the JSON-LD context as a hash.

## Complete Example

```ruby
require 'schema_resume'

# Create validator
validator = SchemaResume::Validator.new

# Complete resume example
resume = {
  "$schema" => "https://schema-resume.org/schema.json",
  "basics" => {
    "name" => "Jane Smith",
    "label" => "Full Stack Developer",
    "email" => "jane@example.com",
    "phone" => "+1-555-123-4567",
    "url" => "https://janesmith.dev",
    "summary" => "Experienced developer with 8+ years in web development",
    "location" => {
      "city" => "San Francisco",
      "countryCode" => "US",
      "region" => "California"
    }
  },
  "work" => [
    {
      "name" => "Tech Company",
      "position" => "Senior Developer",
      "startDate" => "2020-03",
      "highlights" => [
        "Led team of 5 developers",
        "Improved performance by 40%"
      ]
    }
  ],
  "skills" => [
    {
      "name" => "Web Development",
      "level" => "Expert",
      "keywords" => ["JavaScript", "React", "Node.js"]
    }
  ]
}

# Validate
result = validator.validate(resume)

if result[:valid]
  puts "✓ Resume is valid!"
  puts "\nResume Summary:"
  puts "  Name: #{resume['basics']['name']}"
  puts "  Title: #{resume['basics']['label']}"
  puts "  Email: #{resume['basics']['email']}"
else
  puts "✗ Validation failed:"
  result[:errors].each_with_index do |error, i|
    puts "\nError #{i + 1}:"
    puts "  Path: #{error[:path]}"
    puts "  Message: #{error[:message]}"
  end
end
```

## Requirements

- Ruby 2.7 or higher

## Links

- **Website**: https://schema-resume.org/
- **Documentation**: https://github.com/tradik/schema-resume
- **Online Validator**: https://schema-resume.org/validator.html
- **RubyGems**: https://rubygems.org/gems/schema-resume-validator
- **Issues**: https://github.com/tradik/schema-resume/issues

## Support

For questions or issues:
- Email: info@schema-resume.org or support@tradik.com
- GitHub Issues: https://github.com/tradik/schema-resume/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://github.com/tradik/schema-resume/blob/main/CONTRIBUTING.md).
