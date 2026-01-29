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
- Fragen im Chat stellen (Antworten werden als Markdown gerendert), um Fehler schneller einzugrenzen.

## So benutzt du es

1. `knxUltimateAI` Node im Dropdown auswählen.
2. **Refresh Summary** klicken (oder **Auto** aktivieren).
3. Im Chat gezielt nach Ursachen und nächsten Prüfschritten fragen.

## Beispiel-Szenarien (ohne Code)

- **Loop / doppelte Telegramme:** Ursachen eingrenzen und die Quelle isolieren.
- **„Lauter“ GA:** warum ist ein GA Top‑Talker, welche Quellen schreiben darauf?
- **Unerwartetes Verhalten nach Deploy:** was hat sich in den letzten Minuten geändert, welche Pattern sind neu?
- **Routing/Bridging:** wie filtern/umschreiben, um Storms und Feedback‑Loops zu vermeiden?

## Beispiel-Fragen für den Chat

- „Warum ist `2/4/2` so aktiv? Was sind die wahrscheinlichsten Ursachen?“
- „Siehst du Loop‑Pattern zwischen zwei Group Addresses?“
- „Welche physikalischen Quellen schreiben auf `x/y/z` und wie oft?“
- „Welche Filter im Router Filter stoppen den Spam, ohne normale Telegramme zu blockieren?“

## Voraussetzungen

- Mindestens ein `knxUltimateAI` Node im Flow.
- Der ausgewählte `knxUltimateAI` Node muss an ein `knxUltimate-config` Gateway gebunden sein.
- Für LLM-Antworten im Chat: LLM im `knxUltimateAI` Node aktivieren und dort den API-Key konfigurieren.
