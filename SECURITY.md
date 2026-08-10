# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 1.2.x | Yes |
| 1.1.x | Security fixes only, until 1.3.0 |
| < 1.1 | No |

Versioned schema URLs (`/1.2/schema.json` and earlier) stay published
indefinitely — see [versioning and stability](docs/VERSIONING.md) — but only
supported versions receive fixes.

## Reporting a vulnerability

Report privately, not as a public issue:

- **Preferred:** [open a draft security advisory](https://github.com/tradik/schema-resume/security/advisories/new)
- **Email:** <info@schema-resume.org>

Please include what you did, what happened, and what you expected. A proof of
concept helps; a working exploit is not required.

**Expect a first response within five working days.** This is a small project
with no on-call rotation, so please do not expect a same-day reply. If you have
heard nothing after ten working days, escalate by opening a public issue that
says only that you are waiting on a security report — no details.

We will keep you informed while we investigate, credit you in the advisory
unless you would rather stay anonymous, and let you know before anything is
published.

## What is in scope

- The specification files: `schema.json`, `meta-schema.json`, `context.jsonld`,
  `xml/1.0/schema-resume.xsd`. A schema that lets a malformed document pass, or
  that a validator can be made to hang on, is in scope.
- The validator packages under `packages/` (npm, PyPI, Go, Maven, RubyGems,
  Packagist).
- The site at `schema-resume.org`, including the browser tools at
  `/validator.html`, `/converter.html` and `/editor/`.
- The Cloudflare Pages Function under `workers/`.

Things we are particularly interested in: anything that gets data out of the
browser tools. They are documented as processing your CV entirely locally, and
that claim is the one we most want to be true.

## What is out of scope

- Findings against third-party services we merely link to.
- Missing security headers with no demonstrated impact.
- Reports produced by a scanner with no accompanying analysis.
- Social engineering, physical access, or denial of service by volume.
- The absence of rate limiting on static files.

## Safe harbour

We will not pursue or support legal action against anyone who reports in good
faith, stays within the scope above, avoids privacy violations and service
degradation, and gives us reasonable time to respond before disclosing.
