🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)
<!-- NAV START -->
Navigation: [Startseite](/node-red-contrib-knx-ultimate/wiki/de-Home)  
Übersicht: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) • [Sicherheit](/node-red-contrib-knx-ultimate/wiki/de-SECURITY) • [Doku: Sprachleiste](/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar)  
KNX Geräteknoten: [Gateway](/node-red-contrib-knx-ultimate/wiki/de-Gateway-configuration) • [Gerät](/node-red-contrib-knx-ultimate/wiki/de-Device) • [Knotenschutz](/node-red-contrib-knx-ultimate/wiki/de-Protections)  
Weitere KNX‑Knoten: [Szenencontroller](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) • [Laststeuerung](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/de-knxUltimateViewer) • [Auto‑Responder](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) • [HA‑Übersetzer](/node-red-contrib-knx-ultimate/wiki/de-HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/de-HUE+Bridge+configuration) • [Licht](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) • [Batterie](/node-red-contrib-knx-ultimate/wiki/de-HUE+Battery) • [Taster](/node-red-contrib-knx-ultimate/wiki/de-HUE+Button) • [Kontakt](/node-red-contrib-knx-ultimate/wiki/de-HUE+Contact+sensor) • [Geräte‑SW‑Update](/node-red-contrib-knx-ultimate/wiki/de-HUE+Device+software+update) • [Lichtsensor](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light+sensor) • [Bewegung](/node-red-contrib-knx-ultimate/wiki/de-HUE+Motion) • [Szene](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/de-HUE+Tapdial) • [Temperatur](/node-red-contrib-knx-ultimate/wiki/de-HUE+Temperature+sensor) • [Zigbee‑Konnektivität](/node-red-contrib-knx-ultimate/wiki/de-HUE+Zigbee+connectivity)  
Beispiele: [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/de-Manage-Wiki)
<!-- NAV END -->
---


# Alerter -Knotenkonfiguration

Verwenden Sie den Alerter-Knoten, um zu fordern, ob sich das ausgewählte Gerät in einem Alarmzustand auf dem Monitor oder über den Knoten-Red-Contribrib-TTS-Ultimate-Knoten (Voice Broadcast) befindet, dh "Payload" **true** .
Dieser Knoten gibt Nachrichten aus, die die Details des aktuellen Alarmgeräts in einem konfigurierbaren Zeitintervall (einzeln) enthalten.Zum Beispiel kann es Ihnen sagen, wie viele Fenster geöffnet sind.<br/>
Der Knoten liest direkt den Gerätewert aus dem KNX -Bus.Darüber hinaus können Sie auch benutzerdefinierte Warnungen an Knoten senden, unabhängig von KNX -Geräten.<br/>
Die Beispielseite zeigt, wie es im Prozess verwendet wird.<br/>

- **Gateway (Gateway)**

> Wählen Sie das zu verwendende KNX -Gateway aus. Sie können das Gateway auch nicht auswählen.Zu diesem Zeitpunkt werden nur Nachrichten, die in den Knoten eintreten, nur verarbeitet.

- **Name (Name)**

> Knotenname.

- **So starten Sie Alarmabfragen**

> Wählen Sie das Ereignis aus, das das Senden der Alarmmeldung auslöst.

- **Intervall jeder Nachricht (Sekunden)**

> Das Zeitintervall zwischen zwei aufeinanderfolgenden Ausgabenachrichten.

## Ausrüstung, die überwacht werden muss

Fügen Sie die Geräte hinzu, die hier überwacht werden müssen.<br/>
Füllen Sie die Gruppenadresse des Geräts ein oder geben Sie eine Beschriftung für das Gerät an.<br/>

- **Lesen Sie den Wert jedes Geräts beim Anschließen/Wiederverbinden**

> Beim Starten oder Wiederverbinden sendet der Knoten eine Leseanforderung für jedes Gerät in der Liste.

- **Schaltfläche add**

> Fügen Sie der Liste eine Zeile hinzu.

- **Ausrüstungslinie ** > Die erste Spalte ist die Gruppenadresse (Sie können auch jeden Text mit Eingabemeldungen ausfüllen; siehe Beispielseite).Die zweite Spalte ist die Abkürzung des Geräts (**bis zu 14 Zeichen** ).Die dritte Spalte ist der vollständige Name des Geräts.

- **Schaltfläche löschen**

> Entfernen Sie das Gerät aus der Liste.

<br/>
<br/>

## Die Ausgabenachricht des Knotens

Pin1: Jedes Alarmgerät gibt eine Meldung gemäß dem festgelegten Intervall aus.<br/>
Pin2: Ausgabe einer zusammenfassenden Meldung, die alle Geräte im Alarmzustand enthält.<br/>
Pin3: Nur das letzte Gerät, das den Alarmstatus eingegeben hat, wird ausgegeben.<br/>

**Pin1** ```javascript
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
``` **Pin3** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```Ausgabe, wenn alle Geräte stationär sind (keine Alarme):

**Pin1, Pin2, Pin3** ```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```<br/>
<br/>

## Eingabenachricht für den Knoten```javascript
msg.readstatus = true
```Liest den aktuellen Wert jedes Geräts in der Liste.```javascript
msg.start = true
```Starten Sie eine Umfrage, in der "alle Alarmgeräte und Ausgaben nacheinander durchlaufen".Umfragen endet nach dem letzten Geräteausgang; Wenn Sie erneut befragen, senden Sie die Eingabenachricht erneut.

<br/>

**benutzerdefinierter Gerätealarm** <br/>

Um den Status eines benutzerdefinierten Geräts (True/False) zu aktualisieren, senden Sie die folgende Eingabenachricht:```javascript
msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```<br/>

## Beispiel

<a href = "/node-red-contrib-knx-ultimate/wiki/samplealerter"> klicken Sie hier, um das Beispiel anzuzeigen </a>

<br/>
<br/>
<br/>
