---
layout: wiki
title: "KNX-Debug-Sidebar"
lang: en
permalink: /wiki/KNX-Debug-Sidebar
---
The **KNX Debug** sidebar tab shows a live log view of KNX Ultimate internal debug entries.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-debug.png" alt="KNX Debug sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## What it is for

- Quickly inspect what KNX Ultimate is doing (errors, warnings, info, debug).
- Auto refresh + copy to clipboard.

## Enabled by

This tab is provided by the Node-RED plugin:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- File: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
