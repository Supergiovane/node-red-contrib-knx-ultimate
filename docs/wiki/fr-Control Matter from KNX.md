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
| Serrure | Une AG de commande DPT `1.xxx` appelle `lockDoor` avec `true` et `unlockDoor` avec `false` ; une AG d'état séparée reçoit uniquement les états Verrouillé/Déverrouillé non ambigus. Si nécessaire, le PIN distant est conservé dans le champ d'identification. Les commandes non annoncées sont refusées. |
| Autres points de terminaison | Window Covering, Thermostat, Fan et Switch utilisent des profils dédiés sélectionnés selon leurs capacités ; les événements Switch tels que pression initiale, longue et multiple sont émis sur la sortie flow optionnelle. Prises, actionneurs On/Off, capteurs, batterie, puissance et énergie utilisent le fallback mappé générique. L'onglet **Mappages** contient uniquement les fonctions annoncées. |
| Contrôles lumière | Pour les endpoints lumière, l'UI lumière complète est utilisée : DIM relatif (DPT `3.007`), luminosité %, RGB/HSV, blanc réglable, luminosité/température à l'allumage, mode jour/nuit, niveau min/max et vitesse de variation. Les sections non supportées restent masquées. |
| Capteurs | Les endpoints capteur affichent leur GA de mesure/état uniquement si elle est supportée : température, humidité, éclairement, occupation, contact et batterie. |
| Read at startup | Publie la valeur Matter en cache au déploiement/démarrage ou quand le périphérique se reconnecte. |
| Update local state from KNX write | Met à jour le cache local Matter/KNX lorsqu'un télégramme est écrit sur une GA KNX configurée. |
| Node Input/Output PINs | Affiche les pins entrée/sortie Node-RED. Pour les endpoints mappés, les sélecteurs Matter se placent directement dans `msg` : `msg.clusterId` avec `msg.attribute` lit un attribut et émet sa valeur dans `msg.payload` ; `msg.requestFromRemote = true` force la lecture du dispositif. Ajoutez `msg.value` pour écrire un attribut, ou utilisez `msg.clusterId`, `msg.command` et `msg.args` pour une commande. L'identifiant numérique d'attribut `0` est valide. Door Lock accepte un `msg.payload` booléen (`true` verrouille, `false` déverrouille). La sélection est conservée à la réouverture de l'éditeur. |

## Comportement

Le nœud garde un cache local depuis les mises à jour Matter et les écritures KNX, répond aux lectures KNX depuis ce cache et peut émettre/lire les valeurs au démarrage. Il n'écoute que les adresses de groupe configurées, donc le trafic KNX non lié est ignoré.
