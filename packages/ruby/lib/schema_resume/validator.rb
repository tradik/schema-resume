require 'json'
require 'json-schema'

module SchemaResume
  class Validator
    attr_reader :schema, :meta_schema, :context

    def initialize(schema_path: nil)
      @schemas_dir = File.join(File.dirname(__FILE__), '../../schemas')
      
      if schema_path
        @schema = load_json(schema_path)
      else
        @schema = load_json(File.join(@schemas_dir, 'schema.json'))
      end
      
      @meta_schema = load_json(File.join(@schemas_dir, 'meta-schema.json'))
      @context = load_json(File.join(@schemas_dir, 'context.jsonld'))
    end

    # Validate a resume document
    #
    # @param resume [Hash, String] Resume data as hash or JSON string
    # @return [Hash] Validation result with :valid and :errors keys
    def validate(resume)
      resume_data = parse_resume(resume)
      
      errors = JSON::Validator.fully_validate(
        validation_schema,
        resume_data,
        errors_as_objects: true,
        version: :draft6
      )
      
      {
        valid: errors.empty?,
        errors: errors.map { |error| format_error(error) }
      }
    end

    # Get the JSON Schema
    #
    # @return [Hash] The schema
    def get_schema
      @schema
    end

    # Get the meta-schema
    #
    # @return [Hash] The meta-schema
    def get_meta_schema
      @meta_schema
    end

    # Get the JSON-LD context
    #
    # @return [Hash] The context
    def get_context
      @context
    end

    private

    # schema.json declares the draft-07 dialect (since 1.3.0). The json-schema
    # gem implements up to draft-06 and refuses an unknown `$schema`, so the
    # dialect is pinned explicitly and the declaration dropped from the copy it
    # validates with. Draft-07 adds nothing this schema relies on beyond
    # `$comment`, which the gem ignores.
    def validation_schema
      @validation_schema ||= @schema.reject { |key, _| key == '$schema' }
    end

    def load_json(path)
      JSON.parse(File.read(path))
    rescue Errno::ENOENT => e
      raise SchemaError, "Schema file not found: #{path}"
    rescue JSON::ParserError => e
      raise SchemaError, "Invalid JSON in schema file: #{path}"
    end

    def parse_resume(resume)
      case resume
      when Hash
        resume
      when String
        JSON.parse(resume)
      else
        raise ValidationError, "Resume must be a Hash or JSON string"
      end
    rescue JSON::ParserError => e
      raise ValidationError, "Invalid JSON: #{e.message}"
    end

    def format_error(error)
      {
        path: error[:fragment] || '/',
        message: error[:message],
        schema: error[:schema] || {}
      }
    end
  end
end
