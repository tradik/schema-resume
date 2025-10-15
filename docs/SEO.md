# SEO Guidelines for Schema Resume

This document outlines the SEO best practices and requirements for all HTML pages in the Schema Resume project.

## Table of Contents

- [Required Meta Tags](#required-meta-tags)
- [Open Graph Tags](#open-graph-tags)
- [Twitter Card Tags](#twitter-card-tags)
- [Structured Data](#structured-data)
- [Technical SEO](#technical-seo)
- [Content Guidelines](#content-guidelines)
- [Checklist](#checklist)

## Required Meta Tags

Every HTML page MUST include these meta tags:

### Basic Meta Tags

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[150-160 character description]">
<meta name="keywords" content="[relevant, comma-separated, keywords]">
<meta name="author" content="Tradik">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow">
<link rel="canonical" href="[full URL of the page]">
<meta name="theme-color" content="#2563eb">
```

### Title Tag

```html
<title>[Page Title - 50-60 characters] | Schema Resume</title>
```

**Rules:**
- Keep under 60 characters
- Include primary keyword
- Be descriptive and unique per page
- Include brand name (Schema Resume) at the end

### Description Meta Tag

```html
<meta name="description" content="[Description here]">
```

**Rules:**
- 150-160 characters optimal length
- Include primary keyword naturally
- Compelling call-to-action
- Unique per page
- Accurately describe page content

### Keywords Meta Tag

```html
<meta name="keywords" content="keyword1, keyword2, keyword3">
```

**Rules:**
- 5-10 relevant keywords
- Include variations and synonyms
- Prioritize long-tail keywords
- Avoid keyword stuffing

## Open Graph Tags

Required for proper social media sharing (Facebook, LinkedIn):

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="[full page URL]">
<meta property="og:title" content="[page title]">
<meta property="og:description" content="[page description]">
<meta property="og:image" content="https://tradik.github.io/schema-resume/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Schema Resume">
```

**Image Requirements:**
- Dimensions: 1200x630px (Facebook recommended)
- Format: PNG or JPG
- File size: < 1MB
- High quality, clear branding

## Twitter Card Tags

Required for Twitter sharing:

```html
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="[full page URL]">
<meta property="twitter:title" content="[page title]">
<meta property="twitter:description" content="[page description]">
<meta property="twitter:image" content="https://tradik.github.io/schema-resume/og-image.png">
<meta name="twitter:creator" content="@tradik">
```

**Card Types:**
- `summary_large_image` - For pages with featured images
- `summary` - For text-heavy pages

## Structured Data

Every page MUST include JSON-LD structured data:

### Main Page (index.html)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Schema Resume",
  "applicationCategory": "DeveloperApplication",
  "description": "[application description]",
  "url": "https://tradik.github.io/schema-resume/",
  "author": {
    "@type": "Organization",
    "name": "Tradik"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "softwareVersion": "1.1.0",
  "operatingSystem": "Any",
  "license": "https://opensource.org/licenses/MIT",
  "codeRepository": "https://github.com/tradik/schema-resume"
}
</script>
```

### Tool Pages (validator.html)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Tool Name]",
  "applicationCategory": "DeveloperApplication",
  "description": "[tool description]",
  "url": "[tool URL]",
  "author": {
    "@type": "Organization",
    "name": "Tradik"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "browserRequirements": "Requires JavaScript. Works with modern browsers.",
  "operatingSystem": "Any",
  "isPartOf": {
    "@type": "SoftwareApplication",
    "name": "Schema Resume",
    "url": "https://tradik.github.io/schema-resume/"
  }
}
</script>
```

## Technical SEO

### Favicon

All pages must include favicon links:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

### Canonical URL

Every page must have a canonical URL:

```html
<link rel="canonical" href="[full absolute URL]">
```

**Rules:**
- Always use absolute URLs (https://...)
- Point to the preferred version of the page
- Avoid duplicate content issues

### Language Declaration

```html
<html lang="en">
```

### Semantic HTML

Use proper semantic HTML5 elements:

```html
<header>   <!-- Page header -->
<nav>      <!-- Navigation -->
<main>     <!-- Main content -->
<article>  <!-- Independent content -->
<section>  <!-- Thematic grouping -->
<aside>    <!-- Sidebar content -->
<footer>   <!-- Page footer -->
```

### Heading Hierarchy

Maintain proper heading structure:

```html
<h1>Page Title</h1>           <!-- Only ONE h1 per page -->
  <h2>Main Section</h2>        <!-- Multiple h2s allowed -->
    <h3>Subsection</h3>        <!-- Nested under h2 -->
      <h4>Sub-subsection</h4>  <!-- Nested under h3 -->
```

**Rules:**
- Only ONE `<h1>` per page
- Don't skip heading levels (h1 → h3)
- Use headings for structure, not styling

### Alt Text for Images

All images must have descriptive alt text:

```html
<img src="logo.png" alt="Schema Resume logo">
```

For decorative images or emojis:

```html
<span role="img" aria-label="Document">📄</span>
```

### Internal Linking

- Use descriptive anchor text
- Link to related pages
- Maintain clear navigation structure
- Use relative URLs for internal links

### Mobile Responsiveness

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Ensure:
- Responsive design
- Touch-friendly elements (min 44x44px)
- Readable font sizes (min 16px)
- No horizontal scrolling

## Content Guidelines

### URL Structure

**Good:**
- `https://tradik.github.io/schema-resume/`
- `https://tradik.github.io/schema-resume/validator.html`

**Bad:**
- URLs with query parameters (when avoidable)
- URLs with session IDs
- Overly long URLs

### Page Speed

- Minimize CSS/JS
- Optimize images
- Use CDN for external resources
- Enable compression
- Leverage browser caching

### Accessibility

All SEO improvements must maintain accessibility:

- ARIA labels for icons
- Keyboard navigation
- Screen reader compatibility
- Sufficient color contrast (WCAG 2.2 AA)
- Focus indicators

## Sitemap

Maintain `sitemap.xml` in root directory:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>[page URL]</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Priority Guidelines:**
- Homepage: 1.0
- Main tools: 0.8
- Documentation: 0.6-0.7
- Examples: 0.5-0.6

**Change Frequency:**
- Homepage: weekly
- Tools: monthly
- Documentation: monthly
- Static resources: yearly

## Robots.txt

Maintain `robots.txt` in root directory:

```txt
User-agent: *
Allow: /
Sitemap: https://tradik.github.io/schema-resume/sitemap.xml
```

## Checklist

Use this checklist for every new HTML page:

### Meta Tags
- [ ] `<meta charset="UTF-8">`
- [ ] `<meta name="viewport">`
- [ ] `<title>` (50-60 chars, unique)
- [ ] `<meta name="description">` (150-160 chars)
- [ ] `<meta name="keywords">`
- [ ] `<meta name="author" content="Tradik">`
- [ ] `<meta name="robots" content="index, follow">`
- [ ] `<link rel="canonical">`
- [ ] `<meta name="theme-color">`

### Social Media
- [ ] Open Graph `og:type`
- [ ] Open Graph `og:url`
- [ ] Open Graph `og:title`
- [ ] Open Graph `og:description`
- [ ] Open Graph `og:image`
- [ ] Open Graph `og:site_name`
- [ ] Twitter `twitter:card`
- [ ] Twitter `twitter:title`
- [ ] Twitter `twitter:description`
- [ ] Twitter `twitter:image`
- [ ] Twitter `twitter:creator`

### Structured Data
- [ ] JSON-LD script with appropriate schema type
- [ ] All required properties included
- [ ] Valid JSON syntax

### Technical
- [ ] Favicon links (32x32, 16x16, apple-touch-icon)
- [ ] `<html lang="en">`
- [ ] Semantic HTML5 elements
- [ ] Single `<h1>` tag
- [ ] Proper heading hierarchy
- [ ] Alt text for all images
- [ ] ARIA labels for icons/emojis
- [ ] Mobile responsive
- [ ] Fast loading time

### Content
- [ ] Unique, valuable content
- [ ] Primary keyword in title
- [ ] Primary keyword in description
- [ ] Primary keyword in H1
- [ ] Internal links to related pages
- [ ] External links open in new tab (when appropriate)

### Files
- [ ] Page added to `sitemap.xml`
- [ ] Sitemap date updated
- [ ] No blocking in `robots.txt`

## Testing Tools

Validate SEO implementation with these tools:

1. **Google Search Console** - Index status, errors
2. **Google PageSpeed Insights** - Performance, Core Web Vitals
3. **Google Rich Results Test** - Structured data validation
4. **Facebook Sharing Debugger** - Open Graph validation
5. **Twitter Card Validator** - Twitter card validation
6. **Lighthouse** (Chrome DevTools) - Overall SEO audit
7. **WAVE** - Accessibility testing
8. **Schema.org Validator** - JSON-LD validation

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

**Last Updated**: 2024-10-15  
**Version**: 1.0.0
