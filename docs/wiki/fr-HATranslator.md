---
layout: wiki
title: "HATranslator"
lang: fr
permalink: /wiki/fr-HATranslator
translation_key: "HATranslator"
---

> Dans la version 8, utilisez **KNX Utility** et choisissez **Home Assistant Translator**. Les réglages ci-dessous décrivent cette fonction. L’ancien nœud séparé n’est plus inclus.
>
> [KNX Utility]({{ '/wiki/fr-KNX-Utility' | relative_url }}) · [Passer de la version 7 à la 8]({{ '/wiki/fr-Migration-8' | relative_url }})


Home Assistant Translator dispose d’une entrée et d’une sortie et ne nécessite pas de passerelle KNX. Choisissez la propriété du message à traduire (par exemple `payload` ou `data.new_state.state`) et modifiez les correspondances `source:true` / `source:false`, comme `open:true` et `closed:false`. La valeur booléenne traduite est envoyée dans `msg.payload` ; reliez la sortie à KNX Device pour écrire sur le bus.

Ce nœud traduit le msg d'entrée en valeurs vraies / fausses valides. 

Il peut traduire une charge utile d'entrée, en valeurs booléennes vraies / fausses. 

Chaque ligne de la zone de texte représente une commande de traduction.

Vous pouvez ajouter votre propre ligne de traduction. 

| Propriété | Description |
|-|-|
|Nom |Le nom du nœud.|
|Entrée |La propriété MSG d'entrée à évaluer et à traduire.|
|Traduire |Ajoutez, supprimez ou modifiez votre propre commande de traduction.The row's translation command must be **input string from HA:KNX value** (_KNX value_ as true or false).For example: <code>open:true</code> <code>closed:false</code>.|
