---
name: claude-mem
description: >-
  Manages cross-session persistent project memory using a token-efficient 3-layer progressive
  disclosure workflow (Index -> Timeline -> Full Observation) inspired by thedotmack/claude-mem.
  Use when recalling architectural decisions, past bugfixes, gotchas, or session handoffs, or
  when persisting durable project knowledge across conversations.
---

# Persistent Project Memory (`claude-mem`)

Use this skill to retrieve and record durable project context across sessions without polluting the context window with raw, high-token transcripts.

## Separation of Concerns (Coexistence Rule)
- **`claude-mem`** stores **project & codebase facts** (architectural decisions, non-obvious bug root causes, environment quirks, unfinished session handoffs).
- **`task-observer`** stores **agent workflow & skill friction** (user corrections to agent behavior, missing rules, skill improvements). Never duplicate entries into both stores.

---

## 1. Retrieving Past Context: The 3-Layer Progressive Workflow

Whether querying an active `claude-mem` MCP server (`search` / `timeline` / `get_observations`) or scanning the local workspace memory vault (`.agents/memory/`), **never dump all historical files into context at once**:

### Layer 1 — Search Index (~50–100 tokens/hit)
- Query only lightweight titles, tags, dates, and observation IDs first.
- If using `claude-mem` MCP: `search(query="<topic>", type="decision|bugfix|gotcha", limit=10)`.
- If using local `.agents/memory/INDEX.md` or file headers: grep headings/frontmatter only (`rg "^## |^tags:" .agents/memory`).

### Layer 2 — Timeline & Surrounding Context
- For promising hits from Layer 1, inspect what happened immediately before and after to understand whether a decision was superseded.
- Notice explicit reversals (e.g., in `CLAUDE.md`, the warm-editorial theme was intentionally replaced by the jade emitting-instrument identity — never resurrect superseded history!).

### Layer 3 — Selective Deep Fetch
- Read full observation records **only** for the 1–3 validated IDs directly relevant to the current task.

---

## 2. Recording Durable Observations

Record a memory entry when a session produces high-signal knowledge that is **not** already obvious from reading `CLAUDE.md` or type definitions:

### Observation Taxonomy
- `decision` — Architectural trade-off chosen and *why* alternatives were rejected.
- `bugfix` — Subtle bug symptom, root cause, and invariant required to prevent recurrence.
- `gotcha` — Framework/build/deployment trap (e.g., Next.js 16 static export `beforeInteractive` script queue, Satori WOFF2 limitation, Tailwind v4 `--font-*` variable collision).
- `handoff` — Exact stopping point, verified passing steps, and next action items for multi-session work.

### Local Storage Format (`.agents/memory/`)
When no external `claude-mem` SQLite/MCP daemon is connected, store concise Markdown entries in `.agents/memory/INDEX.md` + `.agents/memory/observations/<YYYY-MM-DD>-<slug>.md`:

```markdown
---
id: obs-2026-11-22-example
type: gotcha
files: [app/layout.tsx, next.config.ts]
tags: [nextjs-16, static-export, json-ld]
---

# Summary Title (1 line)

- **Context:** When / where this surfaces.
- **Root Cause / Rationale:** Concrete technical mechanism.
- **Rule Going Forward:** Exact invariant to preserve.
```

## 3. Hygiene Rules
- Never store secrets, API keys, tokens, or personal credentials in memory files.
- Before recording a permanent architectural law, check if it belongs directly in `CLAUDE.md` instead so every tool sees it immediately.

