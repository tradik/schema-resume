package org.schemaresume.validator;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests for {@link ResumeValidator}.
 */
class ResumeValidatorTest {
    private static ResumeValidator validator;
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @BeforeAll
    static void setUp() throws IOException {
        validator = new ResumeValidator();
    }

    @Test
    void loadsEmbeddedSchemas() {
        assertNotNull(validator.getSchema());
        assertNotNull(validator.getMetaSchema());
        assertNotNull(validator.getContext());
        assertTrue(validator.getSchema().has("properties"));
        assertTrue(validator.getContext().has("@context"));
    }

    @Test
    void acceptsMinimalValidResume() throws IOException {
        String json = "{\"basics\":{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\"}}";
        ResumeValidator.ValidationResult result = validator.validateJson(json);
        assertTrue(result.isValid(), () -> "unexpected errors: " + result.getErrors());
        assertTrue(result.getErrors().isEmpty());
    }

    @Test
    void rejectsInvalidEmail() throws IOException {
        String json = "{\"basics\":{\"name\":\"Jane Doe\",\"email\":\"not-an-email\"}}";
        ResumeValidator.ValidationResult result = validator.validateJson(json);
        assertFalse(result.isValid());
        assertFalse(result.getErrors().isEmpty());
        ResumeValidator.ValidationError error = result.getErrors().get(0);
        assertNotNull(error.getPath());
        assertNotNull(error.getType());
        assertNotNull(error.getMessage());
        assertTrue(error.toString().contains(error.getMessage()));
    }

    @Test
    void rejectsWrongType() throws IOException {
        JsonNode resume = MAPPER.readTree("{\"basics\":\"should be an object\"}");
        ResumeValidator.ValidationResult result = validator.validate(resume);
        assertFalse(result.isValid());
        assertEquals("type", result.getErrors().get(0).getType());
    }

    @Test
    void validatesRepositoryExampleResume() throws IOException {
        try (java.io.InputStream is = getClass().getResourceAsStream("/example.json")) {
            assertNotNull(is, "example.json test resource missing");
            ResumeValidator.ValidationResult result = validator.validate(MAPPER.readTree(is));
            assertTrue(result.isValid(), () -> "unexpected errors: " + result.getErrors());
        }
    }
}
