#!/bin/bash
# Runner for the work[].positions validation tests (Schema Resume v1.2.0).
# Ensures the jsonschema dependency is available, then runs the Python suite.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! python3 -c "import jsonschema" >/dev/null 2>&1; then
    echo "Installing test dependency: jsonschema ..."
    python3 -m pip install --quiet jsonschema
fi

echo "Running work[].positions validation tests..."
python3 "${SCRIPT_DIR}/run-positions-tests.py"
