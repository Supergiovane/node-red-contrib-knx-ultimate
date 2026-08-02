---
layout: wiki
title: "HUE Humidity sensor"
lang: de
permalink: /wiki/de-HUE%20Humidity%20sensor
---
> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der orange Migrationsbutton konvertiert alle Legacy-HUE-Knoten lokal; anschließend öffnet er einen bearbeitbaren E-Mail-Entwurf und die Spendenseite in einem neuen Browserfenster. Die E-Mail wird niemals automatisch gesendet. Nach Abschluss des Vorgangs bleibt eine feste Node-RED-Meldung sichtbar, bis Sie auf OK klicken.

Dieser Knoten liest die relative Luftfeuchtigkeit (%) von einem HUE-Sensor und überträgt sie auf KNX.

Beginne im GA-Feld (Name oder Gruppenadresse) zu tippen, um die KNX-GA zu verknüpfen; während der Eingabe werden passende Geräte angezeigt.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX Gateway | Das zu verwendende KNX-Gateway auswählen |
| Hue Bridge | Die zu verwendende Hue Bridge auswählen |
| HUE Sensor | HUE-Luftfeuchtigkeitssensor (Auto-Vervollständigung beim Tippen) |
| Status beim Start auslesen | Beim Start/Reconnect den aktuellen Wert lesen und auf KNX senden (Standard: Nein) |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Luftfeuchtigkeit | KNX-GA für die relative Luftfeuchtigkeit %. Empfohlener DPT: <b>9.007</b> |

### Ausgänge

1. Standardausgang
   : `msg.payload` (Zahl): aktuelle relative Luftfeuchtigkeit in %

### Details

`msg.payload` enthält den numerischen Luftfeuchtigkeitswert (Prozentangabe).
