# LumenLoop Stellar Skills

Preconfigured **playbooks** that make **any MCP-capable AI assistant** useful for
**researching and building on the [Stellar](https://stellar.org) ecosystem** — wired
to LumenLoop's free, read-only ecosystem MCP at **`https://mcp.lumenloop.com`**.

LumenLoop indexes the public Stellar ecosystem — projects, Stellar Community Fund
(SCF) submissions, and editorial / news / audio-video content — and exposes it as 18
read-only query tools over the open [Model Context Protocol](https://modelcontextprotocol.io).
**Any MCP client can connect** (Claude, ChatGPT, Gemini, Cursor, …). This repo adds the
**playbooks** for using those tools well, plus an `.mcp.json` that wires the connector.

The skills are packaged as **Claude Code Agent Skills** for one-command install, but the
connector and the recipes inside each skill are model-agnostic — see
[Using these with other LLMs](#using-these-with-other-llms).

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
| **stellar-content-auditor** | Audit a draft against the ecosystem — fix @handles, add citations, flag bad claims. |

See [`VISION.md`](VISION.md) for the design and authoring standard.

## Install

### A. As a Claude Code plugin (recommended)

```
/plugin marketplace add lumenloop/lumenloop-skills
/plugin install lumenloop-skills@lumenloop
```

Installing the plugin enables all eight skills **and** wires the `lumenloop` MCP
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

The skills query the `lumenloop` MCP server. After install, connect it in your client:

- **Claude Code / desktop:** the `lumenloop` server appears from `.mcp.json` (or the
  `claude mcp add` above). Run `/mcp`, pick **lumenloop**, and complete the one-time
  sign-in.
- **Claude.ai, ChatGPT, Gemini & other MCP clients:** add a custom / remote MCP
  connector pointing at `https://mcp.lumenloop.com` (transport: streamable HTTP) and
  sign in once.

Once connected, ask your assistant something like *"map the RWA projects on Stellar"*
or *"vet project `<slug>` for me"* and the matching skill (or playbook) takes over. In
Claude Code you can also invoke one directly, e.g.
`/stellar-ecosystem-scout real-world assets`.

## Using these with other LLMs

The `/plugin` install is Claude Code-specific, but nothing else here is:

1. **Connect the MCP** at `https://mcp.lumenloop.com` from any MCP-capable client
   (Claude, ChatGPT, Gemini, Cursor, or your own agent). The 18 tools work the same
   everywhere.
2. **Use the skill files as playbooks.** Each `skills/<name>/SKILL.md` is plain
   markdown describing exactly which tools to call, in what order, with which
   parameters. Paste one in as a system prompt / instructions, or hand it to your
   agent as a reference — the recipes are model-agnostic MCP tool-call sequences.

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
