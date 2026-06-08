# SCF Positioning Brief — <idea one-liner>

> Research/positioning only, built from the public SCF record via LumenLoop's
> read-only MCP. This does NOT submit anything to SCF.

## 1. The idea
- **One-liner:** <what it does, for whom, on Stellar>
- **Proposed category:** <one of: Applications | Developer Tooling | Education & Community | Financial Protocols | Infrastructure & Services>
- **Query used:** `find_similar_scf_submissions(query: "<...>")`

## 2. Closest prior submissions
| Title | Round | award_type (funded?) | linked_project_slug | Takeaway |
| --- | --- | --- | --- | --- |
| <title> | <round> | <funded / not awarded / track> | <slug> | <one line> |
| | | | | |

Separate **funded prior art** (problem validated, lane crowded) from
**proposed-but-not-awarded** (opening, or a reviewer signal to heed).

## 3. Teams behind the closest matches
| Project (slug) | Category | Repeat applicant? | Live focus / links |
| --- | --- | --- | --- |
| <slug> | <category> | <one-shot / multi-round> | <website, tags> |

Source: `get_project(slug, compact: true)` + `get_scf_submissions(slug)`.

## 4. Live ecosystem reality check
- Short `search_directory` terms run: <term1>, <term2>
- Semantic neighbors from seed: `find_similar_projects_semantic(slug: "<seed>")`
- Live competitors who never went through SCF: <list>
- Verdict: lane is **empty / crowded / integrable**.

## 5. Differentiation
- What the closest **funded** prior art does NOT do: <gap>
- Your wedge: <the defensible difference>

## 6. Open adjacencies
- Under-served neighboring framings (from `find_similar_scf_submissions(slug: ...)`):
  <adjacency 1>, <adjacency 2>

## 7. Recommended framing
- **Headline to pitch:** <sharpened one-liner>
- **Category:** <chosen value, matched to peer submissions>
- **Award track to target:** <based on award_type of comparable funded work>
- **Overlap risk to address up front:** <incumbent + how you differentiate or integrate>

## 8. Next step
- Plan the build with the `stellar-builder-quickstart` skill; Stellar build
  references at https://developers.stellar.org.
- Deep-dive any incumbent team with the `stellar-project-dossier` skill.
