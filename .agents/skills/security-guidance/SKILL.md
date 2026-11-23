---
name: security-guidance
description: >-
  Enforces real-time secure coding guardrails during file edits and command execution
  (inspired by Anthropic's official security-guidance plugin). Use whenever writing or
  modifying HTML/JSX rendering, external links/redirects, forms, JSON-LD scripts, shell
  commands, GitHub Actions workflows, Nginx/Docker configs, or API integrations.
---

# Real-Time Secure Coding Guardrails (`security-guidance`)

Use this skill as an inline preventative shield **while authoring code or configs** so vulnerabilities never enter the working tree. *(For full repository assessments and reporting, use `anthropic-security-audit`.)*

---

## 1. Dangerous Sink Guardrails (Frontend & Node/TS)

Check these rules automatically before writing or editing matching patterns:

1. **`dangerouslySetInnerHTML` / `innerHTML` / Raw `<script>` Tags:**
   - Never pass user-controlled, URL-derived, or external data into `dangerouslySetInnerHTML` without a battle-tested HTML sanitizer (e.g., DOMPurify).
   - When serializing structured data into raw `<script type="application/ld+json">` tags, **always escape `<` as `\u003c`** (`JSON.stringify(payload).replace(/</g, "\\u003c")`) so a `</script>` substring can never break out of the script element.
2. **Dynamic URLs, Redirects & `window.open`:**
   - Validate dynamic `href`, `src`, and `window.open()` targets against an explicit scheme allowlist (`https:`, `http:`, `mailto:`, `tel:`) — block `javascript:`, `data:`, and `vbscript:`.
   - Always pass `"noopener,noreferrer"` as the third argument to `window.open(url, "_blank", "noopener,noreferrer")` and `rel="noopener noreferrer"` on `<a target="_blank">` elements.
   - Encode every user-supplied parameter interpolated into `wa.me` or Gmail compose query strings with `encodeURIComponent()`.
3. **Shell & Subprocess Execution (`child_process`, Scripts):**
   - Never pass interpolated strings to `exec()` or `execSync()`. Use `execFile()` / `spawn()` with an argument array and `shell: false`.
4. **Prototype Pollution & Unsafe Parsing:**
   - Validate untrusted JSON (`localStorage`, `postMessage`, webhook bodies) with runtime type guards or schema validators; check `event.origin` strictly on every `window.addEventListener("message", ...)` handler.
5. **Secrets & Environment Variables:**
   - Never place private keys, tokens, or API secrets in `NEXT_PUBLIC_*` variables, client components, `data/*.ts`, or committed config files.

---

## 2. Infrastructure, Docker, Nginx & GitHub Actions Guardrails

- **GitHub Actions (`.github/workflows/*.yml`):**
  - Never interpolate untrusted GitHub context (`${{ github.event.pull_request.title }}`, `${{ github.head_ref }}`, commit messages) directly inside a `run:` shell block — bind them via `env:` variables first to prevent command injection.
  - Scope `permissions:` to the minimum required (`contents: read`, `pages: write`, `id-token: write`).
- **Nginx (`nginx.conf`) & Static Hosting:**
  - Include `X-Content-Type-Options "nosniff" always`, `X-Frame-Options "SAMEORIGIN" always` (or CSP `frame-ancestors`), `Referrer-Policy "strict-origin-when-cross-origin" always`, and block dotfile access (`location ~ /\.(?!well-known) { deny all; }`).
- **Dockerfile:**
  - Run production containers as a non-root user where supported, pin base image major/minor tags, and ensure `.dockerignore` excludes `.git`, `.env*`, and `node_modules`.

