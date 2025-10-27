const { createValidator, schema, metaSchema, context } = require('./index');

console.log('Running tests for @schema-resume/validator\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Validator creation
test('createValidator() should return a validator instance', () => {
  const validator = createValidator();
  if (!validator || typeof validator.validate !== 'function') {
    throw new Error('Validator instance is invalid');
  }
});

// Test 2: Schema export
test('schema should be exported', () => {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Schema is not exported correctly');
  }
  if (!schema.$schema || !schema.$id) {
    throw new Error('Schema is missing required fields');
  }
});

// Test 3: Meta-schema export
test('metaSchema should be exported', () => {
  if (!metaSchema || typeof metaSchema !== 'object') {
    throw new Error('Meta-schema is not exported correctly');
  }
});

// Test 4: Context export
test('context should be exported', () => {
  if (!context || typeof context !== 'object') {
    throw new Error('Context is not exported correctly');
  }
  if (!context['@context']) {
    throw new Error('Context is missing @context field');
  }
});

// Test 5: Valid resume validation
test('Valid resume should pass validation', () => {
  const validator = createValidator();
  const resume = {
    "$schema": "https://schema-resume.org/schema.json",
    "basics": {
      "name": "Test User",
      "email": "test@example.com"
    }
  };
  const result = validator.validate(resume);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 6: Invalid email format
test('Invalid email should fail validation', () => {
  const validator = createValidator();
  const resume = {
    "basics": {
      "email": "not-an-email"
    }
  };
  const result = validator.validate(resume);
  if (result.valid) {
    throw new Error('Should have failed validation for invalid email');
  }
});

// Test 7: ISO 8601 date validation
test('Valid ISO 8601 dates should pass', () => {
  const validator = createValidator();
  const resume = {
    "work": [
      {
        "name": "Company",
        "position": "Developer",
        "startDate": "2020-03-15"
      }
    ]
  };
  const result = validator.validate(resume);
  if (!result.valid) {
    throw new Error(`Date validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 8: Partial ISO 8601 dates
test('Partial ISO 8601 dates (year-month) should pass', () => {
  const validator = createValidator();
  const resume = {
    "work": [
      {
        "name": "Company",
        "position": "Developer",
        "startDate": "2020-03"
      }
    ]
  };
  const result = validator.validate(resume);
  if (!result.valid) {
    throw new Error(`Partial date validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 9: Year-only dates
test('Year-only dates should pass', () => {
  const validator = createValidator();
  const resume = {
    "education": [
      {
        "institution": "University",
        "area": "CS",
        "startDate": "2020"
      }
    ]
  };
  const result = validator.validate(resume);
  if (!result.valid) {
    throw new Error(`Year-only date validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 10: Getter methods
test('Validator getter methods should work', () => {
  const validator = createValidator();
  if (!validator.getSchema()) throw new Error('getSchema() failed');
  if (!validator.getMetaSchema()) throw new Error('getMetaSchema() failed');
  if (!validator.getContext()) throw new Error('getContext() failed');
  if (!validator.getAjv()) throw new Error('getAjv() failed');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests completed: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`${'='.repeat(50)}`);

process.exit(failed > 0 ? 1 : 0);
