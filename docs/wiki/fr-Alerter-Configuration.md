---
layout: wiki
title: "Alerter-Configuration"
lang: fr
permalink: /wiki/fr-Alerter-Configuration/
---
# Configuration du nœud d'alerte

Avec le nœud d'alerte, vous pouvez signaler à un affichage ou au nœud nœud-red-controst-tts-ultimate (rétroaction audio) si les périphériques sélectionnés sont alertés, c'est-à-dire qu'ils ont la charge utile **true** .
Le nœud émet des messages à intervalles spécifiés (un message à la fois) contenant les détails de chaque périphérique alerté.Par exemple, le nœud peut vous dire combien et quelles fenêtres sont ouvertes.

Le nœud reçoit les valeurs des périphériques directement du bus KNX.De plus, vous pouvez envoyer des messages personnalisés au nœud, non liés aux appareils KNX.

L'exemple de page explique comment utiliser le nœud.

- **passerelle**

> KNX Gateway sélectionné.Il est également possible de ne sélectionner aucune passerelle;Dans ce cas, seuls les messages entrants au nœud seront pris en compte.

- **Nom**

> Nom du nœud.

- **Type de démarrage du cycle d'alerte**

> Ici, vous pouvez sélectionner l'événement qui sautera le début de l'envoi de messages à partir de périphériques alertés.

- **Intervalle entre chaque msg (en secondes)**

> Intervalle entre chaque message sortant du nœud.

Appareils ## à surveiller

Ici, vous pouvez ajouter des appareils à surveiller.

Entrez le nom du périphérique ou son adresse de groupe.

- **Lire la valeur de chaque périphérique sur la connexion / reconnecter**

> Sur la connexion / la reconnexion, le nœud enverra une demande «lire» chaque périphérique appartenant à la liste.

- **Ajouter le bouton**

> Ajoutez une ligne à la liste.

- **lignes de l'appareil ** > Le premier champ est l'adresse de groupe (mais vous pouvez également saisir n'importe quel texte, que vous pouvez utiliser avec les messages entrants, voir l'exemple de page), le second est le nom du périphérique**(Max 14 Chars)** , le troisième est le nom long du périphérique.

- **Bouton de suppression**

> Supprime un appareil de la liste.

## Message du nœud

PIN1: Le nœud émet un message pour chaque périphérique alerté, à des intervalles sélectionnables. 

PIN2: Le nœud émet un message unique contenant tous les appareils alertés. 

Pin3: le nœud émet un message contenant uniquement le dernier périphérique alerté. 

**pin1** 

```javascript

msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}

```

**Pin2** 

```javascript

msg = {
    "topic":"door, 0/0/11, 0/1/2, 0/0/9",
    "devicename":"Main Door, Applique soggiorno, Applique taverna, Luce studio",
    "longdevicename":"Main entry Door, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
    "count":4,
    "payload":true
    }

```

**pin3** 

```javascript

msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}

```Message

sortant lorsque tous les appareils sont au repos

**pin1, pin2, pin3** 

```javascript

msg = {
    "topic":"",
    "count":0,
    "devicename":"",
    "longdevicename":"",
    "payload":false
}

```

## Message dans le nœud

```javascript

msg.readstatus = true
```Lisez

la valeur de chaque appareil appartenant à la liste.

```javascript

msg.start = true
```Le

cycle d'envoi de tous les appareils alertés commence.Le cycle se termine par le dernier dispositif alerté.Pour répéter le cycle, envoyez ce message entrant à nouveau.

**Alerte de périphérique personnalisée** 

Pour mettre à jour la valeur vraie / fausse d'un appareil personnalisé, vous pouvez envoyer ce message entrant

```javascript

msg = {
    "topic":"door",
    "payload":true // Or false to reset the alert for this device
}

```

## ÉCHANTILLON

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Samplealerter"> Cliquez ici pour l'exemple </a>
