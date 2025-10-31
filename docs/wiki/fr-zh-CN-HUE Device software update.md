---
layout: wiki
title: "zh-CN-HUE Device software update"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Device%20software%20update
---
---
<p> Ce nœud surveille l'état de mise à jour du logiciel du périphérique Hue et le publie à KNX.</p>
Commencez à taper le nom ou l'adresse de groupe du périphérique KNX dans le champ GA, et les appareils disponibles commencent à afficher
Vous tapez.
**Général**
| Propriétés | Description |
|-|-|
| KNX GW | Sélectionnez le portail KNX à utiliser |
| Hua Bridge | Sélectionnez le pont de ton à utiliser |
| Dispositif Hue | Dispositif de teinte à surveiller (assureur automatique) |
**Mappage**
| Propriétés | Description |
|-|-|
| Statut | Adresse du groupe KNX pour le mappage des mises à jour du logiciel: _true_ Disponible / préparation / installation, sinon _false_ |
| Lire l'état au démarrage | Lire et publier sur KNX pendant le démarrage / reconnexion (par défaut "Oui") |
### Sortir
1. Sortie standard
: charge utile (booléen): mettent à jour le drapeau.
: Status (String): **Non \ _update, Update \ _Pending, Ready \ _To \ _install, Installation** .
