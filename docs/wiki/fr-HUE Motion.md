---
layout: wiki
title: "HUE Motion"
lang: fr
permalink: /wiki/fr-HUE%20Motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion)

Ce nœud écoute un capteur de mouvement de teinte et reflète les événements de KNX et / ou de votre flux rouge-rouge. 

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les suggestions apparaissent pendant que vous tapez.Appuyez sur le bouton d'actualisation à côté du "capteur Hue" pour recharger la liste des périphériques à partir du pont si vous ajoutez de nouveaux capteurs.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway qui reçoit les mises à jour de mouvement (requise avant que les champs de mappage KNX n'apparaissent).|
|Hue Bridge |Bridge Hue à la question.|
|Capteur de teinte |Capteur de mouvement Hue (prend en charge la saisie semi-automatique et la rafraîchissement).|

**Mappage**

| Propriété | Description |
|-|-|
|Motion |KNX GA qui reçoit «True» lorsque le mouvement est détecté et «faux» lorsque la zone est claire.DPT recommandé: <b> 1.001 </b>.|

**Comportement**

| Propriété | Description |
|-|-|
|Pin de sortie de nœud |Afficher ou masquer la sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est sélectionnée, la broche de sortie reste activée afin que les événements de mouvement de teinte atteignent toujours votre flux.|

> ℹ️ Les widgets KNX restent cachés jusqu'à ce que vous sélectionniez une passerelle KNX, ce qui facilite l'utilisation du nœud purement comme une teinte → Écouteur rouge-rouge.

### Sortir

1. Sortie standard - `msg.payload` (booléen)
: «True» sur le mouvement, «False» lorsque le mouvement se termine.
