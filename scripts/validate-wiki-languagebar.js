#!/usr/bin/env node
/*
 Validates (and can fix) the language bar on wiki pages.
 Checks that the first line starts with the globe bar and that links are absolute
 and point to the expected EN/IT/DE/zh-CN pages for that filename.
 Usage:
   node scripts/validate-wiki-languagebar.js           # report only
   node scripts/validate-wiki-languagebar.js --fix     # update files in-place
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WIKI_DIR = path.resolve(ROOT, '..', 'node-red-contrib-knx-ultimate.wiki');
const ABS_PREFIX = 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/';

const fix = process.argv.includes('--fix');

function listMarkdown(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listMarkdown(p));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function deriveBaseTitle(filename) {
  // filename without extension
  let title = path.basename(filename, '.md');
  // strip language prefix
  if (title.startsWith('it-')) title = title.slice(3);
  else if (title.startsWith('de-')) title = title.slice(3);
  else if (title.startsWith('zh-CN-')) title = title.slice('zh-CN-'.length);
  return title;
}

function toSlug(title) {
  return title.replace(/ /g, '+');
}

function expectedLinks(filename) {
  const base = deriveBaseTitle(filename);
  const slugEN = toSlug(base);
  const slugIT = 'it-' + slugEN;
  const slugDE = 'de-' + slugEN;
  const slugZH = 'zh-CN-' + slugEN;
  return {
    EN: ABS_PREFIX + slugEN,
    IT: ABS_PREFIX + slugIT,
    DE: ABS_PREFIX + slugDE,
    ZH: ABS_PREFIX + slugZH,
  };
}

function buildBar(filename) {
  const e = expectedLinks(filename);
  return `🌐 Language: [EN](${e.EN}) | [IT](${e.IT}) | [DE](${e.DE}) | [简体中文](${e.ZH})`;
}

function validateFile(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  if (!lines.length) return null;
  const first = lines[0];
  if (!first.startsWith('🌐 Language:')) {
    return { file, status: 'missing', message: 'Missing language bar' };
  }
  const want = buildBar(file);
  const ok = first === want;
  return { file, status: ok ? 'ok' : 'mismatch', message: ok ? '' : 'Bar differs from expected', expected: want, current: first };
}

function shouldSkip(file) {
  const rel = path.relative(WIKI_DIR, file);
  if (rel.startsWith('samples/')) return true; // sample pages are English-only
  const base = path.basename(file);
  if (base === '_Sidebar.md' || base === '_Footer.md') return true; // wiki scaffolding
  return false;
}

const files = listMarkdown(WIKI_DIR).filter(f => !shouldSkip(f));
let missing = 0, mismatches = 0, fixed = 0;
for (const f of files) {
  const res = validateFile(f);
  if (!res) continue;
  if (res.status === 'ok') continue;
  if (res.status === 'missing') {
    missing++;
    if (fix) {
      const content = fs.readFileSync(f, 'utf8');
      const updated = buildBar(f) + '\n' + content;
      fs.writeFileSync(f, updated, 'utf8');
      fixed++;
    } else {
      console.log(`[MISSING] ${path.relative(WIKI_DIR, f)}`);
    }
  } else if (res.status === 'mismatch') {
    mismatches++;
    if (fix) {
      const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
      lines[0] = res.expected;
      fs.writeFileSync(f, lines.join('\n'), 'utf8');
      fixed++;
    } else {
      console.log(`[MISMATCH] ${path.relative(WIKI_DIR, f)}`);
      console.log(`  current: ${res.current}`);
      console.log(`  expected: ${res.expected}`);
    }
  }
}

console.log(`Checked ${files.length} files. Missing: ${missing}, Mismatches: ${mismatches}${fix ? `, Fixed: ${fixed}` : ''}.`);
