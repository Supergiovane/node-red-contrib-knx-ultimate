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
| Node Input/Output PINs | Affiche les pins entrée/sortie Node-RED et la section **Entrée du flow** juste sous ce champ. Les lumières affichent leurs messages d'état pris en charge au premier niveau ; les autres endpoints affichent le format simple `{function,value}` et les sélecteurs Matter avancés. |

## Messages d'entrée du flow

Activez **Node Input/Output PINs** pour afficher la section **Entrée du flow** juste sous le sélecteur. Pour une lumière, elle propose des exemples copiables des propriétés prises en charge au premier niveau, comme `msg.on`, `msg.dimming`, `msg.color_temperature` et `msg.color`. Pour les autres endpoints, elle est générée depuis la structure annoncée et affiche l'Endpoint ID, tous les attributs lisibles/inscriptibles et toutes les commandes acceptées. Elle reste disponible sans passerelle KNX.

Utilisez `msg.payload = {function:"position",value:35}` pour écrire avec des unités lisibles. Omettez `value` pour lire un état, par exemple `{function:"temperature"}` ; le résultat est placé dans `msg.payload` et les détails bruts dans `msg.matter`. Selon l'endpoint, les fonctions comprennent `onoff`, `level`, `position`, `open`, `close`, `stop`, les consignes, le ventilateur et les capteurs. Une serrure accepte `{function:"lock",value:true|false}`.

Les flows existants restent compatibles. Les messages avancés utilisent toujours `msg.clusterId` avec `msg.command`/`msg.args`, ou `msg.attribute` et éventuellement `msg.value`. Le Node ID et l'Endpoint ID sont déjà sélectionnés.

## Comportement

Le nœud garde un cache local depuis les mises à jour Matter et les écritures KNX, répond aux lectures KNX depuis ce cache et peut émettre/lire les valeurs au démarrage. Il n'écoute que les adresses de groupe configurées, donc le trafic KNX non lié est ignoré.

Les commandes utilisent une file ordonnée séparée pour chaque appareil appairé. Un appareil hors ligne, en délai dépassé ou supprimé ne peut donc pas retarder les autres appareils Matter qui utilisent la même adresse de groupe KNX. Un nœud qui référence encore un appareil supprimé refuse immédiatement la commande et affiche **Device no longer commissioned** en rouge ; sélectionnez un appareil Matter valide ou supprimez le nœud Controller orphelin.

Une erreur d'appareil indisponible reste verrouillée : les commandes KNX et flow suivantes sont ignorées et ne peuvent pas remplacer l'état rouge. Le nœud reprend automatiquement dès que cet appareil Matter signale `connected` ; l'ouverture de l'éditeur du nœud libère également le verrou pour permettre un nouvel essai manuel.
