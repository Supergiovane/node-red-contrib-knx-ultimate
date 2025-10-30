---
layout: wiki
title: "WatchDog-Configuration"
lang: de
permalink: /wiki/de-WatchDog-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)

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

> Ethernet: Verbindung zwischen KNX‑Ultimate (Unicast) und KNX/IP‑Interface.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width="90%">

> Ethernet und KNX TP: Vollständige Prüfung (Router/Interface). Read an physisches Gerät, Antwort erwarten; Fehler auf Ethernet/TP werden gemeldet. In ETS eine Status‑GA einrichten, die auf Read antwortet.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" width="90%">

## Erweiterte Optionen

| Property | Beschreibung |
|--|--|
| Retry interval (in seconds) | Intervall in Sekunden zwischen zwei Prüfungen. |
| Number of retry before giving an error | Anzahl erfolgloser Versuche bis zur Fehlermeldung. |

# Ausgaben des WatchDog

Der Node gibt Nachrichten aus, wenn eigene Prüfungen Fehler melden oder wenn ein KNX‑Ultimate‑Node im Flow einen Fehlerstatus meldet.

**Bei WatchDog‑eigenem Verbindungsproblem**

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration" target="_blank">Siehe hier.</a>

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

[Sample WatchDog](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
