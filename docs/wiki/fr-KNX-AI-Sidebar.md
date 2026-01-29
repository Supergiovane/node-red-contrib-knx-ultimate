---
layout: wiki
title: "KNX-AI-Sidebar"
lang: fr
permalink: /wiki/fr-KNX-AI-Sidebar
---
L’onglet de barre latérale **KNX AI** affiche en temps réel vos nœuds **KNX AI** : résumé, anomalies et une chat pour poser des questions sur le trafic KNX.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## À quoi ça sert

- Afficher le résumé produit par le nœud `knxUltimateAI` sélectionné.
- Consulter les anomalies détectées.
- Poser des questions via la chat (les réponses sont rendues en Markdown).

## Prérequis

- Au moins un nœud `knxUltimateAI` dans vos flows.
- Le nœud `knxUltimateAI` sélectionné doit être lié à une passerelle `knxUltimate-config`.
- Pour les réponses LLM : activer le LLM dans `knxUltimateAI` et configurer la clé API dans ce nœud.

## Activé par

Cet onglet est fourni par le plugin Node-RED :

- `package.json` → `node-red.plugins.knxUltimateAISidebar`
- Fichier : `nodes/plugins/knxUltimateAI-sidebar-plugin.html`

