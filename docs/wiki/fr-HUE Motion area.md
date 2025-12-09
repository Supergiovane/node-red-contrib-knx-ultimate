---
layout: wiki
title: "HUE Motion area"
lang: fr
permalink: /wiki/fr-HUE%20Motion%20area
---
Le nœud Hue Motion Area écoute les événements de mouvement agrégés d’une zone MotionAware (Hue Bridge Pro) et reflète l’état mouvement / pas de mouvement vers KNX ou votre flow Node-RED.

Commencez à saisir le nom ou l’adresse de groupe KNX dans le champ GA ; des suggestions apparaissent au fil de la saisie.

**Général**

|Propriété|Description|
|--|--|
| KNX GW | Passerelle KNX utilisée pour recevoir l’état de mouvement de la zone. |
| HUE Bridge | Hue Bridge Pro à utiliser. |
| HUE Area | Zone MotionAware (convenience ou security) à surveiller (saisie semi-automatique). |
| Lire l'état au démarrage | Au démarrage / à la reconnexion lit la valeur courante et l’envoie à KNX (par défaut : oui). |

**Mappage**

|Propriété|Description|
|--|--|
| Mouvement | GA KNX pour l’état de mouvement de la zone (booléen). DPT recommandé : <b>1.001</b>. |

**Comportement**

|Propriété|Description|
|--|--|
| Broche de sortie du nœud | Affiche ou masque la sortie Node-RED. Sans passerelle KNX, la sortie reste active afin que les événements MotionAware atteignent toujours votre flow. |

### Sortie

1. Sortie standard  
   : `msg.payload` (booléen) : `true` lorsque la zone est en mouvement, sinon `false`.

### Détails

`msg.payload` contient le dernier état de mouvement agrégé fourni par le service MotionAware de la zone sélectionnée.

