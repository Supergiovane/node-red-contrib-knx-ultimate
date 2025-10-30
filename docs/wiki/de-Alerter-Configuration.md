---
layout: wiki
title: "Alerter-Configuration"
lang: de
permalink: /wiki/de-Alerter-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)

# Alerter - Node-Konfiguration

Mit dem Node "Alerter" kannst du auf einem Display oder über den Node node-red-contrib-tts-ultimate (Sprachausgabe) melden, welche ausgewählten Geräte einen Alarmzustand haben, also `payload` **true** liefern.
Der Node gibt in einstellbaren Intervallen jeweils eine Nachricht aus, die die Details des aktuell gemeldeten Geräts enthält. So kannst du dir z. B. sagen lassen, wie viele und welche Fenster offen sind.

Der Node liest die Werte der Geräte direkt vom KNX‑BUS. Zusätzlich kannst du eigene (nicht an KNX‑Geräte gebundene) Meldungen an den Node schicken.

Auf der Beispielseite ist die Nutzung im Flow gezeigt.

- **Gateway**

> Gewähltes KNX‑Gateway. Du kannst auch kein Gateway auswählen; dann werden nur eingehende Nachrichten an den Node ausgewertet.

- **Name**

> Anzeigename des Nodes.

- **Startart des Meldungszyklus**

> Ereignis, das den Start des Sendezyklus für die gemeldeten Geräte auslöst.

- **Intervall zwischen den Meldungen (Sekunden)**

> Zeitabstand zwischen zwei aufeinanderfolgenden Ausgaben.

## Zu überwachende Geräte

Hier fügst du die zu überwachenden Geräte hinzu.

Gib die Gruppenadresse oder eine Bezeichnung für das Gerät ein.

- **Wert jedes Geräts bei Verbindungsaufbau/-wiederherstellung lesen**

> Beim Start bzw. bei einer Wiederverbindung sendet der Node für jedes gelistete Gerät eine Leseanforderung.

- **Schaltfläche "ADD"**

> Fügt eine neue Zeile hinzu.

- **Gerätezeilen ** > Erstes Feld: Gruppenadresse (alternativ eine freie Bezeichnung, die du mit Eingangs­nachrichten verwenden kannst; siehe Beispielseite). Zweites Feld: Kurzname des Geräts (**MAX. 14 ZEICHEN** ). Drittes Feld: Langname.

- **Schaltfläche "DELETE"**

> Entfernt das Gerät aus der Liste.

## Ausgaben des Nodes

PIN1: eine Nachricht pro gemeldetem Gerät, im gewählten Intervall.

PIN2: eine Sammelmeldung mit allen aktuell gemeldeten Geräten.

PIN3: eine Nachricht nur für das zuletzt gemeldete Gerät.

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

## Eingänge des Nodes

```javascript
msg.readstatus = true
```

Liest den aktuellen Wert aller gelisteten Geräte.

```javascript
msg.start = true
```

Startet den Sendezyklus über alle Geräte im Alarmzustand. Der Zyklus endet mit dem letzten Gerät; zum Wiederholen den Eingang erneut senden.

**Benutzerdefinierter Gerätealarm** 

Um den Zustand (true/false) eines eigenen Geräts zu setzen, sende diese Eingangs­nachricht:

```javascript
msg = {
  topic: "door",
  payload: true // oder false, um die Meldung für dieses Gerät zurückzusetzen
}
```

## Beispiel

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleAlerter">HIER KLICKEN FÜR DAS BEISPIEL</a>
