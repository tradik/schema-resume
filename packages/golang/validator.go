// Package validator provides JSON Schema validation for Schema Resume documents.
package validator

import (
	_ "embed"
	"encoding/json"
	"fmt"

	"github.com/xeipuuv/gojsonschema"
)

//go:embed schemas/schema.json
var schemaJSON []byte

//go:embed schemas/meta-schema.json
var metaSchemaJSON []byte

//go:embed schemas/context.jsonld
var contextJSON []byte

// Validator provides resume validation functionality
type Validator struct {
	schema     *gojsonschema.Schema
	schemaData map[string]interface{}
	metaSchema map[string]interface{}
	context    map[string]interface{}
}

// ValidationResult contains the validation outcome
type ValidationResult struct {
	Valid  bool            `json:"valid"`
	Errors []ValidationError `json:"errors"`
}

// ValidationError represents a single validation error
type ValidationError struct {
	Field       string `json:"field"`
	Type        string `json:"type"`
	Description string `json:"description"`
	Value       string `json:"value,omitempty"`
}

// NewValidator creates a new resume validator instance
func NewValidator() (*Validator, error) {
	// Parse schema data
	var schemaData map[string]interface{}
	if err := json.Unmarshal(schemaJSON, &schemaData); err != nil {
		return nil, fmt.Errorf("failed to parse schema: %w", err)
	}

	// Parse meta-schema
	var metaSchema map[string]interface{}
	if err := json.Unmarshal(metaSchemaJSON, &metaSchema); err != nil {
		return nil, fmt.Errorf("failed to parse meta-schema: %w", err)
	}

	// Parse context
	var context map[string]interface{}
	if err := json.Unmarshal(contextJSON, &context); err != nil {
		return nil, fmt.Errorf("failed to parse context: %w", err)
	}

	// Create schema loader
	schemaLoader := gojsonschema.NewBytesLoader(schemaJSON)
	schema, err := gojsonschema.NewSchema(schemaLoader)
	if err != nil {
		return nil, fmt.Errorf("failed to create schema: %w", err)
	}

	return &Validator{
		schema:     schema,
		schemaData: schemaData,
		metaSchema: metaSchema,
		context:    context,
	}, nil
}

// Validate validates a resume document
func (v *Validator) Validate(resume interface{}) (*ValidationResult, error) {
	documentLoader := gojsonschema.NewGoLoader(resume)
	result, err := v.schema.Validate(documentLoader)
	if err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	validationResult := &ValidationResult{
		Valid:  result.Valid(),
		Errors: make([]ValidationError, 0),
	}

	if !result.Valid() {
		for _, err := range result.Errors() {
			validationResult.Errors = append(validationResult.Errors, ValidationError{
				Field:       err.Field(),
				Type:        err.Type(),
				Description: err.Description(),
				Value:       fmt.Sprintf("%v", err.Value()),
			})
		}
	}

	return validationResult, nil
}

// ValidateJSON validates a resume from JSON bytes
func (v *Validator) ValidateJSON(resumeJSON []byte) (*ValidationResult, error) {
	var resume interface{}
	if err := json.Unmarshal(resumeJSON, &resume); err != nil {
		return nil, fmt.Errorf("failed to parse resume JSON: %w", err)
	}
	return v.Validate(resume)
}

// GetSchema returns the JSON Schema as a map
func (v *Validator) GetSchema() map[string]interface{} {
	return v.schemaData
}

// GetMetaSchema returns the meta-schema as a map
func (v *Validator) GetMetaSchema() map[string]interface{} {
	return v.metaSchema
}

// GetContext returns the JSON-LD context as a map
func (v *Validator) GetContext() map[string]interface{} {
	return v.context
}

// ValidateResume is a convenience function to validate a resume
func ValidateResume(resume interface{}) (*ValidationResult, error) {
	validator, err := NewValidator()
	if err != nil {
		return nil, err
	}
	return validator.Validate(resume)
}

// ValidateResumeJSON is a convenience function to validate resume from JSON bytes
func ValidateResumeJSON(resumeJSON []byte) (*ValidationResult, error) {
	validator, err := NewValidator()
	if err != nil {
		return nil, err
	}
	return validator.ValidateJSON(resumeJSON)
}
