---
layout: wiki
title: "HUE Light sensor"
lang: fr
permalink: /wiki/fr-HUE%20Light%20sensor
---
Ce nœud lit les événements lux à partir d'un capteur de lumière de teinte et les mappe à Knx. 

Il émet l'illuminance ambiante (lux) chaque fois qu'il change.Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de lumière |Capteur de lumière Hue à utiliser (assortiment automatique pendant la frappe). |
|Lire l'état au démarrage |Lisez l'état au démarrage et émettez l'événement dans le bus KNX au démarrage / reconnexion.(Par défaut "non") |

**Mappage**

|Propriété |Description |
|-|-|
|Lux |KNX GA qui reçoit la valeur lux.|

### sorties

1. Sortie standard
: charge utile (numéro): valeur lux actuelle.

### Détails

`msg.payload` comporte la valeur lux numérique.Utilisez-le pour une logique personnalisée si nécessaire.
