---
layout: wiki
title: "HUE Zigbee connectivity"
lang: fr
permalink: /wiki/fr-HUE%20Zigbee%20connectivity
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Zigbee%20connectivity) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Zigbee%20connectivity) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Zigbee%20connectivity) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Zigbee%20connectivity) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)

Ce nœud récupère l'état de connectivité ZigBee à partir d'un périphérique de teinte et l'expose à KNX. 

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les suggestions apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway avait l'habitude de publier le statut.|
|Hue Bridge |Bridge Hue à la question.|
|Capteur de teinte |Capteur / appareil Hue Fournissant les informations de connectivité ZigBee.Assomple automatique pendant la saisie.|

**Mappage**

| Propriété | Description |
|-|-|
|Statut |Adresse du groupe KNX qui reflète la connectivité zigbee.Devient _true_ lorsqu'il est connecté, sinon _false_.|
|Lire l'état au démarrage |Lit sur l'état actuel chez l'éditeur start / reconnection et émet à KNX.Par défaut: "Oui".|

### sorties

1. Sortie standard
: charge utile (booléen): état de connectivité.

### Détails

`msg.payload` porte l'état booléen (true / false). \
`msg.status` contient un statut textuel: l'un des **connectés, déconnectés, connectivité \ _issue, unidirectional \ _incoming** .
