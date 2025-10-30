🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)

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

# Scene Controller

Der Scene‑Controller‑Node verhält sich wie ein KNX‑Szenencontroller: Szenen speichern und abrufen.

## Node‑Einstellungen

| Property | Beschreibung |
|--|--|
| Gateway | Gewähltes KNX‑Gateway. |
| Scene Recall | **Datapoint ** und**Trigger Value** . Gruppenadresse zum Abrufen (z. B. `0/0/1`). Reagiert auf Telegramme an dieser GA, um die Szene abzurufen. DPT ist der Datentyp der Recall‑GA. Trigger Value ist der Wert, der das Abrufen auslöst. Hinweis: Für DIM‑Befehle als Trigger den passenden Dimm‑Objektwert setzen (`{decr_incr:1,data:5}` hoch, `{decr_incr:0,data:5}` runter). |
| Scene Save | **Datapoint ** und**Trigger Value** . Gruppenadresse zum Speichern (z. B. `0/0/2`). Speichert die aktuellen Werte aller Geräte in der Szene in nichtflüchtigem Speicher. DPT ist der Datentyp der Save‑GA. Trigger Value löst das Speichern aus (DIM wie oben). |
| Node name | Anzeigename (z. B. "Recall: … / Save: …"). |
| Topic | Topic des Nodes. |

## Szenenkonfiguration

Füge Geräte wie bei einem echten KNX‑Szenencontroller hinzu. Jede Zeile entspricht einem Gerät.

Der Node speichert automatisch aktualisierte Werte aller Aktoren der Szene, sobald sie vom BUS eintreffen.

| Property | Beschreibung |
|--|--|
| ADD | Zeile hinzufügen. |
| Zeilenfelder | 1) Gruppenadresse 2) Datapoint 3) Default‑Wert in der Szene (durch Scene Save überschreibbar). Darunter: Gerätename.<br/> Eine Pause einfügen: **wait ** im ersten Feld und eine Zahl im letzten Feld (Millisekunden), z. B. `2000`.<br/>**wait** akzeptiert auch Sekunden/Minuten/Stunden: `12s`, `5m`, `1h`. |
| Remove | Gerät/Zeile entfernen. |

## Ausgaben

```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```

---

## Eingänge (INPUT)

Primär reagiert der Node auf KNX‑Telegramme, kann aber auch per Nachricht gesteuert werden. Eingänge vom BUS lassen sich deaktivieren, sodass nur Flow‑Nachrichten wirken.

**Szene abrufen**

```javascript
msg.recallscene = true; return msg;
```

**Szene speichern**

```javascript
msg.savescene = true; return msg;
```

**Aktuellen Wert einer GA speichern**

Obwohl die Szene Aktor‑Werte automatisch mitführt, kann es sinnvoll sein, als "wahren Szenenwert" den Ist‑Wert einer anderen GA (z. B. Status statt Befehl) zu speichern.

Beispiel Rolladen: absolute Positions‑Status‑GA liefert den exakten Wert. Damit können Befehls‑GAs der in der Szene enthaltenen Aktoren aktualisiert werden.

```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // zu speichernder Wert
return msg;
```

**Scene Controller deaktivieren**

Deaktiviert BUS‑Kommandos (Flow‑Nachrichten bleiben aktiv). Praktisch z. B. nachts.

```javascript
msg.disabled = true; // false = reaktivieren
return msg;
```

## Siehe auch

[Sample Scene Controller](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
