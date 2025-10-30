---
layout: wiki
title: "HUE Humidity sensor"
lang: fr
permalink: /wiki/fr-HUE%20Humidity%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Humidity%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Humidity%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Humidity%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Humidity%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Humidity%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Humidity%20sensor)

Ce nœud lit l'humidité relative (%) à partir d'un capteur d'humidité de teinte et le mappe à Knx. 

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez le pont Hue à utiliser |
|Capteur de teinte |Capteur d'humidité de la teinte (assortiment automatique pendant la frappe) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Humidité |KNX GA pour l'humidité relative%.DPT recommandé: <b> 9.007 </b> |

### sorties

1. Sortie standard
: `msg.payload` (numéro): Humidité relative actuelle en%

### Détails

`msg.payload` comporte la valeur d'humidité numérique (pourcentage).
