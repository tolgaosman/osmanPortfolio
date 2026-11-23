---
name: playwright-cli
description: >-
  Automates browser inspection, interactive QA, visual regression screenshots, console/network
  debugging, and deterministic Playwright E2E tests using Microsoft's token-efficient
  playwright-cli snapshot workflow (open -> snapshot -> click/fill -> verify). Use when asked
  to test UI via Playwright CLI, write Playwright E2E specs, or inspect rendered pages via CLI.
---

# Playwright CLI & Deterministic E2E Testing (`playwright-cli`)

Use this skill for token-efficient terminal browser automation (`@playwright/cli`) and flake-free Playwright E2E test authoring (`@playwright/test`).

## Environment Note
- If the user asks for interactive live Chrome visual browsing without specifying CLI, check whether the built-in browser subagent is more appropriate. Use `playwright-cli` / `npx playwright` specifically when CLI execution, headless snapshot inspection, reproducible E2E specs, or static build verification is requested.
- On Windows inside a sandboxed shell, a local server started in one command is only reachable within that **same** command chain unless run outside the sandbox. Start the server, run the Playwright check, and stop the server cleanly in a single lifecycle when testing in-sandbox.

---

## 1. Token-Efficient `playwright-cli` Snapshot Loop

Unlike verbose DOM dumps, `playwright-cli` maps interactive accessibility nodes to compact IDs (`e1`, `e2`, `e3`…):

### Setup Check
```bash
# Check availability (install globally only with user permission if missing)
playwright-cli --version
```

### Core Interactive Sequence
```bash
# 1. Open target URL (use -s=<name> to isolate named sessions)
playwright-cli open http://localhost:3000

# 2. Capture compact accessibility snapshot -> inspect ref IDs (e1, e2, ...)
playwright-cli snapshot

# 3. Act deterministically using snapshot element refs
playwright-cli click e4
playwright-cli fill e7 "Tolga Osman"
playwright-cli press Enter

# 4. Re-snapshot after DOM/route changes (refs refresh after navigation/modals!)
playwright-cli snapshot

# 5. Capture visual evidence, console errors, and network failures
playwright-cli screenshot --filename=qa-desktop.png
playwright-cli console
playwright-cli network

# 6. Test mobile / tablet viewports
playwright-cli resize 390 844
playwright-cli screenshot --filename=qa-mobile.png

# 7. Clean up session
playwright-cli close
```

---

## 2. Authoring Flake-Free Playwright E2E Specs (`*.spec.ts`)

When adding automated Playwright tests to a Next.js / React project:

1. **User-Facing Locators Only (Priority Order):**
   - `page.getByRole("button", { name: /send|gönder/i })`
   - `page.getByLabel(...)` / `page.getByPlaceholder(...)`
   - `page.getByText(...)`
   - Never bind tests to brittle Tailwind utility classes (`.px-4.py-2`) or nth-child chains.
2. **Zero `page.waitForTimeout()`:**
   - Rely exclusively on auto-retrying web-first assertions (`await expect(locator).toBeVisible()`, `toHaveAttribute()`, `toHaveURL()`).
3. **Static Export (`out/`) & BasePath Verification:**
   - Test production static builds (`npm run build` → serve `out/`) to catch broken `/public` asset paths (`404` on `<img>` `naturalWidth === 0`), missing `<script type="application/ld+json">`, language-switch persistence (`EN` ↔ `TR`), modal scroll-lock cleanup, and zero `pageerror` / `console.error` events:
   ```ts
   const errors: string[] = [];
   page.on("pageerror", (err) => errors.push(err.message));
   // ... interact with page ...
   expect(errors).toEqual([]);
   ```
4. **Reduced-Motion Matrix:**
   - Run an assertion pass with `await page.emulateMedia({ reducedMotion: "reduce" })` to verify ambient/pinned layers disable cleanly and content remains 100% reachable.

