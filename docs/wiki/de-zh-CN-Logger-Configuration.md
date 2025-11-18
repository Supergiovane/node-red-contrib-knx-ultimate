---
layout: wiki
title: "zh-CN-Logger-Configuration"
lang: de
permalink: /wiki/de-zh-CN-Logger-Configuration
---
---


# Logger (Protokoll)

Der Logger -Knoten erfasst alle Nachrichten und gibt eine XML -Datei aus, die mit dem ETS -Bus -Monitor kompatibel ist.

Sie können es mit dem Dateiknoten auf der Festplatte speichern oder an FTP usw. senden usw. Diese Datei kann in ETS zur Diagnose oder Wiedergabe von Nachrichten verwendet werden.
Dieser Knoten kann auch die Anzahl der Nachrichten (pro Sekunde oder benutzerdefiniertes Intervall) zählen.<br/> <a href = "/node-red-contrib-knx-ultimate/wiki/logger-sample" target = "_ leer"> Beispiel ist hier </a>

## aufstellen

| Eigenschaften | Beschreibung |
|-|-|
| Gateway | KNX -Tor. |
| Thema | Das Thema des Knotens. |
| Name | Knotenname. |

## ETS -kompatible Busdiagnosedateien

|Eigenschaften |Beschreibung |
|-|-|
| Auto Start Timer | Starten Sie den Timer automatisch, wenn Sie bereitgestellt oder gestartet werden. |
|Jede (in Minuten) neue XML ausgeben | Wie viele Minuten gibt ETS-kompatible XML aus? |
| Maximale Anzahl der Zeilen in XML (0 = keine Grenze) | Die maximale Anzahl von XML -Zeilen in diesem Zeitfenster; 0 bedeutet keine Grenze.|

## KNX -Nachrichtenzähler

| Eigenschaften | Beschreibung |
|-|-|
| Auto Start Timer | Starten Sie den Timer automatisch, wenn Sie bereitgestellt oder gestartet werden.|
| Zählerintervall (in Sekunden) | Das Intervall für die Ausgabe des Prozesses zählt in Sekunden.|

---

#Node -Ausgabe

**Pin 1: ETS -kompatible xml**

Verwenden Sie den Dateiknoten, um `msg.payload` zu speichern, oder senden Sie ihn an FTP usw.

```javascript

msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
```

**Pin 2: KNX -Nachrichtenanzahl**

Ausgabe pro Zählzyklus:

```javascript

msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```

---

# Meldung eingeben (Eingabe)

ETS -kompatible XML -Steuerung

**Timer starten** 

```javascript

msg.etsstarttimer = true; return msg;
```

**Timer stoppen** 

```javascript

msg.etsstarttimer = false; return msg;
```

**Ausgabe xml jetzt** 

```javascript

// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```Meldungszählerkontrolle

**Timer starten** 

```javascript

msg.telegramcounterstarttimer = true; return msg;
```

**Timer stoppen** 

```javascript

msg.telegramcounterstarttimer = false; return msg;
```

**Ausgangszahl sofort** 

```javascript

msg.telegramcounteroutputnow = true; return msg;
```

## Sehen

- [Beispiellogger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
