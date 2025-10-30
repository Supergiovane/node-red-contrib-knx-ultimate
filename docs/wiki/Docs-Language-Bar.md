---
layout: wiki
title: "Docs-Language-Bar"
lang: en
permalink: /wiki/Docs-Language-Bar
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Docs-Language-Bar) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Docs-Language-Bar) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)
---
<h1><p align='center'>Wiki Language Bar — How To</p></h1>
Use this pattern to add the language switch to wiki pages and keep naming consistent across translations.
Guidelines
- Filenames: base EN page, then prefix for other languages: `it-`, `de-`, `zh-CN-` (e.g., `HUE Light.md`, `it-HUE Light.md`).
- First line (required): add the language bar with the globe icon and links to the four variants.
- Separator: add `---` on the next line, then a blank line, then the page content.
- Links: use absolute wiki URLs. Spaces become `+` in URLs (e.g., `HUE Light` → `HUE+Light`).
- New pages: if a translation is not yet available, you may temporarily keep only the EN page published; add other files when ready.
Snippet
- Put this at the very top of each page, replacing `Page Title` with the wiki filename without extension:
  - `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
  - `---`
Conventions
- HUE node pages: sections should follow `General`, `Mapping`, `Outputs`, `Details`.
- Use consistent DPT notations (e.g., `DPT 3.007`, `DPT 5.001`, `DPT 9.001`).
- Keep product names and brands unchanged (e.g., HUE, KNX).
Maintainers
- Validate all pages: `npm run wiki:validate`
- Auto-fix language bars to absolute URLs: `npm run wiki:fix-langbar`
- Notes: `_Sidebar.md`, `_Footer.md`, and pages under `samples/` are excluded from validation.
