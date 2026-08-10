---
title: "Upgrading"
slug: "upgrading"
status: "publish"
type: "page"
description: "Every step between Schema Resume versions in one page: what changed from 1.0, 1.1 and 1.2, what breaks, and how to stay on the version you are on."
categories: [Documentation]
modified: 2026-08-09
---

# Upgrading

Start with the version you are on. Each section lists only what that step
changes; skipping to the newest release means doing every section between.

**You do not have to upgrade.** Every release is published at a permanent URL
and stays there. If a project works today, pinning it is a complete answer:

| You are on | Pin this |
|---|---|
| 1.0 | `https://schema-resume.org/1.0/schema.json` |
| 1.1 | `https://schema-resume.org/1.1/schema.json` |
| 1.2 | `https://schema-resume.org/1.2/schema.json` |
| 1.3 | `https://schema-resume.org/1.3/schema.json` |

The same applies to `meta-schema.json`, `context.jsonld`, the examples and —
from 1.1 onwards — `schema-resume.xsd`. See
[versioning and stability](/versioning) for the guarantees behind those URLs.

## Which version am I on?

If your documents say `"$schema": "https://schema-resume.org/schema.json"`, you
are on **whatever is current**, because that URL floats. Check what you actually
depend on:

| Signal | Version |
|---|---|
| `basics.demographics` exists | 1.3 |
| `work[].positions` exists | 1.2 |
| `basics.nationalities` or `basics.workAuthorization` exists | 1.1 or later |
| `tools` section exists | 1.1 or later |
| None of the above | 1.0 |

An unpinned document is not on a version so much as exposed to all of them. The
single most useful change you can make, whatever you decide about upgrading, is
to replace `/schema.json` with a pinned URL in anything you store.

---

## 1.0 → 1.1

The largest step. 1.0 predates the `schema-resume.org` domain, Schema.org
alignment and the XML schema.

**Domain.** 1.0 used `https://tradik.github.io/schema-resume/`. From 1.1 the
canonical host is `https://schema-resume.org/`. Update both `$schema` and
`@context` in your documents.

**New sections.** `tools` joins the top level. `basics` grows from 9 fields to
18, including `nationalities`, `workAuthorization`, `dateOfBirth`, `gender`,
`age` and `legalNote`. All optional — a valid 1.0 document is a valid 1.1
document once the URLs are updated.

**Schema.org alignment.** `@type` and `additionalType` become available
throughout. They are optional for JSON Schema validation but required if you
want `validator.schema.org` to read your document. See the
[Schema.org validation guide](/schema-org-validation).

**XML.** 1.1 is the first release with an XSD, at
`https://schema-resume.org/1.1/schema-resume.xsd`. There is nothing to migrate;
there was no XML before it.

Full detail: [1.0 → 1.1 migration guide](/migration-v1-1).

## 1.1 → 1.2

**`work[].positions`.** A single company with several roles no longer needs
several `work` entries. The old single-role shape stays valid — `positions` is
additive, and the test suite covers both.

**`basics.legalNote`.** A place for GDPR consent statements and disclaimers,
with optional country scoping.

Full detail: [1.1 → 1.2 migration guide](/migration-v1-2).

## 1.2 → 1.3

Additive. Every 1.2 document is still valid.

**`basics.demographics`.** `age`, `dateOfBirth` and `gender` move into their own
object. The old field names still validate, are marked `deprecated`, and are
scheduled for removal in 2.0.0. See the
[1.2 → 1.3 guide](/migration-v1-3) for why, and for the one-line change.

**`$schema` names the draft-07 dialect.** Nothing changes in your documents. If
your code called `ajv.addMetaSchema(metaSchema)` to work around the old value,
it is now unnecessary — harmless if you leave it.

**The embedded `@context` is gone from `schema.json`.** Only affects code that
read `schema.json["@context"]`; use `context.jsonld`, which is what your
document's own `@context` should point at.

---

## Upgrading the validator packages

The packages embed the schema, so their version *is* the schema version:

```bash
npm  install schema-resume-validator@1.3.0
pip  install schema-resume-validator==1.3.0
gem  install schema-resume-validator -v 1.3.0
composer require schema-resume/validator:^1.3
go get github.com/tradik/schema-resume/validator@v1.3.0
```

Staying on an older schema means pinning the matching package version. That is
the recommended way to depend on a specific release: it removes this site from
your runtime path entirely, so nothing you rely on can change or become
unreachable.

**Check what a registry actually has before assuming.** The registries have
drifted from each other before — a release reported success while npm had
failed:

```bash
npm view schema-resume-validator version
curl -s https://pypi.org/pypi/schema-resume-validator/json | jq -r .info.version
curl -s https://rubygems.org/api/v1/gems/schema-resume-validator.json | jq -r .version
```

## Checking a document against a specific version

```bash
npx ajv validate -s https://schema-resume.org/1.3/schema.json \
  -c ajv-formats -d your-resume.json
```

From 1.3 no extra flags are needed. For 1.0 to 1.2, `$schema` in those releases
points at a meta-schema rather than a dialect, so add `--strict=false` and
register it:

```bash
npx ajv validate -s https://schema-resume.org/1.2/schema.json \
  -r https://schema-resume.org/1.2/meta-schema.json \
  -c ajv-formats --strict=false -d your-resume.json
```

XML, from 1.1 onwards:

```bash
xmllint --schema https://schema-resume.org/1.3/schema-resume.xsd \
  your-resume.xml --noout
```

## If something breaks

Open an issue with the version you moved from, the version you moved to, and a
document that reproduces it: <https://github.com/tradik/schema-resume/issues>.
A pinned URL is always a safe place to retreat to while it is investigated.
