---
name: scf-submission-radar
description: Position a Stellar Community Fund (SCF) idea against prior submissions before applying, using LumenLoop's SCF data. Use when the user is preparing an SCF application, wants to find similar past proposals, check what's been funded in an area, or sharpen their SCF positioning.
user-invocable: true
---

# SCF Submission Radar

Position a Stellar Community Fund (SCF) idea against the public record of prior
submissions, so you can sharpen the pitch, find the right category, and avoid
re-proposing something already funded. This is research and **positioning only**
— it does not submit anything to SCF. It runs entirely on LumenLoop's free,
read-only Stellar ecosystem MCP (https://mcp.lumenloop.com), which mirrors the
public SCF submissions index alongside the project directory and editorial
content.

## When to use this skill

- The user is drafting an SCF application and wants to know what's been proposed
  or funded in their space already.
- They ask "has anyone built / pitched X to SCF?" or "what's the competition for
  my idea?"
- They want to pick the right SCF category and award track for a proposal.
- They have a one-liner for a product and want a positioning brief before they
  write the long application.
- They found one prior submission and want to see its neighbors / the team's full
  SCF history.

## Related skills

- LumenLoop MCP setup and tool overview → `../lumenloop-mcp-connect/SKILL.md`
- Deep due-diligence on a single team behind a submission →
  `../stellar-project-dossier/SKILL.md`
- Map the wider sector your idea sits in → `../stellar-ecosystem-scout/SKILL.md`
- Once positioning is clear, plan the build → ask for the
  `stellar-builder-quickstart` skill, and for Soroban / dapp / asset / data
  references see the Stellar docs at https://developers.stellar.org.

---

## The tools you use

| Step | Tool | Why |
| --- | --- | --- |
| Find prior art by idea | `find_similar_scf_submissions` (with `query`) | Embedding search over past submissions |
| Find neighbors of one submission | `find_similar_scf_submissions` (with `slug`) | "More like this" for a known submission |
| A team's full SCF history | `get_scf_submissions` | All submissions linked to a project |
| Profile the team | `get_project` (`compact: true`) | Title / category / tags / links |
| Confirm category vocabulary | `get_categories` | The 5 live category buckets |
| Reality-check who already ships | `search_directory` + `find_similar_projects_semantic` | Live projects in the space |

`find_similar_scf_submissions` takes `query` **XOR** `slug` — pass one, not both.
Use `query` for a natural-language idea; use `slug` (a submission id like
`recsAQHCghw9HIUvF`) to find neighbors of a specific submission.

---

## Recipe

### 1. Find the closest prior submissions to the idea

Lead with the idea as a natural-language `query`. Optionally narrow by
`category` (one of the 5 live values) or `round`, and set `limit` (8–12 is a good
sweep).

```
find_similar_scf_submissions(
  query: "non-custodial payroll streaming on Stellar for remote teams",
  limit: 10
)
```

Returns one row per submission:

| field | use |
| --- | --- |
| `title` | the pitch headline |
| `description` | what they proposed |
| `category` | which of the 5 buckets it landed in |
| `round` | which SCF round |
| `award_type` | the funding outcome / track (your "did it get funded?" signal) |
| `linked_project_slug` | the directory project to drill into |

Scan `award_type` and `description` to separate **funded** prior art (strong
signal a problem is validated — and a crowded lane) from **proposed-but-not-awarded**
(an opening, or a warning that reviewers passed). Note every
`linked_project_slug` you'll want to profile.

### 2. Profile the teams behind the closest matches

For each interesting `linked_project_slug`, get a slim profile and the team's
full SCF history.

```
get_project(slug: "decaf", compact: true)
get_scf_submissions(slug: "decaf")
```

`get_project` with `compact: true` returns ~500 chars: slug, title, short
description, category, tags, twitter_handles, website, other_names — enough to
judge maturity and focus without the full row. `get_scf_submissions` returns
every submission linked to that project, so you can see whether they're a
one-shot applicant or a repeat grantee, and across which rounds. (You can also
pass `name:` to `get_scf_submissions` for a fuzzy lookup when you don't have a
slug.)

### 3. Expand from a specific submission

When one prior submission is dead-on, pivot to its neighbors by `slug` to widen
the comparison set without re-guessing keywords.

```
find_similar_scf_submissions(slug: "recsAQHCghw9HIUvF", limit: 8)
```

This surfaces submissions embedding-close to that one — often adjacent problem
framings the keyword `query` missed.

### 4. Reality-check the live ecosystem

A funded submission is past tense; you also want who is shipping **now**. Run a
couple of SHORT `search_directory` queries on the core capability, then grow the
cluster semantically from a good hit.

```
search_directory(query: "payroll", limit: 10)
search_directory(query: "payments", limit: 10)
find_similar_projects_semantic(slug: "decaf", limit: 8)
```

Keep `search_directory` terms short — it is keyword/ILIKE over
title/description/other_names, so a long phrase like "automated payroll for
distributed teams" returns 0. Use one or two words; reach for
`find_similar_projects_semantic` to expand from a seed. This catches live
competitors who never went through SCF and tells you whether your lane is empty,
crowded, or integrable.

### 5. Confirm the category fit

Categories are a controlled vocabulary — propose into one of the live values, not
an invented one. Pull them to be sure:

```
get_categories()
```

Live values: **Applications**, **Developer Tooling**,
**Education & Community**, **Financial Protocols**,
**Infrastructure & Services**. Match your idea to the same bucket the closest
funded prior art used — divergence from peers is a flag to re-read your framing.

---

## Worked example: "on-chain invoice financing for SMEs"

1. `find_similar_scf_submissions(query: "on-chain invoice financing and factoring for small businesses on Stellar", limit: 10)`
   → returns prior submissions. Read each `award_type`: say two are funded under
   **Financial Protocols** (RWA / credit angle) and one community proposal in the
   same lane was not awarded.
2. For the two funded rows, take their `linked_project_slug` →
   `get_project(slug, compact: true)` + `get_scf_submissions(slug)`. You learn one
   team has applied across two rounds (momentum + a moat), the other was a single
   award.
3. The closest funded submission is dead-on, so
   `find_similar_scf_submissions(slug: "rec…")` surfaces adjacent framings —
   supply-chain finance, trade receivables — showing where the cluster is dense
   vs thin.
4. Reality check: `search_directory(query: "invoice")` and
   `search_directory(query: "RWA")` (short!) plus
   `find_similar_projects_semantic` from a seed show which issuers are live today.
5. `get_categories()` confirms **Financial Protocols** is the right bucket.

You now know: the problem is validated (funded prior art exists), the lane has an
incumbent (differentiate hard), the open adjacency is trade-receivables, and the
category is Financial Protocols.

---

## Output: a positioning brief

Synthesize into a short brief. Use the bundled template:
`reference/positioning-brief-template.md`. It covers:

- **Closest prior submissions** — title, round, `award_type` (funded?),
  `linked_project_slug`, one-line takeaway.
- **What's differentiated** — what your idea does that the closest funded prior
  art does not.
- **Category fit** — which of the 5 live categories, matched to peer submissions.
- **Suggested framing** — the headline and award track to pitch into.
- **Overlap / crowding risk** — funded incumbents and live (non-SCF) competitors,
  and whether to differentiate vs integrate.
- **Open adjacencies** — neighboring problem framings that look under-served.

Always attribute outcomes to the public SCF record (round + `award_type`), and
distinguish "funded" from "merely proposed". This skill positions an idea against
that record — it does not apply to SCF on the user's behalf.

## Pointers

- Stellar Community Fund program details: https://communityfund.stellar.org
- Build guidance for whatever you pitch: https://developers.stellar.org
