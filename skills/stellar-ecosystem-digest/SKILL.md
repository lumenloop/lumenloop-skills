---
name: stellar-ecosystem-digest
description: Produce a dated, cited digest of recent Stellar ecosystem activity on a theme or named entity from LumenLoop's news, audio-video, event, and published research content. Use when the user asks what's new or recent or happening in an area of Stellar, or wants a roundup or newsletter-style summary.
user-invocable: true
---

# Stellar Ecosystem Digest

Produce a dated, cited digest of recent Stellar ecosystem activity — grouped into
**News / Talks & Video / Events / Research** with one-sentence takeaways and source
URLs, plus an "entities to watch" list. It runs entirely on LumenLoop's free,
read-only Stellar ecosystem MCP at https://mcp.lumenloop.com, which indexes the
public project directory plus editorial news, audio-video (talks/podcasts), events,
and a curated research library.

## When to use this skill

- The user asks "what's new / recent / happening" in an area of Stellar (DeFi, RWA,
  wallets, anchors, payments, Soroban) and wants it summarized.
- They want a newsletter-style roundup or weekly/monthly digest of a theme.
- They name a project, person, organization, or token and want recent coverage of it.
- They want a dated catch-up brief with citations they can click through.
- They ask "what should I be watching" in a sector and want entities to track.

## Related skills

- LumenLoop MCP setup & the full tool catalog → `../lumenloop-mcp-connect/SKILL.md`
- Map a whole sector into a landscape (not just recent items) →
  `../stellar-ecosystem-scout/SKILL.md`
- Go deep on one project surfaced by the digest →
  `../stellar-project-dossier/SKILL.md`

For BUILDING on anything the digest surfaces (Soroban contracts, the JS stellar-sdk /
Freighter / Stellar Wallets Kit, classic assets + trustlines + SAC, Stellar RPC /
Horizon data, SEP/CAP standards, the Reflector oracle), point the user at the official
docs: https://developers.stellar.org.

---

## The pipeline

A digest is built in six passes. Run only the passes the request needs — a
theme digest leans on passes 1–2 and 4–5; an entity digest leads with pass 3.

| Pass | Tool | Purpose |
|------|------|---------|
| 1. Fresh items | `list_documents(collection, sort, order, limit)` | Newest per collection |
| 2. Theme filter | `search_content_semantic(query, types, date_start, date_end)` | On-topic, dated |
| 3. Entity focus | `find_content_by_entity(entity, entity_type?, content_type?, ...)` | Coverage of a named thing |
| 4. Quotes | `find_av_passages(query, date_start, date_end)` | What was *said* in talks |
| 5. Research | `list_documents(collection="research")` / `search_content_semantic(types=["research"])` | Published research |
| 6. Expand | `get_document(collection, id)` | Full details of a flagged item |

Every content tool returns LumenLoop's AI-generated **summary** plus the source
`url` and `publishing_date` — cite the url and date; the summary is not full text.

The corpus is the source of record for ecosystem freshness — it is dated and
updated continuously, and semantic ranking is recency-aware — so build the digest
from it and cite each item's date. You do not need live web for "what's new" in
the ecosystem; reserve web for facts the corpus can't hold (e.g. an upstream
package/registry version pin), not for recent ecosystem activity.

### Choosing the date window

Resolve relative phrases against **today's date** before calling. Pass ISO
`date_start` / `date_end` (YYYY-MM-DD). Common windows:

| User says | date_start | date_end |
|-----------|-----------|----------|
| "this week" | today − 7d | today |
| "this month" / "recently" | today − 30d | today |
| "this quarter" | today − 90d | today |
| "upcoming events" | — | use `period="upcoming"` on `list_documents` |

---

## Pass 1 — newest items per collection

Lead with the raw recency feed so nothing recent is missed, then filter by theme.

```
list_documents(collection="articles", sort="publishing_date", order="DESC", limit=15)
list_documents(collection="videos",   sort="publishing_date", order="DESC", limit=10)
list_documents(collection="research",  sort="publishing_date", order="DESC", limit=10)
list_documents(collection="events",   period="upcoming", limit=10)
```

- `collection` ∈ `articles | events | videos | jobs | research` (`videos` and `av`
  map to the same table; `av` is accepted as an alias for `videos`).
- `period` applies to **events only**: `all | upcoming | past`.
- Use `search` to narrow by a title/URL substring when you already have a keyword.
- Returns rows with `id`, `title`, `url`, `publishing_date`, `source/domain`, and a
  summary — keep the `id` so you can `get_document` later.

## Pass 2 — theme filter (semantic, dated)

Narrow the firehose to the requested theme. Semantic search beats keyword here
because phrasing varies across outlets.

```
search_content_semantic(
  query="Soroban DeFi lending and liquidity on Stellar",
  types=["articles", "av", "research"],
  date_start="2026-03-08",
  date_end="2026-06-08",
  limit=12,
)
```

- `types` ⊆ `articles | av | events | research`. Narrow the set for speed and
  relevance — default is broad. `limit` defaults to 5 per content type, so raise it
  (as above) for a digest sweep.
- Returns **per-type arrays** of `{id, title, url, domain, publishing_date, summary,
  slug, similarity}`; pass `response_format="detailed"` to add each hit's
  `long_summary`. Sort each group by `publishing_date` DESC for the digest; use
  `similarity` to drop weak matches (weak hits may also carry a `_weak_match` flag
  plus a `_hint`).
