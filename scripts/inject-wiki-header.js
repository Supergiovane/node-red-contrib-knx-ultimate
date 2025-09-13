#!/usr/bin/env node
/*
 Injects/updates a compact navigation header below the language bar on every wiki page.
 The header is localized based on filename prefix: it- / de- / zh-CN- / (default EN).
 It is wrapped between markers so it can be updated idempotently:
   <!-- NAV START -->
   ... one-line header ...
   <!-- NAV END -->
 Insertion point: right after the language bar and before the first '---' separator when present.
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WIKI_DIR = path.resolve(ROOT, '..', 'node-red-contrib-knx-ultimate.wiki');
const ABS = 'https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/';

function listMarkdown(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listMarkdown(p));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function detectLang(fileBase) {
  if (fileBase.startsWith('it-')) return 'it';
  if (fileBase.startsWith('de-')) return 'de';
  if (fileBase.startsWith('zh-CN-')) return 'zh';
  return 'en';
}

function slugify(title) { return title.replace(/ /g, '+'); }

function pageUrl(lang, title) {
  const slug = slugify(title);
  const pref = lang === 'en' ? '' : (lang === 'zh' ? 'zh-CN-' : lang + '-');
  return ABS + pref + slug;
}

const LABELS = {
  en: {
    nav: 'Navigation', home: 'Home', knx: 'KNX', gateway: 'Gateway', node: 'Node', hue: 'HUE', bridge: 'Bridge', light: 'Light', faq: 'FAQ', sec: 'Security',
  },
  it: {
    nav: 'Navigazione', home: 'Home', knx: 'KNX', gateway: 'Gateway', node: 'Nodo', hue: 'HUE', bridge: 'Bridge', light: 'Luce', faq: 'FAQ', sec: 'Sicurezza',
  },
  de: {
    nav: 'Navigation', home: 'Startseite', knx: 'KNX', gateway: 'Gateway', node: 'Knoten', hue: 'HUE', bridge: 'Bridge', light: 'Licht', faq: 'FAQ', sec: 'Sicherheit',
  },
  zh: {
    nav: '导航', home: '首页', knx: 'KNX', gateway: '网关', node: '设备', hue: 'HUE', bridge: 'Bridge', light: '灯', faq: '常见问题', sec: '安全',
  },
};

function buildHeader(lang) {
  const L = LABELS[lang];
  // Titles of target pages
  const linkHome = pageUrl(lang, 'Home');
  const linkGate = pageUrl(lang, 'Gateway-configuration');
  const linkNode = pageUrl(lang, 'KNX Node Configuration');
  const linkHueB = pageUrl(lang, 'HUE Bridge configuration');
  const linkHueL = pageUrl(lang, 'HUE Light');
  const linkFAQ = pageUrl(lang, 'FAQ-Troubleshoot');
  const linkSEC = pageUrl(lang, 'SECURITY');
  return `${L.nav}: [${L.home}](${linkHome}) | ${L.knx}: [${L.gateway}](${linkGate}), [${L.node}](${linkNode}) | ${L.hue}: [${L.bridge}](${linkHueB}), [${L.light}](${linkHueL}) | [${L.faq}](${linkFAQ}) | [${L.sec}](${linkSEC})`;
}

function updateFile(file) {
  const base = path.basename(file);
  if (base === '_Sidebar.md' || base === '_Footer.md') return false;
  const lang = detectLang(base);
  const header = buildHeader(lang);
  const NAV_START = '<!-- NAV START -->';
  const NAV_END = '<!-- NAV END -->';

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  if (!lines.length) return false;
  if (!lines[0].startsWith('🌐 Language:')) return false; // enforce language bar presence

  // If header exists, replace block
  const startIdx = lines.findIndex(l => l.trim() === NAV_START);
  const endIdx = lines.findIndex(l => l.trim() === NAV_END);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const prev = lines.slice(startIdx + 1, endIdx).join('\n');
    if (prev.trim() === header.trim()) return false; // no change
    lines.splice(startIdx, endIdx - startIdx + 1, NAV_START, header, NAV_END);
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    return true;
  }

  // Insert below language bar and before first '---' separator when present
  let insertAt = 1;
  const sepIdx = lines.slice(1, 6).findIndex(l => l.trim() === '---');
  if (sepIdx !== -1) insertAt = 1 + sepIdx; // place right before the '---'

  lines.splice(insertAt, 0, NAV_START, header, NAV_END);
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  return true;
}

const files = listMarkdown(WIKI_DIR);
let changed = 0, skipped = 0;
for (const f of files) {
  try {
    if (updateFile(f)) changed++; else skipped++;
  } catch (e) {
    console.error('Error processing', f, e.message);
  }
}
console.log(`Header injected/updated in ${changed} pages. Unchanged/skipped: ${skipped}.`);

