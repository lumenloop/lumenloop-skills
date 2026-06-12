---
name: stellar-ecosystem-scout
description: Map a sector or topic of the Stellar ecosystem into a landscape of projects, categories, regions, and related content using the LumenLoop directory and semantic search. Use when the user asks to survey, map, or get an overview of an area of Stellar (e.g. 'what RWA projects exist', 'map Stellar DeFi', 'who is building wallets').
user-invocable: true
---

# Stellar Ecosystem Scout

Turn a sector or topic ("RWA tokenization", "wallets", "DeFi", "cross-border
payments") into a structured landscape: the projects that fill it, how they group
by category and region, the controlled tags that describe them, and the editorial /
news / talk / research content that explains the space — every content claim tied to
a source url. This skill runs on LumenLoop's free, read-only Stellar ecosystem MCP at
https://mcp.lumenloop.com (the public project directory, SCF data, and content
library). It maps a space; it does not deep-dive one team or pick one dependency.

## When to use this skill

- The user asks "what projects exist for X on Stellar" or "map / survey the X space".
- You need a landscape of a sector grouped by category and region before going deeper.
- You want to grow a cluster from one known project to its semantic neighbors.
- You need the narrative around a sector — articles, talks, research — with cited urls.
- You want to spot gaps / white space in a category before building or investing.
- The user names a fuzzy theme ("regenerative finance", "gaming") and wants the
  serious players plus the supporting content surfaced.

## Related skills

- Set up / troubleshoot the connector and see all 18 tools → `../lumenloop-mcp-connect/SKILL.md`.
- Deep-dive ONE project you surfaced here (funding, talks, comparables) → `../stellar-project-dossier/SKILL.md`.
- Pick ONE dependency to integrate from a landscape (wallet/oracle/anchor/…) → `../stellar-integration-finder/SKILL.md`.
- Turn the landscape into a build plan (primitives, prior art, stack) → `../stellar-builder-quickstart/SKILL.md`.
- For actually BUILDING on Stellar (Soroban contracts, JS stellar-sdk / Freighter /
  Stellar Wallets Kit, classic assets + trustlines + SAC, Stellar RPC / Horizon data,
  SEP/CAP standards, Reflector oracle), see the Stellar developer docs at
  https://developers.stellar.org.

---

## The scouting recipe

Work in five passes. Each pass is one or two tool calls; stop when the cluster
stops growing and the narrative is covered.

| Pass | Goal | Tool(s) |
|------|------|---------|
| 1. Frame | Learn the buckets | `get_categories`, `get_regions`, `get_project_tags_vocabulary` |
| 2. Seed | Find anchor projects | several SHORT `search_directory` queries |
| 3. Grow | Expand the cluster | `find_similar_projects_semantic(slug, limit)` |
| 4. Narrate | Add context + sources | `search_content_semantic(query, types)`, then `get_related_projects` |
| 5. Detail | Slim project facts | `get_project(slug, compact=true)` |

### Pass 1 — Frame the taxonomy

Pull the controlled vocabularies first so you bucket everything consistently and can
name gaps in the project's own language.

```
get_categories()
get_regions()
get_project_tags_vocabulary()
```

