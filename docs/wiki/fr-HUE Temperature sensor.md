---
layout: wiki
title: "HUE Temperature sensor"
lang: fr
permalink: /wiki/fr-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)

Ce nœud lit la température (° C) à partir d'un capteur de température de teinte et le mappe à Knx. 

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez le pont Hue à utiliser |
|Capteur de teinte |Capteur de température de la teinte (Ambordage automatique pendant la saisie) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Temps |KNX GA pour la température à Celsius.DPT recommandé: <b> 9.001 </b> |

### sorties

1. Sortie standard
: `msg.payload` (nombre): température du courant en ° C

### Détails

`msg.payload` comporte la valeur de température numérique.
