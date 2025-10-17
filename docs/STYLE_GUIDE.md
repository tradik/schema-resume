# Style Guide for Schema Resume

This document defines the design system, color palette, and accessibility guidelines for the Schema Resume project.

## 🎨 Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Primary Red** | `#990000` | `rgb(153, 0, 0)` | Primary actions, links, headings, accents |
| **Dark Red** | `#7a0000` | `rgb(122, 0, 0)` | Hover states, darker accents |
| **Gold/Yellow** | `#facc2e` | `rgb(250, 204, 46)` | Call-to-action buttons, highlights |

### Text Colors

| Color Name | Hex Code | RGB | Usage | WCAG Contrast |
|------------|----------|-----|-------|---------------|
| **Text Primary** | `#000000` | `rgb(0, 0, 0)` | Body text, headings | AAA on white |
| **Text Secondary** | `#666666` | `rgb(102, 102, 102)` | Secondary text, captions, labels | AA on white |
| **Text Tertiary** | `#737373` | `rgb(115, 115, 115)` | Footer text, metadata | AA on white |

### Background Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Background Primary** | `#ffffff` | `rgb(255, 255, 255)` | Main content areas, page background |
| **Background Secondary** | `#eeeeee` | `rgb(238, 238, 238)` | Cards, sections, alternating backgrounds |
| **Background Light Gray** | `#d8d8d8` | `rgb(216, 216, 216)` | Subtle boxes, inactive elements |
| **Code Background** | `#eeddcc` | `rgb(238, 221, 204)` | Code blocks (tan/beige) |
| **Programlisting Background** | `#eeeeee` | `rgb(238, 238, 238)` | Alternative code blocks |

### Utility Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Success Green** | `#10b981` | `rgb(16, 185, 129)` | Success messages, validation |
| **Warning Red** | `#9f1313` | `rgb(159, 19, 19)` | Warnings, errors |
| **Warning Background** | `#f8e8e8` | `rgb(248, 232, 232)` | Warning box backgrounds |
| **Border Light** | `#dadada` | `rgb(218, 218, 218)` | Light borders, input fields |
| **Border Medium** | `#cccccc` | `rgb(204, 204, 204)` | Standard borders, dividers |
| **Border Dark** | `#b6b6b6` | `rgb(182, 182, 182)` | Darker borders, separators |

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
font-family: Verdana, Geneva, 'DejaVu Sans', sans-serif;
```


### Font Sizes

| Element | Size | Line Height | Weight |
|---------|------|-------------|--------|
| **H1** | 120% (19.2px) | 1.2 | 700 (bold) |
| **H2** | 115% (18.4px) | 1.2 | 700 (bold) |
| **H3** | 110% (17.6px) | 1.2 | 700 (bold) |
| **Body** | 1em (16px) | 1.2 | 400 |
| **Small** | 0.9em (14.4px) | 1.3 | 400 |
| **Code** | 1.1em (17.6px) | 1.2 | 400 (monospace) |

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
  background-color: #990000;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  transition: background-color 0.2s;
  text-decoration: none;
}

.btn:hover {
  background-color: #7a0000;
}

.btn:focus {
  outline: 2px solid #990000;
  outline-offset: 2px;
}

.btn-primary {
  background-color: #facc2e;
  color: #990000;
}

.btn-primary:hover {
  background-color: #e5b829;
}
```

### Cards

```css
.card {
  background-color: #eeeeee;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid #cccccc;
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
  background-color: #eeddcc;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 1ex;
  overflow-x: auto;
  font-family: monospace;
  font-size: 1.1em;
}

.programlisting {
  background-color: #eeeeee;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 1ex;
  overflow-x: auto;
  font-family: monospace;
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
  color: #990000;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #990000;
}

a:focus {
  outline: 2px solid #990000;
  outline-offset: 2px;
}

a:visited {
  color: #7a0000;
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
background: linear-gradient(135deg, #990000 0%, #7a0000 100%);
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

**Last Updated**: 2025-10-17  
**Version**: 2.0.0 
**Maintained by**: Tradik  

