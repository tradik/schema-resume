Gem::Specification.new do |spec|
  spec.name          = "schema-resume-validator"
  spec.version       = "1.1.0"
  spec.authors       = ["Schema Resume", "Tradik"]
  spec.email         = ["info@schema-resume.org", "support@tradik.com"]

  spec.summary       = "JSON Schema validator for Schema Resume"
  spec.description   = "Official Ruby gem for validating resumes against the Schema Resume JSON Schema - comprehensive CV/Resume validation with JSON-LD support"
  spec.homepage      = "https://schema-resume.org/"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 2.7.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/tradik/schema-resume"
  spec.metadata["changelog_uri"] = "https://github.com/tradik/schema-resume/blob/main/CHANGELOG.md"
  spec.metadata["bug_tracker_uri"] = "https://github.com/tradik/schema-resume/issues"
  spec.metadata["documentation_uri"] = "https://github.com/tradik/schema-resume"

  spec.files = Dir[
    "lib/**/*",
    "schemas/**/*",
    "LICENSE",
    "README.md"
  ]
  spec.require_paths = ["lib"]

  spec.add_dependency "json-schema", "~> 4.0"
  spec.add_dependency "json", "~> 2.6"

  spec.add_development_dependency "rspec", "~> 3.12"
  spec.add_development_dependency "rake", "~> 13.0"
end
