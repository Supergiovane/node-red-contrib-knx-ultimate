---
layout: wiki
title: "KNX-AI-Sidebar"
lang: de
permalink: /wiki/de-KNX-AI-Sidebar
---
Der **KNX AI** Sidebar-Tab zeigt Live-Infos deiner **KNX AI Nodes**: Summary, Anomalien und einen Chat für Fragen zum KNX-Traffic.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Zweck

- Summary des ausgewählten `knxUltimateAI` Nodes anzeigen.
- Erkannte Anomalien prüfen.
- Fragen im Chat stellen (Antworten werden als Markdown gerendert).

## Voraussetzungen

- Mindestens ein `knxUltimateAI` Node im Flow.
- Der ausgewählte `knxUltimateAI` Node muss an ein `knxUltimate-config` Gateway gebunden sein.
- Für LLM-Antworten im Chat: LLM im `knxUltimateAI` Node aktivieren und dort den API-Key konfigurieren.

## Aktiviert durch

Dieser Tab wird durch das Node-RED Plugin bereitgestellt:

- `package.json` → `node-red.plugins.knxUltimateAISidebar`
- Datei: `nodes/plugins/knxUltimateAI-sidebar-plugin.html`

