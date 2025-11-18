---
layout: wiki
title: "zh-CN-Alerter-Configuration"
lang: fr
permalink: /wiki/fr-zh-CN-Alerter-Configuration
---
---
# Configuration du nœud d'alerte
Utilisez le nœud Alerter pour inviter si le périphérique sélectionné est dans un état d'alarme sur le moniteur ou via le nœud nœud-red-Contrib-tts-ultimate (vocal Broadcast), c'est-à-dire que la `charge utile 'est **true** .
Ce nœud publie des messages contenant les détails du périphérique d'alarme actuel à un intervalle de temps configurable (un à la fois).Par exemple, il peut vous dire "combien de fenêtres sont ouvertes".<br/>
Le nœud lit directement la valeur de l'appareil à partir du bus KNX.De plus, vous pouvez également envoyer des alertes personnalisées aux nœuds, quels que soient les appareils KNX.<br/>
L'exemple de page montre comment il est utilisé dans le processus.<br/>
- **passerelle (passerelle)**
> Sélectionnez la passerelle KNX à utiliser. Vous ne pouvez pas non plus sélectionner la passerelle;Seuls les messages entrant dans le nœud sont traités pour le moment.
- **nom (nom)**
> Nom du nœud.
- **Comment démarrer le sondage d'alarme**
> Sélectionnez l'événement qui déclenche le début de l'envoi du message d'alarme.
- **Intervalle de chaque message (secondes)**
> L'intervalle de temps entre deux messages de sortie consécutifs.
## Équipement qui doit être surveillé
Ajoutez les appareils qui doivent être surveillés ici.<br/>
Remplissez l'adresse de groupe de l'appareil ou spécifiez une étiquette pour l'appareil.<br/>
- **Lisez la valeur de chaque périphérique lors de la connexion / de la reconnexion**
> Lors du démarrage ou de la reconnexion, le nœud envoie une demande de lecture pour chaque périphérique dans la liste.
- **Ajouter le bouton**
> Ajoutez une ligne à la liste.
- **Ligne d'équipement ** > La première colonne est l'adresse de groupe (vous pouvez également remplir n'importe quel texte à utiliser avec des messages d'entrée; voir l'exemple de page).La deuxième colonne est l'abréviation de l'appareil (**jusqu'à 14 caractères** ).La troisième colonne est le nom complet de l'appareil.
- **Bouton de suppression**
> Supprimez l'appareil de la liste.
<br/>
<br/>
## Le message de sortie du nœud
PIN1: Chaque périphérique d'alarme diffuse un message en fonction de l'intervalle de définition.<br/>
PIN2: Sortie d'un message récapitulatif contenant tous les périphériques à l'état d'alarme.<br/>
Pin3: Seul le dernier périphérique qui est entré dans l'état d'alarme est sorti.<br/>
**pin1** 

```javascript

msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```

**Pin2** 

```javascript

msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "入户门, 客厅壁灯, 地下室壁灯, 书房灯",
  longdevicename: "主入户门, 客厅左侧壁灯, 地下室右侧壁灯, 书房顶灯",
  count: 4,
  payload: true
}
```

**pin3** 

```javascript

msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```Sortie

lorsque tous les périphériques sont stationnaires (pas d'alarmes):
**pin1, pin2, pin3** 

```javascript

msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```

<br/>
<br/>
## Message d'entrée pour le nœud

```javascript

msg.readstatus = true
```Lit

la valeur actuelle de chaque appareil dans la liste.

```javascript

msg.start = true
```Démarrez

un sondage qui "traverse tous les dispositifs d'alarme et les sorties à tour de rôle".Le sondage se termine après la dernière sortie du dispositif; Si vous interrogez, envoyez à nouveau le message d'entrée.
<br/>
**Alarme de périphérique personnalisée** <br/>
Pour mettre à jour l'état d'un périphérique personnalisé (true / false), envoyez le message d'entrée suivant:

```javascript

msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```

<br/>
## Exemple
<a href = "/node-red-contrib-knx-ultimate/wiki/Samplealerter"> Cliquez ici pour afficher l'exemple </a>
<br/>
<br/>
<br/>