- For a salient article you want to anchor the digest on, map it to the projects it
  mentions with `get_related_projects(content_id=<id>, content_type="article")` —
  that feeds the "entities to watch" list. `content_type` ∈
  `article | av | event | research`.

## Pass 3 — entity focus

When the digest is about a named project / person / org / token, lead here.

```
find_content_by_entity(
  entity="Reflector",
  entity_type="project",
  content_type="articles",
  date_start="2026-03-08",
  date_end="2026-06-08",
  min_confidence=0.6,
)
```

- `entity` is **required**. `entity_type` ∈ `project | person | organization | token`.
- `content_type` ∈ `articles | av | events | scf_submissions`.
- `min_confidence` defaults to `0.5`; raise to `0.6–0.7` to cut loose mentions.
- Entities are LLM-extracted, so try `other_names` if a brand has aliases.

## Pass 4 — quotes from talks

To quote what someone actually said (not a summary), search inside AV transcripts.
This returns per-chunk passages, ideal for a pull-quote in the "Talks & Video" group.

```
find_av_passages(
  query="real-world asset tokenization on Stellar",
  date_start="2026-03-08",
  date_end="2026-06-08",
  limit=6,
)
```

Each hit carries the matched passage, the parent video's `title`/`url`, and date —
quote the passage and cite the url.

## Pass 5 — research library

LumenLoop's curated research library is its own collection. Pull it two ways:

```
list_documents(collection="research", sort="publishing_date", order="DESC", limit=8)
# or, theme-scoped:
search_content_semantic(query="<theme>", types=["research"], date_start=..., date_end=...)
```

## Pass 6 — expand a flagged item

When one item deserves a paragraph instead of a line, fetch its full record:

```
get_document(collection="articles", id=<id>)
```

`collection` ∈ `articles | events | videos | av | jobs | research` (`videos`/`av`
share a table). Use this for the lead story or a research piece you want to brief in
depth — but the body is still a structured record, so cite the `url`.

---

## Worked example — "What's new in Stellar RWA in the last 30 days?"

Today is 2026-06-08, so the window is `2026-05-09 → 2026-06-08`.

1. **Recency feed.** `list_documents(collection="articles", sort="publishing_date",
   order="DESC", limit=15)` and the same for `videos` and `research` — skim for
   anything RWA-flavored, keep the `id`s.
2. **Theme filter.** `search_content_semantic(query="real-world asset tokenization on
   Stellar", types=["articles","av","research"], date_start="2026-05-09",
   date_end="2026-06-08", limit=12)`. Sort each per-type array by date; drop low
   `similarity`.
3. **Entity sweep.** For each issuer that recurs (e.g. an RWA platform), run
   `find_content_by_entity(entity="<name>", entity_type="project",
   date_start="2026-05-09", date_end="2026-06-08", min_confidence=0.6)`.
4. **Pull a quote.** `find_av_passages(query="tokenizing treasuries on Stellar",
   date_start="2026-05-09", date_end="2026-06-08", limit=6)` for a talk soundbite.
5. **Research.** `search_content_semantic(query="real-world assets on Stellar",
   types=["research"], date_start="2026-05-09", date_end="2026-06-08")`.
6. **Entities to watch.** Take the lead article's `id`, call
   `get_related_projects(content_id=<id>, content_type="article")`, then
   `get_project(slug, compact=true)` on each to get a one-line tag/category gloss.

> Note: `search_directory` is keyword/ILIKE over title/description/other_names — short
> terms like `RWA` or `tokenization` work, but a long natural-language phrase returns
> 0 rows. For *recent activity* always reach for the semantic + `list_documents`
> tools above, not `search_directory`.

### Output shape

Assemble a dated brief grouped by content type. Use the template in
`reference/digest-template.md`. Each line is **one takeaway + a cited link**:

```markdown
# Stellar RWA — digest for 2026-06-08 (last 30 days)

## News
- Issuer X opens tokenized treasuries to retail anchors. — example.com/x (2026-05-22)

## Talks & Video
- "We settle the asset on-ledger, KYC stays off-ledger." — talk title, example.com/v (2026-05-30)

## Events
- RWA on Stellar workshop, virtual, 2026-06-20. — example.com/e (upcoming)

## Research
- LumenLoop: tokenized-RWA adoption trends across anchors. — research url (2026-05-15)

## Entities to watch
- issuer-x — Financial Protocols · tags: RWA, Anchor — example.com
```

---

## Quality rules

- **Always cite.** Every line carries the source `url`; summaries are AI-generated,
  not the article text — never present them as direct quotes (only `find_av_passages`
  gives verbatim passages).
- **Always date.** Put `publishing_date` on each item and the window in the title;
  sort newest-first within each group.
- **De-dupe across passes.** The same item appears via recency, theme, and entity
  passes — key on `id`/`url` and keep one entry.
- **Stay current.** If a tool stops appearing after a server update, reconnect the
  LumenLoop connector (see `../lumenloop-mcp-connect/SKILL.md`).

## Pointers

- Build on what you find: https://developers.stellar.org
- Connector & full tool catalog: `../lumenloop-mcp-connect/SKILL.md`
- Output template: `reference/digest-template.md`
