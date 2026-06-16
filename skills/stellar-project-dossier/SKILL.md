---
name: stellar-project-dossier
description: Build a due-diligence profile of a single Stellar project from the LumenLoop directory — details, related content, talks, SCF history, and similar projects. Use when the user names a project and asks to vet, profile, research, or summarize it, or wants a dossier or background on a Stellar team.
user-invocable: true
---

# Stellar Project Dossier

Assemble a structured due-diligence dossier on ONE Stellar project: what it is,
its category/tags/links, its Stellar Community Fund (SCF) funding history, what
the ecosystem has written and said about it, and the projects most like it. This
skill runs entirely on LumenLoop's free, read-only Stellar ecosystem MCP
(https://mcp.lumenloop.com) — every fact below comes from a public directory,
the public SCF record, and LumenLoop's editorial/AV/research library.

## When to use this skill

- The user names a Stellar project and asks to "vet", "profile", "research",
  "do diligence on", or "summarize" it.
- You need a project's funding track record (which SCF rounds, what award type).
- You want to know what articles, talks, podcasts, or events discuss a team —
  with citable source urls.
- You need a list of comparable / competing projects to position one team.
- You are prepping a one-pager or background brief on a Stellar builder.

## Related skills

- New to the MCP? Connect and learn the toolset first →
  `../lumenloop-mcp-connect/SKILL.md`
- Mapping a whole sector instead of one project →
  `../stellar-ecosystem-scout/SKILL.md`
- Positioning an SCF idea against prior submissions →
  `../scf-submission-radar/SKILL.md`
- Choosing which project to depend on (wallet / oracle / anchor / DEX) →
  `../stellar-integration-finder/SKILL.md`
- Building on Stellar (Soroban contracts, JS stellar-sdk + Freighter + Stellar
  Wallets Kit, classic assets + trustlines + SAC, Stellar RPC / Horizon data,
  SEP/CAP standards, the Reflector oracle): see the Stellar developer docs at
  https://developers.stellar.org.

---

## The dossier pipeline (run in order)

| # | Step | Tool | Yields |
|---|------|------|--------|
| 1 | Resolve the slug | `search_directory(query)` | candidate `slug`s |
| 2 | Pull the profile | `get_project(slug)` | full row (links, region, tags) |
| 3 | Funding history | `get_scf_submissions(slug)` | rounds + award_type |
| 4 | What's written/said | `find_content_about_project(slug, limit)` | articles/AV/events + urls |
| 5 | Direct quotes | `find_av_passages(query)` | transcript passages to quote |
| 6 | Comparables | `find_similar_projects_semantic(slug, limit)` | competitors / neighbors |
| 7 | (Optional) connections | `get_related_projects(content_id, content_type)` | projects a key item co-mentions |

Each step is independent of the others except for the slug — once you have it
from step 1, steps 2–6 can be issued together.

### 1. Resolve the slug

The user gives a name; the tools key off a `slug`. Resolve it first.

```
search_directory(query="lobstr")
```

`search_directory` is keyword/ILIKE over title, description, and other_names.
Keep the term SHORT — one or two words. A long natural-language phrase
("the lobstr non-custodial wallet app") matches nothing (a zero-hit response
includes a recovery hint). It returns one JSON object shaped like:

```
{ count: 1, projects: [
  { slug: "lobstr", title: "LOBSTR", category: "Applications",
    tags: ["Wallet Infra", "Custody"], website: "https://lobstr.co",
    description: "Non-custodial Stellar wallet ..." } ] }
```

Pick the row whose `title`/`website` matches the user's intent and lock its
`slug`. If the user already supplied a slug, skip to step 2. If the name is
ambiguous or returns nothing, try a shorter or alternate term, then confirm the
match with the user before spending the rest of the pipeline on it.

### 2. Pull the profile

```
get_project(slug="lobstr")
```

The default response is the FULL row — long-form description, `based_in` /
`operating_region`, `twitter_handles`, website, all tags, other_names, and
more. That is what a dossier wants. If you only need a quick header (title,
short description, category, tags, links), pass `compact: true` for a slim
~500-char shape and save tokens:

```
get_project(slug="lobstr", compact=true)
```

Record: category (one of the five from `get_categories` — Applications,
Developer Tooling, Education & Community, Financial Protocols, Infrastructure &
Services), project tags (vocabulary from `get_project_tags_vocabulary`, e.g.
"Wallet Infra", "Cross-Border Payments", "SDK"), region, and every link.

### 3. Funding history (SCF)

```
get_scf_submissions(slug="lobstr")
```

Returns the project's Stellar Community Fund submissions. For each, note the
`round` and `award_type` — this is the funding track record. If the slug
returns nothing but you suspect SCF history under a slightly different name,
fall back to the fuzzy name lookup:

```
get_scf_submissions(name="LOBSTR")
```

An empty result is itself a finding: "no SCF submissions on record." State it
plainly rather than omitting the section.

### 4. What's written and said about it

```
find_content_about_project(slug="lobstr", limit=10)
```

Returns content across domains (articles, AV/video, events, research) that
DISCUSSES this project. Each item carries `title`, `url`, `domain`,
`publishing_date`, and an AI-generated `summary` / `long_summary`. These are
LumenLoop's SUMMARIES, not full article text — cite the `url` for every claim
and never quote the summary as if it were the source's exact words.

Ranking here is recency-aware, so recent coverage (a security incident or
exploit, an audit, a launch) surfaces alongside the canonical/older items — for
a due-diligence dossier, scan explicitly for any incident or audit and date it
(`publishing_date`, flagged as possibly outdated if old). The corpus is the
source of record for these ecosystem facts and is dated, so cite the date;
reach for live web only for facts it can't hold (e.g. a current on-chain TVL or
an upstream package version), not for "has this project had an incident".

