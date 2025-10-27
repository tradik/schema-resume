# Schema Resume Validator (PHP)

[![Packagist Version](https://img.shields.io/packagist/v/schema-resume/validator.svg)](https://packagist.org/packages/schema-resume/validator)
[![PHP Version](https://img.shields.io/packagist/php-v/schema-resume/validator.svg)](https://packagist.org/packages/schema-resume/validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official PHP package for validating resumes against the [Schema Resume](https://schema-resume.org/) JSON Schema.

## Installation

Install via Composer:

```bash
composer require schema-resume/validator
```

## Usage

### Basic Validation

```php
<?php

require 'vendor/autoload.php';

use SchemaResume\Validator;

$validator = new Validator();

$resume = [
    '$schema' => 'https://schema-resume.org/schema.json',
    'basics' => [
        'name' => 'John Doe',
        'label' => 'Software Engineer',
        'email' => 'john.doe@example.com',
    ],
    'work' => [
        [
            'name' => 'Tech Corp',
            'position' => 'Senior Developer',
            'startDate' => '2020-01',
        ],
    ],
];

$result = $validator->validate($resume);

if ($result['valid']) {
    echo "✓ Resume is valid!\n";
} else {
    echo "✗ Validation errors:\n";
    foreach ($result['errors'] as $error) {
        echo "  - {$error['path']}: {$error['message']}\n";
    }
}
```

### Validating JSON String

```php
<?php

use SchemaResume\Validator;

$validator = new Validator();

$resumeJson = '{
    "$schema": "https://schema-resume.org/schema.json",
    "basics": {
        "name": "Jane Smith",
        "email": "jane@example.com"
    }
}';

$result = $validator->validate($resumeJson);

echo "Valid: " . ($result['valid'] ? 'Yes' : 'No') . "\n";
```

### Custom Schema

```php
<?php

use SchemaResume\Validator;

// Use custom schema file
$validator = new Validator('path/to/custom-schema.json');
$result = $validator->validate($resume);
```

### Accessing Schema Files

```php
<?php

use SchemaResume\Validator;

$validator = new Validator();

// Get schema
$schema = $validator->getSchema();
echo "Schema version: " . $schema->version . "\n";

// Get meta-schema
$metaSchema = $validator->getMetaSchema();
echo "Meta-schema title: " . $metaSchema->title . "\n";

// Get JSON-LD context
$context = $validator->getContext();
var_dump($context);
```

## API Reference

### `Validator`

Main validator class.

#### `__construct(?string $schemaPath = null)`

Create a new validator instance.

**Parameters:**
- `$schemaPath` (string, optional): Path to custom schema file

**Throws:**
- `RuntimeException`: If schema files cannot be loaded

#### `validate(array|object|string $resume): array`

Validate a resume document.

**Parameters:**
- `$resume`: Resume data as array, object, or JSON string

**Returns:** Array with:
- `valid` (bool): Whether the resume is valid
- `errors` (array): List of validation errors

**Throws:**
- `InvalidArgumentException`: If resume data is invalid

#### `getSchema(): object`

Returns the JSON Schema as an object.

#### `getMetaSchema(): object`

Returns the meta-schema as an object.

#### `getContext(): object`

Returns the JSON-LD context as an object.

## Complete Example

```php
<?php

require 'vendor/autoload.php';

use SchemaResume\Validator;

$validator = new Validator();

// Complete resume example
$resume = [
    '$schema' => 'https://schema-resume.org/schema.json',
    'basics' => [
        'name' => 'Jane Smith',
        'label' => 'Full Stack Developer',
        'email' => 'jane@example.com',
        'phone' => '+1-555-123-4567',
        'url' => 'https://janesmith.dev',
        'summary' => 'Experienced developer with 8+ years in web development',
        'location' => [
            'city' => 'San Francisco',
            'countryCode' => 'US',
            'region' => 'California',
        ],
    ],
    'work' => [
        [
            'name' => 'Tech Company',
            'position' => 'Senior Developer',
            'startDate' => '2020-03',
            'highlights' => [
                'Led team of 5 developers',
                'Improved performance by 40%',
            ],
        ],
    ],
    'skills' => [
        [
            'name' => 'Web Development',
            'level' => 'Expert',
            'keywords' => ['JavaScript', 'React', 'Node.js'],
        ],
    ],
];

// Validate
$result = $validator->validate($resume);

if ($result['valid']) {
    echo "✓ Resume is valid!\n\n";
    echo "Resume Summary:\n";
    echo "  Name: {$resume['basics']['name']}\n";
    echo "  Title: {$resume['basics']['label']}\n";
    echo "  Email: {$resume['basics']['email']}\n";
    echo "  Work Experience: " . count($resume['work']) . " position(s)\n";
    echo "  Skills: " . count($resume['skills']) . " skill area(s)\n";
} else {
    echo "✗ Validation failed:\n\n";
    foreach ($result['errors'] as $i => $error) {
        echo "Error " . ($i + 1) . ":\n";
        echo "  Path: {$error['path']}\n";
        echo "  Message: {$error['message']}\n";
        echo "\n";
    }
}
```

### Error Handling

```php
<?php

use SchemaResume\Validator;

try {
    $validator = new Validator();
    
    $invalidResume = [
        'basics' => [
            'email' => 'not-an-email', // Invalid email format
        ],
    ];
    
    $result = $validator->validate($invalidResume);
    
    if (!$result['valid']) {
        echo "Expected validation errors found:\n";
        foreach ($result['errors'] as $error) {
            echo "  • {$error['path']}: {$error['message']}\n";
        }
    }
} catch (\RuntimeException $e) {
    echo "Schema error: " . $e->getMessage() . "\n";
} catch (\InvalidArgumentException $e) {
    echo "Invalid input: " . $e->getMessage() . "\n";
}
```

## Requirements

- PHP 8.0 or higher
- Composer

## Links

- **Website**: https://schema-resume.org/
- **Documentation**: https://github.com/tradik/schema-resume
- **Online Validator**: https://schema-resume.org/validator.html
- **Packagist**: https://packagist.org/packages/schema-resume/validator
- **Issues**: https://github.com/tradik/schema-resume/issues

## Support

For questions or issues:
- Email: info@schema-resume.org or support@tradik.com
- GitHub Issues: https://github.com/tradik/schema-resume/issues

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see the [Contributing Guide](https://github.com/tradik/schema-resume/blob/main/CONTRIBUTING.md).
