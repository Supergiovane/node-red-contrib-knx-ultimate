---
layout: wiki
title: "HUE Contact sensor"
lang: fr
permalink: /wiki/fr-HUE%20Contact%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Contact%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Contact%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Contact%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Contact%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor)

Ce nœud transmet les événements d'un capteur de contact de teinte et les mappe aux adresses de groupe KNX. 

Commencez à taper le champ GA, le nom ou l'adresse de groupe de votre appareil KNX, les périphériques AVAIable commencent à apparaître pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez le pont Hue à utiliser |
|Capteur de teinte |Capteur de contact de la teinte à utiliser (assortiment automatique pendant la frappe). |

|Propriété |Description |
|-|-|
|Contact |Lorsque le contact s'ouvre / ferme, envoyez une valeur KNX: _true_ sur actif / ouvert, sinon _false_.|

### sorties

1. Sortie standard
: charge utile (booléen): la sortie standard de la commande.

### Détails

`msg.payload` propose l'événement Raw Hue (boolean / objet).Utilisez-le pour une logique personnalisée si nécessaire.
