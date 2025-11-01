---
layout: wiki
title: "HUE Zigbee connectivity"
lang: de
permalink: /wiki/de-HUE%20Zigbee%20connectivity/
---
Dieser Node liest den Zigbee‑Konnektivitätsstatus eines HUE‑Geräts und spiegelt ihn nach KNX.

Gib im GA‑Feld den Gerätenamen oder die Gruppenadresse ein; beim Tippen erscheinen Vorschläge.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX GW | KNX‑Gateway, auf das veröffentlicht wird. |
| HUE Bridge | Zu verwendender HUE Bridge. |
| HUE Sensor | HUE‑Sensor/Gerät mit Zigbee‑Konnektivitätsinfo (Autocomplete). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Status | KNX‑GA, die die Zigbee‑Konnektivität abbildet. _true_ = verbunden, sonst _false_. |
| Status beim Start lesen | Beim Start/bei Wiederverbindung Status lesen und an KNX ausgeben. Standard: "Ja". |

### Ausgänge

1. Standardausgang
   : payload (boolean): Konnektivitätszustand.

### Details

`msg.payload` ist true/false.\
`msg.status` ist Text: **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .
