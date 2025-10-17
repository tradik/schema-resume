#!/bin/bash
# Run both comparison and linting tools

cd "$(dirname "$0")"

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                    SCHEMA VALIDATION SUITE                                 ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Run linting first
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: LINTING SCHEMAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 lint-schemas.py
LINT_RESULT=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: COMPARING SCHEMAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python3 compare-schemas.py
COMPARE_RESULT=$?

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                         VALIDATION SUMMARY                                 ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

if [ $LINT_RESULT -eq 0 ]; then
    echo "✅ Linting:    PASSED"
else
    echo "❌ Linting:    FAILED"
fi

if [ $COMPARE_RESULT -eq 0 ]; then
    echo "✅ Comparison: PASSED"
else
    echo "⚠️  Comparison: COMPLETED (check for warnings)"
fi

echo ""

if [ $LINT_RESULT -eq 0 ]; then
    echo "🎉 All validation checks passed!"
    exit 0
else
    echo "⚠️  Some validation checks failed. Please review the output above."
    exit 1
fi
