---
layout: wiki
title: "Matter Battery"
lang: fr
permalink: /wiki/fr-Matter%20Battery
---
# Capteur de batterie Matter (BETA)

> Ce nœud est en **BETA** : le comportement peut changer pendant l amélioration de l'implémentation Matter.

Ce nœud relie un endpoint batterie/alimentation Matter à KNX et, en option, à une sortie Node-RED.

## Configuration

|Champ|Description|
|--|--|
| KNX GW | Passerelle KNX utilisée pour écrire et répondre sur les adresses de groupe configurées. Elle peut rester vide si seule la sortie Node-RED est utilisée. |
| Matter controller | Nœud de configuration Matter Controller dans lequel le périphérique a été appairé. |
| Capteur de batterie Matter | endpoint batterie/alimentation Matter choisi parmi les périphériques appairés. La liste est filtrée sur les endpoints exposant `PowerSource`. |
| GA batterie | GA batterie recevant la valeur convertie. DPT par défaut : `5.001`. |
| Read at startup | Publie la valeur Matter en cache au déploiement/démarrage ou quand le périphérique se reconnecte. |
| Node output | Affiche une sortie Node-RED et émet chaque mise à jour Matter. |

## Comportement

Le nœud lit `PowerSource.batPercentRemaining`, le convertit en niveau de batterie en pourcentage, l'écrit sur la GA KNX configurée et répond aux lectures KNX avec la dernière valeur connue.
