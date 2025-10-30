---
layout: wiki
title: "HUE Plug"
lang: fr
permalink: /wiki/fr-HUE%20Plug
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Plug) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Plug) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Plug) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Plug) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Plug) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Plug)

# Plug / prise

## Aperçu

Le nœud Hue Plug relie une fiche Smart Hue Philips (Service `Plug`) avec des adresses de groupe KNX afin que vous puissiez contrôler l'alimentation et suivre l'état directement à partir du bus.

- prend en charge **Contrôle ON / OFF ** et**Feedback d'état** .
- mappage facultatif de la teinte `power_state` (on / standby).
- Peut exposer les broches d'entrée / sortie de Node-Red pour transmettre les événements de teinte aux flux ou envoyer des charges utiles API avancées.

Configuration ##

| Champ | Description |
|-|-|
|KNX GW |KNX Gateway utilisé pour les télégrammes |
|Hue Bridge |Bridge Hue configuré |
|Nom |Sélectionnez la fiche Hue dans la liste de saisie semi-automatique |
|Contrôle |KNX GA pour les commandes ON / OFF (Boolean DPT) |
|Statut |GA pour les commentaires ON / OFF provenant de Hue |
|État de pouvoir |Hue en miroir en option `power_state` (booléen / texte) |
|Lire l'état au démarrage |Lorsqu'il est activé, le nœud émet l'état de fiche actuel sur le déploiement / la connexion |
|Broches d'E / S de nœud |Activer les broches d'entrée / sortie rouge-rouge.L'entrée attend des charges utiles de l'API Hue (par exemple `{on: {on: true}}`).La sortie transmet chaque événement Hue.|

## conseils de mappage KNX

- Utilisez un point de données booléen (par exemple DPT 1.001) pour la commande et l'état.
- Si vous exposez `Power_State`, mappez-le à un GA booléen (true =` on`, false = `standby`).
- Pour les demandes de lecture (`GroupValue_Read`), le nœud renvoie la dernière valeur de teinte en cache.

## Intégration de flux

Lorsque _Node E / S Pins_ sont activés:

- **Entrée:** Envoyer des charges utiles Hue V2 pour effectuer des actions avancées (par exemple `msg.on = {on: true}`).
- **sortie:** Recevoir un objet d'événement `{Payé: Boolean, ON, Power_State, RawEvent}` Chaque fois que Hue signale un changement.

## Référence de l'API Hue

Le nœud utilise `/ ressource / plug / {id}` sur https.Les modifications d'état sont fournies via le flux d'événements Hue et mises en cache pour les réponses KNX Read.
