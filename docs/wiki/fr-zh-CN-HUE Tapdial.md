---
layout: wiki
title: "zh-CN-HUE Tapdial"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Tapdial
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Tapdial) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Tapdial) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Tapdial) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Tapdial) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Tapdial) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Tapdial)
---
**TABLE TAP TAP DIAL** Le nœud mappe le service de rotation de Tap Dial to KNX et envoie l'événement Hue d'origine au processus de Node-Red.Après avoir associé un nouvel appareil, cliquez sur l'icône d'actualisation à côté du champ de périphérique.
Onglet ###
- **Mappage** - Sélectionnez l'adresse du groupe KNX et DPT correspondant à l'événement de rotation, prenant en charge DPT 3.007, 5.001, 232.600.
- **comportement** - contrôle si la broche de sortie du nœud-rouge s'affiche.Lorsque la passerelle KNX n'est pas configurée, la broche reste activée afin que les événements continuent de saisir le processus.
### Paramètres généraux
| Propriétés | Description |
|-|-|
| KNX GW | KNX Gateway for GA Automatic Competion.|
| Hue Bridge | Hue Bridge fournit le pont Hue de Tap Dial. |
| Hue Tap Dial |Appareil bouton (prend en charge l'achèvement automatique; bouton de rafraîchissement pour recueillir la liste).|
Onglet de mappage ###
| Propriétés | Description |
|-|-|
| GA rotatif | Adresse du groupe KNX qui reçoit des événements de rotation (prend en charge DPT 3.007, 5.001, 232.600).|
| Nom |Description Nom de GA. |
### Sortir
| # | Port | Télélée utile |
|-|-| - | - |
| 1 | Sortie standard | `msg.payload` (objet) Événement de teinte d'origine généré par Tap Dial. |
> ℹ️ Les commandes liées au KNX ne seront affichées qu'après avoir sélectionné la passerelle KNX; L'onglet Mappage restera caché jusqu'à la configuration du pont Hue et de la passerelle KNX.
