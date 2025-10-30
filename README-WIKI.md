Wiki Maintenance — Scripts and Workflow

This document explains how to maintain the GitHub Wiki for node-red-contrib-knx-ultimate using the helper scripts included in this repo.

Where things live
- Wiki repo: ../node-red-contrib-knx-ultimate.wiki
- Scripts: scripts/*
- Menu config: scripts/wiki-menu.json
- GitHub Pages site (Jekyll): docs/

Prerequisites
- Node.js 20+
- The wiki repo checked out next to this repo (as above).
- Internet connectivity (for translation).

NPM scripts
- Validate bars: `npm run wiki:validate`
  - Checks that every page’s first line has a correct language bar with absolute wiki URLs.
  - Excludes `_Sidebar.md`, `_Footer.md`, and files under `samples/`.
- Fix bars: `npm run wiki:fix-langbar`
  - Rewrites language bars to the expected format with absolute URLs.
- Regenerate navigation include: `node scripts/generate-wiki-navbar.js`
  - Reads `scripts/wiki-menu.json` and produces `docs/_data/wiki-nav.json` consumed by the Jekyll layout.
  - Automatically run as part of `npm run wiki:refresh`; invoke manually only when you need to preview changes.
- Add menu item (interactive): `npm run wiki:menu-add`
  - Prompts for a page (EN title, e.g., `Quick-Start`) and the target section.
  - Optionally creates a new section; if localized labels are left empty, auto‑translates from EN.
  - Saves your changes into `scripts/wiki-menu.json` and regenerates localized node help when applicable.
- Translate pages: `npm run translate-wiki`
  - Scans the wiki for base EN pages (no `it-`, `de-`, `zh-CN-` prefix) and creates missing translations.
  - Preserves code blocks, keeps URLs intact, and emits an absolute-URL language bar.
  - Run `npm run wiki:refresh` afterwards to rebuild help pages and navigation.
- Export node help to wiki: `npm run wiki:help-export`
  - Reads every localized help snippet under `nodes/locales/<lang>/<help-name>.html`.
  - Rewrites the matching `docs/wiki/<lang><Title>.md` so GitHub Pages mirrors the Node-RED help.
- Sync GitHub Pages site: `npm run docs:sync`
  - Copies the entire wiki into `docs/wiki/` and rewrites links so the site can be published via GitHub Pages.
  - Run this after updating the wiki repository so `docs/` stays in sync before committing.
- Refresh everything: `npm run wiki:refresh`
  - Runs `wiki:help-export`, regenerates the Jekyll navigation data, ensures front matter is present, and then executes `docs:sync`.

Node help migration and generation
- One‑time migrate (existing nodes): `node scripts/migrate-node-help.js`
  - Finds inline node help blocks in `nodes/*.html` and moves them to localized files under:
    - `nodes/locales/en-US/<help-name>.html`
    - `nodes/locales/it-IT/<help-name>.html`
    - `nodes/locales/de-DE/<help-name>.html`
    - `nodes/locales/zh-CN/<help-name>.html`
  - Content source: corresponding wiki pages (EN/IT/DE/zh‑CN). If a page is missing, uses the inline help as fallback.
  - Removes the inline help from the node HTML file (keeps only templates and editor JS).
- Auto‑generate from wiki when adding menu entries: `npm run wiki:menu-add`
  - If the selected wiki page maps to a node (see mapping), the script will create/update the localized help files as above.

Page ↔ node mapping (for help generation)
- Mapping is defined inside `scripts/manage-wiki-menu.js` (WIKI_TO_HELP/HELP_TO_WIKI).
- Example mappings:
  - `HUE Bridge configuration` → `hue-config`
  - `Gateway-configuration` → `knxUltimate-config`
  - `Device` → `knxUltimate`
  - `Logger-Configuration` → `knxUltimateLogger`
  - … and all HUE/KNX pages listed in the script.
- If you add a brand new node and wiki page, update the mapping in `manage-wiki-menu.js` once; after that, `wiki:menu-add` can generate localized help automatically.

Key files
- scripts/validate-wiki-languagebar.js: verifies and optionally fixes the language bar on each page.
- scripts/generate-wiki-navbar.js: converts `scripts/wiki-menu.json` into the data structure used by the Jekyll include.
- scripts/prepare-wiki-pages.js: strips legacy inline nav blocks and injects front matter so Jekyll can render every page.
- scripts/manage-wiki-menu.js: interactive tool to edit `wiki-menu.json` (add items/sections with auto‑translation) and to generate localized node help files from wiki pages.
- scripts/translate-wiki.js: creates IT/DE/zh‑CN pages from an EN page body.
- scripts/wiki-menu.json: declarative definition of header sections and items. Supports `type: "page"` (localized links) and `type: "url"` (external/absolute links).

Quick start — add a new page to the wiki
1) Create the EN page in the wiki repo
   - Path: ../node-red-contrib-knx-ultimate.wiki
   - Filename: `Your-Page-Title.md` (use spaces as in the displayed title)
   - Top of file: add the language bar (absolute links) or let the scripts generate it later.
2) Generate translations
   - Run: `npm run translate-wiki`
   - This creates `it-Your-Page-Title.md`, `de-Your-Page-Title.md`, `zh-CN-Your-Page-Title.md` if missing.
3) Add the page to the navigation menu
   - Run: `npm run wiki:menu-add`
   - Select an existing section (e.g., Overview, KNX Device, Other KNX Nodes, HUE, Samples) or create a new one.
   - Leave localized labels empty to auto‑translate from EN, or enter your own.
4) Rebuild docs
   - Run: `npm run wiki:refresh`
   - This updates the exported help pages, regenerates the navigation include, injects Jekyll front matter, and syncs `docs/wiki`.
5) (Optional) Validate language bars
   - Run: `npm run wiki:validate`

How to add a new node (with localized help)
1) Create the node as usual under `nodes/`, including editor UI and templates.
   - If you already wrote inline help (`<script type="text/markdown" data-help-name="…">`), you can leave it temporarily; it will be migrated.
2) Create the EN wiki page for that node (e.g., `My Node.md`) with the proper title and content.
   - You can use `npm run translate-wiki` to generate `it-`, `de-`, `zh-CN-` variants if missing.
3) Add the wiki → node mapping (only for brand‑new entries)
   - Edit `scripts/manage-wiki-menu.js` and add a mapping in `HELP_TO_WIKI`, e.g.:
     - `['myNewNode', 'My Node']`
4) Add the page to the menu
   - Run: `npm run wiki:menu-add`, select the section, optionally create a new section, and accept auto‑translation of labels if desired.
   - This will also generate/update localized help files under `nodes/locales/<lang>/<help-name>.html` for the node.
5) (If you started with inline help) Migrate and clean up
   - Run once: `node scripts/migrate-node-help.js` to remove inline help and ensure all nodes use localized help files.
6) Verify in Node‑RED
   - Restart Node‑RED and switch the UI language to see the localized help under the “Info” panel for the node.

Conventions and notes
- Language bar: first line of each page. Scripts will normalize it to absolute links: EN, IT (`it-`), DE (`de-`), zh‑CN (`zh-CN-`). If a translation file is missing, language links fall back to the EN page so readers never hit a 404.
- Navigation: the site-wide navbar is rendered by Jekyll using `docs/_data/wiki-nav.json`. Edit `scripts/wiki-menu.json` (or use `npm run wiki:menu-add`) and run `npm run wiki:refresh` to regenerate it.
- Samples: most sample pages exist only in EN. The menu uses absolute URLs for these.
- Sidebar: a minimal `_Sidebar.md` exists with only language home links; the full navigation is provided by the Jekyll navbar include.

Troubleshooting
- Navbar missing entries: ensure `scripts/wiki-menu.json` contains the page (type:"page" and correct `page` title). Then run `node scripts/generate-wiki-navbar.js` or simply `npm run wiki:refresh`.
- Wrong/missing translations: re‑run `npm run translate-wiki` after adjusting the EN page. The script doesn’t overwrite existing translations; delete a specific translated file to force regeneration.
- Language bar still relative on GitHub: run `npm run wiki:fix-langbar` and push the wiki repo.
- Migrate node help: `npm run wiki:help-migrate`
  - One‑shot migration of inline help blocks from `nodes/*.html` to localized files in `nodes/locales/<lang>/<help-name>.html` using wiki content as source (fallback to inline text if wiki page is missing).
