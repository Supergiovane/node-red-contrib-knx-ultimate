---
layout: wiki
title: "HATranslator"
lang: fr
permalink: /wiki/fr-HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)

Ce nœud traduit le msg d'entrée en valeurs vraies / fausses valides. 

Il peut traduire une charge utile d'entrée, en valeurs booléennes vraies / fausses. 

Chaque ligne de la zone de texte représente une commande de traduction.

Vous pouvez ajouter votre propre ligne de traduction. 

| Propriété | Description |
|-|-|
|Nom |Le nom du nœud.|
|Entrée |La propriété MSG d'entrée à évaluer et à traduire.|
|Traduire |Ajoutez, supprimez ou modifiez votre propre commande de traduction.The row's translation command must be **input string from HA:KNX value** (_KNX value_ as true or false).For example: <code>open:true</code> <code>closed:false</code>.|
