# cookie-consent worker

A GDPR / ePrivacy / UK-PECR cookie consent banner for an SSG site. Scaffold it
with `ssg new worker cookie-consent`.

It is compliant, not decorative:

- **Prior consent.** A non-essential `<script>` does not run until its category
  is granted (see *Gating scripts* below). Nothing analytics/marketing fires
  before a choice.
- **Reject as easy as accept.** *Reject all* sits beside *Accept all*, same
  size; non-essential toggles start off; Escape saves only the necessary ones.
- **Geo-aware.** Shown in the EEA and the UK by default; override the set or
  force it on everywhere.
- **Withdrawable, versioned, expiring.** Any `data-cookie-settings` element
  reopens the dialog; consent is re-asked after `expiryDays` or a policy
  `version` bump.
- **Consent Mode v2.** Emits `gtag('consent','update', …)`, a `dataLayer`
  event, and a `ssg:consent` DOM event so tag managers react.
- **Auditable.** An optional endpoint records a proof-of-consent entry (the IP
  is stored only as a salted hash), because the GDPR requires you to be able to
  *demonstrate* consent.

## Files

```
workers/cookie-consent/
├── functions/api/consent/geo.ts   GET  — is the banner required for this visitor?
├── functions/api/consent/log.ts   POST — optional proof-of-consent audit record
├── public/cookie-consent.js       the banner (served from your site root)
├── public/cookie-consent.css       its styles
└── cookie-policy.md               a starter policy page — edit to list your services
```

`public/` is copied to the site root at build time, so the assets are served at
`/cookie-consent.js` and `/cookie-consent.css`.

## 1. Wire it into `.ssg.yaml`

```yaml
workers:
  - name: cookie-consent
    dir: workers/cookie-consent
    routes_include: [/api/consent/*]
```

Only `/api/consent/*` reaches the Function; every page stays static.

## 2. Put the banner on every page

Add this to your theme's `<head>` (once). The JSON is the client config — edit
it, it is not secret:

```html
<link rel="stylesheet" href="/cookie-consent.css">
<script id="ssg-consent-config" type="application/json">
{
  "version": "1",
  "policyUrl": "/cookie-policy/",
  "position": "bottom",
  "geoMode": "edge",
  "expiryDays": 180,
  "logEndpoint": "/api/consent/log",
  "categories": [
    { "id": "necessary", "required": true },
    { "id": "analytics" },
    { "id": "marketing" }
  ]
}
</script>
<script src="/cookie-consent.js" defer></script>
```

`geoMode`: `edge` calls `/api/consent/geo` (needs the worker); `always` shows it
everywhere with no Function at all. Drop `logEndpoint` to skip the audit record.
`position`: `bottom` (default), `top` or `center`.

## 3. Gating scripts (the compliant part)

Non-essential tags must not run until consent. Mark them `type="text/plain"`
with the category; the banner activates them once granted:

```html
<script type="text/plain" data-consent-category="analytics"
        src="https://…/analytics.js"></script>
```

For Google, keep Consent Mode's default-deny in a real `<script>` and let the
banner send the update:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });
</script>
```

## 4. The policy page

Copy `cookie-policy.md` into your content and edit the tables to list your
actual services. Its **Manage cookies** button reopens the dialog.

## Config / secrets (all optional)

Set with `wrangler pages secret put <NAME>` or `[vars]` in `wrangler.toml`:

| Name | Effect |
|---|---|
| `CONSENT_COUNTRIES` | comma-separated ISO codes to require it in (replaces the EEA+UK default) |
| `CONSENT_ALWAYS` | `1` requires the banner everywhere |
| `TURNSTILE_SECRET` | if set, the audit endpoint verifies a Turnstile token (anti-flood); never blocks the choice |
| `CONSENT_IP_SALT` | salt for the stored IP hash |
| `CONSENT_RETENTION_DAYS` | audit-record TTL (default 365) |
| `CONSENT_LOG` (KV binding) | where audit records are stored; without it, nothing is written |

Without any of these the banner still works (client-side, EEA+UK, no audit
log). The audit log needs the `CONSENT_LOG` KV namespace bound to the project.

## Deploy

`ssg --deploy=cloudflare` ships the functions and the static assets together.
`ssg new worker` prints the `worker:`/`workers:` block; `--wrangler` runs
`wrangler dev` for local testing.
