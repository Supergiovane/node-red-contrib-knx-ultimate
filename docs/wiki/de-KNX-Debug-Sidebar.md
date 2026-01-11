---
layout: wiki
title: "KNX Debug (Sidebar)"
lang: de
permalink: /wiki/de-KNX-Debug-Sidebar
---

Der Sidebar-Tab **KNX Debug** zeigt eine Live-Logansicht der internen Debug-Einträge von KNX Ultimate.

<img src="{{ '/img/wiki/knx-debug.png' | relative_url }}" alt="KNX Debug sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Zweck

- Schnell sehen, was KNX Ultimate macht (Fehler, Warnungen, Info, Debug).
- Auto-Refresh + in die Zwischenablage kopieren.

## Aktivierung

Bereitgestellt durch das Node-RED Plugin:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- Datei: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`

