#!/bin/bash
# Run the schema comparison script

cd "$(dirname "$0")"

echo "Running Schema Comparison Tool..."
echo ""

python3 compare-schemas.py

echo ""
echo "Comparison complete!"
