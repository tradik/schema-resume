# Migration Guide: v1.1.0 to v1.2.0

This guide helps you upgrade your resume JSON from version 1.1.0 to 1.2.0.

## 🆕 What's New in v1.2.0

Version 1.2.0 adds the ability to record **multiple positions held at the same
organization** — capturing career progression (for example, promotions) without
repeating the organization's details for every role.

> **Good news:** v1.2.0 is fully **backwards compatible**. Every resume that was
> valid under v1.1.0 is still valid under v1.2.0. You only need to change your
> resume if you *want* to use the new `positions` array.

## The `positions` array (`work[].positions`)

Previously, if you held three roles at the same company you had to create three
separate `work` entries and repeat the company name, location, URL, and industry
in each one:

```json
{
  "work": [
    {
      "name": "Nexora Digital Ltd",
      "location": { "city": "Edinburgh", "countryCode": "GB" },
      "url": "https://nexora-digital.example.com",
      "position": "Senior Software Engineer",
      "startDate": "2015-01",
      "endDate": "2016-01"
    },
    {
      "name": "Nexora Digital Ltd",
      "location": { "city": "Edinburgh", "countryCode": "GB" },
      "url": "https://nexora-digital.example.com",
      "position": "Software Engineer",
      "startDate": "2014-01",
      "endDate": "2014-12"
    },
    {
      "name": "Nexora Digital Ltd",
      "location": { "city": "Edinburgh", "countryCode": "GB" },
      "url": "https://nexora-digital.example.com",
      "position": "Junior Software Engineer",
      "startDate": "2012-09",
      "endDate": "2013-12"
    }
  ]
}
```

With v1.2.0 you can collapse those into a **single** `work` entry, keeping the
organization details once and listing each role in `positions`:

```json
{
  "work": [
    {
      "@type": "schema:Organization",
      "name": "Nexora Digital Ltd",
      "location": { "@type": "schema:PostalAddress", "city": "Edinburgh", "countryCode": "GB" },
      "url": "https://nexora-digital.example.com",
      "startDate": "2012-09",
      "endDate": "2016-01",
      "summary": "Progressed from junior engineer to engineering lead across four years",
      "positions": [
        {
          "@type": "schema:EmployeeRole",
          "position": "Senior Software Engineer",
          "workType": "hybrid",
          "startDate": "2015-01",
          "endDate": "2016-01",
          "highlights": ["Designed a multi-tenant platform serving 12 departments"]
        },
        {
          "@type": "schema:EmployeeRole",
          "position": "Software Engineer",
          "workType": "onsite",
          "startDate": "2014-01",
          "endDate": "2014-12"
        },
        {
          "@type": "schema:EmployeeRole",
          "position": "Junior Software Engineer",
          "workType": "onsite",
          "startDate": "2012-09",
          "endDate": "2013-12"
        }
      ]
    }
  ]
}
```

### Position fields

Each entry in `positions` accepts:

| Field | Type | Description |
|-------|------|-------------|
| `@type` | string | Schema.org type, `schema:EmployeeRole` for validator.schema.org compatibility |
| `position` | string | Job title held during this role (e.g., `Senior Software Engineer`) |
| `workType` | string | Work arrangement (`remote`, `hybrid`, `onsite`, `full-time`, `part-time`, `contract`, `freelance`, `internship`, `temporary`) |
| `startDate` | string | Date this role began (ISO 8601: `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`) |
| `endDate` | string | Date this role ended (ISO 8601; omit if this is the current role) |
| `summary` | string | Overview of responsibilities in this specific role |
| `highlights` | array of strings | Notable achievements in this specific role |

Additional custom properties are allowed (`additionalProperties: true`).

## 📌 Guidelines

- **Pick one style per entry.** For a given piece of information, use *either* the
  singular top-level fields (`position`, `startDate`, `endDate`, `summary`,
  `highlights`) *or* the `positions` array — not both. Mixing them for the same
  role is redundant and may confuse parsers.
- **Keep organization data at the `work` level.** `name`, `location`, `url`,
  `industry`, `contactDetails`, and `description` describe the employer and should
  stay on the `work` entry. Only role-specific data belongs in `positions`.
- **Order positions however you like.** Chronological (oldest first) or reverse
  chronological (most recent first) are both valid; the schema does not enforce an
  order.

## ✅ Do I have to change anything?

No. If your v1.1.0 resume already validates, it will continue to validate under
v1.2.0 unchanged. Adopt `positions` only when it makes your resume cleaner.

## XML (XSD) users

The XSD gains a `<positions>` element inside `<work>`, containing repeated
`<item>` elements (mirroring how `<highlights>` wraps `<item>` entries):

```xml
<work>
  <name>Nexora Digital Ltd</name>
  <url>https://nexora-digital.example.com</url>
  <startDate>2012-09</startDate>
  <endDate>2016-01</endDate>
  <positions>
    <item>
      <position>Senior Software Engineer</position>
      <workType>hybrid</workType>
      <startDate>2015-01</startDate>
      <endDate>2016-01</endDate>
    </item>
    <item>
      <position>Junior Software Engineer</position>
      <workType>onsite</workType>
      <startDate>2012-09</startDate>
      <endDate>2013-12</endDate>
    </item>
  </positions>
</work>
```

## Related

- Issue: [#11 — Make a positions array](https://github.com/tradik/schema-resume/issues/11)
- Previous migration: [MIGRATION_v1.1.md](./MIGRATION_v1.1.md)
