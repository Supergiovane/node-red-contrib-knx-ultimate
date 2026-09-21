---
layout: wiki
title: "HUE Temperature sensor"
lang: fr
permalink: /wiki/fr-HUE%20Temperature%20sensor
---
## Mise à jour vers KNX Ultimate 8

La version 7 ajoute un petit bouton **Mettre à jour vers v8** en haut de chaque éditeur de nœud. Il sauvegarde les flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Lire le guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)

> **Obsolète :** ce nœud HUE dédié reste disponible pour les flows existants. Utilisez **HUE Controller** pour les nouveaux projets. Il est marqué `(deprecated)` dans la palette et sur le canevas, utilise une couleur plus claire que HUE Controller et son éditeur affiche un avis de migration en haut. Le bouton de migration orange à contraste élevé avec texte blanc convertit localement tous les nœuds HUE legacy ; il ouvre ensuite uniquement un brouillon d’e-mail modifiable. L’e-mail n’est jamais envoyé automatiquement. À la fin du processus, un message Node-RED fixe reste visible jusqu’à ce que vous cliquiez sur OK et propose un bouton de soutien facultatif ; la page de don ne s’ouvre qu’après un clic sur ce bouton. Avant de commencer, [regardez la vidéo explicative sur YouTube](https://youtu.be/f0Evf2QFI7c).

Ce nœud lit la température (° C) à partir d'un capteur de température de teinte et le mappe à Knx. 

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de température de teinte |Capteur de température de la teinte (Ambordage automatique pendant la saisie) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Temps |KNX GA pour la température à Celsius.DPT recommandé: <b> 9.001 </b> |

### sorties

1. Sortie standard
: `msg.payload` (nombre): température du courant en ° C

### Détails

`msg.payload` comporte la valeur de température numérique.
