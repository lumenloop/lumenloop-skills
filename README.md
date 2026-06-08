# LumenLoop Stellar Skills

Preconfigured [Claude](https://claude.com/claude-code) skills for **researching and
building on the [Stellar](https://stellar.org) ecosystem** — wired to LumenLoop's
free, read-only ecosystem MCP at **`https://mcp.lumenloop.com`**.

LumenLoop indexes the public Stellar ecosystem — projects, Stellar Community Fund
(SCF) submissions, and editorial / news / audio-video content — and exposes it as
18 read-only query tools. This repo gives Claude the **playbooks** to use those
tools well, plus an `.mcp.json` that connects the server for you.

> Read-only and public by design. These skills only ever query LumenLoop's public
> ecosystem data — they never write anything.

## What's inside

| Skill | Use it when you want to… |
|-------|--------------------------|
| **lumenloop-mcp-connect** | Connect the MCP and learn what each tool does / which skill to use. |
| **stellar-ecosystem-scout** | Map a sector or topic into a landscape of projects + content. |
| **stellar-project-dossier** | Build a due-diligence profile of a single project. |
| **scf-submission-radar** | Position an SCF idea against prior submissions before you apply. |
| **stellar-integration-finder** | Find the right wallet / oracle / anchor / RWA / DEX to integrate. |
| **stellar-ecosystem-digest** | Get a dated digest of recent activity on a theme or entity. |
| **stellar-builder-quickstart** | Go from idea → Stellar primitives → prior art → a build path. |

See [`VISION.md`](VISION.md) for the design and authoring standard.

## Install

### A. As a Claude Code plugin (recommended)

```
/plugin marketplace add lumenloop/lumenloop-skills
/plugin install lumenloop-skills@lumenloop
```

Installing the plugin enables all seven skills **and** wires the `lumenloop` MCP
connector from the bundled `.mcp.json`. Then connect the server (below).

### B. Project-scoped (clone into a repo)

```bash
git clone https://github.com/lumenloop/lumenloop-skills.git
```

Run Claude Code from the clone (or copy `.mcp.json` + `skills/` into your project's
`.claude/`). Project skills and the MCP server are auto-discovered.

### C. Personal skills

```bash
git clone https://github.com/lumenloop/lumenloop-skills.git
cp -r lumenloop-skills/skills/* ~/.claude/skills/        # or symlink individual folders
```

Then add the server to your MCP config once:

```bash
claude mcp add --transport http lumenloop https://mcp.lumenloop.com
```

## Connect the server

The skills query the `lumenloop` MCP server. After install, connect it in your
Claude client:

- **Claude Code / desktop:** the `lumenloop` server appears from `.mcp.json` (or the
  `claude mcp add` above). Run `/mcp`, pick **lumenloop**, and complete the one-time
  sign-in.
- **Claude.ai / other MCP clients:** add a connector pointing at
  `https://mcp.lumenloop.com` and sign in.

Once connected, ask Claude something like *"map the RWA projects on Stellar"* or
*"vet project `<slug>` for me"* and the matching skill takes over. Or invoke one
directly, e.g. `/stellar-ecosystem-scout real-world assets`.

## Develop / contribute

```bash
node scripts/validate_skills.mjs          # validate all skills + manifests
node scripts/validate_skills.mjs skills/stellar-ecosystem-scout   # one skill
claude plugin validate .                  # Anthropic manifest validation
```

The validator enforces the authoring contract in `VISION.md`, including the rule
that skills may reference **only** the 18 public read tools. New skills are added
one validated folder at a time.

## License

MIT — see [`LICENSE`](LICENSE). Stellar ecosystem data is served by LumenLoop and
remains subject to its source terms.
