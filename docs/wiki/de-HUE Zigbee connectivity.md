---
layout: wiki
title: "HUE Zigbee connectivity"
lang: de
permalink: /wiki/de-HUE%20Zigbee%20connectivity
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Zigbee%20connectivity) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Zigbee%20connectivity) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Zigbee%20connectivity) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Zigbee%20connectivity) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)

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
