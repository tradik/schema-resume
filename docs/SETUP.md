---
title: "Setup Guide"
slug: "setup"
status: "publish"
type: "page"
description: "Set up the Schema Resume repository locally: building the site with ssg, staging the specification files, and publishing to Cloudflare Pages."
categories: [Documentation]
modified: 2026-08-06
---

# Setup Guide

How to work on this repository: build the site, validate the specification, and
understand what happens on deploy.

## Prerequisites

| Tool | Why | Install |
|---|---|---|
| [ssg](https://github.com/spagu/ssg) | Generates the site | `brew install spagu/tap/ssg` |
| Node.js 20+ | Vendors the browser libraries; runs the schema validator | [nodejs.org](https://nodejs.org/) |
| Python 3.8+ | Runs the schema linting and comparison tools | Preinstalled on macOS and most Linux |

Only `ssg` and Node are needed to build the site. Python is needed for
`make validate`.

## First build

```bash
git clone https://github.com/tradik/schema-resume.git
cd schema-resume

make install        # npm ci — build dependencies only; nothing is published from here
make serve          # http://127.0.0.1:8888, rebuilds on every save
```

`make serve` runs two steps:

1. **`npm run build:assets`** vendors the browser libraries — Ajv, Chart.js,
   Mermaid, the XSLT processor — and inlines the icon set. Output lands in
   `templates/schema-resume/js/vendor/`, `editor/vendor/` and
   `templates/schema-resume/partials/icons.html`. All generated, all gitignored.
2. **`ssg --config .ssg.yaml`** generates `output/`, publishing the
   specification, `xml/`, `docs/` and the editor straight from where they live
   via `static_sources`.

There is exactly one live copy of `schema.json` in this repository, at the root.
The snapshots under `versions/` are frozen past releases and are never edited.
If you find yourself changing a file under `output/`, stop — the next build will
erase it.

## Everyday commands

```bash
make help           # every target, with a description
make site           # build once into output/
make site-release   # minified and fingerprinted, exactly as CI builds it
make check-links    # fail on a dead internal link
make validate       # lint and cross-check every schema file
make freeze-version # snapshot the current specification into versions/
make clean          # remove generated output and vendored libraries
```

`make site-release` is worth running before opening a pull request: minification
and fingerprinting occasionally surface a template problem a development build
does not.

## Validating the specification

```bash
npm test            # compile schema.json and validate example.json with Ajv
make validate       # the Python linting and comparison suite
```

The linter checks syntax and structure across all four specification files. The
comparison tool reports JSON-LD coverage — which schema fields have a `@context`
mapping, and therefore which produce RDF triples.

To validate your own document:

```bash
npx ajv validate -s schema.json -c ajv-formats -d your-resume.json
```

No `--strict=false` and no `-r` flag. `$schema` names the draft-07 dialect, so
any validator resolves it unaided, and the schema carries no keyword that ajv's
strict mode rejects.

## Where things live

```
schema.json, meta-schema.json,     the specification — the canonical copies
  context.jsonld, example*.json
xml/1.0/                           the XSD and its example
docs/                              documentation; published as HTML and served raw
content/site/pages/                tool and legal pages (metadata only)
data/packages.yaml                 drives the packages page
templates/schema-resume/           the theme: templates, CSS, JS, images
tools/                             build and validation scripts
workers/cookie-consent/            the Pages Function behind the consent banner
packages/                          the six language validator packages
versions/                          frozen past releases, served at /1.2/, /1.3/…
output/                            generated — not in git
```

## Adding a documentation page

Drop a Markdown file in `docs/` with front matter:

```yaml
---
title: "Short Title"
slug: "short-title"
status: "publish"
type: "page"
description: "One sentence, 70–160 characters — the build warns outside that range."
categories: [Documentation]
---
```

It appears at `/short-title.html` and in the guide list on the home page
automatically. The build checks that every page has a title and a description of
a sensible length, that no internal link is dead, that every image has `alt`
text, and that nothing is orphaned.

To keep a file in the repository without publishing it, add it to
`content_exclude` in `.ssg.yaml`.

## Deployment

Pushing to `main` runs
[`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml),
which installs `ssg`, builds with `--minify-all --fingerprint
--check-links=strict`, and deploys `output/` to Cloudflare Pages. Pull requests
are built but not deployed, so a broken site is caught before merge.

Two secrets are required on the `cloudflare-pages` **environment** (Settings →
Environments → cloudflare-pages → Environment secrets), not just the repository:
`CLOUDFLARE_API_TOKEN` (an API token with *Cloudflare Pages: Edit*) and
`CLOUDFLARE_ACCOUNT_ID`. Without them the Build job passes and the Publish job
fails with "it's necessary to set a CLOUDFLARE_API_TOKEN". The token needs
*Cloudflare Pages: Edit* on the account. The workflow creates the Pages project
`schema-resume` on first run if it is missing; attaching the custom domain
`schema-resume.org` to that project (Pages → schema-resume → Custom domains) is
a one-off manual step in the dashboard.

The consent banner's audit log needs a KV namespace bound to the Pages project
as `CONSENT_LOG`, plus a `CONSENT_IP_SALT` secret. Without them the banner still
works and still records the visitor's choice; only the proof-of-consent record
is skipped. See
[`workers/cookie-consent/README.md`](../workers/cookie-consent/README.md).

The checkout uses `fetch-depth: 0` deliberately: sitemap `<lastmod>` values come
from each file's last commit, which a shallow clone does not have.

## Releasing a schema version

Order matters: freeze **before** bumping, or the outgoing version's pinned URL
picks up the incoming changes.

1. **`make freeze-version`** — snapshots the current specification into
   `versions/<MAJOR.MINOR>/`. This is what `/1.3/schema.json` serves, and it is
   why a pin cannot change underneath a document.
2. Add the new snapshot to `static_sources` in `.ssg.yaml`.
3. Update `version` in `package.json`, `title` in `schema.json` and
   `meta-schema.json`, and `meta.version` in the examples.
4. Update `schema_version` and `schema_version_minor` in `.ssg.yaml`, and the
   schema badge in `README.md`.
5. Add a `CHANGELOG.md` entry and, for a minor or major bump, a migration guide
   in `docs/`. See [versioning and stability](VERSIONING.md) for which bump a
   change deserves.
6. Run `make validate && npm test && make site-release`.
7. Run `./tools/sync-schema-files.sh` to copy the schema into every language
   package.
8. Tag `vMAJOR.MINOR.PATCH` and push. That triggers
   [`release-packages.yml`](../.github/workflows/release-packages.yml), which
   publishes to npm, PyPI, Go, Maven Central, RubyGems and Packagist.

**Check the registries afterwards.** The v1.2.0 release reported success while
npm actually failed with `E404` — the log was piped through `tee`, which
swallowed the exit code. That specific masking is fixed, but a release is not
done until the versions are visible:

```bash
npm view schema-resume-validator version
curl -s https://pypi.org/pypi/schema-resume-validator/json | jq -r .info.version
curl -s https://rubygems.org/api/v1/gems/schema-resume-validator.json | jq -r .version
```
