🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)

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

# WatchDog

Überwacht die Verbindung zum Gateway oder zu einem bestimmten KNX‑Gerät und ermöglicht automatische Maßnahmen bei Störungen.

**Funktion**

1. Prüft die KNX‑Kommunikation durch periodische Telegramme, wartet auf Antwort und sendet bei Ausfall eine Nachricht in den Flow. Zwei Prüf‑Levels (siehe unten).
2. Ändert per Nachricht die Parameter des Config‑Nodes (KNX/IP‑Router/Interface), z. B. Umschalten auf ein Backup‑Gateway.
3. Erzwingt Verbindungsaufbau/‑abbau des Gateways zum KNX‑BUS.

## Prüfungen auf Ethernet‑Ebene und KNX‑Twisted‑Pair

Der WatchDog bietet zwei Prüfstufen:

- Ethernet‑Level: prüft nur die Verbindung zwischen KNX‑Ultimate und KNX/IP‑Interface (Unicast).
- Ethernet+KNX‑TP: prüft die gesamte Strecke bis zum TP‑Medium; erfordert ein physisches Gerät, das auf Read‑Requests antwortet.

Ideal zum Signalisieren von Fehlern/Verbindungsproblemen (E‑Mail, automatisches Failover auf Backup‑Gateway etc.).

## Einstellungen (SETTINGS)

| Property | Beschreibung |
|--|--|
| Gateway | Gewähltes KNX‑Gateway. |
| Group Address to monitor | GA, an die gelesen wird und von der eine Antwort erwartet wird. DPT muss 1.x (Boolean) sein. |
| Name | Node‑Name. |
| Auto start the watchdog timer | Timer beim Deploy/Start automatisch starten. |
| Check level | Siehe oben. |

**Check level**

> Ethernet: Verbindung zwischen KNX‑Ultimate (Unicast) und KNX/IP‑Interface.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width="90%"><br/>

> Ethernet und KNX TP: Vollständige Prüfung (Router/Interface). Read an physisches Gerät, Antwort erwarten; Fehler auf Ethernet/TP werden gemeldet. In ETS eine Status‑GA einrichten, die auf Read antwortet.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" width="90%"><br/>

## Erweiterte Optionen

| Property | Beschreibung |
|--|--|
| Retry interval (in seconds) | Intervall in Sekunden zwischen zwei Prüfungen. |
| Number of retry before giving an error | Anzahl erfolgloser Versuche bis zur Fehlermeldung. |

# Ausgaben des WatchDog

Der Node gibt Nachrichten aus, wenn eigene Prüfungen Fehler melden oder wenn ein KNX‑Ultimate‑Node im Flow einen Fehlerstatus meldet.

**Bei WatchDog‑eigenem Verbindungsproblem**

<a href="/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration" target="_blank">Siehe hier.</a>

```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // oder "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
```

**Wenn einer deiner KNX‑Ultimate‑Nodes Probleme hat**

```javascript
msg = {
  type: "NodeError",
  checkPerformed: "Self KNX-Ultimate node reporting a red color status",
  nodeid: "23HJ.2355",
  payload: true,
  description: "...",
  completeError: {
    nodeid: "23HJ.2355",
    topic: "0/1/1",
    devicename: "Kitchen Light",
    GA: "0/1/1"
  }
}
```

**Neue Gateway‑Konfiguration via setGatewayConfig**

```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
```

**Erzwungener Verbindungs‑Auf/Abbau**

```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=connect, false=disconnect
  description: "Connection",
  completeError: ""
}
```

---

# Eingangs‑Nachrichten (INPUT)

## WatchDog starten/stoppen

```javascript
msg.start = true; return msg; // Start
```

```javascript
msg.start = false; return msg; // Stop
```

## KNX/IP‑Gateway‑Einstellungen zur Laufzeit ändern

Mit `msg.setGatewayConfig` IP/Port/PhysicalAddress/Protocol usw. ändern; der Config‑Node übernimmt und verbindet neu. Beim Neustart gelten wieder die Config‑Node‑Werte. Alle Parameter optional.

```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```

Nur IP ändern:

```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
```

**Verbindung trennen und Auto‑Reconnect deaktivieren**

```javascript
msg.connectGateway = false; return msg;
```

**Verbindung herstellen und Auto‑Reconnect aktivieren**

```javascript
msg.connectGateway = true; return msg;
```

## Siehe auch

[Sample WatchDog](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
