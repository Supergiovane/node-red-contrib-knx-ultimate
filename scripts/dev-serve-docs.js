#!/usr/bin/env node

/**
 * Lightweight documentation preview server that mimics the GitHub Pages baseurl.
 * It turns docs/index.md into docs/_site/index.html (no Jekyll required)
 * and serves everything from docs/_site at http://127.0.0.1:4000/node-red-contrib-knx-ultimate/.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const marked = require('marked');
const yaml = require('js-yaml');

const PORT = Number(process.env.DOCS_PREVIEW_PORT || 4000);
const BASE_URL = '/node-red-contrib-knx-ultimate';
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const SITE_DIR = path.join(DOCS_DIR, '_site');
const TEMPLATE_FILE = path.join(__dirname, 'dev-serve-template.html');
const LANG_FILE = path.join(DOCS_DIR, '_data', 'languages.yml');
const TRANSLATIONS_FILE = path.join(DOCS_DIR, '_data', 'translations.yml');
const NAV_FILE = path.join(DOCS_DIR, '_data', 'wiki-nav.json');
const ASSETS_SOURCE = path.join(DOCS_DIR, 'assets');
const ASSETS_TARGET = path.join(SITE_DIR, 'assets');
const WIKI_DIR = path.join(DOCS_DIR, 'wiki');

let languagesCache = null;
let translationsCache = null;
let navCache = null;
let templateCache = null;
let navUrlCache = null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function parseFrontMatter(source) {
  const lines = source.split(/\r?\n/);
  if (lines[0] !== '---') {
    return { data: {}, body: source };
  }
  let idx = 1;
  while (idx < lines.length && lines[idx] !== '---') {
    idx += 1;
  }
  const fm = lines.slice(1, idx).join('\n');
  const body = lines.slice(idx + 1).join('\n');
  let data = {};
  try {
    data = yaml.load(fm) || {};
  } catch (err) {
    console.warn('Could not parse front matter:', err);
  }
  return { data, body };
}

async function ensureLandingPages() {
  const entries = await fs.promises.readdir(DOCS_DIR, { withFileTypes: true });
  const render = typeof marked.parse === 'function' ? marked.parse.bind(marked) : marked;
  templateCache = templateCache || await fs.promises.readFile(TEMPLATE_FILE, 'utf8').catch(() => null);
  const template = templateCache;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/^index(.[\w-]+)?\.md$/i.test(entry.name)) continue;

    const filePath = path.join(DOCS_DIR, entry.name);
    const markdown = await fs.promises.readFile(filePath, 'utf8');
    const { data, body } = parseFrontMatter(markdown);
    const html = render(body, {
      headerIds: false,
      mangle: false
    });

    let permalink = typeof data.permalink === 'string' ? data.permalink.trim() : '/';
    if (permalink === '') permalink = '/';
    if (!permalink.startsWith('/')) permalink = `/${permalink}`;
    if (permalink !== '/' && !permalink.endsWith('/')) {
      permalink = `${permalink}/`;
    }

    const relative = permalink === '/' ? '' : permalink.replace(/^\//, '').replace(/\/$/, '');
    const outputDir = relative ? path.join(SITE_DIR, relative) : SITE_DIR;
    const outputFile = path.join(outputDir, 'index.html');

    await fs.promises.mkdir(outputDir, { recursive: true });
    const finalHtml = html.replace(/{{\s*site\.baseurl\s*}}/g, BASE_URL);

    if (template) {
      const lang = (data.lang || 'en').toString();
      const headerHtml = buildHeaderHtml(lang);
      const navHtml = buildSidebarHtml(lang, data.title || 'Docs', permalink);
      const pageHtml = template
        .replace('HEADER_PLACEHOLDER', headerHtml)
        .replace('NAV_PLACEHOLDER', navHtml)
        .replace('CONTENT_PLACEHOLDER', finalHtml);
      await fs.promises.writeFile(outputFile, pageHtml, 'utf8');
    } else {
      await fs.promises.writeFile(outputFile, finalHtml, 'utf8');
    }
    console.log(`Generated ${path.relative(process.cwd(), outputFile)}`);
  }
}

async function copyAssets() {
  async function copyRecursive(src, dest) {
    const stat = await fs.promises.stat(src);
    if (stat.isDirectory()) {
      await fs.promises.mkdir(dest, { recursive: true });
      const entries = await fs.promises.readdir(src);
      for (const entry of entries) {
        await copyRecursive(path.join(src, entry), path.join(dest, entry));
      }
    } else if (stat.isFile()) {
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.copyFile(src, dest);
    }
  }

  try {
    await copyRecursive(ASSETS_SOURCE, ASSETS_TARGET);
    console.log(`Synced assets -> ${path.relative(process.cwd(), ASSETS_TARGET)}`);
  } catch (err) {
    console.warn('Failed to sync docs assets:', err.message);
  }
}

async function ensureWikiPages () {
  async function walk (dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
        continue
      }
      if (!entry.name.endsWith('.md')) continue

      const raw = await fs.promises.readFile(fullPath, 'utf8')
      const { data, body } = parseFrontMatter(raw)
      const render = typeof marked.parse === 'function' ? marked.parse.bind(marked) : marked
      const htmlBody = render(body, {
        headerIds: false,
        mangle: false
      })

      const lang = (data.lang || 'en').toString()
      let permalink = data.permalink || ''
      if (!permalink) {
        const relative = path.relative(WIKI_DIR, fullPath).replace(/\\/g, '/')
        const slug = relative.replace(/\.md$/i, '')
        permalink = `/wiki/${slug}/`
      }
      if (!permalink.endsWith('/')) {
        permalink = `${permalink}/`
      }

      templateCache = templateCache || await fs.promises.readFile(TEMPLATE_FILE, 'utf8').catch(() => null)
      if (!templateCache) {
        continue
      }
      const headerHtml = buildHeaderHtml(lang)
      const navHtml = buildSidebarHtml(lang, data.title || 'Docs', permalink)
      const pageHtml = templateCache
        .replace('HEADER_PLACEHOLDER', headerHtml)
        .replace('NAV_PLACEHOLDER', navHtml)
        .replace('CONTENT_PLACEHOLDER', htmlBody)

      const outputDir = path.join(SITE_DIR, permalink.replace(/^\//, ''))
      await fs.promises.mkdir(outputDir, { recursive: true })
      const outputFile = path.join(outputDir, 'index.html')
      await fs.promises.writeFile(outputFile, pageHtml, 'utf8')
      console.log(`Rendered wiki page -> ${path.relative(process.cwd(), outputFile)}`)
    }
  }

  if (fs.existsSync(WIKI_DIR)) {
    await walk(WIKI_DIR)
  }
}

function buildHeaderHtml (lang) {
  const taglines = {
    en: 'Node-RED meets KNX',
    it: 'Node-RED incontra KNX',
    de: 'Node-RED trifft KNX',
    fr: 'Node-RED rencontre KNX',
    es: 'Node-RED se encuentra con KNX',
    'zh-CN': 'Node-RED 与 KNX 相遇'
  }
  const tagline = taglines[lang] || taglines.en
  const homeHref = `${BASE_URL}/`
  const logoSrc = `${BASE_URL}/logo.png`

  return `<div class="wiki-header">
    <div class="wiki-header__card">
      <div class="wiki-header__logo">
        <a class="wiki-logo" href="${homeHref}">
          <img src="${logoSrc}" alt="KNX Ultimate logo">
        </a>
      </div>
      <div class="wiki-header__tagline">${tagline}</div>
    </div>
  </div>`
}

function loadLanguages() {
  if (!languagesCache) {
    const raw = fs.readFileSync(LANG_FILE, 'utf8');
    languagesCache = yaml.load(raw) || {};
  }
  return languagesCache;
}

function loadTranslations() {
  if (!translationsCache) {
    const raw = fs.readFileSync(TRANSLATIONS_FILE, 'utf8');
    translationsCache = yaml.load(raw) || {};
  }
  return translationsCache;
}

function loadNav() {
  if (!navCache) {
    const raw = fs.readFileSync(NAV_FILE, 'utf8');
    navCache = JSON.parse(raw);
    navUrlCache = collectNavUrls(navCache);
  }
  return navCache;
}

function getNavUrlsForLang(lang) {
  loadNav();
  return navUrlCache.get(lang) || new Set();
}

function normaliseWikiUrl(url) {
  if (!url) return '';
  let normalised = url.trim();
  if (!normalised.startsWith('/')) {
    normalised = `/${normalised}`;
  }
  if (!normalised.endsWith('/')) {
    normalised += '/';
  }
  return normalised;
}

function collectNavUrls(navData) {
  const cache = new Map();
  for (const [lang, sections] of Object.entries(navData)) {
    const urls = new Set();
    (sections || []).forEach((section) => {
      (section.items || []).forEach((item) => {
        if (!item.external && item.url) {
          urls.add(normaliseWikiUrl(item.url));
        }
      });
    });
    cache.set(lang, urls);
  }
  return cache;
}

function buildSidebarHtml(lang, pageTitle, currentUrl) {
  const languages = loadLanguages();
  const translations = loadTranslations();
  const navData = loadNav();

  const langKey = languages[lang] ? lang : Object.keys(languages)[0];
  const languageLabel =
    translations.language_label && translations.language_label[langKey]
      ? translations.language_label[langKey]
      : 'Language';

  const normalizedCurrent = currentUrl === '/' ? '/' : currentUrl.replace(/\/$/, '');
  const isWikiPage = normalizedCurrent.startsWith('/wiki/');
  const currentSlug = isWikiPage ? normalizedCurrent.replace(/^\/wiki\//, '') : '';
  let rootSlug = currentSlug;
  if (isWikiPage) {
    for (const [code, info] of Object.entries(languages)) {
      const prefix = info.prefix || '';
      if (prefix && currentSlug.startsWith(prefix)) {
        rootSlug = currentSlug.slice(prefix.length);
        break;
      }
    }
  }

  const languageLinks = Object.entries(languages)
    .map(([code, info]) => {
      const label = info.short || info.label || code;
      const available = getNavUrlsForLang(code);
      let targetUrl;

      if (!isWikiPage) {
        const homeItem = (navData[code] && navData[code][0] && navData[code][0].items && navData[code][0].items[0]) || null;
        if (homeItem && !homeItem.external) {
          targetUrl = normaliseWikiUrl(homeItem.url);
        } else {
          const prefix = info.prefix || '';
          targetUrl = prefix ? normaliseWikiUrl(`/${prefix}/`) : '/';
        }
      } else {
        const prefix = info.prefix || '';
        const candidateSlug = prefix ? `${prefix}${rootSlug}` : rootSlug;
        targetUrl = normaliseWikiUrl(`/wiki/${candidateSlug}/`);
        if (!available.has(targetUrl) && available.size) {
          const fallback = normaliseWikiUrl(`/wiki/${rootSlug}/`);
          if (available.has(fallback)) {
            targetUrl = fallback;
          } else {
            targetUrl = Array.from(available)[0];
          }
        }
      }

      const href = `${BASE_URL}${targetUrl}`;
      if (code === langKey) {
        return `<span class="wiki-nav__language wiki-nav__language--active">${label}</span>`;
      }
      return `<a class="wiki-nav__language" href="${href}">${label}</a>`;
    })
    .join('');

  const sections = (navData[langKey] || [])
    .map((section, sectionIdx) => {
      let sectionHasActive = false;
      const itemsHtml = (section.items || [])
        .map((item) => {
          if (item.external) {
            return `<li><a class="wiki-nav__link" href="${item.url}" rel="noopener">${item.label}</a></li>`;
          }
          const itemUrlNormalized = normaliseWikiUrl(item.url);
          const href = `${BASE_URL}${itemUrlNormalized}`;
          const isActive = itemUrlNormalized.replace(/\/$/, '') === normalizedCurrent;
          if (isActive) {
            sectionHasActive = true;
          }
          const activeClass = isActive ? ' wiki-nav__link--active' : '';
          return `<li><a class="wiki-nav__link${activeClass}" href="${href}">${item.label}</a></li>`;
        })
        .join('');
      const openAttr = sectionHasActive || sectionIdx === 0 ? ' open' : '';
      return `<details class="wiki-nav__group"${openAttr}>
        <summary>${section.title}</summary>
        <ul class="wiki-nav__list">
          ${itemsHtml}
        </ul>
      </details>`;
    })
    .join('');

  return `<aside class="wiki-sidebar">
    <nav class="wiki-nav">
      <div class="wiki-nav__languages" role="navigation" aria-label="${languageLabel}">
        <span class="wiki-nav__languages-label">🌐 ${languageLabel}</span>
        ${languageLinks}
      </div>
      <div class="wiki-nav__groups">
        ${sections}
      </div>
    </nav>
  </aside>`;
}

function resolveFilePath(requestPath) {
  let localPath = requestPath;

  if (localPath.startsWith(BASE_URL)) {
    localPath = localPath.slice(BASE_URL.length) || '/';
  }

  if (localPath === '/' || localPath === '') {
    localPath = '/index.html';
  } else if (localPath.endsWith('/')) {
    localPath += 'index.html';
  }

  const normalised = path.normalize(localPath).replace(/^(\.\.[/\\])+/, '');
  const absolute = path.join(SITE_DIR, normalised);

  if (!absolute.startsWith(SITE_DIR)) {
    return null;
  }
  return absolute;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

async function handleRequest(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (pathname === '/' && BASE_URL.length) {
    res.writeHead(302, { Location: `${BASE_URL}/` });
    res.end();
    return;
  }

  const filePath = resolveFilePath(pathname);

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) {
      throw new Error('Not a file');
    }
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${pathname}`);
  }
}

(async () => {
  try {
    await ensureLandingPages();
    await copyAssets();
    await ensureWikiPages();
  } catch (err) {
    console.error('Failed to generate docs/_site/index.html');
    console.error(err);
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      console.error('Unexpected error while serving request:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
    });
  });

  server.listen(PORT, '127.0.0.1', () => {
    console.log('');
    console.log('Docs preview server running!');
    console.log(`  Local preview : http://127.0.0.1:${PORT}${BASE_URL}/`);
    console.log('');
  });

  const shutdown = () => {
    console.log('\nShutting down docs preview server.');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
