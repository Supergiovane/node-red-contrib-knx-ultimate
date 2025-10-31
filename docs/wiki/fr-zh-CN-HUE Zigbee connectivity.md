---
layout: wiki
title: "zh-CN-HUE Zigbee connectivity"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Zigbee%20connectivity
---
---
<p> Ce nœud lit l'état de connexion ZigBee à partir du périphérique Hue et le publie à KNX.</p>
Entrez le nom du périphérique KNX ou l'adresse de groupe dans le champ GA, et il s'associera automatiquement lors de la saisie.
**conventionnel**
| Propriétés | Description |
|-|-|
| KNX GW | KNX Gateway pour l'état de libération |
| Hue Bridge | Bridge Hue à utiliser |
| Capteur de teinte | Capteur / périphérique Hue Fournir des informations de connexion ZigBee (assortiment automatique) |
**Mappage**
| Propriétés | Description |
|-|-|
| Statut | Maptez l'adresse du groupe KNX de la connectivité Zigbee._true_ Lorsqu'il est connecté, sinon _false_.|
| Lire l'état au démarrage | Lisez et publiez sur KNX pendant le démarrage / reconnexion.Par défaut: "Oui".|
### Sortir
1. Sortie standard
: charge utile (booléen): État de connexion.
### Détails
`msg.payload` est vrai / false.\
`msg.status` est texte: **connecté, déconnecté, connectivité \ _issue, unidirectional \ _incoming** .
