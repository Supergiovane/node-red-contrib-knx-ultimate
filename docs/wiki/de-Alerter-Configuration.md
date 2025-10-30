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


# Alerter - Node-Konfiguration

Mit dem Node "Alerter" kannst du auf einem Display oder über den Node node-red-contrib-tts-ultimate (Sprachausgabe) melden, welche ausgewählten Geräte einen Alarmzustand haben, also `payload` **true** liefern.
Der Node gibt in einstellbaren Intervallen jeweils eine Nachricht aus, die die Details des aktuell gemeldeten Geräts enthält. So kannst du dir z. B. sagen lassen, wie viele und welche Fenster offen sind.<br/>
Der Node liest die Werte der Geräte direkt vom KNX‑BUS. Zusätzlich kannst du eigene (nicht an KNX‑Geräte gebundene) Meldungen an den Node schicken.<br/>
Auf der Beispielseite ist die Nutzung im Flow gezeigt.<br/>

- **Gateway**

> Gewähltes KNX‑Gateway. Du kannst auch kein Gateway auswählen; dann werden nur eingehende Nachrichten an den Node ausgewertet.

- **Name**

> Anzeigename des Nodes.

- **Startart des Meldungszyklus**

> Ereignis, das den Start des Sendezyklus für die gemeldeten Geräte auslöst.

- **Intervall zwischen den Meldungen (Sekunden)**

> Zeitabstand zwischen zwei aufeinanderfolgenden Ausgaben.

## Zu überwachende Geräte

Hier fügst du die zu überwachenden Geräte hinzu.<br/>
Gib die Gruppenadresse oder eine Bezeichnung für das Gerät ein.<br/>

- **Wert jedes Geräts bei Verbindungsaufbau/-wiederherstellung lesen**

> Beim Start bzw. bei einer Wiederverbindung sendet der Node für jedes gelistete Gerät eine Leseanforderung.

- **Schaltfläche "ADD"**

> Fügt eine neue Zeile hinzu.

- **Gerätezeilen ** > Erstes Feld: Gruppenadresse (alternativ eine freie Bezeichnung, die du mit Eingangs­nachrichten verwenden kannst; siehe Beispielseite). Zweites Feld: Kurzname des Geräts (**MAX. 14 ZEICHEN** ). Drittes Feld: Langname.

- **Schaltfläche "DELETE"**

> Entfernt das Gerät aus der Liste.

<br/>
<br/>

## Ausgaben des Nodes

PIN1: eine Nachricht pro gemeldetem Gerät, im gewählten Intervall.<br/>
PIN2: eine Sammelmeldung mit allen aktuell gemeldeten Geräten.<br/>
PIN3: eine Nachricht nur für das zuletzt gemeldete Gerät.<br/>

**PIN1**

```javascript
msg = {
  topic: "0/1/12",
  count: 3, // Gesamtzahl gemeldeter Geräte
  devicename: "Fenster Schlafzimmer",
  longdevicename: "Hauptfenster Schlafzimmer",
  payload: true
}
```

**PIN2**

```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "Haustür, Applik Wohnzimmer, Applik Hobbyraum, Licht Büro",
  longdevicename: "Haupteingangstür, linke Applik Wohnzimmer, rechte Applik Hobbyraum, Deckenlicht Büro",
  count: 4,
  payload: true
}
```

**PIN3**

```javascript
msg = {
  topic: "0/1/12",
  count: 3, // Gesamtzahl gemeldeter Geräte
  devicename: "Fenster Schlafzimmer",
  longdevicename: "Hauptfenster Schlafzimmer",
  payload: true
}
```

Ausgabe, wenn alle Geräte im Ruhezustand sind:

**PIN1, PIN2, PIN3**

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

## Eingänge des Nodes

```javascript
msg.readstatus = true
```

Liest den aktuellen Wert aller gelisteten Geräte.

```javascript
msg.start = true
```

Startet den Sendezyklus über alle Geräte im Alarmzustand. Der Zyklus endet mit dem letzten Gerät; zum Wiederholen den Eingang erneut senden.

<br/>

**Benutzerdefinierter Gerätealarm** <br/>

Um den Zustand (true/false) eines eigenen Geräts zu setzen, sende diese Eingangs­nachricht:

```javascript
msg = {
  topic: "door",
  payload: true // oder false, um die Meldung für dieses Gerät zurückzusetzen
}
```

<br/>

## Beispiel

<a href="/node-red-contrib-knx-ultimate/wiki/SampleAlerter">HIER KLICKEN FÜR DAS BEISPIEL</a>

<br/>
<br/>
<br/>
