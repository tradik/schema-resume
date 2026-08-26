#!/bin/bash
# Run the schema linting script

# Scripts live in tools/ but operate on the schema files at the repo root.
cd "$(dirname "$0")/.."

echo "Running Schema Linting Tool..."
echo ""

python3 tools/lint-schemas.py

echo ""
if [ $? -eq 0 ]; then
    echo "✅ Linting completed successfully!"
else
    echo "❌ Linting found errors!"
    exit 1
fi
