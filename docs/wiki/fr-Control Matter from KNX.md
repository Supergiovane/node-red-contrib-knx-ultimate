---
layout: wiki
title: "Control Matter from KNX"
lang: fr
permalink: /wiki/fr-Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> Ce nœud est en **BETA** : le comportement peut changer pendant l amélioration de l'implémentation Matter.

Ce nœud contrôle depuis KNX un endpoint Matter déjà appairé. Sélectionnez l'appareil Matter et l'éditeur détecte ses capacités, puis affiche uniquement les mappings KNX adaptés à cet endpoint.

Il remplace les nœuds Matter séparés non publiés et conserve toute l'UI lumière lorsque l'endpoint sélectionné est une lumière.

## Configuration

|Champ|Description|
|--|--|
| KNX GW | Passerelle KNX utilisée pour écrire et répondre sur les adresses de groupe configurées. Elle peut rester vide si seule la sortie Node-RED est utilisée. |
| Matter controller | Nœud de configuration Matter Controller dans lequel le périphérique a été appairé. |
| Appareil Matter | Endpoint Matter choisi parmi les appareils appairés. L'UI est reconstruite à partir de ses capacités réelles. |
| Switch / Prise / Lumière On-Off | Adresses de groupe commande et état On/Off, généralement DPT `1.001`. |
| Contrôles lumière | Pour les endpoints lumière, l'UI lumière complète est utilisée : DIM relatif (DPT `3.007`), luminosité %, RGB/HSV, blanc réglable, luminosité/température à l'allumage, mode jour/nuit, niveau min/max et vitesse de variation. Les sections non supportées restent masquées. |
| Capteurs | Les endpoints capteur affichent leur GA de mesure/état uniquement si elle est supportée : température, humidité, éclairement, occupation, contact et batterie. |
| Read at startup | Publie la valeur Matter en cache au déploiement/démarrage ou quand le périphérique se reconnecte. |
| Update local state from KNX write | Met à jour le cache local Matter/KNX lorsqu'un télégramme est écrit sur une GA KNX configurée. |
| Node Input/Output PINs | Affiche les pins entrée/sortie Node-RED. L'entrée accepte les payloads booléens et les messages Matter dans `msg.payload` ou `msg.on.on`; la sortie émet les états. |

## Comportement

Le nœud garde un cache local depuis les mises à jour Matter et les écritures KNX, répond aux lectures KNX depuis ce cache et peut émettre/lire les valeurs au démarrage. Il n'écoute que les adresses de groupe configurées, donc le trafic KNX non lié est ignoré.
