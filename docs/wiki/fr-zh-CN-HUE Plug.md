---
layout: wiki
title: "zh-CN-HUE Plug"
lang: fr
permalink: /wiki/fr-zh-CN-HUE%20Plug/
---
---
# Socket / plug
## Aperçu
Le nœud Hue Plug mappe Philips Hue Smart Sockets aux adresses du groupe KNX à implémenter:
- Contrôle marche / arrêt dans le bus;
- Feedback d'état de la plate-forme Hue;
- Surveillance `Power_State` (ON / STANDY) facultative.
Configuration ##
| Champs |Description |
|-|-|
| KNX GW | Passerelles KNX utilisées |
| Hue Bridge | Bridge Hue Utilisé |
| Nom | Socket à contrôler (invite automatique) |
| Contrôle | Envoyer une adresse de groupe KNX On / Off (Bolean DPT) |
| Statut | Rapport Hue ON / OFF Statut Adresse de réception |
| Statut de puissance | Adresse de groupe facultative pour le mappage Hue `Power_State` |
| Lire l'état au démarrage | Envoyez l'état actuel immédiatement pendant le déploiement |
| PIN | Activer la broche d'entrée / sortie du nœud-rouge pour un contrôle avancé ou un transfert d'événements |
## Recommandations KNX
- Le contrôle et l'état sont recommandés pour utiliser DPT 1.xxx.
- `Power_State` peut être mappé à une valeur booléenne (true = on, false = standby), ou utiliser la classe de texte DPT pour afficher la chaîne d'origine.
- Lorsqu'une lecture KNX (`GroupValue_Read`) est reçue, le nœud revient au statut de teinte en cache.
## Intégration de flux
Lorsque les broches sont activées:
- **entrée** : Envoyer la charge utile Hue V2 (comme `{on: {on: true}}`).
- **Output** : Output `{upload, on, power_state, rawevent}` chaque fois événement de teinte.
## API Hue
Le nœud appelle `/ ressource / plug / {id}`.Les flux d'événements Hue sont utilisés pour capturer les changements d'état et se synchroniser en KNX.
