---
layout: wiki
title: "HUE Contact sensor"
lang: fr
permalink: /wiki/fr-HUE%20Contact%20sensor
---
> **Obsolète :** ce nœud HUE dédié reste disponible pour les flows existants. Utilisez **HUE Controller** pour les nouveaux projets. Il est marqué `(deprecated)` dans la palette et sur le canevas, utilise une couleur plus claire que HUE Controller et son éditeur affiche un avis de migration en haut. Le bouton de migration orange de cet éditeur ouvre le même convertisseur de flow complet que HUE Controller.

Ce nœud transmet les événements d'un capteur de contact de teinte et les mappe aux adresses de groupe KNX. 

Commencez à taper le champ GA, le nom ou l'adresse de groupe de votre appareil KNX, les périphériques AVAIable commencent à apparaître pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de contact de la teinte |Capteur de contact de la teinte à utiliser (assortiment automatique pendant la frappe). |

|Propriété |Description |
|-|-|
|Contact |Lorsque le contact s'ouvre / ferme, envoyez une valeur KNX: _true_ sur actif / ouvert, sinon _false_.|

### sorties

1. Sortie standard
: charge utile (booléen): la sortie standard de la commande.

### Détails

`msg.payload` propose l'événement Raw Hue (boolean / objet).Utilisez-le pour une logique personnalisée si nécessaire.
