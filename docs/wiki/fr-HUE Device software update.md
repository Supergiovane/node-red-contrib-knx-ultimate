---
layout: wiki
title: "HUE Device software update"
lang: fr
permalink: /wiki/fr-HUE%20Device%20software%20update
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Device%20software%20update) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Device%20software%20update) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Device%20software%20update) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Device%20software%20update) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update)

Ce nœud surveille si un périphérique Hue sélectionné a une mise à jour logicielle disponible et publie le statut de KNX. 

Commencez à taper le nom ou l'adresse de groupe de votre appareil KNX dans le champ GA, les périphériques AVAIable commencent à apparaître pendant que
vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez le pont Hue à utiliser |
|Dispositif Hue |Appareil Hue pour surveiller les mises à jour logicielles (assortie automatique pendant la frappe). |

**Mappage**

|Propriété |Description |
|-|-|
|Statut |KNX GA reflétant l'état de mise à jour._True_ Si une mise à jour est disponible / prêt / en cours d'installation, sinon _false_.|
|Lire l'état au démarrage |Lisez l'état actuel au démarrage / reconnexion et émettez à KNX (par défaut "Oui").|

### sorties

1. Sortie standard
: charge utile (booléen): mettent à jour le drapeau.
: Status (String): l'un de **no \ _update, Update \ _Pending, Ready \ _To \ _install, installation** .
