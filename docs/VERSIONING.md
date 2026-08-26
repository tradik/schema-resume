---
title: "Versioning and Stability"
slug: "versioning"
status: "publish"
type: "page"
description: "Which Schema Resume URLs are permanent, which track the latest release, and what may change between a patch, a minor and a major version."
categories: [Documentation]
modified: 2026-08-06
---

# Versioning and Stability

Schema Resume follows [Semantic Versioning](https://semver.org/). This page says
what that means for the URLs your documents point at, because those URLs are the
part of the project you cannot change once other people depend on them.

## Two kinds of URL

| URL | Contents | Changes |
|---|---|---|
| `https://schema-resume.org/schema.json` | The current release | Yes, on every release |
| `https://schema-resume.org/1.3/schema.json` | Version 1.3, forever | Never |
| `https://schema-resume.org/1.2/schema.json` | Version 1.2, forever | Never |
| `https://schema-resume.org/1.1/schema.json` | Version 1.1, forever | Never |
| `https://schema-resume.org/1.0/schema.json` | Version 1.0, forever | Never |

Every release the project has ever made has an address, back to 1.0. Projects
built against an older version are not obliged to move: pin, and nothing changes
under you. [Upgrading](/upgrading) covers each step for when you choose to.

The archives are byte-exact copies of what each release shipped, restored from
its Git tag (1.0 predates tagging and comes from the last commit before the 1.1
work began). Nothing in them is corrected — 1.0 still names the
`tradik.github.io` domain it was published under, and 1.0 to 1.2 still point
`$schema` at a meta-schema rather than a dialect. An archive that has been
edited is not an archive.

The same pairing applies to `meta-schema.json`, `context.jsonld` and the
examples. The XSD joined in 1.1 and is published both at its original address,
`https://schema-resume.org/xml/1.0/schema-resume.xsd`, and inside each version
directory from 1.1 onwards. 1.0 shipped no XML schema.

**Pin the version in anything you store.** A resume document written today and
filed away should say:

```json
{
  "$schema": "https://schema-resume.org/1.3/schema.json",
  "@context": "https://schema-resume.org/1.3/context.jsonld"
}
```

Pinned URLs are served from committed snapshots under `versions/` in the
repository, not from the live files at its root. That distinction is the whole
guarantee: publishing `/1.2/schema.json` from the current `schema.json` would
mean the pin changed the moment the specification moved on.

A document that points at `/schema.json` instead is validated against whatever
the specification says on the day someone opens it, which for an archived CV is
rarely what you want.

**Track the latest** — `/schema.json` — in tooling you actively maintain and in
documentation, where following the specification is the point.

Pinned URLs are served with a one-year immutable cache; the floating URLs are
revalidated hourly, so a new release reaches consumers within the hour without
anyone pinning a stale copy for a year.

## What each version bump means

**Patch** (1.3.0 → 1.3.1). Wording of a `description`, a typo, a corrected
example. The set of documents that validate does not change — if it changes, it
is not a patch. Patches share the minor version's URL: `/1.3/` always serves the
newest 1.3.x.

**Minor** (1.3 → 1.4). New optional fields, new enum members, relaxed
constraints. Every document valid under 1.3 is still valid under 1.4. You can
move a pin forward without re-checking your data.

A field that moves is handled here rather than in a major release: the old name
keeps validating, marked `deprecated`, and is removed at the next major. That is
how `basics.age` became `basics.demographics.age` in 1.3.0 without breaking a
single document — see the [1.2 → 1.3 guide](/migration-v1-3).

**Major** (1.x → 2.0). A field is removed or renamed, a constraint is tightened,
a type changes. Documents valid under 1.x may stop validating. A migration guide
is published alongside every major release. Guides exist for
[1.0 → 1.1](/migration-v1-1), [1.1 → 1.2](/migration-v1-2) and
[1.2 → 1.3](/migration-v1-3); deprecations scheduled for the next major are
listed in each.

`/schema.json` follows major versions too. That is deliberate: it is the "current
specification" pointer, not a compatibility promise. The promise lives in the
versioned URLs.

## How long old versions stay up

Indefinitely. A pinned URL that stops resolving breaks documents that did the
right thing, so removing one is not on the table. They are static files of a few
tens of kilobytes; keeping them costs nothing worth counting.

## The `meta` block in your document

The schema's own `meta` section records which version a document was written
against:

```json
{
  "meta": {
    "version": "1.3.0",
    "canonical": "https://example.com/cv.json",
    "lastModified": "2026-08-06"
  }
}
```

This is advisory — validation does not depend on it — but it makes a document
self-describing when it arrives without context, which is most of the time.

## Not depending on this site at all

The validator packages embed the schema files, so
[integrating through a package](/packages) removes the site from your
runtime path entirely. That is the recommended approach for anything that must
keep working when a network is unavailable.
