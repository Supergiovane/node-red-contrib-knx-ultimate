---
layout: wiki
title: "KNX Debug (sidebar)"
lang: it
permalink: /wiki/it-KNX-Debug-Sidebar
---

La tab **KNX Debug** nella sidebar mostra una vista live del log interno di KNX Ultimate.

<img src="{{ '/img/wiki/knx-debug.png' | relative_url }}" alt="KNX Debug sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## A cosa serve

- Capire rapidamente cosa sta facendo KNX Ultimate (errori, warning, info, debug).
- Auto refresh + copia negli appunti.

## Come viene abilitato

La tab è fornita dal plugin Node-RED:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- File: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`

