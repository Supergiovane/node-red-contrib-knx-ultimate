---
layout: wiki
title: "HATranslator"
lang: fr
permalink: /wiki/fr-HATranslator
---
## Mise à jour vers KNX Ultimate 8

La version 7 ajoute un petit bouton **Mettre à jour vers v8** en haut de chaque éditeur de nœud. Il sauvegarde les flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Lire le guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Ce nœud dédié reste compatible avec les flux existants. Pour les nouveaux flux, utilisez [KNX Utility](/node-red-contrib-knx-ultimate/wiki/fr-KNX-Utility) et sélectionnez **Home Assistant Translator**. Son éditeur convertit tous les anciens utilitaires compatibles dans tous les flux et sous-flux, avec une seule opération Annuler et un Deploy manuel.

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
