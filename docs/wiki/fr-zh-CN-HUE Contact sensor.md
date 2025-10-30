---
layout: wiki
title: "zh-CN-HUE Contact sensor"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Contact%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Contact%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Contact%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Contact%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Contact%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor)
---
<p> Ce nœud mappe l'événement du capteur de contact Hue à l'adresse du groupe KNX.</p>
Commencez à entrer dans le champ GA, le nom ou l'adresse de groupe du périphérique KNX et le périphérique disponible commence à s'afficher lors de l'entrée.
**Général**
| Propriétés | Description |
|-|-|
| KNX GW | Sélectionnez le portail KNX à utiliser |
| Hua Bridge | Sélectionnez le pont de ton à utiliser |
| Capteur de teinte | Capteur de contact Hue à utiliser (complétion automatique) |
| Propriétés | Description |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contact | Lorsque le capteur est ON / OFF: Envoyez la valeur KNX _true_ (activer / on), sinon _false_ |
### Sortir
1. Sortie standard
: Charge utile (boléen): sortie standard de la commande.
### détail
`msg.payload` est un événement de teinte (booléen / objet) qui peut être utilisé pour la logique personnalisée.
