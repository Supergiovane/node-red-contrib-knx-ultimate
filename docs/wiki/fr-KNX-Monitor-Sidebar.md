---
layout: wiki
title: "KNX Monitor (barre latérale)"
lang: fr
permalink: /wiki/fr-KNX-Monitor-Sidebar
---

L’onglet **KNX Monitor** dans la barre latérale affiche un tableau en temps réel des adresses de groupe KNX et de leurs valeurs.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-monitor.png" alt="KNX Monitor sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## À quoi ça sert

- Surveiller en temps réel les changements de valeurs dans une vue tabulaire.
- Filtrer par GA, nom d’équipement, ou valeur.
- Basculer les booléens directement depuis le tableau (si la valeur courante est booléenne).

## Prérequis

- Au moins un nœud `knxUltimate-config` dans le flow courant (pour choisir une passerelle).

## Activation

Fourni par le plugin Node-RED :

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- Fichier : `nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
