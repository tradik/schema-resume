const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('./schema.json');
const metaSchema = require('./meta-schema.json');
const context = require('./context.jsonld');

/**
 * Create a validator instance for Schema Resume
 * @param {Object} options - AJV options
 * @returns {Object} Validator instance with validate method
 */
function createValidator(options = {}) {
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true,
    ...options
  });
  
  addFormats(ajv);
  
  // Add meta-schema
  ajv.addMetaSchema(metaSchema);
  
  // Compile the schema
  const validate = ajv.compile(schema);
  
  return {
    /**
     * Validate a resume object
     * @param {Object} resume - Resume data to validate
     * @returns {Object} Validation result with valid flag and errors
     */
    validate: (resume) => {
      const valid = validate(resume);
      return {
        valid,
        errors: validate.errors || []
      };
    },
    
    /**
     * Get the schema
     * @returns {Object} JSON Schema
     */
    getSchema: () => schema,
    
    /**
     * Get the meta-schema
     * @returns {Object} Meta Schema
     */
    getMetaSchema: () => metaSchema,
    
    /**
     * Get the JSON-LD context
     * @returns {Object} JSON-LD context
     */
    getContext: () => context,
    
    /**
     * Get the AJV instance
     * @returns {Object} AJV instance
     */
    getAjv: () => ajv
  };
}

module.exports = {
  createValidator,
  schema,
  metaSchema,
  context
};
