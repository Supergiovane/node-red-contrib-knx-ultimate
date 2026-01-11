---
layout: wiki
title: "KNX Monitor (barra lateral)"
lang: es
permalink: /wiki/es-KNX-Monitor-Sidebar
---

La pestaña **KNX Monitor** en la barra lateral muestra una tabla en tiempo real de direcciones de grupo KNX y sus valores.

<img src="{{ '/img/wiki/knx-monitor.png' | relative_url }}" alt="KNX Monitor sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Para qué sirve

- Monitorizar cambios en tiempo real en una vista de tabla.
- Filtrar por GA, nombre de dispositivo o valor.
- Conmutar valores booleanos desde la tabla (si el valor actual es booleano).

## Requisitos

- Al menos un nodo `knxUltimate-config` en el flujo actual (para seleccionar un gateway).

## Activación

Lo proporciona el plugin de Node-RED:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- Archivo: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`

