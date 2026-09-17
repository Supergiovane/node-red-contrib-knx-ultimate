---
layout: wiki
title: "KNX Utility"
lang: fr
permalink: /wiki/fr-KNX-Utility
translation_key: "KNX-Utility"
---
# KNX Utility

**KNX Utility** regroupe onze fonctions auxiliaires KNX dans un seul nœud de la palette. Sélectionnez une **Fonction** pour afficher ses paramètres, son icône et ses ports. **KNX Device (KNXUltimate)** reste le nœud principal pour envoyer et recevoir les télégrammes KNX.

## Onze fonctions, un nœud

| Fonction et référence des paramètres | Rôle | Entrées / sorties |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | Signale les appareils en alerte individuellement, ensemble ou comme dernière alerte. | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | Répond aux lectures KNX avec les valeurs configurées ou précédemment reçues. | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/fr-DateTime-Configuration) | Envoie la date et l’heure avec les DPT 19.001, 11.001 et 10.001. | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | Surveille la passerelle ou un appareil KNX et signale les problèmes de connexion. | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | Partage les valeurs KNX dans le stockage du contexte global Node-RED choisi. | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | Enregistre les télégrammes en XML compatible ETS et compte le trafic. | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/fr-Staircase-Configuration) | Commande l’éclairage temporisé d’escalier avec état, forçage et préavis. | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | Gère les commandes de garage, les impulsions, les entrées de sécurité et la fermeture automatique. | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | Rappelle, apprend et mémorise les scènes avec des adresses de groupe et valeurs configurables. | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | Coupe et rétablit les charges configurées selon la consommation et les limites de puissance. | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | Traduit les états Home Assistant en valeurs booléennes avec une propriété d’entrée et une table configurables. | 1 / 1 |

Le tableau indique les ports de chaque fonction. AutoResponder et Global Context travaillent directement avec le bus et le contexte. DateTime utilise les envois programmés et son bouton sur le nœud ; il n’a aucun port d’entrée ou de sortie.

Home Assistant Translator dispose d’une entrée et d’une sortie et ne nécessite pas de passerelle KNX. Choisissez la propriété du message à traduire (par exemple `payload` ou `data.new_state.state`) et modifiez les correspondances `source:true` / `source:false`, comme `open:true` et `closed:false`. La valeur booléenne traduite est envoyée dans `msg.payload` ; reliez la sortie à KNX Device pour écrire sur le bus.

## Configurer un nœud Utility

1. Glissez **KNX Utility** de la palette vers le flux.
2. Choisissez la **Fonction**, la passerelle KNX si nécessaire, puis renseignez les paramètres affichés.
3. Enregistrez le nœud et vérifiez ses connexions. Cliquez sur **Deploy** pour l’activer.

Changer de fonction dans l’éditeur affiche un aperçu de ses paramètres. **Annuler** conserve la configuration précédemment enregistrée. Les liens du tableau ouvrent les paramètres et exemples propres à chaque fonction ; les pages de référence décrivent ces fonctions de KNX Utility.

## Passer de la version 7 à la 8

Convertissez les anciens nœuds séparés avec **KNX Ultimate 7** encore installé, puis faites Deploy avant la mise à niveau. La conversion conserve ID, réglages et connexions et fournit une sauvegarde des flows et Annuler. La version 8 ne charge pas les types retirés.

[Passer de la version 7 à la 8]({{ '/wiki/fr-Migration-8' | relative_url }})
