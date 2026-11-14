package org.schemaresume.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.Error;
import com.networknt.schema.InputFormat;
import com.networknt.schema.Schema;
import com.networknt.schema.SchemaRegistry;
import com.networknt.schema.dialect.Dialect;
import com.networknt.schema.dialect.Dialects;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Validator for Schema Resume JSON documents.
 *
 * <p>The public API takes and returns Jackson 2 ({@code com.fasterxml.jackson}) nodes, as it
 * always has. networknt json-schema-validator 3.x is built on Jackson 3, so documents are handed
 * to it as JSON text and callers never see the second Jackson.
 */
public class ResumeValidator {
    /** IRI declared in the {@code $schema} keyword of schema.json; resolved locally as a Draft-07 dialect. */
    private static final String META_SCHEMA_IRI = "https://schema-resume.org/meta-schema.json";

    private final Schema schema;
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
        
        // schema.json declares draft-07 as its $schema; copies embedded before 1.3.0 declared our own
        // meta-schema IRI. Register both, the IRI as a Draft-07 dialect, so neither is ever fetched
        // over the network (networknt 3.x refuses dialects it was not given).
        Dialect resumeDialect = Dialect.builder(META_SCHEMA_IRI, Dialects.getDraft7()).build();
        SchemaRegistry registry = SchemaRegistry.withDialects(List.of(Dialects.getDraft7(), resumeDialect));
        this.schema = registry.getSchema(schemaNode.toString(), InputFormat.JSON);
    }

    /**
     * Load a resource from classpath.
     *
     * @param path Resource path
     * @return JsonNode of the resource
     * @throws IOException if resource cannot be loaded
     */
    JsonNode loadResource(String path) throws IOException {
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
        List<Error> errors = schema.validate(resume.toString(), InputFormat.JSON);

        List<ValidationError> errorList = new ArrayList<>();
        for (Error error : errors) {
            errorList.add(new ValidationError(
                error.getInstanceLocation().toString(),
                error.getKeyword(),
                error.getMessage()
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
