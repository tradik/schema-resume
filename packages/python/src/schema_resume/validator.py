"""Resume validator implementation."""

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import jsonschema
from jsonschema import Draft7Validator, validators


class ResumeValidator:
    """Validator for Schema Resume JSON documents."""

    def __init__(self, schema_path: Optional[Path] = None) -> None:
        """
        Initialize the resume validator.

        Args:
            schema_path: Optional path to custom schema file. If not provided,
                        uses the bundled schema.
        """
        self.schema_dir = Path(__file__).parent / "schemas"
        
        if schema_path:
            self.schema = self._load_json(schema_path)
        else:
            self.schema = self._load_json(self.schema_dir / "schema.json")
        
        self.meta_schema = self._load_json(self.schema_dir / "meta-schema.json")
        self.context = self._load_json(self.schema_dir / "context.jsonld")
        
        # Create validator with format checking
        format_checker = jsonschema.FormatChecker()
        self.validator = Draft7Validator(self.schema, format_checker=format_checker)

    def _load_json(self, path: Path) -> Dict[str, Any]:
        """Load JSON file from path."""
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def validate(self, resume: Union[Dict[str, Any], str, Path]) -> Dict[str, Any]:
        """
        Validate a resume document.

        Args:
            resume: Resume data as dict, JSON string, or path to JSON file

        Returns:
            Dictionary with validation results:
            {
                "valid": bool,
                "errors": List[Dict[str, Any]]
            }

        Raises:
            ValueError: If resume data is invalid
        """
        # Load resume data
        if isinstance(resume, (str, Path)):
            if isinstance(resume, str) and resume.strip().startswith("{"):
                # JSON string
                resume_data = json.loads(resume)
            else:
                # File path
                resume_data = self._load_json(Path(resume))
        else:
            resume_data = resume

        # Validate
        errors = list(self.validator.iter_errors(resume_data))
        
        return {
            "valid": len(errors) == 0,
            "errors": [self._format_error(error) for error in errors]
        }

    def _format_error(self, error: jsonschema.ValidationError) -> Dict[str, Any]:
        """Format validation error for output."""
        return {
            "path": "/" + "/".join(str(p) for p in error.absolute_path),
            "message": error.message,
            "schema_path": "/" + "/".join(str(p) for p in error.absolute_schema_path),
            "validator": error.validator,
            "validator_value": error.validator_value,
        }

    def get_schema(self) -> Dict[str, Any]:
        """Get the JSON Schema."""
        return self.schema

    def get_meta_schema(self) -> Dict[str, Any]:
        """Get the meta-schema."""
        return self.meta_schema

    def get_context(self) -> Dict[str, Any]:
        """Get the JSON-LD context."""
        return self.context


def validate_resume(resume: Union[Dict[str, Any], str, Path]) -> Dict[str, Any]:
    """
    Convenience function to validate a resume.

    Args:
        resume: Resume data as dict, JSON string, or path to JSON file

    Returns:
        Dictionary with validation results

    Example:
        >>> result = validate_resume({"basics": {"name": "John Doe"}})
        >>> if result["valid"]:
        ...     print("Resume is valid!")
    """
    validator = ResumeValidator()
    return validator.validate(resume)
