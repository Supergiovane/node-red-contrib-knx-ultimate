---
layout: wiki
title: "Matter Motion sensor"
lang: fr
permalink: /wiki/fr-Matter%20Motion%20sensor
---
# Détecteur de mouvement Matter (BETA)

> Ce nœud est en **BETA** : le comportement peut changer pendant l amélioration de l'implémentation Matter.

Ce nœud relie un endpoint de mouvement Matter à KNX et, en option, à une sortie Node-RED.

## Configuration

|Champ|Description|
|--|--|
| KNX GW | Passerelle KNX utilisée pour écrire et répondre sur les adresses de groupe configurées. Elle peut rester vide si seule la sortie Node-RED est utilisée. |
| Matter controller | Nœud de configuration Matter Controller dans lequel le périphérique a été appairé. |
| Détecteur de mouvement Matter | endpoint de mouvement Matter choisi parmi les périphériques appairés. La liste est filtrée sur les endpoints exposant `OccupancySensing`. |
| GA mouvement | GA mouvement recevant la valeur convertie. DPT par défaut : `1.001`. |
| Read at startup | Publie la valeur Matter en cache au déploiement/démarrage ou quand le périphérique se reconnecte. |
| Node output | Affiche une sortie Node-RED et émet chaque mise à jour Matter. |

## Comportement

Le nœud lit `OccupancySensing.occupancy`, le convertit en état booléen de présence/mouvement, l'écrit sur la GA KNX configurée et répond aux lectures KNX avec la dernière valeur connue.
