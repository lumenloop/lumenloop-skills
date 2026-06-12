---
name: stellar-builder-quickstart
description: "Go from a Stellar product idea to a build path: pick the right Stellar primitives, check ecosystem prior art via LumenLoop, and route to the relevant build skill (Soroban, SDK/dapp, assets, oracles). Use when the user wants to start building something on Stellar and needs orientation on approach and existing work."
user-invocable: true
---

# Stellar Builder Quickstart

Turn a half-formed Stellar product idea into a concrete build path. This skill maps the
idea to the right Stellar primitive, scans the ecosystem for prior art you should reuse
or integrate (so you don't rebuild what already ships), recommends a stack, and hands
off to the deeper Stellar build references. It runs on LumenLoop's free, read-only
Stellar ecosystem MCP (https://mcp.lumenloop.com) — the public project directory, SCF
submissions, and editorial/news/AV/event/research library. LumenLoop is for *discovery*;
the actual contract/SDK guidance lives in the Stellar build skills linked below.

## When to use this skill

- A user describes a Stellar idea ("a tipping app", "a yield vault", "a stablecoin for
  X corridor", "an RWA marketplace") and asks "how do I build this?" or "where do I start?"
- You need to decide between Stellar primitives — classic asset, Soroban contract,
  payments, an anchor/SEP flow, or a price oracle — before writing any code.
- You want to avoid reinventing: is there an existing project or SCF-funded team you
  should integrate with or fork from instead of building from zero?
- You need a one-page build plan (primitive, prior art, stack, first steps) to align on.
- You're scoping an SCF submission and want the technical "base to build on" framed first.

## Related skills

- **Connect first** → `../lumenloop-mcp-connect/SKILL.md` — add the MCP server and sign in.
- **Map the sector** before committing → `../stellar-ecosystem-scout/SKILL.md`.
- **Pick a specific dependency** (wallet/oracle/anchor) → `../stellar-integration-finder/SKILL.md`.
- **Deep-dive one prior-art project** → `../stellar-project-dossier/SKILL.md`.

For the actual building, route to the Stellar build references (these are NOT in this
repo — refer to them by name and link https://developers.stellar.org):

- **Soroban** — Rust smart contracts: storage, auth, cross-contract calls, testing.
- **dapp** — JS `stellar-sdk` (browser + Node), Freighter, Stellar Wallets Kit, passkeys.
- **assets** — classic assets, trustlines, authorization flags, and the SAC bridge to Soroban.
- **data** — Stellar RPC (preferred) and Horizon for reading chain state / indexing.
- **standards** — which SEP/CAP applies (wallets, anchors, payments, KYC, deep links).
- **reflector-build** — Reflector price oracle (Pulse free SEP-40 feed; on-demand feed).

---

## The recipe

Four steps: **clarify → check prior art → decide primitives + stack → emit a build plan.**

### 1. Clarify the idea and map it to a Stellar primitive

Restate the idea in one sentence, then pick the primitive(s). Use this decision table:

| What the idea needs | Primitive | Build reference |
|---|---|---|
| Move value, pay, remit, stream tips | **Payments** (classic ops) + maybe an asset | dapp + assets |
| Issue a token / stablecoin / RWA share | **Classic asset** + trustlines (+ SAC to use in Soroban) | assets |
| Custom on-chain logic, vaults, escrow, AMM, governance | **Soroban contract** (Rust) | soroban |
| Deposit/withdraw fiat, on/off-ramp, KYC | **Anchor / SEP** flow (SEP-6/24/31/12) | standards |
| Price data for DeFi (liquidation, pricing) | **Price oracle** (Reflector) | reflector-build |
| A web/mobile UI that signs and submits | **dapp** (stellar-sdk + a wallet) | dapp |
| Read balances, history, events, analytics | **Stellar RPC / Horizon** | data |

Most real products combine two or three (e.g. an RWA marketplace = classic asset + a
Soroban escrow contract + a dapp front end + Reflector for pricing). Name each primitive
explicitly — that list drives steps 2–4.

### 2. Check ecosystem prior art via the MCP — don't reinvent

Before recommending a build, see what already ships. Run these in order.

**a. Keyword sweep (`search_directory`).** Keyword/ILIKE over title/description/
other_names — **short terms work, long natural-language phrases return 0.** Use 1–2 word
capability terms, not sentences.

```
search_directory(query="vault", limit=10)
search_directory(query="oracle", limit=10)
search_directory(query="RWA", limit=10)
```

Returns `{count, projects: [{slug, title, description, category, tags, website}]}`.
Note promising slugs.

**b. Grow the cluster (`find_similar_projects_semantic`).** Pick the closest seed slug
and pull semantic neighbours — better than tag matching for "who else does this".

```
find_similar_projects_semantic(slug="<seed-slug>", limit=8)
```

**c. Narrative + recommendations (`search_content_semantic`).** Semantic search over the
content library returns **AI summaries + a source `url`** (not full text — cite the url).
Use a full natural-language query here (semantic, unlike `search_directory`):

```
search_content_semantic(
  query="building a real world asset tokenization marketplace on Stellar",
  types=["articles","av","research"], limit=6)
```

Each hit is `{id, title, url, domain, publishing_date, summary, similarity}` (limit
defaults to 5 per content type; pass `response_format="detailed"` for `long_summary`).

**d. (Optional) Has it been SCF-funded? (`find_similar_scf_submissions`).** Surfaces
prior proposals + their `award_type` and `linked_project_slug` — strong signal that a
team already builds here and might be worth collaborating with or forking.

```
find_similar_scf_submissions(query="<your idea>", limit=5)
```

**e. (Optional) Detail a candidate (`get_project`).** Pass `compact=true` for a slim
writer shape (slug, title, short description, category, tags, website, other_names) when
you just need to size up integration surface.

```
get_project(slug="<candidate-slug>", compact=true)
```

> Decision rule: if a prior-art project covers a chunk of the idea, prefer **integrating**
> over rebuilding and hand off to `../stellar-integration-finder/SKILL.md` to choose the
> exact dependency. Reserve a custom build for the part that's genuinely new.

### 3. Decide primitives + stack

From step 1's primitive list and step 2's prior art, lock the stack. Default picks:

| Layer | Default choice | Build reference |
|---|---|---|
| Contract logic | Rust on Soroban (use OpenZeppelin Stellar libs where they fit) | soroban |
| Token / asset | Classic asset + trustlines; expose to Soroban via **SAC** | assets |
| Front end | JS `stellar-sdk` + Stellar Wallets Kit (or Freighter directly) | dapp |
| Chain reads | **Stellar RPC** (preferred); Horizon for legacy/history | data |
| Price feeds | Reflector — Pulse (free SEP-40, 5-min) unless on-demand is required | reflector-build |
| Ramps / KYC | the SEP that fits (6/24/31 transfers, 12 KYC, 10 info) | standards |

State *why* each was chosen in one clause (e.g. "Soroban for the escrow because the
hold/release logic is custom; classic asset + SAC for the token so wallets list it natively").

### 4. Emit the build plan

Produce a short, copy-pasteable plan. Fill the template in
`reference/build-plan-template.md` and link the Stellar docs. Keep it to one screen:

1. **Idea** — one sentence.
2. **Primitives** — the explicit list from step 1.
3. **Prior art** — projects/SCF teams to reuse or integrate, each with slug + cited url;
   what stays custom.
4. **Recommended stack** — the table from step 3 with the *why*.
5. **First steps** — 3–6 concrete actions (scaffold contract, set up testnet identity,
   wire a wallet, etc.).
6. **Read next** — name the deeper build reference(s) + link https://developers.stellar.org.

---

## Worked example: "an RWA tokenization marketplace on Stellar"

**Step 1 — primitives.** Tokenized shares → **classic asset + trustlines**, exposed to
contracts via **SAC**. Escrow/settlement of trades → **Soroban contract**. A buy/sell UI
that signs → **dapp**. Per-asset valuation → **Reflector** oracle. KYC for regulated
issuance → an **anchor/SEP** flow (SEP-12).

**Step 2 — prior art.**

```
search_directory(query="RWA", limit=10)            # short term — returns hits
search_directory(query="tokenization", limit=10)
# NOTE: search_directory(query="real world asset tokenization marketplace") → 0 (too long)
```

Then go semantic for the narrative:

```
search_content_semantic(
  query="real world asset tokenization on Stellar",
  types=["articles","research"], limit=6)
```

This returns real library items (e.g. a "tokenization-basics" explainer) with summaries
+ source urls — cite them, they're summaries, not full text. Grow the project cluster
from a seed slug:

```
find_similar_projects_semantic(slug="<an-RWA-seed-slug>", limit=8)
```

And check funding precedent:

```
find_similar_scf_submissions(query="real world asset tokenization", limit=5)
```

If an existing issuer or marketplace covers part of the flow, integrate it (hand to
`../stellar-integration-finder/SKILL.md`) rather than rebuilding the issuance layer.

**Step 3 — stack.** Classic asset + SAC (assets) · Soroban escrow (soroban) ·
stellar-sdk + Wallets Kit front end (dapp) · Reflector Pulse for valuation
(reflector-build) · SEP-12 KYC via an anchor (standards) · Stellar RPC for reads (data).

**Step 4 — build plan.** Emit it from `reference/build-plan-template.md`. First steps:
scaffold the Soroban escrow + fund a testnet identity; issue the test asset and set its
authorization flags; wrap it as a SAC; wire a wallet to a minimal dapp that submits a
trade. **Read next:** the Soroban and assets references — start at
https://developers.stellar.org.

---

## Gotchas

- `search_directory` is keyword/ILIKE — **short terms only**; long phrases return 0. Use
  the semantic tools (`search_content_semantic`, `find_similar_projects_semantic`) for
  concept/topic discovery.
- Content tools return LumenLoop's **AI-generated summaries + a source `url`**, not full
  article text — always cite the url and verify specifics at the source.
- `get_project` default returns a large full row; pass `compact=true` for the slim shape.
- LumenLoop tells you *what exists* and *what's been said*; it does not write contracts.
  For the actual build, follow the named Stellar build skills and
  https://developers.stellar.org.
- If a tool stops appearing after a server update, reconnect the connector
  (see `../lumenloop-mcp-connect/SKILL.md`).

## Read next

- **Build plan template** → `reference/build-plan-template.md`.
- **Stellar developer docs** (Soroban, SDKs, assets, RPC/Horizon, SEPs, Reflector) →
  https://developers.stellar.org.
