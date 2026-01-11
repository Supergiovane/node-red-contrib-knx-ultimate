---
layout: wiki
title: "KNX Monitor (sidebar)"
lang: en
permalink: /wiki/KNX-Monitor-Sidebar
---

The **KNX Monitor** sidebar tab shows a live table of KNX Group Addresses and their values.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-monitor.png" alt="KNX Monitor sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## What it is for

- Monitor live traffic/value changes in a quick table view.
- Filter by GA, device name, or value.
- Toggle boolean datapoints directly from the table (when the current value is boolean).

## Requirements

- At least one `knxUltimate-config` node in the current flow (to pick a gateway).

## Enabled by

This tab is provided by the Node-RED plugin:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- File: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
