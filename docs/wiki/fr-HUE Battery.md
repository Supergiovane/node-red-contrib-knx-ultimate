---
layout: wiki
title: "HUE Battery"
lang: fr
permalink: /wiki/fr-HUE%20Battery
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Battery) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Battery) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Battery) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Battery) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery)

Ce nœud expose le niveau de batterie d'un dispositif de teinte à KNX et soulève un événement chaque fois que la valeur change. 

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les entrées correspondantes apparaissent pendant que vous tapez.Utilisez l'icône de rafraîchissement à côté de <q> capteur de teinte </Q> pour recharger la liste à partir du pont de teinte après avoir ajouté de nouveaux appareils.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway a utilisé pour publier le niveau de la batterie (requis avant l'apparition des champs de mappage KNX).|
|Hue Bridge |Hue Bridge qui héberge l'appareil.|
|Capteur de teinte |Dispositif / capteur Hue Fournissant le niveau de la batterie (prend en charge la saisie semi-automatique et la rafraîchissement).|

**Mappage**

| Propriété | Description |
|-|-|
|Niveau |KNX GA pour le pourcentage de batterie (0-100%).DPT recommandé: <b> 5.001 </b>.|

**Comportement**

| Propriété | Description |
|-|-|
|Lire l'état au démarrage |Sur le déploiement / reconnecter, lisez la valeur actuelle de la batterie et publiez-la à KNX.Par défaut: "Oui".|
|Pin de sortie de nœud |Afficher ou masquer la sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est sélectionnée, la sortie reste activée, les événements de teinte continuent d'atteindre le flux.|

> ℹ️ Les widgets de mappage KNX restent cachés jusqu'à ce qu'une passerelle KNX soit sélectionnée.Cela maintient l'éditeur bien rangé lorsque le nœud est utilisé uniquement pour transmettre les événements de teinte dans Node-Red.
