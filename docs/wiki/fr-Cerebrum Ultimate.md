---
layout: wiki
title: "Cerebrum Ultimate"
lang: fr
permalink: /wiki/fr-Cerebrum-Ultimate
---

# Cerebrum Ultimate

L’ancien nœud d’IA inclus dans KNX Ultimate a été remplacé par le paquet autonome **Cerebrum Ultimate**.

Cerebrum Ultimate utilise KNX Ultimate comme intégration compatible facultative, au même titre que Home Assistant, HUE, Matter, UniFi Protect et les autres adaptateurs enregistrés. Les nouvelles installations doivent utiliser [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

À partir de **7.1.0-beta.0**, `knxUltimateAI`, `knxUltimateAIHomeAssistant` et leur interface web ont été supprimés de KNX Ultimate. Les flows existants contenant ces types afficheront des nœuds inconnus. Migrez ces flows vers le paquet autonome Cerebrum Ultimate avant la mise à jour ; aucune conversion automatique n’est prévue. Les données d’IA enregistrées sur disque restent intactes.

La documentation anglaise complète se trouve dans le [README de Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
