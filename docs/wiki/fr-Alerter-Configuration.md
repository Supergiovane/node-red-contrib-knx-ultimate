🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
---
# Configuration du nœud d'alerte
Avec le nœud d'alerte, vous pouvez signaler à un affichage ou au nœud nœud-red-controst-tts-ultimate (rétroaction audio) si les périphériques sélectionnés sont alertés, c'est-à-dire qu'ils ont la charge utile **true** .
Le nœud émet des messages à intervalles spécifiés (un message à la fois) contenant les détails de chaque périphérique alerté.Par exemple, le nœud peut vous dire combien et quelles fenêtres sont ouvertes.<br/>
Le nœud reçoit les valeurs des périphériques directement du bus KNX.De plus, vous pouvez envoyer des messages personnalisés au nœud, non liés aux appareils KNX.<br/>
L'exemple de page explique comment utiliser le nœud.<br/>
- **passerelle**
> KNX Gateway sélectionné.Il est également possible de ne sélectionner aucune passerelle;Dans ce cas, seuls les messages entrants au nœud seront pris en compte.
- **Nom**
> Nom du nœud.
- **Type de démarrage du cycle d'alerte**
> Ici, vous pouvez sélectionner l'événement qui sautera le début de l'envoi de messages à partir de périphériques alertés.
- **Intervalle entre chaque msg (en secondes)**
> Intervalle entre chaque message sortant du nœud.
Appareils ## à surveiller
Ici, vous pouvez ajouter des appareils à surveiller.<br/>
Entrez le nom du périphérique ou son adresse de groupe.<br/>
- **Lire la valeur de chaque périphérique sur la connexion / reconnecter**
> Sur la connexion / la reconnexion, le nœud enverra une demande «lire» chaque périphérique appartenant à la liste.
- **Ajouter le bouton**
> Ajoutez une ligne à la liste.
- **lignes de l'appareil ** > Le premier champ est l'adresse de groupe (mais vous pouvez également saisir n'importe quel texte, que vous pouvez utiliser avec les messages entrants, voir l'exemple de page), le second est le nom du périphérique**(Max 14 Chars)** , le troisième est le nom long du périphérique.
- **Bouton de suppression**
> Supprime un appareil de la liste.
<br/>
<br/>
## Message du nœud
PIN1: Le nœud émet un message pour chaque périphérique alerté, à des intervalles sélectionnables. <br/>
PIN2: Le nœud émet un message unique contenant tous les appareils alertés. <br/>
Pin3: le nœud émet un message contenant uniquement le dernier périphérique alerté. <br/>
**pin1** ```javascript
msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}
``` **Pin2** ```javascript
msg = {
    "topic":"door, 0/0/11, 0/1/2, 0/0/9",
    "devicename":"Main Door, Applique soggiorno, Applique taverna, Luce studio",
    "longdevicename":"Main entry Door, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
    "count":4,
    "payload":true
    }
``` **pin3** ```javascript
msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}
```Message sortant lorsque tous les appareils sont au repos
**pin1, pin2, pin3** ```javascript
msg = {
    "topic":"",
    "count":0,
    "devicename":"",
    "longdevicename":"",
    "payload":false
}
```<br/>
<br/>
## Message dans le nœud```javascript
msg.readstatus = true
```Lisez la valeur de chaque appareil appartenant à la liste.```javascript
msg.start = true
```Le cycle d'envoi de tous les appareils alertés commence.Le cycle se termine par le dernier dispositif alerté.Pour répéter le cycle, envoyez ce message entrant à nouveau.
<br/>
**Alerte de périphérique personnalisée** <br/>
Pour mettre à jour la valeur vraie / fausse d'un appareil personnalisé, vous pouvez envoyer ce message entrant```javascript
msg = {
    "topic":"door",
    "payload":true // Or false to reset the alert for this device
}
```<br/>
## ÉCHANTILLON
<a href = "/node-red-contrib-knx-ultimate/wiki/Samplealerter"> Cliquez ici pour l'exemple </a>
<br/>
<br/>
<br/>
