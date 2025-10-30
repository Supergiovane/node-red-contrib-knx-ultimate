Wiki Maintenance — Scripts and Workflow

This document explains how to maintain the GitHub Wiki for node-red-contrib-knx-ultimate using the helper scripts included in this repo.

Where things live
- Wiki repo: ../node-red-contrib-knx-ultimate.wiki
- Scripts: scripts/*
- Menu config: scripts/wiki-menu.json

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
- Inject header: `npm run wiki:inject-header`
  - Inserts/updates a localized navigation header between `<!-- NAV START -->` and `<!-- NAV END -->` right after the language bar on every page.
  - The header includes all sections and links defined in `scripts/wiki-menu.json` and uses localized labels for EN/IT/DE/zh‑CN.
- Add menu item (interactive): `npm run wiki:menu-add`
  - Prompts for a page (EN title, e.g., `Quick-Start`) and the target section.
  - Optionally creates a new section; if localized labels are left empty, auto‑translates from EN.
  - After saving, run `npm run wiki:inject-header` to propagate into all pages.
  - Also generates/updates the localized Node‑RED help files (see below) if the page maps to a node.
- Translate pages: `npm run translate-wiki`
  - Scans the wiki for base EN pages (no `it-`, `de-`, `zh-CN-` prefix) and creates missing translations.
  - Preserves code blocks, keeps URLs intact, and emits an absolute-URL language bar.
  - After translation, run `npm run wiki:inject-header` to add the localized header.
- Export node help to wiki: `npm run wiki:help-export`
  - Reads every localized help snippet under `nodes/locales/<lang>/<help-name>.html`.
  - Rewrites the matching `docs/wiki/<lang><Title>.md` keeping the language bar and any existing navigation block intact.
  - Run `npm run wiki:inject-header` afterwards so the header reflects the latest menu configuration.
- Sync GitHub Pages site: `npm run docs:sync`
  - Copies the entire wiki into `docs/wiki/` and rewrites links so the site can be published via GitHub Pages.
  - Run this after updating the wiki repository so `docs/` stays in sync before committing.
- Refresh everything: `npm run wiki:refresh`
  - Convenience shortcut that runs `wiki:help-export`, `wiki:inject-header`, and `docs:sync` in sequence.

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
- scripts/inject-wiki-header.js: generates the per‑page navigation header from `wiki-menu.json` (idempotent).
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
4) Inject/update headers on all pages
   - Run: `npm run wiki:inject-header`
   - Each page gets the full, localized header reflecting your menu changes.
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
- Language bar: first line of each page. Scripts will normalize it to absolute links: EN, IT (`it-`), DE (`de-`), zh‑CN (`zh-CN-`).
- Header placement: inserted right below the language bar. Do not edit between the NAV markers; regenerate instead.
- Samples: most sample pages exist only in EN. The menu uses absolute URLs for these.
- Sidebar: a minimal `_Sidebar.md` exists with only language home links; the full navigation is in the per‑page header.

Troubleshooting
- Header not updated: ensure `scripts/wiki-menu.json` contains the page (type:"page" and correct `page` title). Then run `npm run wiki:inject-header`.
- Wrong/missing translations: re‑run `npm run translate-wiki` after adjusting the EN page. The script doesn’t overwrite existing translations; delete a specific translated file to force regeneration.
- Language bar still relative on GitHub: run `npm run wiki:fix-langbar` and push the wiki repo.
 - Migrate node help: `npm run wiki:help-migrate`
   - One‑shot migration of inline help blocks from `nodes/*.html` to localized files in `nodes/locales/<lang>/<help-name>.html` using wiki content as source (fallback to inline text if wiki page is missing).
