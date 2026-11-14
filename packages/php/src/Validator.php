<?php

namespace SchemaResume;

use JsonSchema\Validator as JsonValidator;
use JsonSchema\Constraints\Constraint;

/**
 * Validator for Schema Resume JSON documents.
 */
class Validator
{
    private object $schema;
    private object $metaSchema;
    private object $context;
    private string $schemasDir;

    /**
     * Create a new Validator instance.
     *
     * @param string|null $schemaPath Optional path to custom schema file
     * @throws \RuntimeException If schema files cannot be loaded
     */
    public function __construct(?string $schemaPath = null)
    {
        $this->schemasDir = __DIR__ . '/../schemas';
        
        if ($schemaPath !== null) {
            $this->schema = $this->loadJson($schemaPath);
        } else {
            $this->schema = $this->loadJson($this->schemasDir . '/schema.json');
        }
        
        $this->metaSchema = $this->loadJson($this->schemasDir . '/meta-schema.json');
        $this->context = $this->loadJson($this->schemasDir . '/context.jsonld');
    }

    /**
     * Load JSON file.
     *
     * @param string $path Path to JSON file
     * @return object Decoded JSON object
     * @throws \RuntimeException If file cannot be loaded or parsed
     */
    private function loadJson(string $path): object
    {
        if (!file_exists($path)) {
            throw new \RuntimeException("Schema file not found: {$path}");
        }
        
        $content = file_get_contents($path);
        if ($content === false) {
            throw new \RuntimeException("Failed to read schema file: {$path}");
        }
        
        $json = json_decode($content);
        if (json_last_error() !== JSON_ERROR_NONE || !is_object($json)) {
            throw new \RuntimeException("Invalid JSON in schema file: {$path}");
        }

        return $json;
    }

    /**
     * Validate a resume document.
     *
     * @param array<mixed>|object|string $resume Resume data as array, object, or JSON string
     * @return array{valid: bool, errors: list<array{path: mixed, message: mixed, constraint: mixed}>}
     *         Validation result with 'valid' and 'errors' keys
     * @throws \InvalidArgumentException If resume data is invalid
     */
    public function validate(array|object|string $resume): array
    {
        $resumeData = $this->parseResume($resume);
        
        $validator = new JsonValidator();
        $validator->validate($resumeData, $this->schema, Constraint::CHECK_MODE_NORMAL);
        
        $errors = [];
        if (!$validator->isValid()) {
            /** @var list<array{property?: mixed, message?: mixed, constraint?: mixed}> $reported */
            $reported = $validator->getErrors();
            foreach ($reported as $error) {
                $errors[] = [
                    'path' => $error['property'] ?? null,
                    'message' => $error['message'] ?? null,
                    'constraint' => $error['constraint'] ?? null,
                ];
            }
        }
        
        return [
            'valid' => $validator->isValid(),
            'errors' => $errors,
        ];
    }

    /**
     * Parse resume data from various formats.
     *
     * @param array<mixed>|object|string $resume Resume data
     * @return object Parsed resume object
     * @throws \InvalidArgumentException If resume data is invalid
     */
    private function parseResume(array|object|string $resume): object
    {
        if (is_string($resume)) {
            $decoded = json_decode($resume);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \InvalidArgumentException('Invalid JSON: ' . json_last_error_msg());
            }
            if (!is_object($decoded)) {
                throw new \InvalidArgumentException('Resume must be a JSON object');
            }
            return $decoded;
        }
        
        if (is_array($resume)) {
            // A JSON round trip turns every associative array into an object, nested ones
            // included, and keeps lists as arrays. `(object) $resume` converted only the top
            // level, so `basics`, `work[0]` and the rest failed with "Array value found, but an
            // object is required" for any resume passed as a PHP array.
            if ($resume === []) {
                return new \stdClass(); // as `(object) []` always did
            }
            $decoded = json_decode(json_encode($resume, JSON_THROW_ON_ERROR));
            if (!is_object($decoded)) {
                throw new \InvalidArgumentException('Resume must be an object, not a list');
            }
            return $decoded;
        }

        return $resume;
    }

    /**
     * Get the JSON Schema.
     *
     * @return object The schema
     */
    public function getSchema(): object
    {
        return $this->schema;
    }

    /**
     * Get the meta-schema.
     *
     * @return object The meta-schema
     */
    public function getMetaSchema(): object
    {
        return $this->metaSchema;
    }

    /**
     * Get the JSON-LD context.
     *
     * @return object The context
     */
    public function getContext(): object
    {
        return $this->context;
    }
}
