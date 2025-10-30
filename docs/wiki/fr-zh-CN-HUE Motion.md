---
layout: wiki
title: "zh-CN-HUE Motion"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion)
---
<p> Ce nœud s'abonne aux événements du capteur de mouvement de la teinte et les synchronise avec le processus KNX et Node-Red.</p>
Entrez le nom du périphérique KNX ou l'adresse de groupe dans le champ GA pour terminer automatiquement; Le bouton d'actualisation à côté du "capteur de teinte" peut recharger la liste des périphériques Hue.
**conventionnel**
| Propriétés | Description |
|-|-|
| KNX GW | KNX Gateway qui reçoit l'état de mouvement (les paramètres KNX ne sont affichés qu'après la sélection) |
| Hue Bridge | Utilisé par Hue Bridge |
| Capteur de teinte | Capteur de mouvement Hue à utiliser (prend en charge l'achèvement automatique et la rafraîchissement) |
**Mappage**
| Propriétés | Description |
|-|-|
| Motion | Adresse de groupe KNX correspondante; Envoyez «True» lorsque le mouvement est détecté et envoyez «False» lorsque le ralenti est restauré (DPT recommandé: <b> 1.001 </b>) |
**Comportement**
| Propriétés | Description |
|-|-|
| Pin de sortie de nœud | Afficher ou masquer la sortie du nœud-rouge; Reste activé lorsque la passerelle KNX n'est pas sélectionnée pour s'assurer que les événements de teinte peuvent toujours saisir le processus |
> ℹ️ Lorsque la passerelle KNX n'est pas sélectionnée, le champ KNX est automatiquement masqué et le nœud peut être utilisé comme une pure teinte → Écouteur rouge.
### Sortir
1. Sortie standard - «msg.payload» (booléen)
: La motion est détectée comme «True» et la fin de la motion est «False».
