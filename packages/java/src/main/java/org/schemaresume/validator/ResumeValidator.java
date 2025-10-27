package org.schemaresume.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Validator for Schema Resume JSON documents.
 */
public class ResumeValidator {
    private final JsonSchema schema;
    private final JsonNode schemaNode;
    private final JsonNode metaSchemaNode;
    private final JsonNode contextNode;
    private final ObjectMapper objectMapper;

    /**
     * Creates a new ResumeValidator with embedded schemas.
     *
     * @throws IOException if schema files cannot be loaded
     */
    public ResumeValidator() throws IOException {
        this.objectMapper = new ObjectMapper();
        
        // Load schema files
        this.schemaNode = loadResource("/schemas/schema.json");
        this.metaSchemaNode = loadResource("/schemas/meta-schema.json");
        this.contextNode = loadResource("/schemas/context.jsonld");
        
        // Create JSON Schema validator
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7);
        this.schema = factory.getSchema(schemaNode);
    }

    /**
     * Load a resource from classpath.
     *
     * @param path Resource path
     * @return JsonNode of the resource
     * @throws IOException if resource cannot be loaded
     */
    private JsonNode loadResource(String path) throws IOException {
        try (InputStream is = getClass().getResourceAsStream(path)) {
            if (is == null) {
                throw new IOException("Resource not found: " + path);
            }
            return objectMapper.readTree(is);
        }
    }

    /**
     * Validate a resume document.
     *
     * @param resume Resume data as JsonNode
     * @return ValidationResult containing validation outcome
     */
    public ValidationResult validate(JsonNode resume) {
        Set<ValidationMessage> errors = schema.validate(resume);
        
        List<ValidationError> errorList = new ArrayList<>();
        for (ValidationMessage msg : errors) {
            errorList.add(new ValidationError(
                msg.getPath(),
                msg.getType(),
                msg.getMessage()
            ));
        }
        
        return new ValidationResult(errors.isEmpty(), errorList);
    }

    /**
     * Validate a resume from JSON string.
     *
     * @param resumeJson Resume data as JSON string
     * @return ValidationResult containing validation outcome
     * @throws IOException if JSON parsing fails
     */
    public ValidationResult validateJson(String resumeJson) throws IOException {
        JsonNode resume = objectMapper.readTree(resumeJson);
        return validate(resume);
    }

    /**
     * Get the JSON Schema.
     *
     * @return JsonNode of the schema
     */
    public JsonNode getSchema() {
        return schemaNode;
    }

    /**
     * Get the meta-schema.
     *
     * @return JsonNode of the meta-schema
     */
    public JsonNode getMetaSchema() {
        return metaSchemaNode;
    }

    /**
     * Get the JSON-LD context.
     *
     * @return JsonNode of the context
     */
    public JsonNode getContext() {
        return contextNode;
    }

    /**
     * Validation result containing valid flag and errors.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<ValidationError> errors;

        public ValidationResult(boolean valid, List<ValidationError> errors) {
            this.valid = valid;
            this.errors = errors;
        }

        public boolean isValid() {
            return valid;
        }

        public List<ValidationError> getErrors() {
            return errors;
        }
    }

    /**
     * Validation error details.
     */
    public static class ValidationError {
        private final String path;
        private final String type;
        private final String message;

        public ValidationError(String path, String type, String message) {
            this.path = path;
            this.type = type;
            this.message = message;
        }

        public String getPath() {
            return path;
        }

        public String getType() {
            return type;
        }

        public String getMessage() {
            return message;
        }

        @Override
        public String toString() {
            return String.format("%s: %s (%s)", path, message, type);
        }
    }
}
