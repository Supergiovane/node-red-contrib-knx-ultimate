---
layout: wiki
title: "Premiers pas"
lang: fr
permalink: /wiki/fr-Getting-Started
translation_key: "Getting-Started"
---

# Premiers pas

Pour une nouvelle installation, suivez ces étapes. Si vos flows utilisent déjà KNX Ultimate 7, commencez par le guide de mise à niveau.

> [Passer de la version 7 à la 8]({{ '/wiki/fr-Migration-8' | relative_url }})

Nécessite Node.js 20.18.1 minimum et Node-RED 3.1.1 minimum.

1. Ouvrez **Gérer la palette → Installer** et installez `node-red-contrib-knx-ultimate`. Redémarrez Node-RED.

2. Placez **KNX Device** dans un flow. Ajoutez une passerelle avec l’adresse et les paramètres de connexion de votre interface KNX. Importez les adresses ETS si disponibles.

3. Choisissez une adresse de groupe de votre installation et son datapoint. Pour marche/arrêt, utilisez le datapoint booléen prévu, par exemple `1.001`.

4. Reliez un nœud **Inject** avec un `msg.payload` booléen (`true` ou `false`) à KNX Device. Reliez sa sortie à **Debug** pour voir les télégrammes reçus.

5. Vérifiez l’adresse puis cliquez sur **Deploy**. Utilisez Inject pour envoyer la commande. Activez **React to response** pour voir les réponses aux demandes de lecture.

## Le premier flow, étape par étape

L’animation ci-dessous construit un premier flow : un nœud **KNX Device** pour l’adresse de groupe `1/1/0` avec le datapoint `1.001`, sa configuration de passerelle et un nœud **Debug**.

1. Faites glisser **KNX DEVICE** de la palette dans le flow et double-cliquez dessus.
2. À côté de **Gateway**, cliquez sur **+**. La configuration de la passerelle recherche les interfaces KNX/IP du réseau : tapez l’adresse de la vôtre (ici `192.168.1.117`) et choisissez-la dans la liste. L’adresse, le port et le protocole sont remplis. Cliquez sur **Add**.
3. Dans **Group Addr.**, tapez `1/1/0`, nommez le nœud et gardez le datapoint `1.001 Switch`. Cliquez sur **Done**.
4. Faites glisser un nœud **Debug** dans le flow, reliez-y la sortie de KNX Device et cliquez sur **Deploy**.

Quand le nœud affiche **Connected. On duty.**, chaque télégramme envoyé à `1/1/0` sur le bus apparaît dans la barre latérale **Debug**.

![Création d’un nœud KNX Device pour l’adresse de groupe 1/1/0, de sa configuration de passerelle et d’un nœud Debug](/node-red-contrib-knx-ultimate/assets/getting-started/first-flow.gif)

## Lire une valeur sur le bus

Activez le bouton manuel de KNX Device. Ses actions sont **Toggle boolean**, **Envoyer KNX Read** (deuxième choix) et **Écrire une valeur personnalisée**. Choisissez Read et cliquez pour interroger l’adresse configurée. Cette action du bouton n’est pas disponible en mode universel. Depuis un flow, vous pouvez aussi envoyer `msg.readstatus = true`.

[KNX Device]({{ '/wiki/fr-Device' | relative_url }}) · [KNX Gateway]({{ '/wiki/fr-Gateway-configuration' | relative_url }}) · [Exemples]({{ '/wiki/fr--SamplesHome' | relative_url }})

## Tutoriels vidéo

[Max Supervibe — YouTube](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)
