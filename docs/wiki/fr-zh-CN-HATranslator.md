---
layout: wiki
title: "zh-CN-HATranslator"
lang: fr
permalink: /wiki/fr-zh-CN-HATranslator/
---
---
<p> Ce nœud convertit le msg d'entrée en une valeur vraie / false valide.<p>
Il peut convertir la charge utile d'entrée en true / false booléen.<br />
Chaque ligne de la zone de texte représente une commande de traduction.<br/>
Vous pouvez ajouter vos propres lignes de traduction.<br/>
| Propriétés | Description |
|-|-|
| Nom | Nom du nœud. |
| Entrée |Propriétés MSG d'entrée pour évaluer et traduire. |
| Traduction |Ajouter, supprimer ou modifier vos propres commandes de traduction.La commande de traduction de cette ligne doit être la chaîne de saisie \ *\* de Ha: Knx Value \ *\* (_knx Valu _ & # x4E3A; true ou false).Par exemple: <code> ouvrir: true </code> <code> fermé: false </code>.|
<br/>
