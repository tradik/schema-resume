"""Schema Resume Validator - JSON Schema validation for resumes/CVs."""

from .validator import ResumeValidator, validate_resume
from .exceptions import ValidationError, SchemaError

__version__ = "1.1.0"
__author__ = "Schema Resume"
__email__ = "info@schema-resume.org"
__url__ = "https://schema-resume.org/"

__all__ = [
    "ResumeValidator",
    "validate_resume",
    "ValidationError",
    "SchemaError",
]
