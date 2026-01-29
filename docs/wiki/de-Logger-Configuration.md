---
layout: wiki
title: "Logger-Configuration"
lang: de
permalink: /wiki/de-Logger-Configuration
---
# Logger

Der Logger-Node zeichnet alle Telegramme auf und erzeugt eine ETS-Busmonitor-kompatible XML-Datei.

Du kannst die Datei per File-Node speichern oder z. B. per FTP versenden. ETS kann sie für Diagnose oder Telegramm-Replay einlesen.
Der Node kann zudem Telegramme pro Sekunde (oder in frei wählbaren Intervallen) zählen. 
 <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">Beispiele hier.</a>

## Einstellungen

|Eigenschaft|Beschreibung|
|--|--|
| Gateway | KNX-Gateway. |
| Topic | Topic des Nodes. |
| Node Name | Name des Nodes. |

## ETS-kompatible BUS-Diagnosedatei

|Eigenschaft|Beschreibung|
|--|--|
| Timer für automatischen Start | Timer automatisch beim Deploy/Start starten. |
| Neue Payload-Ausgabe alle (in Minuten) | Intervall für das Senden des Payloads und/oder das Speichern in eine Datei. Beim Speichern in eine Datei wird die Datei bei Erreichen der konfigurierten Zeilenanzahl **rotiert**, wobei die ältesten Zeilen zuerst entfernt werden. |
| Maximale Anzahl von Zeilen (0 = keine Begrenzung) | Max. Zeilenzahl in der XML innerhalb des Intervalls; 0 = kein Limit. Wenn zusätzlich die Dateispeicherung aktiviert ist, gibt dieser Wert auch die maximale Zeilenzahl der Datei an. Beim Erreichen des Grenzwerts wird die Datei **rotiert**, wobei nach und nach die ältesten Zeilen entfernt werden. |

## KNX-Telegrammzähler

|Eigenschaft|Beschreibung|
|--|--|
| Timer für automatischen Start | Timer automatisch beim Deploy/Start starten. |
| Zählintervall (in Sekunden) | Intervall (Sekunden) für die Ausgabe des Telegramm-Zählstands. |

---

# Ausgaben des Logger

**PIN 1: ETS-Busmonitor-kompatible XML**

Mit einem File-Node `payload` speichern oder z. B. an FTP senden.

```javascript

msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML-String
}
```

**PIN 2: KNX-Telegrammzähler**

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

# Eingangs-Nachrichten (INPUT)

ETS-kompatible XML

**Timer starten**

```javascript

msg.etsstarttimer = true; return msg;
```

**Timer stoppen**

```javascript

msg.etsstarttimer = false; return msg;
```

**Sofortige XML-Ausgabe**

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
