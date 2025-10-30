---
layout: wiki
title: "HUE Tapdial"
lang: fr
permalink: /wiki/fr-HUE%20Tapdial
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Tapdial) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Tapdial) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Tapdial) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Tapdial) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Tapdial) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Tapdial)

Le Node **Hue Tap Dial** Maps Le service rotatif du Tap Down Tap To KNX et transmet les événements de teinte brute à votre flux.Utilisez l'icône d'actualisation à côté du champ de périphérique après avoir associé un nouveau cadran sur le pont.

Onglets ###

- **Mappage** - Sélectionnez le KNX GA et le DPT utilisés pour les événements de rotation.Points de données pris en charge: DPT 3.007 (relative DIM), DPT 5.001 (niveau absolu 0-100%) et DPT 232.600 (contrôle des couleurs du fournisseur).
- **comportement** - afficher ou masquer la broche de sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est configurée, la sortie est maintenue activée, les événements de teinte atteignent toujours le flux.

### Paramètres généraux

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway utilisée pour GA Assomple automatique.|
|Hue Bridge |Hue Bridge hébergeant le cadran du robinet.|
|Hue Tap Dial |Dispositif rotatif à contrôler (Ambordage automatique; le bouton de rafraîchissement recharge la liste).|

Onglet de mappage ###

| Propriété | Description |
|-|-|
|Tourner GA |KNX GA Receiving Rotation Events (prend en charge DPT 3.007, 5.001, 232.600).|
|Nom |Étiquette amicale pour le GA.|

### sorties

| # | Port | Télélée utile |
|-|-| - |
| 1 | Sortie standard | `msg.payload` (objet) Événement de teinte brute émise par le cadran du robinet. |

> ℹ️ Les widgets spécifiques à KNX n'apparaissent qu'après avoir sélectionné une passerelle KNX;L'onglet de mappage reste caché jusqu'à la configuration du pont et de la passerelle.
