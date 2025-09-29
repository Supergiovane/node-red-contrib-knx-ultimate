#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO = process.cwd();
const WIKI_DIR = path.resolve(REPO, '..', 'node-red-contrib-knx-ultimate.wiki');
const NODES_DIR = path.join(REPO, 'nodes');

const LANGS = [
  { key: 'en', dir: 'en-US', prefix: '' },
  { key: 'it', dir: 'it-IT', prefix: 'it-' },
  { key: 'de', dir: 'de-DE', prefix: 'de-' },
  { key: 'fr', dir: 'fr', prefix: 'fr-' },
  { key: 'es', dir: 'es-ES', prefix: 'es-' },
  { key: 'es', dir: 'es', prefix: 'es-' },
  { key: 'zh', dir: 'zh-CN', prefix: 'zh-CN-' },
];

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
  ['knxUltimateHueHumiditySensor', 'HUE Humidity sensor'],
  ['knxUltimateHueCameraMotion', 'HUE Camera motion'],
  ['knxUltimateHuePlug', 'HUE Plug'],
]);

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (err) {
    return null;
  }
}

function extractWikiContent(md) {
  if (!md) return null;
  const lines = md.split(/\r?\n/);
  let i = 0;
  if (lines[i] && lines[i].startsWith('🌐 Language:')) i++;
  let navStart = -1;
  let navEnd = -1;
  for (let idx = i; idx < lines.length; idx++) {
    if (lines[idx].trim() === '<!-- NAV START -->') navStart = idx;
    if (lines[idx].trim() === '<!-- NAV END -->') { navEnd = idx; break; }
  }
  if (navStart !== -1 && navEnd !== -1 && navEnd > navStart) {
    i = navEnd + 1;
  }
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && lines[i].trim() === '---') i++;
  while (i < lines.length && lines[i].trim() === '') i++;
  const body = lines.slice(i).join('\n').trim();
  if (!body.length) return null;
  return normalizeSpacing(body);
}

function writeLocaleHelp(destDir, helpName, content) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const html = `<script type="text/markdown" data-help-name="${helpName}">\n${content}\n</script>\n`;
  fs.writeFileSync(path.join(destDir, `${helpName}.html`), html, 'utf8');
}

function normalizeSpacing(body) {
  const lines = body.split(/\n/);
  const out = [];
  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];
    const trimmed = line.trim();
    if (trimmed.startsWith('|')) {
      const prevRaw = out.length ? out[out.length - 1] : '';
      const prevTrim = prevRaw.trim();
      if (prevTrim !== '' && !prevTrim.startsWith('|')) out.push('');
    }
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function updateHelp() {
  let updated = 0;
  for (const [helpName, wikiTitle] of HELP_TO_WIKI.entries()) {
    for (const lang of LANGS) {
      const wikiFile = path.join(WIKI_DIR, `${lang.prefix}${wikiTitle}.md`);
      const md = readFileSafe(wikiFile);
      const content = extractWikiContent(md || '');
      if (!content) continue;
      const destDir = path.join(NODES_DIR, 'locales', lang.dir);
      writeLocaleHelp(destDir, helpName, content);
      updated++;
    }
  }
  console.log(`Updated ${updated} localized help files from wiki.`);
}

updateHelp();
