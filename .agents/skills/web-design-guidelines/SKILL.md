---
name: web-design-guidelines
description: >-
  Audits and enforces Vercel's Web Interface Guidelines (vercel-labs/agent-skills) across
  keyboard/focus interactions, forms, typography micro-details, layout stability, dark mode,
  hydration safety, and Core Web Vitals. Use when asked to review UI compliance, check web
  interface guidelines, or audit HTML/CSS/React UX details.
---

# Web Design & Interface Guidelines (`web-design-guidelines`)

Use this skill to audit UI components and pages against Vercel's **Web Interface Guidelines**, returning terse, high-precision `file:line` findings or applying compliant fixes directly.

---

## Complete Audit Checklist

### 1. Interactions, Keyboard & Focus
- Full keyboard operability (`WAI-ARIA` APG patterns for dialogs, tabs, menus).
- Visible `:focus-visible` rings on every interactive element; never set `outline: none` without a high-contrast replacement ring.
- Hit targets $\ge 24\text{px}$ desktop, $\ge 44\text{px}$ mobile/touch (`pointer: coarse`). If visual icon is smaller, expand hit area via padding or pseudo-element.
- Never dead-zone padding inside clickable rows/buttons — the `<button>` or `<a>` itself carries the padding.
- Prevent accidental double-submits; keep `cursor: pointer` consistent per project convention without hiding native cursors (`cursor: none` globally is banned).
- Use real `<a href>` for anything navigable (supports `Cmd/Ctrl+Click`, middle-click, Open in New Tab) and `<button type="button">` for in-page actions.

### 2. Forms & Validation
- Every `<input>`, `<textarea>`, and `<select>` is paired with a programmatic `<label htmlFor>` (or `aria-label` when visually compact).
- Set accurate `type` (`email`, `tel`, `url`), `inputMode`, `autoComplete` (`name`, `email`, `tel`), and `spellCheck={false}` on emails/usernames/code.
- Never block paste (`onPaste` preventDefault) on any field.
- Reserve space for inline validation errors or display them cleanly on blur/submit without jumping surrounding sections; focus the first invalid field on failed submit.
- Submit via `Enter` in single-line inputs and `Cmd/Ctrl+Enter` in `<textarea>`.

### 3. Typography & Microcopy Details
- Apply `font-variant-numeric: tabular-nums` (`tabular-nums`) on numbers that update, align in columns, or represent indices/folio numerals/timers.
- Apply `text-wrap: balance` on multi-line headings (`<h1>`–`<h3>`) and `text-wrap: pretty` on body paragraphs.
- Use typographic glyphs where appropriate: true ellipsis `…` (`\u2026`) over `...`, en/em dashes (`–` / `—`), curly quotes, and non-breaking spaces (`\u00A0`) between numbers and units (`100 ms`, `60 fps`).
- Ensure flex/grid children carrying dynamic text include `min-w-0` + `truncate` or `break-words` so long strings never blow out horizontal scroll.

### 4. Performance, Media & Core Web Vitals
- Explicit `width` and `height` on all `<img>` / `<svg>` elements to guarantee `CLS = 0`.
- Above-the-fold LCP hero image gets `fetchPriority="high"` and eager loading (`loading="eager"`); below-the-fold images get `loading="lazy"` and `decoding="async"`.
- Load variable Google/local fonts with `display: "swap"` and only required subsets (`latin`, `latin-ext`), avoiding 15+ static weight files.
- Never animate layout properties; honor `@media (prefers-reduced-motion: reduce)`.

### 5. Theme, Hydration & State Sync
- Set `color-scheme: dark` (or `light dark`) on `<html>` so native scrollbars, form controls, and browser overscroll match the page ground.
- Guard initial theme/language boot in a synchronous `<head>` script when static-exporting so there is zero flash of wrong language/theme and zero React hydration mismatch.
- Ensure deep-linkable sections/modals handle URL hashes (`#projects`, `#contact`) and scroll offset (`scroll-margin-top` or tuned `NAV_OFFSET`) cleanly.

---

## Audit Report Output Format
When invoked as a review/audit tool, output terse, scannable findings grouped by file:

```markdown
### [Component.tsx](file:///abs/path/Component.tsx)
- `L34`: Icon `<button>` missing `type="button"` inside `<form>` (triggers unintended submit).
- `L58`: Counter numeral missing `tabular-nums` class (causes horizontal jitter during updates).
```

