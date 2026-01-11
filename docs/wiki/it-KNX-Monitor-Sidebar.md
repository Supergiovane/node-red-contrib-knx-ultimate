---
layout: wiki
title: "KNX Monitor (sidebar)"
lang: it
permalink: /wiki/it-KNX-Monitor-Sidebar
---

La tab **KNX Monitor** nella sidebar mostra una tabella live degli Indirizzi di Gruppo KNX e dei relativi valori.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-monitor.png" alt="KNX Monitor sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## A cosa serve

- Monitorare in tempo reale cambi/telegrammi in una vista tabellare.
- Filtrare per GA, nome dispositivo o valore.
- Fare toggle dei booleani direttamente dalla tabella (se il valore corrente è booleano).

## Requisiti

- Almeno un nodo `knxUltimate-config` nel flow corrente (per selezionare un gateway).

## Come viene abilitato

La tab è fornita dal plugin Node-RED:

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- File: `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
