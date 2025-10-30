---
layout: wiki
title: "zh-CN-WatchDog-Configuration"
lang: de
permalink: /wiki/de-zh-CN-WatchDog-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)
---

# Watchdog (Watchdog)

Wird verwendet, um den Verbindungsstatus mit einem Gateway oder einem bestimmten KNX -Gerät zu erkennen und automatisierte Vorgänge im Falle eines Ausfalls durchzuführen.

**Funktion**

1. Senden Sie Nachrichten regelmäßig und warten Sie auf eine Antwort. Wenn die Busverbindung abnormal ist, geben Sie Nachrichten an den Prozess aus.Es sind zwei Erkennungsniveaus verfügbar (siehe unten).
2. Ändern Sie die Gateway-Parameter des Konfigurationsknotens (config-node) über die Nachricht, um das Wechseln von KNX/IP-Router/-schnittstelle (z. B. Master-Support-Schalten) zu realisieren.
3.. Kraftaufbau/Trennung vom KNX -Bus.

## Ethernet -Schicht und KNX Twisted Pair Layer Detection

Watchdog bietet zweistufige Tests:

- Ethernet -Ebene: Erkennen Sie nur die Konnektivität zwischen KNX -Ultimat und der KNX/IP -Schnittstelle (Unicast).
- Ethernet + KNX -TP: Überprüfen Sie den gesamten Link (Ethernet → TP). Ein physisches Gerät, das auf Leseanfragen antwortet, ist erforderlich.

Geeignet für Fehler-/Verbindungsfehleralarme (E -Mail -Benachrichtigungen, automatische Sicherungs -Gateway -Switching usw.).

## Einstellungen (Einstellungen)

|Eigenschaften | Beschreibung |
|-|-|
| Gateway | Ausgewähltes KNX -Gateway. |
| Gruppenadresse zur Überwachung |Gruppenadresse zum Senden und Überwachung;DPT muss 1.x (boolean) sein. |
| Name | Knotenname. |
| Auto starten Sie den Watchdog -Timer | Starten Sie den Timer automatisch auf Bereitstellung/Start. |
|Überprüfen Sie die Ebene | Siehe oben. |

**Überprüfen Sie die Ebene**

> Ethernet: Verbindungen zwischen KNX -LUFTIME (UNICAST) und der KNX/IP -Schnittstelle erkennen. <br/>

<img src = "https://raw.githubuSercontent.com/supergiovane/node-red-contrib-nx-ultimate/master/img/wiki/watchDogEthetlevel.png" width = "90%"> <br/>

> Ethernet + KNX TP: Komplette Erkennung (unterstützt Router/Schnittstelle).Senden Sie das Lesen an das physische Gerät und warten Sie auf die Antwort.Fehler bei Ethernet oder TP werden gemeldet.Bitte konfigurieren Sie einen **Status** GA in ETS für einen Aktuator, der auf das Lesen antwortet. <br/>

<img src = "https://raw.githubuSercontent.com/supergiovane/node-red-contrib-nx-ultimate/master/img/wiki/watchDogEnnetknXtplevel.png" width = "90%"> <br/>

## Erweiterte Optionen

| Eigenschaften | Beschreibung |
|-|-|
| Wiederholungsintervall (in Sekunden) | Erkennungsintervall in Sekunden. |
| Anzahl der Wiederholungen vor dem Angeben eines Fehlers |Wie viele aufeinanderfolgende Fehler werden gemeldet. |

# Watchdog -Ausgabe

Watchdog gibt eine Nachricht aus, wenn die interne Erkennung einen Fehler findet, oder ein KNX -Ultimate -Knoten meldet einen Fehler im Prozess.

**Watchdog -eigenes Verbindungsproblem ** **<a href = "/node-red-contrib-knx-ultimate/wiki/watchdog-configuration" target = "_ leer"> siehe hier für Details </a>```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
``` ** Ausnahme trat an einem Ihrer KNX -Ultimate -Knoten auf** ```javascript
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
``` ** Ändern Sie die Gateway -Konfiguration über SetGatewayConfig** ```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
``` ** Zwangsverbindung/Trennen** ```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```---

# Meldung eingeben (Eingabe)

## Start/Stop Watchdog```javascript
msg.start = true; return msg; // 启动
```

```javascript
msg.start = false; return msg; // 停止
```## Ändern Sie die KNX/IP -Gateway -Einstellungen während der Laufzeit

Ändern Sie IP/Port/PhysicalAddress/Protocol usw. über `msg.setgatewayconfig`; Der Konfigurationsknoten wendet eine Wiederverbindung an.Node -Red stellt nach dem Neustart den Einstellungen im Konfigurationsknoten wieder her.Alle Parameter sind optional.```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Ändern Sie nur die IP:```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
``` ** Erzwungene Trennung und Deaktivierung der automatischen Wiederverbindung** ```javascript
msg.connectGateway = false; return msg;
``` ** Zwangsverbindung und aktivieren automatische Wiederverbindung** ```javascript
msg.connectGateway = true; return msg;
```## Sehen

[Sample Watchdog](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
