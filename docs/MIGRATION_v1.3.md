---
title: "Migration Guide: v1.2 to v1.3"
slug: "migration-v1-3"
status: "publish"
type: "page"
description: "Upgrade a resume document from Schema Resume v1.2.0 to v1.3.0: the demographics object, the corrected $schema dialect, and what you do not have to change."
categories: [Documentation]
modified: 2026-08-07
---

# Migration Guide: v1.2 to v1.3

**Nothing you have breaks.** Every document valid under 1.2.0 is still valid
under 1.3.0, in both JSON and XML. If you do nothing, everything keeps working.
The changes below are worth making, not urgent.

If you would rather not move at all, pin the old version — it is frozen and will
not change:

```json
{ "$schema": "https://schema-resume.org/1.2/schema.json" }
```

## 1. Demographic fields moved into their own object

`basics.age`, `basics.dateOfBirth` and `basics.gender` now live under
`basics.demographics`.

**Before**

```json
{
  "basics": {
    "name": "Jane Smith",
    "age": 34,
    "dateOfBirth": "1992-04-11",
    "gender": "female"
  }
}
```

**After**

```json
{
  "basics": {
    "name": "Jane Smith",
    "demographics": {
      "age": 34,
      "dateOfBirth": "1992-04-11",
      "gender": "female"
    }
  }
}
```

The old field names still validate and are marked `deprecated`; they are
scheduled for removal in 2.0.0. Editors that understand the keyword will show
them struck through.

XML follows the same shape:

```xml
<basics>
  <name>Jane Smith</name>
  <demographics>
    <age>34</age>
    <dateOfBirth>1992-04-11</dateOfBirth>
    <gender>female</gender>
  </demographics>
</basics>
```

### Why

These are protected characteristics. In the UK and most of the EU a CV should
not carry age, date of birth or gender: employers are advised not to request
them, and a document that volunteers them invites a discrimination claim against
whoever processes it. Gender may additionally be special-category data under
GDPR Article 9.

They were not removed, because the convention is not universal — a German or
Japanese CV commonly carries a date of birth. Grouping them makes including them
a deliberate act rather than an incidental one, and lets a processor strip the
whole object in a single step:

```js
delete resume.basics.demographics;
```

## 2. `$schema` names the JSON Schema dialect

`schema.json` previously declared:

```json
"$schema": "https://schema-resume.org/meta-schema.json"
```

which no validator could resolve, so `ajv compile -s schema.json`,
`check-jsonschema` and IDE validation all failed until the consumer registered
the meta-schema by hand. It now declares the dialect it is actually written in:

```json
"$schema": "http://json-schema.org/draft-07/schema#"
```

**Nothing to change in your documents.** Your document's own `$schema` still
points at `https://schema-resume.org/schema.json` (or a pinned version). If your
code called `ajv.addMetaSchema(metaSchema)` to work around the old value, it is
now unnecessary — harmless if you leave it.

`meta-schema.json` is unchanged in purpose and still published. It describes what
a Schema Resume schema looks like; it was never a dialect.

## 3. The embedded `@context` is gone from `schema.json`

`schema.json` carried a top-level `@context` with 14 terms. It covered 9 of the
102 terms in the canonical `context.jsonld`, defined 7 terms that do not exist
there, and contradicted it on `address`. It was also the reason the file failed
JSON Schema strict-mode validation.

Use `context.jsonld`, which is what your document's `@context` should point at
and always should have:

```json
{
  "@context": "https://schema-resume.org/1.3/context.jsonld",
  "$schema": "https://schema-resume.org/1.3/schema.json"
}
```

## 4. Dead `additionalItems` keywords removed

27 occurrences of `"additionalItems": false` sat beside a schema-form `items`,
where draft-07 ignores the keyword entirely. They constrained nothing. No
behaviour changes.

## Checking your documents

```bash
npx ajv validate -s https://schema-resume.org/1.3/schema.json \
  -c ajv-formats -d your-resume.json
```

No `--strict=false` and no `-r` flag: both schemas now pass ajv's strict mode
unaided.

To find documents still using the deprecated field names:

```bash
grep -l '"age"\|"dateOfBirth"\|"gender"' *.json
```

## Summary

| Change | Action needed | Breaks anything |
|---|---|---|
| `basics.demographics` | Move three fields when convenient | No |
| `$schema` dialect | None; drop `addMetaSchema` if you had it | No |
| Embedded `@context` removed | Point `@context` at `context.jsonld` | Only if you read `schema.json["@context"]` |
| `additionalItems` removed | None | No |
