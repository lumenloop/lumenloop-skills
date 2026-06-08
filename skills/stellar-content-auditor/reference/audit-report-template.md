# Content audit — output template

Return the audit in this shape. Keep the user's draft intact; annotate around it.

## 1. Mentions

| As written | Canonical (title / slug) | X / @ handle | Website | Status |
| --- | --- | --- | --- | --- |
| Aquarious | Aquarius / `aquarius` | @aquarius | aqua.network | ⚠ fix spelling |
| @foo | — | — | — | ❌ not in directory |

Status legend: ✅ correct · ⚠ fix (name/handle) · ❌ not found / unverified.

## 2. Claims & citations

| Claim (from the draft) | Supporting source (url) | Verdict |
| --- | --- | --- |
| "<quote the claim>" | https://… (LumenLoop summary) | ✅ supported |
| "<quote the claim>" | — | ❌ unverified — no indexed source |

> Cite the returned `url`. Never fabricate a source; "unverified" is a valid result.

## 3. Suggestions

- **Also mention:** <related project> (`slug`) — why it fits.
- **Link:** <article/research title> — https://… — supports your point about <X>.

## 4. Corrected copy (optional)

A clean version of the draft with names/@handles fixed and citations footnoted —
only the factual/handle corrections, not a rewrite of the user's voice.
