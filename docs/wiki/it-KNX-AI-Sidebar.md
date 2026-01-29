---
layout: wiki
title: "KNX-AI-Sidebar"
lang: it
permalink: /wiki/it-KNX-AI-Sidebar
---
La tab **KNX AI** nella sidebar mostra in tempo reale lo stato dei tuoi nodi **KNX AI**: summary, anomalie e una chat per fare domande sul traffico KNX.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## A cosa serve

- Leggere velocemente la summary prodotta dal nodo `knxUltimateAI` selezionato.
- Controllare le anomalie rilevate.
- Fare domande in chat (le risposte vengono renderizzate in Markdown).

## Requisiti

- Almeno un nodo `knxUltimateAI` nei tuoi flow.
- Il nodo `knxUltimateAI` selezionato deve essere collegato ad un gateway `knxUltimate-config`.
- Per le risposte LLM in chat: abilita l’LLM nel nodo `knxUltimateAI` e configura lì le credenziali (API key).

## Come viene abilitato

La tab è fornita dal plugin Node-RED:

- `package.json` → `node-red.plugins.knxUltimateAISidebar`
- File: `nodes/plugins/knxUltimateAI-sidebar-plugin.html`

