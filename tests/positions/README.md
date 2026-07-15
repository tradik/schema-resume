# `work[].positions` validation tests

Tests for the `positions` array added in Schema Resume **v1.2.0** (see
[issue #11](https://github.com/tradik/schema-resume/issues/11) and
[docs/MIGRATION_v1.2.md](../../docs/MIGRATION_v1.2.md)).

## Running

```bash
# From the repository root
./tests/positions/run-positions-tests.sh
# or directly (requires the `jsonschema` package)
python3 tests/positions/run-positions-tests.py
```

The suite is also part of the local validation suite (`./validate-all.sh`) and
runs in CI via the **Quick Schema Check** workflow.

## Fixtures

| File | Expected | Purpose |
|------|----------|---------|
| `valid-positions.json` | valid | Multiple roles at one company via `positions` |
| `valid-single-position-legacy.json` | valid | Legacy single-role entry — backwards compatibility |
| `invalid-null-positions.json` | invalid | `positions` set to `null` (must be an array) |
| `invalid-bad-worktype.json` | invalid | `position.workType` outside the allowed enum |

The runner also re-validates the shipped `example.json` and
`example-with-local-context.json`, both of which now include a `positions` entry.
