---
layout: wiki
title: "zh-CN-HUE Camera motion"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Camera%20motion
---
---
<p> Le nœud de mouvement de la caméra Hue écoute les événements de mouvement de la caméra et des cartes Philips Hue Detecy / non détectées à KNX.</p>
Commencez à entrer dans la zone d'entrée GA (nom ou adresse de groupe) pour associer le KNX GA;Le périphérique correspondant sera affiché lors de la saisie.
**conventionnel**
| Propriétés | Description |
|-|-|
| KNX Gateway | Sélectionnez la passerelle KNX à utiliser |
| Hue Bridge | Sélectionnez le pont Hue à utiliser |
| Capteur de teinte | Capteur de mouvement de la caméra Hue (terminer automatiquement lorsque la saisie) |
| Lire l'état au démarrage | Lisez la valeur actuelle au démarrage / reconnexion et envoyez à KNX (par défaut: non) |
**Mappage**
| Propriétés | Description |
|-|-|
| Mouvement |Adresse du groupe KNX (booléen) pour le mouvement de la caméra. DPT recommandé: <b> 1.001 </b> |
### Sortir
1. Sortie standard
: `msg.payload` (booléen):« true »lorsque le mouvement est détecté, sinon« false »
### Détails
`msg.payload` Enregistrer le dernier état de mouvement rapporté du service de caméra Hue.</cript>
