---
layout: wiki
title: "Logger-Configuration"
lang: de
permalink: /wiki/de-Logger-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)

# Logger

Der Logger‑Node zeichnet alle Telegramme auf und erzeugt eine ETS‑Busmonitor‑kompatible XML‑Datei.

Du kannst die Datei per File‑Node speichern oder z. B. per FTP versenden. ETS kann sie für Diagnose oder Telegramm‑Replay einlesen.
Der Node kann zudem Telegramme pro Sekunde (oder in frei wählbaren Intervallen) zählen. 
 <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">Beispiele hier.</a>

## Einstellungen

|Eigenschaft|Beschreibung|
|--|--|
| Gateway | KNX‑Gateway. |
| Topic | Topic des Nodes. |
| Name | Name des Nodes. |

## ETS‑kompatible BUS‑Diagnosedatei

|Eigenschaft|Beschreibung|
|--|--|
| Auto start timer | Timer automatisch beim Deploy/Start starten. |
| Output new XML every (in minutes) | Intervall in Minuten, in dem die ETS‑kompatible XML ausgegeben wird. |
| Max number of rows in XML (0 = no limit) | Max. Zeilenzahl in der XML innerhalb des Intervalls; 0 = kein Limit. |

## KNX‑Telegrammzähler

|Eigenschaft|Beschreibung|
|--|--|
| Auto start timer | Timer automatisch beim Deploy/Start starten. |
| Count interval (in seconds) | Intervall (Sekunden) für die Ausgabe des Telegramm‑Zählstands. |

---

# Ausgaben des Logger

**PIN 1: ETS‑Busmonitor‑kompatible XML**

Mit einem File‑Node `payload` speichern oder z. B. an FTP senden.

```javascript
msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML‑String
}
```

**PIN 2: KNX‑Telegrammzähler**

Bei jedem Intervall gibt der Node z. B. so aus:

```javascript
msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```

---

# Eingangs‑Nachrichten (INPUT)

ETS‑kompatible XML

**Timer starten**

```javascript
msg.etsstarttimer = true; return msg;
```

**Timer stoppen**

```javascript
msg.etsstarttimer = false; return msg;
```

**Sofortige XML‑Ausgabe**

```javascript
// Gibt die XML sofort aus; startet ggf. den Timer neu
msg.etsoutputnow = true; return msg;
```

Telegrammzähler

**Timer starten**

```javascript
msg.telegramcounterstarttimer = true; return msg;
```

**Timer stoppen**

```javascript
msg.telegramcounterstarttimer = false; return msg;
```

**Zählstand sofort ausgeben**

```javascript
msg.telegramcounteroutputnow = true; return msg;
```

## Siehe auch

- [Sample Logger](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
