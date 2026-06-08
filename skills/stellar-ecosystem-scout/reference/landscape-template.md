# Landscape report template

Fill this in after running the five scouting passes (see `../SKILL.md`). Keep every
content claim tied to a source `url`. Delete bracketed prompts as you go.

---

# <Sector / Topic> on Stellar — Landscape

**Scope:** <one sentence: what's in and what's out>
**Date:** <YYYY-MM-DD>
**Seed terms used:** <short search_directory terms, e.g. RWA, tokenization, stablecoin>

## Taxonomy frame

- **Categories in play:** <subset of: Applications, Developer Tooling, Education &
  Community, Financial Protocols, Infrastructure & Services>
- **Key project tags:** <from get_project_tags_vocabulary, e.g. "RWA", "Wallet Infra">
- **Regions represented:** <from get_regions>

## Projects by category

### Applications
| Project | Slug | Tags | Region | Website |
|---------|------|------|--------|---------|
| <name> | `<slug>` | <tags> | <region> | <url> |

### Developer Tooling
| Project | Slug | Tags | Region | Website |
|---------|------|------|--------|---------|
| | | | | |

### Education & Community
| Project | Slug | Tags | Region | Website |
|---------|------|------|--------|---------|
| | | | | |

### Financial Protocols
| Project | Slug | Tags | Region | Website |
|---------|------|------|--------|---------|
| | | | | |

### Infrastructure & Services
| Project | Slug | Tags | Region | Website |
|---------|------|------|--------|---------|
| | | | | |

> Drop any category with no projects, or list it under "Gaps" below.

## Semantic neighbors (cluster frontier)

Projects surfaced by `find_similar_projects_semantic` that keyword search missed:

- `<slug>` — <why it's adjacent>

## Context & sources

From `search_content_semantic` / `find_av_passages` / `get_related_projects`. One line
each, every line ending in a source url (these are AI summaries, not full text):

- <takeaway> — <url>
- <takeaway> — <url>

## Gaps / white space

- <category or capability with thin or zero coverage> — <why it matters>

## Go deeper

- Deep-dive a single project → `../../stellar-project-dossier/SKILL.md`
- Pick a dependency to integrate → `../../stellar-integration-finder/SKILL.md`
- Turn a gap into a build plan → `../../stellar-builder-quickstart/SKILL.md`
