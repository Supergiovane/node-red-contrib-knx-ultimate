---
layout: wiki
title: "zh-CN-HUE Scene"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Scene
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Scene) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Scene) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Scene) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Scene) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Scene) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Scene)
---

Die **Hue-Szene** Knoten veröffentlicht die Hue-Szene an KNX und kann die Originalereignisse von HUE an den Knoten-Red-Prozess senden. Szenenfelder unterstützen die automatische Fertigstellung;Nachdem Sie der Brücke neue Szenen hinzugefügt haben, klicken Sie bitte auf das Symbol für Aktualisierung, um die Liste zu aktualisieren.

### Registerkarte Übersicht

- **Mapping** - Verbinden Sie die KNX -Gruppenadresse mit der ausgewählten Hue -Szene.DPT 1.XXX wird für die Boolesche Steuerung verwendet, und DPT 18.xxx wird zum Senden von KNX -Szenennummern verwendet.
- **Mehrere Szenarien** - Erstellen Sie eine Liste von Regeln, kartieren Sie verschiedene KNX -Szenennummern in Farbton -Szenen und wählen Sie die Anrufmethode von _active_ / _dynamic \ _palette_ / _static_.
- **Verhalten** - steuert, ob der Knoten -rot -Ausgangspin angezeigt wird.Wenn das KNX -Gateway nicht konfiguriert ist, bleibt der PIN aktiviert, so dass das Brückenereignis weiterhin den Prozess eingeht.

### Allgemeine Einstellungen

| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Ein KNX -Gateway, das ein automatisches Verzeichnis der Abschlussadresse bietet.|
| Hue Bridge | Hue Bridge, in der die Szene stattfindet. |
| Hue -Szene |Szene, die aufgerufen werden soll (Autokompetenz wird unterstützt; Aktualisierungstaste wird die Liste wiedererlangen).|

### Mapping -Registerkarte

| Eigenschaften | Beschreibung |
|-|-|
| Recall Ga | Rufen Sie die KNX -Gruppenadresse der Szene an.Verwenden Sie DPT 1.XXX, um einen booleschen Wert zu senden, oder verwenden Sie DPT 18.xxx, um eine KNX -Szenennummer zu senden.|
| DPT | Die Art des Datenpunkts, der mit einem Rückruf -GA (1.xxx oder 18.001) verwendet wird.|
| Name | Anweisungsname für das Erinnern von Ga. |
| # | Angezeigt, wenn die KNX -Szene DPT ausgewählt ist, wird die Sendungsnummer ausgewählt.|
| Status ga | Optional Boolean GA, um Feedback zu erhalten, ob die Szene aktiv ist.|

### Multi-Szene-Registerkarte

| Eigenschaften | Beschreibung |
|-|-|
| Recall Ga | Verwenden Sie die GA von DPT 18.001, um eine Szene nach KNX -Szenennummer auszuwählen. |
| Szenenliste |Bearbeitbare Liste, um der KNX -Szenennummer der Hue -Szene und des Anrufmodus zu entsprechen.Ziehen Sie Balken zum Nachbestellen. |

> ℹ️ KNX-bezogene Steuerelemente werden erst nach Auswahl des KNX-Gateways angezeigt. Die Registerkarte Mapping bleibt versteckt, bis sowohl die Hue -Brücke als auch das KNX -Gateway konfiguriert sind.
