---
layout: wiki
title: "HUE Light sensor"
lang: fr
permalink: /wiki/fr-HUE%20Light%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor)

Ce nœud lit les événements lux à partir d'un capteur de lumière de teinte et les mappe à Knx. 

Il émet l'illuminance ambiante (lux) chaque fois qu'il change.Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez le pont Hue à utiliser |
|Capteur de teinte |Capteur de lumière Hue à utiliser (assortiment automatique pendant la frappe). |
|Lire l'état au démarrage |Lisez l'état au démarrage et émettez l'événement dans le bus KNX au démarrage / reconnexion.(Par défaut "non") |

**Mappage**

|Propriété |Description |
|-|-|
|Lux |KNX GA qui reçoit la valeur lux.|

### sorties

1. Sortie standard
: charge utile (numéro): valeur lux actuelle.

### Détails

`msg.payload` comporte la valeur lux numérique.Utilisez-le pour une logique personnalisée si nécessaire.
