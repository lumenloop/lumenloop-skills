# LumenLoop MCP — full guest tool catalog (18 tools)

Every tool here is **free, read-only, and queries public Stellar-ecosystem data**:
the project directory, Stellar Community Fund (SCF) submissions, and editorial /
news / AV / event / research content. Server: `https://mcp.lumenloop.com`.

Tools are grouped by job. `?` marks an optional parameter.

---

## Directory & taxonomy

### `search_directory(query, limit?)`
Keyword search projects by name / description / `other_names` (ILIKE).
Returns one JSON object: `{count, projects: [{slug, title, description, category, tags,
website}]}`. SHORT terms work ("wallet", "oracle", "RWA"); long natural-language
phrases return 0 — a zero-hit response includes a recovery hint (shorten the term or
pivot to the semantic tools).

### `get_project(slug, compact?)`
One project by slug.
- `compact: true` → slim writer shape: `slug, title, short description, category,
  tags, twitter_handles, website, other_names` (~500 chars).
- default → full row (large).

### `get_related_projects(content_id, content_type)`
Projects **mentioned by** a content item (content → projects, NOT project → project).
`content_type ∈ article | av | event | research` (plural / alias ok). The source
content must be published.

### `get_categories()`
Controlled category vocabulary. Live values: **Applications, Developer Tooling,
Education & Community, Financial Protocols, Infrastructure & Services**. No args.
Returns `{count, categories}`.

### `get_regions()`
Distinct region values (`based_in` + `operating_region`). No args.
Returns `{count, regions}`.

### `get_tags_vocabulary()`
Content tags (articles / AV) — **NOT** project tags. No args.

### `get_project_tags_vocabulary()`
Controlled project tags (e.g. "Wallet Infra", "Cross-Border Payments", "SDK"). No args.
Returns `{count, tags}`.

---

## Stellar Community Fund (SCF)

### `get_scf_submissions(slug?, name?)`
SCF submissions linked to a project, by `slug` or fuzzy `name` (pass at least one).
Returns `{count, submissions}`.

### `find_similar_scf_submissions(query?, slug?, category?, round?, limit?)`
SCF submissions by embedding similarity. Pass `query` (NL topic) **XOR** `slug` (an
existing submission slug like `recsAQHCghw9HIUvF`). Returns `title, description,
category, round, award_type, linked_project_slug`.

---

## Semantic content search (returns AI summaries + source url)

These return LumenLoop's AI-generated **summaries** plus a source `url` — cite the
url; they are not full article text.

### `search_content_semantic(query, types?, sources?, date_start?, date_end?, limit?, response_format?)`
Semantic search across published content. `types ⊆ articles | av | events | research`
(default broad; narrow for speed). `limit` defaults to **5 per content type**. Returns
per-type arrays: `{id, title, url, domain, publishing_date, summary, slug, similarity}`.
`response_format` ∈ `concise | detailed` — `concise` (default) omits `long_summary`;
pass `detailed` to include it. Weak matches may carry a `_weak_match` flag plus a
`_hint`; zero-hit searches return a recovery hint instead of an empty silence.

### `find_content_about_project(slug, limit?)`
Content that **discusses** a project (cross-domain).

### `find_av_passages(query, limit?, date_start?, date_end?)`
Passages inside AV transcripts via per-chunk similarity. Use to quote what was **said**.

### `find_content_by_entity(entity, entity_type?, content_type?, date_start?, date_end?, min_confidence?, limit?)`
Content mentioning a named entity (LLM-extracted). `entity` required;
`entity_type ∈ project | person | organization | token`;
`content_type ∈ articles | av | events | scf_submissions`; `min_confidence` default 0.5.

### `find_similar_projects_semantic(slug, limit?)`
Projects semantically similar to a given project (better than tag / category matching).

---

## Documents & published research library

### `list_documents(collection, page?, limit?, sort?, order?, search?, source?, period?)`
Browse a collection. `collection ∈ articles | events | videos | jobs | research`
(`av` is accepted as an alias for `videos`).
`period` (events only) `∈ all | upcoming | past`. Use `search` for title / url search.

### `search_documents`
Alias — use `list_documents` with `search` for title / url search.

### `get_document(collection, id)`
Full details of one document. `collection ∈ articles | events | videos | av | jobs |
research` (videos and av map to the same table).

### `list_research(...)`
List LumenLoop's published research library. Equivalent to
`list_documents(collection="research")` or `search_content_semantic(types=["research"])`.

---

## Quick reference table

| Tool | Job | Required args |
| --- | --- | --- |
| `search_directory` | keyword project lookup | `query` |
| `get_project` | one project's details | `slug` |
| `get_related_projects` | projects a content item mentions | `content_id`, `content_type` |
| `get_categories` | category vocabulary | — |
| `get_regions` | region values | — |
| `get_tags_vocabulary` | content tags | — |
| `get_project_tags_vocabulary` | project tags | — |
| `get_scf_submissions` | SCF history for a project | `slug` or `name` |
| `find_similar_scf_submissions` | similar SCF proposals | `query` xor `slug` |
| `search_content_semantic` | semantic content search | `query` |
| `find_content_about_project` | content discussing a project | `slug` |
| `find_av_passages` | quotable transcript passages | `query` |
| `find_content_by_entity` | content mentioning an entity | `entity` |
| `find_similar_projects_semantic` | similar projects | `slug` |
| `list_documents` | browse a collection | `collection` |
| `search_documents` | title/url search (alias) | `collection`, `search` |
| `get_document` | one document's full details | `collection`, `id` |
| `list_research` | published research library | — |
