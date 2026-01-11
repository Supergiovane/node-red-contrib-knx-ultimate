---
layout: wiki
title: "KNX Debug (barra lateral)"
lang: es
permalink: /wiki/es-KNX-Debug-Sidebar
---

La pestaña **KNX Debug** en la barra lateral muestra una vista en tiempo real del log interno de KNX Ultimate.

<img src="{{ '/img/wiki/knx-debug.png' | relative_url }}" alt="KNX Debug sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Para qué sirve

- Ver rápidamente qué está haciendo KNX Ultimate (errores, avisos, info, debug).
- Auto refresh + copiar al portapapeles.

## Activación

Lo proporciona el plugin de Node-RED:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- Archivo: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`

