# Vision — `lumenloop-skills`

A small, curated repository of **Claude Agent Skills** that make Claude immediately
useful for **researching and building on the Stellar ecosystem**, powered by
LumenLoop's free, read-only ecosystem MCP at **`https://mcp.lumenloop.com`**.

This document defines the *proper end result*: what a finished skill looks like,
how the repo is structured, how someone installs it, and what we test against.
It is the contract the build loop validates every skill against
(`scripts/validate_skills.mjs`).

---

## 1. What this repo is

LumenLoop publishes a free, **read-only** MCP server that exposes the public
Stellar ecosystem directory — projects, Stellar Community Fund (SCF) submissions,
and editorial/news/AV content — as 18 query tools any Claude client can connect to.

This repo is the **batteries-included companion**: preconfigured skills that teach
Claude *how to use those tools well* to do real ecosystem work (landscape research,
project due-diligence, SCF positioning, integration discovery, news digests) and to
**route from ecosystem discovery into actually building** on Stellar.

Two things ship together:

1. **`.mcp.json`** — preconfigures the `lumenloop` connector so the tools exist the
   moment the repo is installed. No manual MCP setup.
2. **`skills/`** — seven skills (below) that orchestrate those tools into workflows.

### Scope guardrail (non-negotiable)

We publish **only the public, guest-facing read surface** — the 18 tools listed in
§5. We do **not** document, reference, or imply any non-public capability, internal
access model, billing, or write/research tooling. The validator hard-fails on any
such leak. If a tool isn't in the §5 catalog, it does not exist as far as this repo
is concerned.

---

## 2. What a "proper" skill looks like

Researched against Anthropic's Agent Skills docs (code.claude.com/docs/en/skills)
and the conventions already used in this author's Stellar skills.

### 2.1 Anatomy

```
skills/<skill-name>/
├── SKILL.md                 # required — frontmatter + instructions
└── reference/               # optional — bundled, loaded on demand
    └── <file>.md|.rs|...
```

- **`SKILL.md`** is the only required file. The directory name *is* the skill's
  invocation name (`/<skill-name>`), so `name:` in frontmatter must match the folder.
- Bundled **reference files** hold heavy material (long catalogs, templates,
  copy-paste code) so the main body stays lean. The body links to them by relative
  path; they load only when Claude follows the link.

### 2.2 Frontmatter

```yaml
---
name: <skill-name>            # must equal the directory name
description: <what + WHEN>     # the single most important field; see below
user-invocable: true          # appears in the / menu
argument-hint: "[task]"        # optional, short
---
```

- **`description` is how Claude decides to use the skill.** It must state **what the
  skill does AND when to use it**, in the third person, with concrete trigger phrases
  ("Use when the user asks to map a sector / vet a project / find a wallet…").
  Lead with the primary use case. Combined `description` length is capped by Claude
  Code at 1,536 chars; we budget **≤ 1,024** and warn beyond it.
- Keep other frontmatter minimal. We standardize on `name`, `description`,
  `user-invocable: true`, and an optional `argument-hint`.

### 2.3 Progressive disclosure & size

Claude always sees every skill's `description`; it loads the **body** only when the
skill triggers, and **reference files** only when the body links to them. Therefore:

- **Body ≤ 500 lines.** Move catalogs/templates/long code into `reference/`.
- Write the body as **standing instructions**, not one-time steps — it stays in
  context for the rest of the session once loaded.
- Imperative voice, concrete tool calls with real parameter names, worked examples,
  and tables for option comparisons.

### 2.4 House structure (every SKILL.md body)

1. `# H1 Title` — short, descriptive.
2. One-paragraph intro — what it does, what data it draws on.
3. `## When to use this skill` — 3–7 bullet triggers.
4. `## Related skills` — cross-links to siblings as `../<name>/SKILL.md`.
5. `---`
6. Content: the tool playbook (which of the 18 tools, in what order, with which
   params), worked recipes, output shape, and gotchas.
7. Optional closing pointers to official Stellar docs.

### 2.5 Authoring rules baked into the validator

- `name` matches the directory; `description` present, ≤ caps, contains "Use when".
- Body has H1 + "When to use" + "Related skills"; body ≤ 500 lines.
- Every `../sibling/SKILL.md` cross-link resolves.
- Every `reference/<file>` mentioned exists.
- **Only the 18 guest tools** may appear as tool references; the three research
  tools and any internal/tier/billing phrasing are forbidden and fail the build.

---

## 3. The skill catalog (end state)

