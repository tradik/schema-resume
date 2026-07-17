#!/usr/bin/env python3
"""Validation tests for the work[].positions feature (Schema Resume v1.2.0).

Exercises the `positions` array added in v1.2.0:
  * valid resumes with a positions array must validate;
  * legacy single-role entries (no positions array) must still validate;
  * malformed positions data must be rejected.

Also re-validates the shipped examples so the feature stays wired end-to-end.

Exit code 0 means every expectation held; non-zero means at least one failed.
"""

import json
import sys
from pathlib import Path

try:
    import jsonschema
except ImportError:
    sys.stderr.write(
        "ERROR: the 'jsonschema' package is required to run these tests.\n"
        "Install it with:  python3 -m pip install jsonschema\n"
    )
    sys.exit(2)

# Repository root is two levels up from this file (tests/positions/).
ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent


def load(path: Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def validate(schema, document) -> list:
    """Return a list of validation error messages (empty means valid)."""
    validator = jsonschema.Draft7Validator(schema)
    return [error.message for error in validator.iter_errors(document)]


# (fixture path, should_be_valid, human description)
CASES = [
    (HERE / "valid-positions.json", True,
     "work[].positions with multiple roles at one company"),
    (HERE / "valid-single-position-legacy.json", True,
     "legacy single-role entry (backwards compatibility)"),
    (HERE / "invalid-null-positions.json", False,
     "positions set to null (must be an array)"),
    (HERE / "invalid-bad-worktype.json", False,
     "position.workType outside the allowed enum"),
    (ROOT / "example.json", True,
     "shipped example.json (includes a positions entry)"),
    (ROOT / "example-with-local-context.json", True,
     "shipped example-with-local-context.json (includes a positions entry)"),
]


def main() -> int:
    schema = load(ROOT / "schema.json")

    # Sanity check: the schema itself must be a valid JSON Schema.
    try:
        jsonschema.Draft7Validator.check_schema(schema)
    except jsonschema.exceptions.SchemaError as exc:
        sys.stderr.write(f"schema.json is not a valid JSON Schema: {exc}\n")
        return 1

    # The positions field must actually exist in the schema.
    work_props = schema["properties"]["work"]["items"]["properties"]
    if "positions" not in work_props:
        sys.stderr.write("schema.json is missing work[].positions — feature not present.\n")
        return 1

    passed = failed = 0
    for path, should_be_valid, description in CASES:
        errors = validate(schema, load(path))
        is_valid = not errors
        if is_valid == should_be_valid:
            passed += 1
            print(f"  PASS  {description}  [{path.name}]")
        else:
            failed += 1
            print(f"  FAIL  {description}  [{path.name}]")
            if should_be_valid:
                for message in errors[:5]:
                    print(f"          unexpected error: {message}")
            else:
                print("          expected validation to fail, but it passed")

    print()
    print(f"positions test suite: {passed} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
