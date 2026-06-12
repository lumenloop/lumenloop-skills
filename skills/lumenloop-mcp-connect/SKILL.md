---
name: lumenloop-mcp-connect
description: Connect your AI assistant (Claude, ChatGPT, Gemini, Cursor, or any MCP client) to LumenLoop's free read-only Stellar ecosystem MCP at https://mcp.lumenloop.com and learn its 18 query tools. Use when the user wants to set up or troubleshoot the lumenloop connector, asks what Stellar ecosystem data is available, or needs to know which lumenloop skill fits a task.
user-invocable: true
---

# Connect to the LumenLoop Stellar Ecosystem MCP

This is the onboarding anchor for the LumenLoop skill family. It gets your AI
assistant connected to **LumenLoop's free, read-only Stellar ecosystem MCP**
(`https://mcp.lumenloop.com`), explains what data is behind it, lists the 18 query
tools, and routes you to the right sibling skill for the job. The server speaks the
open Model Context Protocol, so **any MCP-capable client can connect** — Claude Code,
Claude.ai, ChatGPT, Gemini, Cursor, or a custom agent. It is a public, read-only
window on the Stellar ecosystem: the **project directory**, **Stellar Community Fund
(SCF) submissions**, and **editorial / news / AV / event / research content**. Nothing
here writes data or costs anything — every tool just reads public information.

## When to use this skill

- The user wants to **set up** the `lumenloop` connector in Claude Code, Claude.ai, or
  another MCP client.
- The connector is **not showing up**, tools fail, or sign-in is stuck.
- The user asks **what Stellar ecosystem data is available** through LumenLoop.
- You need a **map of the 18 tools** and their exact signatures.
- You are unsure **which LumenLoop skill** fits a task (scout vs dossier vs digest …).
- A teammate is starting fresh and needs the **one-page orientation**.

## Related skills

- Map a sector into a landscape → `../stellar-ecosystem-scout/SKILL.md`
- Deep-dive one project → `../stellar-project-dossier/SKILL.md`
- Position an SCF idea → `../scf-submission-radar/SKILL.md`
- Pick an ecosystem dependency → `../stellar-integration-finder/SKILL.md`
- Dated, cited activity digest → `../stellar-ecosystem-digest/SKILL.md`
- Turn an idea into a build path → `../stellar-builder-quickstart/SKILL.md`
- Audit a draft against the ecosystem → `../stellar-content-auditor/SKILL.md`

For **building on Stellar** (Soroban contracts, the JS stellar-sdk / Freighter /
Stellar Wallets Kit for dApps, classic assets + trustlines + SAC for tokens,
Stellar RPC / Horizon for chain data, SEP/CAP standards, the Reflector oracle), see the
official docs at https://developers.stellar.org.

---

## Connect

### Claude Code

This repo ships an `.mcp.json` that already declares the server, so if you are working
inside it the connector is **preconfigured** — just approve it when prompted. To add it
to any other project, run:

```
claude mcp add --transport http lumenloop https://mcp.lumenloop.com
```

Then complete the one-time sign-in:

```
/mcp            # opens the MCP panel
# → select "lumenloop" → follow the prompt to sign in in your browser
```

After sign-in, the 18 tools appear as `lumenloop` tools. Verify with `/mcp` (status
should read connected) or by calling a no-arg tool such as `get_categories`.

### Claude.ai, ChatGPT, Gemini & other MCP clients

1. Open your client's connector settings (e.g. Claude.ai: **Settings → Connectors →
   Add**; other clients have an equivalent "add MCP server / connector" screen).
2. Add a custom / remote MCP connector with URL `https://mcp.lumenloop.com`
   (transport: streamable HTTP).
3. Complete the one-time sign-in when prompted.
4. The `lumenloop` tools are now available in chat.

If your client cannot auto-load skill files, you can still use each
`skills/<name>/SKILL.md` as a pasted playbook/prompt — the recipes are plain
model-agnostic MCP tool-call sequences.

### Smoke test

Call one tool with no arguments to confirm the connection is live:

```
get_categories()
→ {count: 5, categories: ["Applications", "Developer Tooling",
   "Education & Community", "Financial Protocols", "Infrastructure & Services"]}
```

If that returns the five categories, you are connected.

---

## The 18 tools at a glance

One line each below. **Full per-tool signatures and parameters →
`reference/tool-catalog.md`.**

### Directory & taxonomy

| Tool | What it does |
| --- | --- |
| `search_directory` | Keyword search projects by name/description/other_names (ILIKE). |
| `get_project` | One project; `compact: true` for a slim writer shape. |
| `get_related_projects` | Projects **mentioned by** a content item (content → projects). |
| `get_categories` | Controlled category vocabulary (5 live values). |
| `get_regions` | Distinct region values (based_in + operating_region). |
| `get_tags_vocabulary` | Content tags (articles/AV) — not project tags. |
| `get_project_tags_vocabulary` | Controlled project tags ("Wallet Infra", "SDK" …). |

### Stellar Community Fund (SCF)

