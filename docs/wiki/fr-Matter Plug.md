---
layout: wiki
title: "Matter Plug"
lang: fr
permalink: /wiki/fr-Matter%20Plug
---
# Prise Matter (BETA)

> Ce nœud est en **BETA** : le comportement peut changer pendant l amélioration de l'implémentation Matter.

Ce nœud relie une prise Matter exposant le cluster `OnOff` aux adresses de groupe KNX de commande et d'état.

## Configuration

|Champ|Description|
|--|--|
| KNX GW | Passerelle KNX utilisée pour écrire et répondre sur les adresses de groupe configurées. Elle peut rester vide si seule la sortie Node-RED est utilisée. |
| Matter controller | Nœud de configuration Matter Controller dans lequel le périphérique a été appairé. |
| Prise Matter | Endpoint de prise Matter exposant `OnOff.onOff`. |
| Control | GA KNX de commande. Les écritures booléennes allument ou éteignent la prise Matter. DPT par défaut : `1.001`. |
| Status | GA KNX d'état mise à jour par les changements Matter et utilisée pour répondre aux lectures KNX. DPT par défaut : `1.001`. |
| Read at startup | Publie la valeur Matter en cache au déploiement/démarrage ou quand le périphérique se reconnecte. |
| Node I/O | Affiche les pins entrée/sortie Node-RED. L'entrée accepte les payloads booléens et les messages Matter dans `msg.payload` ou `msg.on.on`; la sortie émet les états. |

## Comportement

Les changements Matter `OnOff.onOff` mettent à jour la GA d'état. Les écritures KNX sur la GA de commande envoient la commande Matter on/off correspondante.
