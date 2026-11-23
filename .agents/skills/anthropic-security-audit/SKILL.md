---
name: anthropic-security-audit
description: >-
  Conducts comprehensive repository-wide security audits, threat modeling, and vulnerability
  assessments covering OWASP Top 10 for Web Applications, OWASP Top 10 for LLM Integrations
  (Anthropic Claude / AI APIs), secrets exposure, static-export/frontend security, and CI/CD
  supply chain risks. Use when asked for a security audit, pentest review, or threat model.
---

# Comprehensive Web & LLM Security Audit (`anthropic-security-audit`)

Use this skill when performing a structured, end-to-end security audit or threat model of a codebase. *(For lightweight inline checks during routine coding, use `security-guidance` instead.)*

---

## 1. Reconnaissance & Attack Surface Mapping
Before scanning patterns, map the architecture:
1. **Runtime Topology:** Static export (`output: "export"`), SSR/Edge API routes, Server Actions, external webhooks, Docker/Nginx reverse proxy (`Dockerfile`, `nginx.conf`), CI/CD workflows (`.github/workflows/*.yml`).
2. **Trust Boundaries:** Untrusted user inputs (forms, URL query params, `localStorage`, `postMessage`, file uploads, external JSON/API payloads, LLM inputs/outputs).
3. **Privilege & Secrets Footprint:** Environment variables (`NEXT_PUBLIC_*` vs server-only `.env`), API keys, OAuth tokens, third-party scripts, CSP headers.

---

## 2. LLM & AI Agent Security Checklist (OWASP LLM01–LLM10)
Whenever the repository integrates Anthropic Claude, OpenAI, Gemini, MCP servers, or RAG pipelines:
- **LLM01 Prompt Injection (Direct & Indirect):** User or retrieved third-party text concatenated into system prompts without structural isolation (XML delimiters + untrusted-data framing + strict schema output validation).
- **LLM02 Insecure Output Handling:** Rendering LLM output via `dangerouslySetInnerHTML`, unescaped Markdown HTML, `eval()`, shell execution, SQL queries, or unvalidated `href`/`src` URLs (`javascript:` / `data:` XSS).
- **LLM04 Model Denial of Service & Cost Exhaustion:** Unbounded `max_tokens`, missing per-IP/user rate limits, recursive agent loops without step caps, or unauthenticated public LLM proxy endpoints.
- **LLM06 Sensitive Information Disclosure & Key Leakage:** Hardcoded `sk-ant-*` keys, client-side SDK usage (`dangerouslyAllowBrowser: true`), or sending unmasked PII/credentials to external model APIs.
- **LLM07 / LLM08 Tool & Excessive Agency:** Tools with write/delete/shell capabilities lacking strict schema validation, path sandboxing, or human-in-the-loop confirmation.
- **LLM10 System Prompt & Proprietary Context Leakage:** Treating system prompts as secret storage (never put secrets or auth logic inside prompts).

---

## 3. Web, Frontend & Infrastructure Checklist (OWASP Top 10)
1. **XSS & DOM Injection:**
   - Audit every `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write`, inline `<script>` JSON serialization (must escape `<` as `\u003c` in JSON-LD / hydration state to prevent `</script>` breakout!).
   - Validate dynamic URLs (`href`, `window.open`, `router.push`) against allowlisted protocols (`https:`, `mailto:`, `tel:`).
   - Enforce `rel="noopener noreferrer"` on external `target="_blank"` links (`window.opener` tabnabbing protection).
2. **Broken Access Control & Auth:**
   - Verify server-side session/JWT validation on every route/action (never rely on middleware or client guards alone), IDOR object ownership checks, CSRF protection.
3. **Security Headers & Reverse Proxy (`nginx.conf` / Hosting):**
   - Check Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, HSTS.
4. **Secrets & Git History Hygiene:**
   - Scan tracked files and `.env*` handling in `.gitignore` for API tokens, private keys (`*.pem`), webhook URLs, or accidental `NEXT_PUBLIC_` secret exposure.
5. **CI/CD & Dependency Supply Chain:**
   - Audit `.github/workflows/*.yml` for untrusted expression injection (`${{ github.event.issue.title }}` inside `run:`), over-broad `permissions: write-all`, unpinned third-party actions, and `package-lock.json` dependency advisories (`npm audit`).

---

## 4. Audit Execution & Deliverable Format

1. Run targeted static searches across source, config, Docker/Nginx, and workflow files.
2. Verify exploitability against the actual runtime (e.g., distinguish static build-time data from runtime user input to eliminate false positives!).
3. Produce a structured report (`security_audit_report.md` artifact when requested) containing:
   - **Executive Summary & Posture Rating**
   - **Vulnerability Matrix:** `ID | Severity (Critical/High/Medium/Low/Info) | Location (file:line) | CWE / OWASP | Exploit Scenario`
   - **Exact Remediation Patches:** Drop-in secure code snippets for every confirmed finding.

