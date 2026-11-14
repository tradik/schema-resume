require 'json'
require 'json-schema'
require_relative 'schema_resume/validator'
require_relative 'schema_resume/version'

module SchemaResume
  class Error < StandardError; end
  class ValidationError < Error; end
  class SchemaError < Error; end

  # Convenience method to validate a resume
  #
  # @param resume [Hash, String] Resume data as hash or JSON string
  # @return [Hash] Validation result with :valid and :errors keys
  def self.validate(resume)
    validator = Validator.new
    validator.validate(resume)
  end
end
