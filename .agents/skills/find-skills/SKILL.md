---
name: find-skills
description: >-
  Discovers, evaluates, audits, and installs modular AI agent skills from open registries
  (skills.sh, vercel-labs, anthropics/skills, GitHub) and manages local workspace skills.
  Use when the user asks to find, browse, compare, deduplicate, or add new skills ("is there
  a skill for X?", "find skills", "fine skills", "audit our skills").
---

# Find & Manage Agent Skills (`find-skills`)

Use this skill to discover, vet, install, and govern modular `SKILL.md` packages without bloating the project with redundant, conflicting, or untrusted instructions.

## 1. Discovery Workflow

When the user asks for a capability, workflow, or domain skill:

1. **Check Local Inventory First**
   - Inspect `.agents/skills/`, `.claude/skills/`, and `.agents/rules/` before searching externally.
   - Verify whether an existing skill already covers the capability or only needs a targeted update.

2. **Search Trusted Upstream Registries**
   - Query the open Agent Skills ecosystem (`skills.sh` leaderboard and official GitHub orgs):
     - `vercel-labs/skills` & `vercel-labs/agent-skills` (Next.js, React, Web Design Guidelines, skill tooling)
     - `anthropics/skills` & `anthropics/claude-plugins-official` (Frontend Design, Code Review, Security Guidance, MCP builders)
     - `microsoft/playwright-cli` (Browser automation & E2E snapshots)
     - `obra/superpowers` (TDD, systematic debugging, planning)
     - `pbakaus/impeccable`, `emilkowalski/skills`, `Leonxlnx/taste-skill` (Design engineering & motion)
   - If the Skills CLI is available in an unsandboxed shell:
     ```bash
     npx skills find "<keyword>"
     ```

3. **Quality & Security Vetting Gate (Mandatory)**
   Before installing or adapting any third-party skill, verify all four checks:
   - **Publisher & Provenance:** Prefer official orgs or well-audited open-source maintainers. Never pull skills from typosquatted repos or unverified mirrors.
   - **Executable Payload Inspection:** Inspect any `scripts/` or `hooks.json` bundled with the skill. Reject obfuscated shell commands, credential readers, or unexpected network exfiltration.
   - **Trigger Specificity:** Ensure the YAML `description` states a narrow, third-person activation condition so it does not hijack unrelated prompts.
   - **Conflict Check (`skill-stocktake`):** Compare against existing skills in `.agents/skills/` to prevent two skills from fighting over the same output file (e.g., `DESIGN.md`) or lifecycle hook.

## 2. Installation & Authoring Standards

### Installing via CLI
```bash
# Project-scoped installation
npx skills add <owner/repo> --skill <skill-name>
```

### Authoring or Adapting a Workspace Skill
Place every skill at `.agents/skills/<skill-name>/SKILL.md` (mirroring or linking to `.claude/skills/` when Claude Code compatibility is required):

```markdown
---
name: lowercase-hyphenated-name
description: >-
  Third-person summary of WHAT the skill does and WHEN to invoke it.
  Include explicit non-goals so it does not collide with adjacent skills.
---

# Skill Title

## Precedence
State how this skill defers to project-local ground truth (`CLAUDE.md`, `.agents/rules/`).

## Workflow
Step-by-step deterministic execution steps, concrete constraints, and verification commands.
```

## 3. Overlap & Stocktake Audit

When asked to review or clean up a skill library:
1. Group all installed skills by domain (**Orchestration**, **Memory/Observability**, **Frontend/Design**, **Motion**, **Security/Review**, **Testing**).
2. Flag **Hard Collisions** (competing session hooks, duplicate slash commands, contradictory aesthetic presets).
3. Establish a **Precedence Ladder** so project-level rules (`CLAUDE.md`, `.agents/rules/*.md`) sit at Priority 0, one primary driver owns each domain, and specialist audit skills run on-demand.

## 4. Verification
- Confirm every `SKILL.md` starts with `---`, contains valid `name` and `description` keys, and matches its parent directory name.
- Ensure no broken relative links (`./scripts/...`, `./references/...`) exist inside `SKILL.md`.

