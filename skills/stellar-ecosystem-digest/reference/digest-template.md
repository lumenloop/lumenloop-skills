# Digest output template

Fill this in from the six-pass pipeline in `../SKILL.md`. Keep every line to one
takeaway plus a cited link. Sort newest-first inside each group. Omit a group if it
has no items. Replace bracketed placeholders.

---

# [Theme or Entity] — Stellar ecosystem digest for [YYYY-MM-DD]
_Window: [date_start] → [date_end]_

## TL;DR
- [2–4 bullets: the single most important developments, each with a link.]

## News
- [One-sentence takeaway.] — [source-url] ([publishing_date])
- [One-sentence takeaway.] — [source-url] ([publishing_date])

## Talks & Video
- "[Verbatim passage from find_av_passages.]" — [talk title], [url] ([date])
- [Takeaway about a talk/podcast.] — [url] ([date])

## Events
- [Event name], [location], [date]. — [url] ([upcoming|past])

## Research
- [LumenLoop research takeaway.] — [research url] ([publishing_date])

## Entities to watch
| Project | Category | Tags | Link |
|---------|----------|------|------|
| [slug]  | [category] | [tag, tag] | [website] |

_Source: LumenLoop ecosystem MCP (https://mcp.lumenloop.com). Summaries are
AI-generated; click through to the cited source for the full text._

---

## Filling notes

- **News** comes from `list_documents(collection="articles")` filtered by
  `search_content_semantic(types=["articles"])` and entity passes.
- **Talks & Video** combine `list_documents(collection="videos")`,
  `search_content_semantic(types=["av"])`, and verbatim `find_av_passages` hits.
- **Events** come from `list_documents(collection="events", period="upcoming"|"past")`.
- **Research** comes from `list_documents(collection="research")` or
  `search_content_semantic(types=["research"])`.
- **Entities to watch** come from `get_related_projects(content_id, content_type)` on
  the lead items, glossed with `get_project(slug, compact=true)`.
- De-dupe across passes by `id`/`url`; cite every line; never present a summary as a
  direct quote.
