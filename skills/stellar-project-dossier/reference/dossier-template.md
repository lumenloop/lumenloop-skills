# Project dossier template

Fill this in from the dossier pipeline in `../SKILL.md`. Every external claim
must carry a source `url`. Mark anything the public data did not answer as an
open question rather than guessing.

## Header

```
PROJECT:   <title>            (from get_project)
SLUG:      <slug>             (from search_directory / get_project)
CATEGORY:  <one of the 5>     (Applications | Developer Tooling |
                               Education & Community | Financial Protocols |
                               Infrastructure & Services)
TAGS:      <project tags>     (get_project_tags_vocabulary values)
REGION:    <based_in / operating_region>
LINKS:     website | twitter/x handle(s) | other
PULLED:    <date you ran this>
```

## 1. Overview

One paragraph: what the project does, who it serves, where it sits in the
Stellar stack. Source: `get_project(slug)` (full row).

## 2. SCF / funding history

| Round | Award type | Notes |
|-------|-----------|-------|
| <round> | <award_type> | <title / linked_project_slug> |

Source: `get_scf_submissions(slug)` (or `name=`). If empty, write
"No SCF submissions on record." — do not omit the table.

## 3. What people say (cited)

| Date | Source (url) | Type | One-line takeaway |
|------|--------------|------|-------------------|
| <publishing_date> | <url> | article/av/event/research | <summary in one line> |

Source: `find_content_about_project(slug, limit)` and, for theme scoping,
`search_content_semantic(query, types)`. These are AI SUMMARIES — cite the url,
do not present them as verbatim quotes.

### Pull-quote (optional)

> "<exact passage>"
> — <speaker / title>, <source url>

Source: `find_av_passages(query)` — this returns the actual spoken passage from
a transcript, so it is safe to quote with attribution.

## 4. Comparables / competitive set

| Project (slug) | Category | Why comparable |
|----------------|----------|----------------|
| <slug> | <category> | <one line> |

Source: `find_similar_projects_semantic(slug, limit)`; confirm peers with
`get_project(slug, compact=true)`.

## 5. Ecosystem connections (optional)

Projects co-mentioned alongside this one in a key article/talk. Source: pick a
relevant content item from section 3, then
`get_related_projects(content_id, content_type)`.

- <project> — appears alongside in <source url>

## 6. Open questions

Gaps the public LumenLoop data did not resolve. Examples:

- No content published since <date> — is the project still active?
- No SCF record — has it sought ecosystem funding elsewhere?
- Region / team size unclear from the directory row.
- Comparables overlap heavily — what is the actual differentiation?

## Citation rules

- Every factual line about external coverage cites a source `url`.
- Summaries from the content tools are LumenLoop's AI summaries, not source
  text — attribute accordingly.
- Empty tool results are findings: state them, never silently drop a section.