`get_categories()` returns the five live buckets — **Applications**,
**Developer Tooling**, **Education & Community**, **Financial Protocols**,
**Infrastructure & Services**. `get_regions()` returns distinct `based_in` /
`operating_region` values for the geo view. `get_project_tags_vocabulary()` returns
the controlled PROJECT tags (e.g. "Wallet Infra", "Cross-Border Payments", "SDK",
"RWA") — these are the precise labels to slice the landscape by, and the best source
of SHORT seed terms for Pass 2. (Note: `get_tags_vocabulary()` returns CONTENT tags
for articles/AV, not project tags — don't confuse the two.)

### Pass 2 — Seed by keyword (mind the ILIKE gotcha)

`search_directory(query, limit?)` is a keyword / ILIKE match over project
title, description, and other_names. **SHORT terms win.** A long natural-language
phrase matches nothing.

```
search_directory(query="real world assets tokenization")   # → 0 results (too long)
search_directory(query="RWA")                               # → real hits
search_directory(query="tokenization")                      # → real hits
search_directory(query="asset")                             # → real hits
```

Fire several short, orthogonal queries to cover synonyms (for RWA: `RWA`,
`tokenization`, `asset`, `stablecoin`, `real estate`). Results come back as one JSON
object `{count, projects}`; each project row is
`{slug, title, description, category, tags, website}`. Collect the slugs — these are
your seeds. If a query returns 0, the response includes a recovery hint — shorten the
term or pivot to the semantic tools below.

### Pass 3 — Grow the cluster semantically

Pick the most central seed slug and expand to its semantic neighbors. This beats
tag/category matching for finding adjacent players you didn't have a keyword for.

```
find_similar_projects_semantic(slug="<seed-slug>", limit=10)
```

It returns projects similar to the seed by embedding distance. Run it on two or
three different seeds and union the results to triangulate the cluster boundary; the
overlap is the dense core of the sector, the long tail is the frontier.

> Do NOT use `get_related_projects` for project→project — that one maps a CONTENT
> item to the projects it mentions (Pass 4). For project→project, always use
> `find_similar_projects_semantic`.

### Pass 4 — Add narrative + cite sources

Layer the story on top of the project list with semantic content search. This is also
the rescue path when `search_directory` returned 0 for a long phrase.

```
search_content_semantic(query="real world asset tokenization on Stellar",
                        types=["articles"], limit=8)
```

`types` ⊆ `articles | av | events | research` (omit for a broad sweep; narrow for
speed). `limit` defaults to 5 per content type. It returns per-type arrays of
`{id, title, url, domain, publishing_date, summary, slug, similarity}` — pass
`response_format="detailed"` if you also want each hit's `long_summary`. **These are
LumenLoop's AI-generated summaries plus the source `url` — cite the url, never quote
them as full article text.** A query like the one above surfaces real explainers such
as "tokenization-basics".

For any salient article, map it back to the projects it discusses:

```
get_related_projects(content_id=<id-from-content-result>, content_type="article")
```

`content_type` ∈ `article | av | event | research` (plural/alias ok); the source must
be published. This often surfaces projects you missed in Pass 2/3 because the article
named them but the directory keyword didn't match. To pull direct quotes from talks
or podcasts about the sector, use `find_av_passages(query="<sector>")`.

### Pass 5 — Detail each project (slim shape)

For every project that makes the landscape, pull the writer-friendly slim row:

```
get_project(slug="<slug>", compact=true)
```

`compact=true` returns ~500 chars — slug, title, short description, category, tags,
twitter_handles, website, other_names — exactly what a landscape table needs. Omit
`compact` (default full row) only when you genuinely need the long record; for a
sector map the compact shape keeps it tight.

---

## Worked example — mapping RWA / tokenization

```
# Pass 1 — frame
get_categories()                  # → Applications, Developer Tooling, Education &
                                  #   Community, Financial Protocols, Infrastructure & Services
get_project_tags_vocabulary()     # → includes "RWA", "Stablecoins", "Cross-Border Payments"…

# Pass 2 — seed (short terms only)
search_directory("real world assets tokenization")  # → 0 results — phrase too long
search_directory("RWA")                              # → seed slugs
search_directory("tokenization")                     # → more seeds
search_directory("stablecoin")                       # → adjacent seeds

# Pass 3 — grow from the strongest seed
find_similar_projects_semantic(slug="<rwa-seed-slug>", limit=10)

# Pass 4 — narrative + sources (also rescues the long phrase from Pass 2)
search_content_semantic(query="real world asset tokenization on Stellar",
                        types=["articles"], limit=8)   # → e.g. "tokenization-basics"
get_related_projects(content_id=<that-article-id>, content_type="article")

# Pass 5 — detail each keeper
get_project(slug="<slug>", compact=true)
```

From there, assemble the landscape: group the projects by the five categories, note
their tags and regions, list the cited content under "context", and call out which
categories are crowded vs empty (the gaps).

## Output: the landscape

Produce a landscape grouped by category, with a project table (slug + tags + region +
website), a cited-content section (one-line takeaway + source url per item), and an
explicit gaps / white-space note. Use the full template at
`reference/landscape-template.md`.

A skeleton:

- **Sector:** <topic> — one-sentence scope.
- **Per category** (Applications / Developer Tooling / Education & Community /
  Financial Protocols / Infrastructure & Services): a table of projects
  `| project | slug | tags | region | website |`.
- **Context & sources:** bullet list, each `takeaway — <url>` from Pass 4.
- **Gaps / white space:** categories or capabilities with thin or no coverage.
- **Go deeper:** route to `../stellar-project-dossier/SKILL.md` for any single
  project, `../stellar-integration-finder/SKILL.md` to pick a dependency, or
  `../stellar-builder-quickstart/SKILL.md` to turn the gap into a build plan.

## Gotchas

- `search_directory` is keyword/ILIKE — SHORT terms ("wallet", "RWA", "oracle") hit;
  long NL phrases return 0. For concept discovery use `search_content_semantic` /
  `find_similar_projects_semantic`.
- The content tools return AI SUMMARIES + a source `url`, not full article text —
  cite the url.
- `get_related_projects` is content→projects (needs `content_id` + `content_type`);
  it is NOT project→project. Use `find_similar_projects_semantic` for that.
- `get_project` default is a large full row; pass `compact=true` for the slim shape.
- `get_tags_vocabulary` = content tags; `get_project_tags_vocabulary` = project tags.
- If a tool stops appearing after a server update, reconnect the connector
  (see `../lumenloop-mcp-connect/SKILL.md`).

## Further reading

- LumenLoop MCP overview and full tool catalog → `../lumenloop-mcp-connect/SKILL.md`.
- Stellar developer docs (build references) → https://developers.stellar.org.
