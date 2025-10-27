"""Custom exceptions for schema-resume-validator."""


class SchemaResumeError(Exception):
    """Base exception for schema-resume-validator."""
    pass


class ValidationError(SchemaResumeError):
    """Raised when resume validation fails."""
    pass


class SchemaError(SchemaResumeError):
    """Raised when schema loading or parsing fails."""
    pass
