---
layout: wiki
title: "Passer de la version 7 à la 8"
lang: fr
permalink: /wiki/fr-Migration-8
translation_key: "Migration-8"
---

# Passer de la version 7 à la 8

La version 8 retire les anciens nœuds HUE, Matter et IA, leurs configurations et les nœuds Utility séparés. Terminez la migration pendant que KNX Ultimate 7 est encore installé.

> ▶️ [Voir le guide vidéo pour migrer de KNX Ultimate 7 vers 8](https://youtu.be/fpNNi1jZZSc) *(en italien)*

1. Sauvegardez tout le dossier utilisateur de Node-RED : flows, identifiants, paramètres et `knxultimatestorage`. Le JSON des flows seul ne sauvegarde pas les appairages Matter.

2. Avec KNX Ultimate 7, utilisez **Migrate KNX** ou le bouton de conversion de KNX Utility pour les anciens nœuds Utility. Vérifiez tous les flows et sous-flows, puis faites Deploy.

3. Installez `node-red-contrib-hue-ultimate` et/ou `node-red-contrib-matter-ultimate`, puis redémarrez Node-RED. Acceptez la proposition de migration. HUE convertit les anciens nœuds individuels et l’ancien Controller multimode.

4. Vérifiez les flows convertis et faites Deploy. Les ID et références de configuration sont conservés. Gardez le même dossier utilisateur et ne supprimez pas `knxultimatestorage/matter` : il contient les identités d’appairage et les fabrics Matter.

5. Remplacez ou retirez `knxUltimateAI` et `knxUltimateAIHomeAssistant` avant la mise à niveau. Cerebrum Ultimate est le package IA séparé ; aucune conversion IA automatique n’est prévue. Retirez aussi les anciennes configurations inutilisées.

6. Vérifiez le fonctionnement des appareils, puis installez KNX Ultimate 8 et redémarrez Node-RED. Les nœuds HUE et Matter utilisant KNX conservent la passerelle existante.

## Si l’installation est bloquée

L’installation de la version 8 recherche les anciens nœuds HUE et Matter dans les flows sauvegardés, y compris les configurations, flows désactivés et sous-flows. Installer les nouveaux packages ne suffit pas : convertissez puis faites Deploy. Les stockages personnalisés et modifications non enregistrées ne peuvent pas tous être vérifiés ; les étapes de migration restent nécessaires.

Si la mise à niveau a été faite trop tôt, réinstallez KNX Ultimate 7 et redémarrez Node-RED avant de migrer. Restaurez la sauvegarde complète si nécessaire. Ne supprimez pas les nœuds inconnus et ne réinitialisez pas les appairages Matter.

## Documentation

- [KNX Utility]({{ '/wiki/fr-KNX-Utility' | relative_url }})
- [HUE Ultimate](https://supergiovane.github.io/node-red-contrib-hue-ultimate/fr/index.html)
- [Matter Ultimate](https://supergiovane.github.io/node-red-contrib-matter-ultimate/fr/index.html)
- [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)
