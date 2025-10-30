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
**pin1** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
``` **Pin2** ```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "入户门, 客厅壁灯, 地下室壁灯, 书房灯",
  longdevicename: "主入户门, 客厅左侧壁灯, 地下室右侧壁灯, 书房顶灯",
  count: 4,
  payload: true
}
``` **pin3** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```Sortie lorsque tous les périphériques sont stationnaires (pas d'alarmes):
**pin1, pin2, pin3** ```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```<br/>
<br/>
## Message d'entrée pour le nœud```javascript
msg.readstatus = true
```Lit la valeur actuelle de chaque appareil dans la liste.```javascript
msg.start = true
```Démarrez un sondage qui "traverse tous les dispositifs d'alarme et les sorties à tour de rôle".Le sondage se termine après la dernière sortie du dispositif; Si vous interrogez, envoyez à nouveau le message d'entrée.
<br/>
**Alarme de périphérique personnalisée** <br/>
Pour mettre à jour l'état d'un périphérique personnalisé (true / false), envoyez le message d'entrée suivant:```javascript
msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```<br/>
## Exemple
<a href = "/node-red-contrib-knx-ultimate/wiki/Samplealerter"> Cliquez ici pour afficher l'exemple </a>
<br/>
<br/>
<br/>
