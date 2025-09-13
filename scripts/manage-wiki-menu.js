#!/usr/bin/env node
/*
 Interactive helper to add a page link to the header menu config (wiki-menu.json).
 - Prompts for base English page title (exact wiki page title, e.g., "Quick-Start")
 - Prompts for target section (existing or new)
 - Optionally creates a new section with labels per language
 - Optionally customizes item labels per language (otherwise uses EN for all)
 - Writes scripts/wiki-menu.json; then run: npm run wiki:inject-header
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const translate = require('translate-google');

// Paths
const REPO = process.cwd();
const WIKI_DIR = path.resolve(REPO, '..', 'node-red-contrib-knx-ultimate.wiki');
const NODES_DIR = path.join(REPO, 'nodes');

const CFG_PATH = path.join(__dirname, 'wiki-menu.json');

function loadCfg() {
  return JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
}
function saveCfg(cfg) {
  fs.writeFileSync(CFG_PATH, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
}

function ask(rl, q) {
  return new Promise(res => rl.question(q, a => res(a.trim())));
}

async function run() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const cfg = loadCfg();

  console.log('Add page to wiki menu');
  const page = await ask(rl, 'Page title (EN, exact wiki title, e.g., "Quick-Start"): ');
  if (!page) { rl.close(); return; }

  console.log('\nChoose section:');
  cfg.sections.forEach((s, i) => console.log(`  ${i+1}) ${s.labels.en} [key=${s.key}]`));
  console.log(`  n) New section`);
  const sel = await ask(rl, 'Your choice: ');

  let section;
  if (sel.toLowerCase() === 'n') {
    const key = await ask(rl, 'New section key (e.g., gettingStarted): ');
    const en = await ask(rl, 'New section label EN: ');
    // If other labels are left empty, auto-translate from EN
    let it = await ask(rl, 'New section label IT (leave empty to auto-translate): ');
    let de = await ask(rl, 'New section label DE (leave empty to auto-translate): ');
    let zh = await ask(rl, 'New section label ZH (leave empty to auto-translate): ');
    const auto = async (val, lang) => val || await translate(en, { to: lang }).catch(() => en);
    it = await auto(it, 'it');
    de = await auto(de, 'de');
    zh = await auto(zh, 'zh-CN');
    section = { key, labels: { en, it, de, zh }, items: [] };
    cfg.sections.push(section);
  } else {
    const idx = parseInt(sel, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= cfg.sections.length) {
      console.error('Invalid selection.');
      rl.close();
      return;
    }
    section = cfg.sections[idx];
  }

  const custom = (await ask(rl, 'Custom labels per language? (y/N): ')).toLowerCase() === 'y';
  let labels = { en: page, it: page, de: page, zh: page };
  if (custom) {
    const enLabel = await ask(rl, 'Label EN: ');
    let itLabel = await ask(rl, 'Label IT (leave empty to auto-translate): ');
    let deLabel = await ask(rl, 'Label DE (leave empty to auto-translate): ');
    let zhLabel = await ask(rl, 'Label ZH (leave empty to auto-translate): ');
    const auto = async (val, lang) => val || await translate(enLabel || page, { to: lang }).catch(() => enLabel || page);
    itLabel = await auto(itLabel, 'it');
    deLabel = await auto(deLabel, 'de');
    zhLabel = await auto(zhLabel, 'zh-CN');
    labels = { en: enLabel || page, it: itLabel, de: deLabel, zh: zhLabel };
  }

  // Avoid duplicates
  if (section.items.some(i => i.type === 'page' && i.page === page)) {
    console.log('Item already exists in that section.');
    rl.close();
    return;
  }

  section.items.push({ type: 'page', labels, page });
  saveCfg(cfg);
  rl.close();
  console.log('Saved. Now run: npm run wiki:inject-header');
  try {
    // Also generate localized node help files, if this wiki page maps to a node help
    generateLocalizedHelpForPage(page);
  } catch (e) {
    console.warn('Help generation skipped:', e.message);
  }
}

run();

// ---- Helpers to generate localized help files from wiki pages ----

// Map node help-name -> wiki page title
const HELP_TO_WIKI = new Map([
  ['hue-config', 'HUE Bridge configuration'],
  ['knxUltimate-config', 'Gateway-configuration'],
  ['knxUltimate', 'KNX Node Configuration'],
  ['knxUltimateLogger', 'Logger-Configuration'],
  ['knxUltimateGlobalContext', 'GlobalVariable'],
  ['knxUltimateWatchDog', 'WatchDog-Configuration'],
  ['knxUltimateAlerter', 'Alerter-Configuration'],
  ['knxUltimateLoadControl', 'LoadControl-Configuration'],
  ['knxUltimateSceneController', 'SceneController-Configuration'],
  ['knxUltimateViewer', 'knxUltimateViewer'],
  ['knxUltimateAutoResponder', 'KNXAutoResponder'],
  ['knxUltimateHATranslator', 'HATranslator'],
  ['knxUltimateHueLight', 'HUE Light'],
  ['knxUltimateHueBattery', 'HUE Battery'],
  ['knxUltimateHueButton', 'HUE Button'],
  ['knxUltimateHueContactSensor', 'HUE Contact sensor'],
  ['knxUltimateHuedevice_software_update', 'HUE Device software update'],
  ['knxUltimateHueLightSensor', 'HUE Light sensor'],
  ['knxUltimateHueMotion', 'HUE Motion'],
  ['knxUltimateHueScene', 'HUE Scene'],
  ['knxUltimateHueTapDial', 'HUE Tapdial'],
  ['knxUltimateHueTemperatureSensor', 'HUE Temperature sensor'],
  ['knxUltimateHueZigbeeConnectivity', 'HUE Zigbee connectivity'],
  ['knxUltimateHueContactSensor', 'HUE Contact sensor'],
  ['knxUltimateGarageDoorBarrierOpener', null], // no wiki page
]);

// Build inverse map: wiki title -> help-name
const WIKI_TO_HELP = (() => {
  const m = new Map();
  for (const [help, wiki] of HELP_TO_WIKI.entries()) {
    if (wiki) m.set(wiki, help);
  }
  return m;
})();

const LANGS = [
  { key: 'en', dir: 'en-US', prefix: '' },
  { key: 'it', dir: 'it-IT', prefix: 'it-' },
  { key: 'de', dir: 'de-DE', prefix: 'de-' },
  { key: 'zh', dir: 'zh-CN', prefix: 'zh-CN-' },
];

function extractWikiContent(md) {
  if (!md) return null;
  const lines = md.split(/\r?\n/);
  let i = 0;
  if (lines[i] && lines[i].startsWith('🌐 Language:')) i++;
  while (i < lines.length && lines[i].trim() !== '---') i++;
  if (i < lines.length && lines[i].trim() === '---') i++;
  return lines.slice(i).join('\n').trim();
}

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }

function writeLocaleHelp(destDir, helpName, content) {
  if (!content) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const out = `<script type="text/markdown" data-help-name="${helpName}">\n${content}\n</script>\n`;
  fs.writeFileSync(path.join(destDir, `${helpName}.html`), out, 'utf8');
}

function generateLocalizedHelpForPage(wikiTitle) {
  const helpName = WIKI_TO_HELP.get(wikiTitle);
  if (!helpName) {
    console.log(`No node help mapping for wiki page: ${wikiTitle}`);
    return;
  }
  for (const lang of LANGS) {
    const wikiFile = path.join(WIKI_DIR, `${lang.prefix}${wikiTitle}.md`);
    const md = readFileSafe(wikiFile);
    const content = extractWikiContent(md || '');
    if (!content) continue;
    const destDir = path.join(NODES_DIR, 'locales', lang.dir);
    writeLocaleHelp(destDir, helpName, content);
  }
  console.log(`Localized help updated for node '${helpName}' from wiki page '${wikiTitle}'.`);
}
