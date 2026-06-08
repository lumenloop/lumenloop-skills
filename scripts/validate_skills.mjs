#!/usr/bin/env node
// validate_skills.mjs — structural + safety validator for lumenloop-skills.
//
// Checks every skill (or one passed as argv) against the authoring contract in
// VISION.md and, critically, against the PUBLIC guest MCP surface: only the 18
// guest read tools may be referenced. The metered research tooling and any
// mention of internal tiers/quotas are FORBIDDEN and fail the build.
//
// Usage:
//   node scripts/validate_skills.mjs              # all skills + repo manifests
//   node scripts/validate_skills.mjs skills/foo   # one skill dir
//
// Exit 0 = clean (warnings allowed), 1 = at least one error.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS_DIR = join(ROOT, 'skills');

// --- The PUBLIC contract: the 18 guest-facing read tools. Nothing else. ------
const GUEST_TOOLS = new Set([
  'search_directory', 'get_project', 'get_related_projects', 'get_categories',
  'get_regions', 'get_tags_vocabulary', 'get_project_tags_vocabulary',
  'get_scf_submissions', 'find_similar_scf_submissions', 'search_content_semantic',
  'find_content_about_project', 'find_av_passages', 'find_content_by_entity',
  'find_similar_projects_semantic', 'list_documents', 'search_documents',
  'get_document', 'list_research',
]);

// Metered / partner-only tools and internal concepts that must NEVER be published.
const FORBIDDEN_TOOLS = new Set(['request_research', 'research_result', 'list_my_research']);
const FORBIDDEN_PHRASES = [
  /partner tier/i, /research quota/i, /\bmetered\b/i, /per-call fee/i,
  /oauth grant/i, /admin tier/i, /llmcp_/i, /workos/i, /\bquota\b/i,
];

// Backticked tokens that look like an MCP tool (verb_prefix) but aren't guest tools.
const TOOLISH = /^(search|find|get|list|request|research)_[a-z0-9_]+$/;
const TOOLISH_ALLOW = new Set(['get_started', 'list_of', 'find_out', 'search_results', 'get_help']);

const MAX_BODY_LINES = 500;
const DESC_HARD_CAP = 1536;
const DESC_SOFT_CAP = 1024;

let totalErrors = 0, totalWarnings = 0;
const summary = [];

