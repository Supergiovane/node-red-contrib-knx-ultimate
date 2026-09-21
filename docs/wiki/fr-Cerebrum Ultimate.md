---
layout: wiki
title: "Cerebrum Ultimate"
lang: fr
permalink: /wiki/fr-Cerebrum-Ultimate
---
### Mise à jour vers KNX Ultimate 8

La version 7 affiche un petit bouton **Mettre à jour vers v8** en haut de cet éditeur. Il télécharge une sauvegarde des flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)

<br/>

# Cerebrum Ultimate

L’ancien nœud d’IA inclus dans KNX Ultimate a été remplacé par le paquet autonome **Cerebrum Ultimate**.

Cerebrum Ultimate utilise KNX Ultimate comme intégration compatible facultative, au même titre que Home Assistant, HUE, Matter, UniFi Protect et les autres adaptateurs enregistrés. Les nouvelles installations doivent utiliser [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Depuis **7.1.1**, les anciens nœuds `knxUltimateAI` et `knxUltimateAIHomeAssistant` et leur interface web sont de nouveau inclus pour préserver la compatibilité des flows existants. Les nœuds sont masqués dans la palette ; les configurations existantes et les données d’IA enregistrées restent prises en charge. La migration vers le paquet autonome Cerebrum Ultimate est facultative et aucune conversion automatique n’est prévue.

La documentation anglaise complète se trouve dans le [README de Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
