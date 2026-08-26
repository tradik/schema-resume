#!/bin/bash
# Run the schema comparison script

# Scripts live in tools/ but operate on the schema files at the repo root.
cd "$(dirname "$0")/.."

echo "Running Schema Comparison Tool..."
echo ""

python3 tools/compare-schemas.py

echo ""
echo "Comparison complete!"
