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
}

run();
