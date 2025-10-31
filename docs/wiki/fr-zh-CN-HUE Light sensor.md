---
layout: wiki
title: "zh-CN-HUE Light sensor"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Light%20sensor
---
---
<p> Ce nœud lit un événement Lux du capteur de lumière Hue et le publie à KNX.</p>
La valeur lux est sortie chaque fois que la lumière ambiante change.Entrez le nom du périphérique KNX ou l'adresse de groupe (Ambord d'auto) dans le champ GA pour l'association.
**Général**
| Propriétés | Description |
|-|-|
| KNX GW | Sélectionnez le portail KNX à utiliser |
| Hua Bridge | Sélectionnez le pont de ton à utiliser |
| Capteur de teinte | Capteur de lumière Hue à utiliser (achèvement automatique) |
| Lire l'état au démarrage | Lire l'état au démarrage et transmettre des événements au bus KNX au démarrage / reconnecter.(Par défaut "non") |
**Mappage**
| Propriétés | Description |
|-|-|
| Lux | Adresse du groupe KNX qui reçoit des valeurs lux |
### Sortir
1. Sortie standard
: charge utile (numéro): valeur lux actuelle
### détail
`msg.payload` est un luxe numérique.