function parseFrontmatter(text, e) {
  if (!text.startsWith('---')) { e.push('SKILL.md does not start with YAML frontmatter (---).'); return { fm: {}, body: text }; }
  const end = text.indexOf('\n---', 3);
  if (end === -1) { e.push('Frontmatter block is not closed with a second ---.'); return { fm: {}, body: text }; }
  const fm = {};
  for (const line of text.slice(3, end).split('\n')) {
    const m = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return { fm, body: text.slice(end + 4) };
}

function validateSkill(dir) {
  const name = basename(dir);
  const e = [], w = [];
  const skillPath = join(dir, 'SKILL.md');
  if (!existsSync(skillPath)) { e.push('Missing SKILL.md'); return report(name, e, w); }
  const { fm, body } = parseFrontmatter(readFileSync(skillPath, 'utf8'), e);

  if (!fm.name) e.push('frontmatter: missing `name`');
  else if (fm.name !== name) e.push(`frontmatter: name "${fm.name}" != directory "${name}"`);

  if (!fm.description) e.push('frontmatter: missing `description`');
  else {
    if (fm.description.length > DESC_HARD_CAP) e.push(`description ${fm.description.length} chars > hard cap ${DESC_HARD_CAP}`);
    else if (fm.description.length > DESC_SOFT_CAP) w.push(`description ${fm.description.length} chars > soft budget ${DESC_SOFT_CAP}`);
    if (!/use when/i.test(fm.description)) w.push('description should state WHEN to use it ("Use when ...")');
    if (FORBIDDEN_PHRASES.some((r) => r.test(fm.description))) e.push('description leaks non-public (tier/research/internal) concepts');
  }

  const bodyLines = body.split('\n').length;
  if (bodyLines > MAX_BODY_LINES) e.push(`body ${bodyLines} lines > ${MAX_BODY_LINES} (split into reference/ files)`);
  else if (bodyLines > MAX_BODY_LINES * 0.9) w.push(`body ${bodyLines} lines (approaching ${MAX_BODY_LINES})`);

  if (!/^#\s+\S/m.test(body)) w.push('missing an H1 title');
  if (!/##\s+When to use/i.test(body)) w.push('missing "## When to use this skill" section');
  if (!/##\s+Related skills/i.test(body)) w.push('missing "## Related skills" section');

  for (const r of FORBIDDEN_PHRASES) if (r.test(body)) e.push(`body contains forbidden/internal phrase matching ${r}`);

  for (const tok of [...body.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim())) {
    if (FORBIDDEN_TOOLS.has(tok)) { e.push(`references FORBIDDEN (non-guest) tool \`${tok}\``); continue; }
    if (TOOLISH.test(tok) && !GUEST_TOOLS.has(tok) && !TOOLISH_ALLOW.has(tok))
      e.push(`references unknown / non-guest MCP tool \`${tok}\` (not in the 18-tool guest catalog)`);
  }

  for (const m of body.matchAll(/\.\.\/([a-z0-9-]+)\/SKILL\.md/g))
    if (!existsSync(join(SKILLS_DIR, m[1], 'SKILL.md'))) e.push(`broken cross-link ../${m[1]}/SKILL.md`);

  for (const m of body.matchAll(/reference\/([A-Za-z0-9._-]+\.[A-Za-z0-9]+)/g))
    if (!existsSync(join(dir, 'reference', m[1]))) e.push(`mentions missing bundled file reference/${m[1]}`);

  if (/\bscripts\/[A-Za-z0-9._-]+\.(sh|py|mjs|js)/.test(body) && !/CLAUDE_SKILL_DIR/.test(body))
    w.push('references a bundled script without ${CLAUDE_SKILL_DIR}');

  report(name, e, w);
}

function report(name, e, w) {
  totalErrors += e.length; totalWarnings += w.length;
  summary.push({ name, status: e.length ? 'FAIL' : (w.length ? 'WARN' : 'PASS') });
  console.log(`\n${e.length ? '❌ FAIL' : (w.length ? '⚠️  WARN' : '✅ PASS')}  ${name}`);
  for (const x of e) console.log(`   error:   ${x}`);
  for (const x of w) console.log(`   warning: ${x}`);
}

function validateRepo() {
  const e = [], w = [];
  for (const [file, mustHave] of [
    ['.claude-plugin/plugin.json', ['name']],
    ['.claude-plugin/marketplace.json', ['name', 'plugins']],
    ['.mcp.json', ['mcpServers']],
  ]) {
    const p = join(ROOT, file);
    if (!existsSync(p)) { e.push(`missing ${file}`); continue; }
    try {
      const j = JSON.parse(readFileSync(p, 'utf8'));
      for (const k of mustHave) if (!(k in j)) e.push(`${file}: missing key "${k}"`);
      if (file === '.mcp.json') {
        const s = JSON.stringify(j);
        if (!/mcp\.lumenloop\.com/.test(s)) e.push('.mcp.json does not point at mcp.lumenloop.com');
        if (FORBIDDEN_PHRASES.some((r) => r.test(s))) e.push('.mcp.json leaks internal concepts');
      }
    } catch (err) { e.push(`${file}: invalid JSON (${err.message})`); }
  }
  report('repo', e, w);
}

const arg = process.argv[2];
if (arg) validateSkill(resolve(arg));
else {
  validateRepo();
  for (const d of readdirSync(SKILLS_DIR)) {
    const p = join(SKILLS_DIR, d);
    if (statSync(p).isDirectory()) validateSkill(p);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Result: ${summary.filter((s) => s.status === 'PASS').length} pass, ` +
  `${summary.filter((s) => s.status === 'WARN').length} warn, ` +
  `${summary.filter((s) => s.status === 'FAIL').length} fail  ` +
  `(${totalErrors} errors, ${totalWarnings} warnings)`);
process.exit(totalErrors ? 1 : 0);
