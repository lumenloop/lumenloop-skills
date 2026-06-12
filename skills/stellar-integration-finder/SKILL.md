---
name: stellar-integration-finder
description: Find the right existing Stellar project or tool to integrate — wallet, oracle, anchor, RWA issuer, DEX, indexer — via the LumenLoop directory and semantic search, then route to the matching build skill. Use when the user asks 'what should I use for X on Stellar' or needs to pick an ecosystem dependency to integrate.
user-invocable: true
---

# Stellar Integration Finder

Pick the right ecosystem dependency to integrate — a wallet, price oracle, anchor,
RWA issuer, DEX, custody provider, payments rail, or indexer — instead of building it
yourself. This skill runs on LumenLoop's free, read-only Stellar ecosystem MCP
(https://mcp.lumenloop.com): it searches the public project directory and editorial
content, shortlists real candidates with their integration surface, and hands you off
to the matching Stellar build reference. Output is a comparison + a recommendation, not
generated code.

## When to use this skill

- The user asks "what should I use for X on Stellar?" (e.g. a wallet, oracle, anchor).
- You need to choose between competing ecosystem dependencies and want tradeoffs.
- You want to avoid reinventing a primitive (payments, custody, on/off-ramp, indexing).
- You're scoping an integration and need each candidate's category, tags, and links.
- You need cited context — articles, talks, research — on what people actually use.
- You're about to start building and want the right build reference to read next.

## Related skills

- New to the MCP? Connect first → `../lumenloop-mcp-connect/SKILL.md`.
- Need the whole landscape of a sector, not one pick → `../stellar-ecosystem-scout/SKILL.md`.
- Going deep on a single candidate (funding, comparables, what's said) →
  `../stellar-project-dossier/SKILL.md`.
- Ready to build once you've chosen → `../stellar-builder-quickstart/SKILL.md`.
- For Stellar BUILD guidance after you pick — **Soroban** contracts, the JS
  **stellar-sdk** + **Freighter** + **Stellar Wallets Kit** for dapps, classic
  **assets** + trustlines + **SAC**, **Reflector** price oracles, **Stellar RPC** /
  **Horizon** for data — see https://developers.stellar.org and the build skills
  named in step 5 below.

---

## Recipe

Run these five steps in order. Steps 1–4 use the MCP to converge on a shortlist; step 5
routes you to the build.

### 1. Seed by capability — short `search_directory` queries

`search_directory(query, limit?)` is keyword/ILIKE over title, description, and
other_names. **Use SHORT capability nouns**, one concept each. Long natural-language
phrases ("a wallet that supports passkeys and recovery") return 0 rows — for those,
use the semantic search in step 2 instead.

```
search_directory(query="wallet", limit=20)
search_directory(query="oracle")
search_directory(query="anchor")
search_directory(query="custody")
search_directory(query="DEX")
search_directory(query="payments")
search_directory(query="indexer")
```

Results arrive as one JSON object `{count, projects}`; each project row is
`{slug, title, description, category, tags, website}`. Worked
example — `search_directory(query="wallet")` returns real directory entries such as:

| slug    | title   | category               | tags (excerpt)                 |
|---------|---------|------------------------|--------------------------------|
| abroad  | Abroad  | Applications           | Wallet, Cross-Border Payments  |
| adamik  | Adamik  | Developer Tooling      | SDK, Wallet Infra              |
| airgap  | AirGap  | Applications           | Wallet, Self-Custody           |
| airtm   | Airtm   | Financial Protocols    | Payments, Wallet               |

Note how one keyword spans several categories — a "wallet" can be an end-user app, a
wallet-infra SDK, or a payments protocol. Keep the slugs; you'll deep-dive them next.

Tip: to know the exact buckets your capability maps to, call `get_categories()` (live
values: Applications, Developer Tooling, Education & Community, Financial Protocols,
Infrastructure & Services) and `get_project_tags_vocabulary()` (controlled project tags
like "Wallet Infra", "Cross-Border Payments", "SDK"). Use `get_regions()` if the choice
is jurisdiction-sensitive (e.g. an anchor that must operate in a specific region).

### 2. Add context — `search_content_semantic`

Keyword search finds names; semantic search finds **recommendations and rationale**.
Pass a natural-language query and narrow `types` for speed.

```
search_content_semantic(
  query="best wallet to integrate on Stellar",
  types=["articles","av","research"],
  limit=8)
```

Returns per-type arrays of `{id, title, url, domain, publishing_date, summary,
slug, similarity}` (limit defaults to 5 per content type; pass
`response_format="detailed"` for `long_summary`). These are LumenLoop's AI-generated
**summaries plus the source `url`** — cite the url; they are not full article text.
Use `find_av_passages(query="<capability> on Stellar")` when you want a direct quote
from a talk or podcast about what to use.

### 3. Deep-dive each candidate — `get_project` + alternatives

For every shortlisted slug, pull its integration surface:

```
get_project(slug="abroad")              # full row: website, category, tags, links, descriptions
get_project(slug="abroad", compact=true)  # slim ~500-char shape when you only need the basics
```

`compact=true` returns just slug, title, short description, category, tags,
twitter_handles, website, other_names — ideal for a comparison table. Then expand the
field of candidates beyond your keyword hits:

```
find_similar_projects_semantic(slug="abroad", limit=6)
```

This surfaces projects semantically similar to a seed — better than tag/category
matching, and it catches competitors your keyword missed. (Do **not** use
`get_related_projects` here: it takes a `content_id` + `content_type` and maps a piece
of CONTENT to the projects it mentions — it is content→projects, not project→project.)

Want to know who actually integrates a candidate, or read what's written about it?
`find_content_about_project(slug="abroad", limit=5)` returns cross-domain content that
discusses it (cite the urls).

### 4. Shortlist and recommend

Assemble 2–4 finalists into a tradeoff table and pick one. Score on **integration fit**,
not popularity. Suggested columns:

| Candidate | Category | Key tags | Integration surface (website/SDK) | Why pick / skip |
|-----------|----------|----------|-----------------------------------|-----------------|
| Abroad    | Applications | Wallet, Cross-Border Payments | abroad.io — end-user app | Use if you need a consumer remittance app, not a library |
| Adamik    | Developer Tooling | SDK, Wallet Infra | adamik.io — multi-chain SDK | Use if you need to embed wallet/signing in your own product |

Then state the recommendation and the single deciding factor (custody model, region
coverage, SDK language, SEP support, license, maintenance signal from step 2's cited
content).

### 5. Route to building

Once a dependency is chosen, name the relevant Stellar build reference and hand off.
Map the capability to the right primitive:

| You're integrating a… | Build with… | Read |
|-----------------------|-------------|------|
| Wallet / signing in a dapp | JS **stellar-sdk**, **Freighter**, **Stellar Wallets Kit** | https://developers.stellar.org |
| Price **oracle** | **Reflector** feeds (SEP-40) | https://developers.stellar.org |
| Token / RWA **issuer** | Classic **assets** + trustlines, **SAC** bridge to Soroban | https://developers.stellar.org |
| On-/off-ramp **anchor** | SEP-6 / SEP-24 / SEP-31 standards | https://developers.stellar.org |
| Custom on-chain logic / **DEX** hook | **Soroban** smart contracts | https://developers.stellar.org |
| **Indexer** / analytics | **Stellar RPC** (preferred) / **Horizon** | https://developers.stellar.org |

For the full build plan — primitive choice, stack, and first steps — cross over to
`../stellar-builder-quickstart/SKILL.md`. For deep due-diligence on the one project you
chose (funding history, comparables, open questions), use
`../stellar-project-dossier/SKILL.md`.

---

## Worked example: "What oracle should I use to read prices on Stellar?"

1. **Seed:** `search_directory(query="oracle")` → returns directory rows; among them is
   `{slug: "reflector", title: "Reflector", category: "Infrastructure & Services",
   tags: ["Oracle", "Price Feeds"]}`. (`search_directory(query="price oracle for my
   Soroban DeFi protocol")` returns 0 — too long; the short noun "oracle" is the move.)
2. **Context:** `search_content_semantic(query="price oracle on Stellar",
   types=["articles","research"], limit=6)` → cited summaries explaining feed types and
   tradeoffs; keep each `url`.
3. **Deep-dive:** `get_project(slug="reflector")` for the integration surface (website,
   tags, links), then `find_similar_projects_semantic(slug="reflector", limit=6)` to see
   whether any alternative oracle exists before committing.
4. **Recommend:** if only one credible price-feed provider surfaces, say so plainly and
   note the deciding factor (SEP-40 support, update cadence, supported assets).
5. **Route:** integrating a price feed → build against **Reflector** (and **Soroban** if
   you read it from a contract). Link https://developers.stellar.org and hand off to
   `../stellar-builder-quickstart/SKILL.md`.

**Final output shape:** a short brief — the question, the 2–4 candidates table from
step 4, the one recommendation with its deciding factor, 2–3 cited content urls from
step 2, and the exact build reference to read next.

## Gotchas

- `search_directory` is keyword/ILIKE — short capability nouns hit; long phrases miss.
  For concept-level discovery, reach for `search_content_semantic` or
  `find_similar_projects_semantic`.
- Content tools return AI **summaries + a source `url`**, not full text. Always cite the
  url and don't quote the summary as if it were the article.
- `get_related_projects` is content→projects (needs `content_id` + `content_type`); for
  project→project similarity use `find_similar_projects_semantic`.
- `get_project` defaults to a large full row; pass `compact=true` for the slim shape when
  you only need title/category/tags/links for a comparison table.
- If a tool stops appearing after a server update, reconnect the connector
  (`../lumenloop-mcp-connect/SKILL.md`).