| Tool | What it does |
| --- | --- |
| `get_scf_submissions` | SCF submissions for a project, by slug or fuzzy name. |
| `find_similar_scf_submissions` | SCF submissions by embedding similarity (`query` xor `slug`). |

### Semantic content (returns AI summaries + source url)

| Tool | What it does |
| --- | --- |
| `search_content_semantic` | Semantic search across published content, by `types`. |
| `find_content_about_project` | Content that **discusses** a given project. |
| `find_av_passages` | Quotable passages inside AV transcripts. |
| `find_content_by_entity` | Content mentioning a named entity (person/org/token/project). |
| `find_similar_projects_semantic` | Projects semantically similar to a given project. |

### Documents & research library

| Tool | What it does |
| --- | --- |
| `list_documents` | Browse a collection (articles/events/videos/jobs/research). |
| `search_documents` | Title/url search (alias of `list_documents` + `search`). |
| `get_document` | Full details of one document. |
| `list_research` | LumenLoop's published research library. |

---

## Worked example — orient in 3 calls

Goal: confirm the connection and get the lay of the land before deeper work.

```
1. get_categories()
   → 5 buckets: Applications, Developer Tooling, Education & Community,
     Financial Protocols, Infrastructure & Services

2. search_directory(query="wallet", limit=5)
   → {count: 5, projects: [{slug:"abroad", title:"Abroad", category:"Applications",
      tags:[...]}, {slug:"adamik", ...}, {slug:"airgap", ...}, ...]}   # short term → hits

3. find_similar_projects_semantic(slug="abroad", limit=5)
   → semantically adjacent wallet/payments projects to grow the cluster
```

From here, hand off: use `stellar-ecosystem-scout` to map the whole sector,
`stellar-project-dossier` to vet one of those slugs, or
`stellar-integration-finder` to choose one as a dependency.

---

## Which skill for which job

| You want to… | Use skill | Anchor tools |
| --- | --- | --- |
| Survey/map a sector or topic | `../stellar-ecosystem-scout/SKILL.md` | `search_directory`, `find_similar_projects_semantic`, `search_content_semantic` |
| Vet / profile ONE project | `../stellar-project-dossier/SKILL.md` | `get_project`, `get_scf_submissions`, `find_content_about_project` |
| Position an SCF idea vs prior art | `../scf-submission-radar/SKILL.md` | `find_similar_scf_submissions`, `get_scf_submissions` |
| Pick a wallet/oracle/anchor/etc. dependency | `../stellar-integration-finder/SKILL.md` | `search_directory`, `get_project`, `find_similar_projects_semantic` |
| Dated, cited recap of recent activity | `../stellar-ecosystem-digest/SKILL.md` | `list_documents`, `search_content_semantic`, `find_content_by_entity` |
| Turn an idea into a build path | `../stellar-builder-quickstart/SKILL.md` | `search_directory`, `find_similar_projects_semantic` + https://developers.stellar.org |
| Fact-check / enrich a draft (handles, citations) | `../stellar-content-auditor/SKILL.md` | `search_directory`, `get_project`, `find_content_by_entity` |

---

## Cross-cutting gotchas

- **`search_directory` is keyword/ILIKE**, not semantic. SHORT terms ("wallet",
  "oracle", "RWA") work; long natural-language phrases ("real world asset tokenization
  platform") return 0. For concept/topic discovery use the semantic tools
  (`search_content_semantic`, `find_similar_projects_semantic`) instead.
- **Content tools return summaries, not full text.** `search_content_semantic`,
  `find_content_about_project`, `find_av_passages`, and `find_content_by_entity` return
  LumenLoop's AI-generated summaries plus the source `url`. **Cite the url**; do not
  present a summary as the verbatim article.
- **`search_content_semantic` defaults to 5 hits per content type** and to a
  `concise` response (no `long_summary`). Raise `limit` or pass
  `response_format="detailed"` when you need more depth; weak matches may carry a
  `_weak_match` flag plus a `_hint`.
- **`get_related_projects` is content → projects.** It takes `content_id` +
  `content_type` and maps a piece of content to the projects it mentions — it is NOT
  project → project. For project → project similarity use `find_similar_projects_semantic`.
- **`get_project` is heavy by default.** It returns a large full row; pass
  `compact: true` when you only need title / category / tags / links (~500 chars).
- **`find_similar_scf_submissions` wants `query` XOR `slug`.** Pass a natural-language
  `query` for topic search, or an existing submission slug (e.g. `recsAQHCghw9HIUvF`)
  to find neighbors of that submission — not both.
- **Vocabularies are controlled.** Read the buckets first with `get_categories`,
  `get_regions`, `get_tags_vocabulary`, `get_project_tags_vocabulary` (these take no
  args) so filters and tags match what the data actually uses.
- **Tool missing after a server update?** Reconnect the connector: in Claude Code
  `/mcp` → `lumenloop` → re-authorize; in other clients, re-add / re-auth the connector.

---

## Pointers

- LumenLoop MCP server: https://mcp.lumenloop.com
- Full per-tool signatures: `reference/tool-catalog.md`
- Building on Stellar: https://developers.stellar.org
