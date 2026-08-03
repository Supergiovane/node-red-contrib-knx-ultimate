---
layout: wiki
title: "HUE Camera motion"
lang: fr
permalink: /wiki/fr-HUE%20Camera%20motion
---
> **Obsolète :** ce nœud HUE dédié reste disponible pour les flows existants. Utilisez **HUE Controller** pour les nouveaux projets. Il est marqué `(deprecated)` dans la palette et sur le canevas, utilise une couleur plus claire que HUE Controller et son éditeur affiche un avis de migration en haut. Le bouton de migration orange à contraste élevé avec texte blanc convertit localement tous les nœuds HUE legacy ; il ouvre ensuite uniquement un brouillon d’e-mail modifiable. L’e-mail n’est jamais envoyé automatiquement. À la fin du processus, un message Node-RED fixe reste visible jusqu’à ce que vous cliquiez sur OK et propose un bouton de soutien facultatif ; la page de don ne s’ouvre qu’après un clic sur ce bouton. Avant de commencer, [regardez la vidéo explicative sur YouTube](https://youtu.be/f0Evf2QFI7c).

Le nœud de mouvement de la caméra Hue écoute les services de mouvement de la caméra Hue Philips et reflète l'état détecté / non détecté à KNX. 

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Motion de la caméra Hue |Capteur de mouvement de la caméra Hue (assortiment automatique pendant la frappe) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Motion |KNX GA pour le mouvement de la caméra (booléen).DPT recommandé: <b> 1.001 </b> |

### sorties

1. Sortie standard
: `msg.payload` (booléen):« true »lorsque le mouvement est détecté;Sinon, «faux»

### Détails

`msg.payload` comporte le dernier état de mouvement rapporté par le service de caméra Hue.
