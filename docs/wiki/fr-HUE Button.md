---
layout: wiki
title: "HUE Button"
lang: fr
permalink: /wiki/fr-HUE%20Button
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Button) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Button) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Button) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Button) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Button) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Button)

Le nœud du bouton Hue mappe les événements du bouton de teinte aux adresses du groupe KNX et expose les mêmes événements sur sa sortie de flux via <code> Button.button_report.event </code>. 

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez le pont Hue à utiliser |
|Bouton Hue |Bouton de teinte à utiliser (assortiment automatique pendant la frappe) |

**Changer**

| Propriété | Description |
|-|-|
|Commutation |GA déclenché par <code> court \ _release </code> (appuyez rapidement / version).|
|Statut GA |Feedback facultatif GA lorsque <em> Les valeurs de basculement </em> sont activées pour maintenir l'état de bascule interne aligné avec d'autres actionneurs.|

**Faible**

| Propriété | Description |
|-|-|
|DIM |GA utilisé pendant <code> long \ _press </code> / <code> répéter </code> des événements pour la gradation (généralement DPT 3.007).|

**Comportement**

| Propriété | Description |
|-|-|
|Basculer les valeurs |S'il est activé, le nœud alterne entre <code> true / false </code> et les charges utiles de gradation / bas.|
|Changer la charge utile |La charge utile envoyée à KNX / Flow lorsque les valeurs de bascule sont désactivées.|
|Téléche utile DIM |Direction envoyée à KNX / Flow Lorsque les valeurs de bascule sont désactivées.|

### sorties

1. Sortie standard
: `msg.payload` transporte le booléen (ou objet DIM) envoyé à KNX;`msg.event` est la chaîne d'événements de teinte (par exemple` short_release`, `repeat`).

### Détails

`msg.event` reflète` bouton.button_report.event`.L'événement Hue original est exposé dans «msg.rawevent».Utilisez l'état facultatif GA pour maintenir l'état de bascule en synchronisation avec les commutateurs muraux ou d'autres contrôleurs.
