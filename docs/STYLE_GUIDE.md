# Style Guide for Schema Resume

This document defines the design system, color palette, and accessibility guidelines for the Schema Resume project.

## 🎨 Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Primary Blue** | `#2563eb` | `rgb(37, 99, 235)` | Primary actions, links, headings |
| **Secondary Blue** | `#1e40af` | `rgb(30, 64, 175)` | Hover states, gradients |
| **Accent Blue** | `#3b82f6` | `rgb(59, 130, 246)` | Highlights, active states |

### Text Colors

| Color Name | Hex Code | RGB | Usage | WCAG Contrast |
|------------|----------|-----|-------|---------------|
| **Text Primary** | `#1f2937` | `rgb(31, 41, 55)` | Body text, headings | AAA on white |
| **Text Secondary** | `#6b7280` | `rgb(107, 114, 128)` | Secondary text, captions | AA on white |

### Background Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Background Primary** | `#ffffff` | `rgb(255, 255, 255)` | Main content areas |
| **Background Secondary** | `#f9fafb` | `rgb(249, 250, 251)` | Page background, cards |
| **Code Background** | `#f3f4f6` | `rgb(243, 244, 246)` | Code blocks, inline code |

### Utility Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Success Green** | `#10b981` | `rgb(16, 185, 129)` | Success messages, badges |
| **Border Color** | `#e5e7eb` | `rgb(229, 231, 235)` | Borders, dividers |

## ♿ WCAG 2.2 Accessibility Compliance

### Contrast Requirements

All color combinations meet **WCAG 2.2 Level AA** standards (minimum 4.5:1 for normal text, 3:1 for large text).

#### Text Contrast Ratios

| Foreground | Background | Contrast Ratio | WCAG Level | Pass |
|------------|------------|----------------|------------|------|
| Text Primary (#1f2937) | Background Primary (#ffffff) | 15.8:1 | AAA | ✅ |
| Text Secondary (#6b7280) | Background Primary (#ffffff) | 5.7:1 | AA | ✅ |
| Primary Blue (#2563eb) | Background Primary (#ffffff) | 5.1:1 | AA | ✅ |
| White (#ffffff) | Primary Blue (#2563eb) | 5.1:1 | AA | ✅ |
| White (#ffffff) | Secondary Blue (#1e40af) | 7.5:1 | AAA | ✅ |

### Accessibility Features

- ✅ **Sufficient color contrast** for all text
- ✅ **Focus indicators** on interactive elements
- ✅ **Semantic HTML** structure
- ✅ **Alt text** for images
- ✅ **Keyboard navigation** support
- ✅ **Screen reader** friendly
- ✅ **Responsive design** for all devices
- ✅ **Clear visual hierarchy**

## 📐 Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes

| Element | Size | Line Height | Weight |
|---------|------|-------------|--------|
| **H1** | 3rem (48px) | 1.2 | 700 |
| **H2** | 2rem (32px) | 1.3 | 600 |
| **H3** | 1.5rem (24px) | 1.4 | 600 |
| **Body** | 1rem (16px) | 1.6 | 400 |
| **Small** | 0.875rem (14px) | 1.5 | 400 |
| **Code** | 0.9rem (14.4px) | 1.5 | 400 |

### Responsive Typography

```css
/* Mobile (< 768px) */
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }

/* Tablet and Desktop (>= 768px) */
h1 { font-size: 3rem; }
h2 { font-size: 2rem; }
```

## 🎯 Spacing System

Based on 4px base unit:

| Size | Value | Usage |
|------|-------|-------|
| **xs** | 4px | Tight spacing |
| **sm** | 8px | Small gaps |
| **md** | 16px | Default spacing |
| **lg** | 24px | Section spacing |
| **xl** | 32px | Large spacing |
| **2xl** | 48px | Extra large spacing |

## 📦 Component Styles

### Buttons

```css
.btn {
  padding: 12px 24px;
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #1e40af;
}

.btn:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### Cards

```css
.card {
  background-color: #f9fafb;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Code Blocks

```css
.code-block {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 20px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
```

## 🎭 Design Principles

### 1. Clarity
- Clear visual hierarchy
- Consistent spacing
- Readable typography
- Obvious interactive elements

### 2. Simplicity
- Minimal design
- No unnecessary decorations
- Focus on content
- Clean layouts

### 3. Consistency
- Consistent color usage
- Uniform spacing
- Standard component styles
- Predictable interactions

### 4. Accessibility
- WCAG 2.2 Level AA compliance
- Keyboard navigation
- Screen reader support
- Sufficient contrast ratios

### 5. Responsiveness
- Mobile-first approach
- Flexible layouts
- Adaptive typography
- Touch-friendly targets

## 🔍 Interactive States

### Links

```css
a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

a:visited {
  color: #1e40af;
}
```

### Buttons

- **Default**: Primary blue background
- **Hover**: Darker blue background
- **Focus**: Visible outline
- **Active**: Slightly darker shade
- **Disabled**: Reduced opacity (0.5)

### Form Elements

- **Default**: Light border
- **Focus**: Blue border with outline
- **Error**: Red border
- **Success**: Green border

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

## 🎨 Gradient Usage

### Header Gradient

```css
background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
```

### Hover Gradients

Use subtle gradients for hover states on large elements.

## 🌗 Dark Mode (Future)

Reserved color variables for future dark mode implementation:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
  }
}
```

## ✅ Checklist for New Components

When creating new components, ensure:

- [ ] Colors meet WCAG 2.2 AA contrast requirements
- [ ] Hover states are defined
- [ ] Focus states are visible
- [ ] Responsive design implemented
- [ ] Keyboard navigation works
- [ ] Touch targets are at least 44x44px
- [ ] Consistent spacing applied
- [ ] Typography follows guidelines
- [ ] Transitions are smooth (200-300ms)
- [ ] Component is accessible

## 📚 Tools for Validation

### Contrast Checkers
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio](https://contrast-ratio.com/)
- Chrome DevTools Lighthouse

### Accessibility Testing
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Screen readers (NVDA, JAWS, VoiceOver)

### Color Tools
- [Coolors](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)
- [Color Hunt](https://colorhunt.co/)

## 📝 Notes

- All colors are defined as CSS custom properties in the HTML
- Maintain consistency across all pages and components
- Test with actual users when possible
- Regular accessibility audits recommended
- Keep this guide updated with any changes

---

**Last Updated**: 2025-10-09  
**Version**: 1.0.0  
**Maintained by**: Tradik
