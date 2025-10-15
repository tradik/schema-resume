# Migration Guide: v1.0.0 to v1.1.0

This guide helps you upgrade your resume JSON from version 1.0.0 to 1.1.0.

## 🆕 What's New in v1.1.0

Version 1.1.0 adds important fields for international work scenarios and enhanced skills tracking.

### New Fields in `basics` Section

#### 1. Nationalities

Track citizenship information with country codes:

```json
{
  "basics": {
    "nationalities": [
      {
        "country": "GB",
        "born": true
      },
      {
        "country": "IE",
        "born": false
      }
    ]
  }
}
```

**Fields:**
- `country` (string): ISO-3166-1 ALPHA-2 country code (GB, US, FR, etc.)
- `born` (boolean): Whether this is the country of birth

#### 2. Work Authorization

Document work rights and visa status:

```json
{
  "basics": {
    "workAuthorization": {
      "rightToWork": ["GB", "IE"],
      "visas": [
        {
          "country": "US",
          "validTo": "2026-08-15",
          "type": "H-1B Skilled Worker Visa"
        }
      ]
    }
  }
}
```

**Fields:**
- `rightToWork` (array): Countries where you have unrestricted work rights
- `visas` (array): Active work visas and permits
  - `country` (string): Country code where visa is valid
  - `validTo` (string): Expiration date in ISO 8601 format
  - `type` (string): Visa category or type

### Enhanced `skills` Section

Skills now support experience tracking:

```json
{
  "skills": [
    {
      "name": "Cloud Platforms",
      "level": "Expert",
      "yearsOfExperience": 8,
      "comment": "Extensive experience with AWS, GCP, and Azure",
      "keywords": ["AWS", "Google Cloud Platform", "Microsoft Azure"]
    }
  ]
}
```

**New Fields:**
- `yearsOfExperience` (number): Years of practical experience
- `comment` (string): Additional context or notes

### New `tools` Section

Track specific software and tools separately from skills:

```json
{
  "tools": [
    {
      "name": "Terraform",
      "yearsOfExperience": 7,
      "comment": "Primary IaC tool, authored 50+ modules",
      "url": "https://www.terraform.io"
    },
    {
      "name": "Kubernetes",
      "yearsOfExperience": 6,
      "comment": "CKA certified, manage production clusters",
      "url": "https://kubernetes.io"
    }
  ]
}
```

**Fields:**
- `name` (string): Tool or software name
- `yearsOfExperience` (number): Years using professionally
- `comment` (string): Usage details and proficiency notes
- `url` (string): Link to tool documentation

## 📋 Migration Steps

### Step 1: Add Nationalities (Optional)

If you want to specify citizenship:

```json
{
  "basics": {
    "name": "Your Name",
    // ... existing fields ...
    "nationalities": [
      {
        "country": "GB",
        "born": true
      }
    ]
  }
}
```

### Step 2: Add Work Authorization (Optional)

If relevant for your job search:

```json
{
  "basics": {
    // ... existing fields ...
    "workAuthorization": {
      "rightToWork": ["GB", "IE"],
      "visas": []
    }
  }
}
```

### Step 3: Enhance Skills (Optional)

Add experience tracking to existing skills:

**Before:**
```json
{
  "skills": [
    {
      "name": "Cloud Platforms",
      "level": "Expert",
      "keywords": ["AWS", "GCP"]
    }
  ]
}
```

**After:**
```json
{
  "skills": [
    {
      "name": "Cloud Platforms",
      "level": "Expert",
      "yearsOfExperience": 8,
      "comment": "Extensive multi-cloud experience",
      "keywords": ["AWS", "GCP"]
    }
  ]
}
```

### Step 4: Add Tools Section (Optional)

Create a new tools section:

```json
{
  "skills": [ /* ... */ ],
  "tools": [
    {
      "name": "Docker",
      "yearsOfExperience": 7,
      "comment": "Containerized 100+ applications",
      "url": "https://www.docker.com"
    }
  ],
  "languages": [ /* ... */ ]
}
```

## ✅ Validation

After migration, validate your resume:

```bash
ajv validate -s https://tradik.github.io/schema-resume/schema.json -d your-resume.json
```

## 🔄 Backward Compatibility

**All new fields are optional.** Your existing v1.0.0 resume will continue to validate against v1.1.0 schema without any changes.

## 📊 Example Comparison

### v1.0.0 Resume
```json
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "skills": [
    {
      "name": "Programming",
      "level": "Advanced",
      "keywords": ["Python", "JavaScript"]
    }
  ]
}
```

### v1.1.0 Resume (Enhanced)
```json
{
  "@context": "https://tradik.github.io/schema-resume/schema.json",
  "$schema": "https://tradik.github.io/schema-resume/schema.json",
  "basics": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "nationalities": [
      {
        "country": "GB",
        "born": true
      }
    ],
    "workAuthorization": {
      "rightToWork": ["GB", "IE"],
      "visas": []
    }
  },
  "skills": [
    {
      "name": "Programming",
      "level": "Advanced",
      "yearsOfExperience": 5,
      "comment": "Full-stack development experience",
      "keywords": ["Python", "JavaScript"]
    }
  ],
  "tools": [
    {
      "name": "VS Code",
      "yearsOfExperience": 5,
      "comment": "Primary development environment",
      "url": "https://code.visualstudio.com"
    }
  ]
}
```

## 🌍 Country Codes Reference

Use ISO-3166-1 ALPHA-2 codes for countries:

| Country | Code |
|---------|------|
| United Kingdom | GB |
| United States | US |
| Ireland | IE |
| France | FR |
| Germany | DE |
| Canada | CA |
| Australia | AU |
| New Zealand | NZ |
| Netherlands | NL |
| Spain | ES |
| Italy | IT |
| Poland | PL |

[Full list available here](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

## 💡 Best Practices

### Nationalities
- List all citizenships you hold
- Mark your birth country with `"born": true`
- Use official country codes

### Work Authorization
- Keep visa information up to date
- Include expiration dates for all visas
- List all countries where you have work rights

### Skills Experience
- Be honest about years of experience
- Count only professional experience
- Use comments to provide context

### Tools
- List tools you use regularly
- Include links for verification
- Separate from general skills for clarity

## 🆘 Need Help?

- Check the [README.md](./README.md) for full documentation
- See [example.json](./example.json) for a complete example
- Open an [issue](https://github.com/tradik/schema-resume/issues) if you encounter problems

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for complete version history.

---

**Version**: 1.1.0  
**Date**: 2025-10-09  
**Backward Compatible**: Yes ✅
