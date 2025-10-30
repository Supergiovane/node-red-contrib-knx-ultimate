---
layout: wiki
title: "zh-CN-HUE Button"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Button
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Button) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Button) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Button) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Button) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Button) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Button)
---
Le nœud de bouton <p> Hue mappe l'événement du bouton de teinte à KNX à l'aide de <code> bouton.button_report.event </code> et fournit le même événement dans la sortie du processus.</p>
Tapez la boîte d'entrée GA (nom ou adresse de groupe) pour associer le KNX GA;Le périphérique de correspondance sera affiché lors de l'entrée.
**conventionnel**
| Propriétés | Description |
|-|-|
| KNX Gateway | Sélectionnez la passerelle KNX à utiliser |
| Hue Bridge | Sélectionnez le pont Hue à utiliser |
| Bouton Hue | Bouton Hue à utiliser (terminer automatiquement lorsque la saisie) |
**changer**
| Propriétés | Description |
|-|-|
| Commutation | GA déclenché par <code> court \ _release </code> (communiqué de presse court).|
| Statut GA | Feedback GA facultatif lorsque "Valeur de commutation par événement" est autorisé à maintenir l'état interne synchronisé.|
**Dimmultiplex**
| Propriétés | Description |
|-|-|
| Frommer | <code> long \ _press </code> / <code> répéter </code> le GA utilisé pour la gradation pendant l'événement (généralement DPT 3.007). |
**Comportement**
| Propriétés |Description |
|-|-|
| Valeurs de commutation pour chaque événement | Lorsqu'il est activé, basculez automatiquement entre <code> true / false </code> et Direction de l'adhérence.|
| Charge de commutation |Correction de la charge envoyée à KNX / Processus lorsque la commutation est désactivée. |
| Charge de gradation | Direction de gradation fixe envoyée à KNX / Flow lorsque la commutation est désactivée. |
### Sortir
1. Sortie standard
: `msg.payload` est un objet booléen ou de gradation;`msg.event` est une chaîne d'événements de teinte (par exemple` short_release`, `repeat`).
### Détails
`msg.event` correspond à` Button.button_report.event`, et l'événement Hue original est contenu dans `msg.rawevent`.L'utilisation d'un état en option GA permet à l'état de commutation interne d'être cohérent avec les dispositifs externes tels que les commutateurs muraux.