If you want a theme-scoped sweep instead (e.g. only what's been said about the
project's cross-border payments work), use semantic content search and narrow
the types:

```
search_content_semantic(query="LOBSTR cross-border payments",
                         types=["articles","av"], limit=8)
```

### 5. Direct quotes from talks and podcasts

```
find_av_passages(query="LOBSTR wallet")
```

This matches per-chunk inside AV transcripts, so it surfaces the actual
passage where something was SAID — ideal for a pull-quote in the dossier.
Optionally bound it with `date_start` / `date_end` to stay recent. Attribute
each quote to its source item and url.

### 6. Comparables / competitors

```
find_similar_projects_semantic(slug="lobstr", limit=8)
```

This is semantic project→project similarity (embeddings), which beats
tag/category matching for finding real competitors and neighbors. Use the
result as the "comparables" section. Spot-check one or two with
`get_project(slug, compact=true)` to confirm they are genuine peers.

> Do NOT use `get_related_projects` for this — it maps a piece of CONTENT to
> the projects it mentions, not project→project. For project similarity always
> use `find_similar_projects_semantic`.

### 7. (Optional) Ecosystem connections via a key content item

When a step-4 item is especially relevant (a roundup, a partnership
announcement), expand who ELSE it names to map the project's neighborhood. Take
that item's `id` and its content type and call:

```
get_related_projects(content_id=4217, content_type="article")
```

`content_type` is one of `article | av | event | research` (plural/alias
accepted); the source must be published. This returns the other projects that
item mentions — useful for "appears alongside" context. Then
`get_project(slug, compact=true)` any newly surfaced slug worth a line.

---

## Worked example: the "lobstr" dossier

1. `search_directory(query="lobstr")` → one strong hit, slug `lobstr`,
   category Applications, tags include "Wallet Infra".
2. `get_project(slug="lobstr")` → full profile: non-custodial Stellar wallet,
   website, twitter handle, region, long description.
3. `get_scf_submissions(slug="lobstr")` → any SCF rounds + award_type (or
   "none on record").
4. `find_content_about_project(slug="lobstr", limit=10)` → articles and talks
   mentioning LOBSTR, each with a url to cite.
5. `find_av_passages(query="LOBSTR wallet")` → a quotable passage from a talk.
6. `find_similar_projects_semantic(slug="lobstr", limit=8)` → comparable
   wallets/apps to list as the competitive set.
7. (Optional) pick the most relevant article from step 4 →
   `get_related_projects(content_id=<id>, content_type="article")` → who else
   it names.

Assemble the results into the dossier structure below.

## Output: the dossier

Produce a single structured brief with these sections:

- **Overview** — one-paragraph what-it-is (from step 2).
- **Profile** — category, project tags, region, all links (website, twitter).
- **SCF / funding** — each submission's round + award_type, or "none on record".
- **What people say** — 3–6 bullets, each a one-sentence takeaway + the source
  `url`; include one attributed pull-quote from step 5 if available.
- **Comparables** — 3–8 similar projects (slug + one-line why), from step 6.
- **Open questions** — gaps the public data did not answer (e.g. no recent
  content, no funding record, unclear traction) to flag for follow-up.

Full section-by-section template, with a filled example and citation rules →
`reference/dossier-template.md`.

## Gotchas

- `search_directory` is ILIKE keyword search — SHORT terms only; long phrases
  return 0. For topic/concept discovery use the semantic tools.
- The content tools return AI SUMMARIES + a source `url`, not full article
  text. Cite the url; never present a summary as a verbatim quote.
- `get_related_projects` is content→projects (needs `content_id` +
  `content_type`), NOT project→project. Use `find_similar_projects_semantic`
  for comparables.
- `get_project` defaults to a large full row; pass `compact: true` when you
  only need the header.
- Empty results are findings — state "none on record" rather than dropping a
  section.
- If a tool stops appearing after a server update, reconnect the connector (see
  `../lumenloop-mcp-connect/SKILL.md`).

## Further reading

- LumenLoop MCP overview and full tool catalog →
  `../lumenloop-mcp-connect/SKILL.md`
- Building on Stellar (Soroban, stellar-sdk, assets, data, standards,
  Reflector) → https://developers.stellar.org
