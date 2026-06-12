---
name: stellar-content-auditor
description: Audit and enrich a draft (blog post, talking points, tweet, announcement) against the LumenLoop Stellar ecosystem data — resolve the projects you mention to their canonical names and X/@ handles, pull supporting facts and citations from indexed content, and flag wrong handles or unsupported claims. Use when the user shares draft copy about Stellar and wants project handles/names/facts checked, or asks to fact-check, enrich, or add citations and links to a post.
user-invocable: true
---

# Stellar Content Auditor

Paste in a draft — a blog post, talking points, a tweet/thread, a launch
announcement — and this skill checks and enriches it against **LumenLoop's free,
read-only Stellar ecosystem MCP** (`https://mcp.lumenloop.com`). It resolves every
project you mention to its canonical directory entry (correct name, slug, X/@ handle,
website), backs up factual claims with cited indexed content, and flags anything
wrong, missing, or unsupported — so what you publish is accurate and well-linked.

## When to use this skill

- The user shares **draft copy** about Stellar and wants it checked before publishing.
- "What's the right **@handle** / official name for these projects?"
- "**Fact-check** this post" / "add **citations** and links" / "what should I also mention?"
- Verifying a **launch/announcement** names projects and partners correctly.
- Catching **misspelled or non-existent** projects and **wrong X handles** in copy.

## Related skills

- Connect the MCP + the tool map → `../lumenloop-mcp-connect/SKILL.md`
- Deep-dive one project you mention → `../stellar-project-dossier/SKILL.md`
- Find recent content on a topic to cite → `../stellar-ecosystem-digest/SKILL.md`
- Map the wider space around your draft → `../stellar-ecosystem-scout/SKILL.md`
- Verify an SCF funding claim → `../scf-submission-radar/SKILL.md`

---

## The audit workflow

### 1. Extract the entities from the draft
Read the draft and list everything that names the ecosystem: **projects**, **people**,
**organizations**, **tokens**, plus any **@handles** and factual **claims** (funding,
metrics, "first to…", partnerships). Work from the user's text only.

### 2. Resolve each project to its canonical entry
For every project mentioned, find its directory record:

```
search_directory(query="<short project name>", limit=5)
   → {count, projects: [{slug, title, description, category, tags, website}]}
get_project(slug="<slug>", compact=true)
   → { slug, title, short description, category, tags, twitter_handles, website, other_names }
```

- `search_directory` is **keyword/ILIKE** — use the short name ("aquarius", not
  "the Aquarius AMM protocol"). If the draft's spelling is off, try `other_names`-style
  variants or a shorter token.
- If `search_directory` returns **0 results**, the project may not be in the directory
  (or is misspelled): **flag it — do not invent a slug or handle.**
- `get_project(compact=true)` returns the **canonical title**, **`twitter_handles`**,
  and **website** — this is your source of truth for names and @mentions.

### 3. Check names and @handles
Compare each as-written name/@handle to the canonical `title` / `twitter_handles`:
- Wrong or missing handle → propose the canonical one.
- Wrong capitalization / spelling of the name → propose the canonical `title`.
- Handle in the draft but project not in the directory → flag as **unverified**.

### 4. Fact-check claims and attach citations
For each factual claim, look for supporting indexed content:

```
find_content_by_entity(entity="<name>", entity_type="project", limit=10)
search_content_semantic(query="<the claim, in words>", types=["articles","av","research"])
find_content_about_project(slug="<slug>", limit=8)
```

Each returns LumenLoop's **AI summaries + the source `url`**. Cite the `url`.
- Claim supported by indexed content → attach the citation.
- Claim with **no** supporting content → mark **unverified** (do not fabricate a source).
- Need a direct quote from a talk/podcast → `find_av_passages(query="<topic>")`.
- Claim about SCF funding → `get_scf_submissions(slug="<slug>")` to confirm round/award.

### 5. Suggest links and mentions
Strengthen the draft:
- `find_similar_projects_semantic(slug="<slug>")` → adjacent projects worth mentioning.
- `search_content_semantic(query="<theme>")` → recent articles/research to link.

### 6. Produce the audit
Return the draft annotated with three things: a **mentions table** (as-written →
canonical name / slug / @handle / website → status), a **claims table** (claim →
citation url → verdict), and **suggestions** (projects/content to add). Use the layout
in `reference/audit-report-template.md`.

---

## Worked example

Draft says: *"Big fan of Aquarious — the AMM on Stellar (@aquarius) just crossed $1B."*

1. `search_directory(query="aquarius", limit=5)` → slug `aquarius`, title "Aquarius".
2. `get_project(slug="aquarius", compact=true)` → canonical title **Aquarius** (draft
   misspells "Aquarious"); `twitter_handles` gives the real handle (verify `@aquarius`
   matches — correct it if not).
3. `find_content_by_entity(entity="Aquarius", entity_type="project")` +
   `search_content_semantic(query="Aquarius AMM total value locked $1B")` → look for a
   source for the "$1B" claim; attach the `url` if found, else mark **unverified**.
4. `find_similar_projects_semantic(slug="aquarius")` → suggest a related AMM/DEX to mention.

Output: "Aquarious → **Aquarius** (slug `aquarius`); confirm @handle; the $1B claim is
unverified — no indexed source. Consider also linking [related project]."

## Gotchas

- **`search_directory` is keyword, not semantic** — short terms only; long phrases
  return 0. For fuzzy spellings, try shorter tokens before concluding "not found".
- **Never invent handles or citations.** If a project isn't in the directory or a
  claim has no supporting content, say so explicitly.
- **Content tools return summaries + a `url`, not full text** — cite the `url`; don't
  present a summary as a verbatim source quote.
- **`twitter_handles` from `get_project(compact=true)` is the canonical @handle** — use
  it to correct @mentions; it may differ from the draft.
- Treat directory metrics/claims as **directional** — confirm time-sensitive numbers
  against a dated source before vouching for them.

## Pointers

- LumenLoop MCP server: https://mcp.lumenloop.com
- Building on Stellar: https://developers.stellar.org
