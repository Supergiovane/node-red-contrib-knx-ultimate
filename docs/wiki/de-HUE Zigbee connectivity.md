---
layout: wiki
title: "HUE Zigbee connectivity"
lang: de
permalink: /wiki/de-HUE%20Zigbee%20connectivity
---
> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der kontrastreiche orange Migrationsbutton mit weißer Beschriftung konvertiert alle Legacy-HUE-Knoten lokal; anschließend öffnet er nur einen bearbeitbaren E-Mail-Entwurf. Die E-Mail wird niemals automatisch gesendet. Nach Abschluss des Vorgangs bleibt eine feste Node-RED-Meldung sichtbar, bis Sie auf OK klicken, und bietet eine optionale Unterstützungsschaltfläche; die Spendenseite öffnet sich nur nach einem Klick darauf. Sehen Sie sich vor dem Start die [Videoanleitung auf YouTube](https://youtu.be/f0Evf2QFI7c) an.

Dieser Node liest den Zigbee-Konnektivitätsstatus eines HUE-Geräts und spiegelt ihn nach KNX.

Gib im GA-Feld den Gerätenamen oder die Gruppenadresse ein; beim Tippen erscheinen Vorschläge.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, auf das veröffentlicht wird. |
| Hue Bridge | Zu verwendende Hue Bridge. |
| Hue-Zigbee-Konnektivität | HUE-Sensor/Gerät mit Zigbee-Konnektivitätsinfo (Autocomplete). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Status | KNX-GA, die die Zigbee-Konnektivität abbildet. _true_ = verbunden, sonst _false_. |
| Status beim Start lesen | Beim Start/bei Wiederverbindung Status lesen und an KNX ausgeben. Standard: "Ja". |

### Ausgänge

1. Standardausgang
   : payload (boolean): Konnektivitätszustand.

### Details

`msg.payload` ist true/false.\
`msg.status` ist Text: **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .
