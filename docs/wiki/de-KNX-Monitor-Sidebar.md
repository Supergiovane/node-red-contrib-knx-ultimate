---
layout: wiki
title: "KNX-Monitor-Sidebar"
lang: de
permalink: /wiki/de-KNX-Monitor-Sidebar
---
Der Sidebar-Tab **KNX Monitor** zeigt eine Live-Tabelle von KNX Gruppenadressen und ihren Werten.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-monitor.png" alt="KNX Monitor sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Zweck

- Live-Überwachung von Wertänderungen in einer Tabellenansicht.
- Filtern nach GA, Gerätename oder Wert.
- Boolesche Werte direkt in der Tabelle umschalten (wenn der aktuelle Wert boolesch ist).

## Voraussetzungen

- Mindestens ein `knxUltimate-config`-Knoten im aktuellen Flow (zur Gateway-Auswahl).

## Aktivierung

Bereitgestellt durch das Node-RED Plugin:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- Datei: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