| Skill | Purpose | Primary tools |
|-------|---------|---------------|
| **lumenloop-mcp-connect** | Onboarding anchor: connect the MCP, the tool map, and which skill to reach for. | all 18 (catalog) |
| **stellar-ecosystem-scout** | Map a sector/topic into a landscape (projects, categories, regions, related content). | `search_directory`, `search_content_semantic`, `find_similar_projects_semantic`, `get_related_projects`, `get_categories`, `get_regions`, `get_tags_vocabulary` |
| **stellar-project-dossier** | Deep due-diligence profile of one project. | `get_project`, `find_content_about_project`, `find_av_passages`, `get_related_projects`, `get_scf_submissions` |
| **scf-submission-radar** | Position an SCF idea against prior submissions before applying. | `find_similar_scf_submissions`, `get_scf_submissions`, `search_directory` |
| **stellar-integration-finder** | "I need a wallet / oracle / anchor / RWA / DEX on Stellar" → shortlist + route to a build skill. | `search_directory`, `find_similar_projects_semantic`, `search_content_semantic`, `get_project` |
| **stellar-ecosystem-digest** | Dated digest of recent activity on a theme or named entity. | `list_documents`, `search_documents`, `search_content_semantic`, `find_content_by_entity`, `find_av_passages`, `list_research` |
| **stellar-builder-quickstart** | From idea → pick Stellar primitives, check prior art via the MCP, route to the right dev skill. | `search_directory`, `find_similar_projects_semantic`, `get_project` |

Each skill cross-links the others and (where relevant) points to external Stellar
build references the reader may already have (Soroban, dapp/SDK, assets, data,
standards, oracles).

---

## 4. How someone installs it

Three supported paths (full commands in `README.md`):

**A. As a Claude Code plugin (recommended).** The repo is a single-plugin
marketplace, so:
```
/plugin marketplace add lumenloop/lumenloop-skills
/plugin install lumenloop-skills@lumenloop
```
Installing the plugin enables the skills *and* wires the `lumenloop` MCP connector
from the bundled `.mcp.json`.

**B. Project-scoped (clone into a repo).** Clone and the repo's `.mcp.json` +
`skills/` are picked up when Claude Code runs in that directory.

**C. Personal skills (copy or symlink).** Copy any `skills/<name>/` folder into
`~/.claude/skills/`, and add the `lumenloop` server to your MCP config once.

In every path the user then **connects the `lumenloop` server** in their Claude
client (sign in once) and the 18 tools become available to the skills.

---

## 5. The published tool surface (the only tools skills may use)

Eighteen read-only tools, grouped:

**Directory & taxonomy** — `search_directory`, `get_project`, `get_related_projects`,
`get_categories`, `get_regions`, `get_tags_vocabulary`, `get_project_tags_vocabulary`

**Stellar Community Fund** — `get_scf_submissions`, `find_similar_scf_submissions`

**Semantic content search** — `search_content_semantic`, `find_content_about_project`,
`find_av_passages`, `find_content_by_entity`, `find_similar_projects_semantic`

**Documents & published research library** — `list_documents`, `search_documents`,
`get_document`, `list_research`

`reference/tool-catalog.md` in `lumenloop-mcp-connect` carries the full per-tool
signatures. (The canonical signatures are also captured in
`scripts/validate_skills.mjs` as the allow-list.)

---

## 6. What we test against

The build is not "done" until all of these pass:

1. **`node scripts/validate_skills.mjs`** — structural + safety contract (§2.5):
   frontmatter, sizes, sections, cross-link/reference resolution, and the
   **guest-only tool allow-list** (catches hallucinated or non-public tools and
   any tier/research/billing leak). Exit non-zero fails CI.
2. **`claude plugin validate .`** — Anthropic's own manifest validator for
   `plugin.json` / `marketplace.json` / skill frontmatter.
3. **Adversarial cold-review** — for each skill, a fresh reader who sees only the
   SKILL.md confirms (a) it would auto-trigger on its intended asks, (b) every
   documented tool call uses real tools and correct parameters, (c) it follows the
   house structure.
4. **Live MCP smoke test** — the documented "first call" of each skill is exercised
   against the live `https://mcp.lumenloop.com` server and must return real data, so
   the recipes are grounded, not plausible-looking fiction.

A skill ships only when 1–4 are green.

---

## 7. Build method

Skills are authored by a fan-out (one agent per skill) and then run through a
loop: **validate → cold-review → fix → re-validate** until the validator is clean
and the cold-review has no blocking notes. The catalog is intentionally small and
high-quality rather than broad; new skills are added the same way, one validated
folder at a time.
