---
layout: wiki
title: "zh-CN-HUE Temperature sensor"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Temperature%20sensor
---
---
<p> Ce nœud lit la température (° C) du capteur de température de la teinte et le mappe à KNX.</p>
Entrez dans le champ GA (nom ou adresse de groupe) pour associer le KNX GA;Les suggestions de périphériques sont affichées lorsqu'elles sont entrées.
**Général**
| Propriétés | Description |
|-|-|
| KNX GW | Sélectionnez la passerelle KNX à utiliser |
| Hue Bridge | Sélectionnez le pont Hue à utiliser |
| Capteur de teinte | Capteur de température de la teinte (Compléter automatiquement en entrée) |
| Lire l'état au démarrage | Lisez la valeur actuelle pendant le démarrage / reconnexion et envoyez à KNX (par défaut: non) |
**Mappage**
| Propriétés |Description |
|-|-|
| Température | Température (° C) KNX GA. DPT recommandé: <b> 9.001 </b> |
### Sortir
1. Sortie standard
: `msg.payload` (nombre): température du courant (° C)
### Détails
`msg.payload` contient une température numérique.
