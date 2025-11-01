---
layout: wiki
title: "zh-CN-HUE Humidity sensor"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Humidity%20sensor/
---
---
<p> Ce nœud lit l'humidité relative (%) du capteur d'humidité de la teinte et les cartes à KNX.</p>
Commencez à entrer (nom ou adresse de groupe) dans le champ GA pour associer le KNX GA;Le périphérique correspondant s'affiche lors de la saisie.
**conventionnel**
| Propriétés | Description |
|-|-|
| KNX Gateway | Sélectionnez la passerelle KNX à utiliser |
| Hue Bridge | Sélectionnez le pont Hue à utiliser |
| Capteur de teinte | Capteur d'humidité de la teinte (Complétez automatiquement lorsque vous entrez) |
| Lire l'état au démarrage | Lisez la valeur actuelle au démarrage / reconnexion et envoyez à KNX (par défaut: non) |
**Mappage**
| Propriétés | Description |
|-|-|
|Humidité | KNX GA avec humidité relative%. DPT recommandé: <b> 9.007 </b> |
### Sortir
1. Sortie standard
: `msg.payload` (numéro): Humidité relative actuelle (%)
### Détails
«msg.payload» La valeur (pourcentage) de l'humidité.
