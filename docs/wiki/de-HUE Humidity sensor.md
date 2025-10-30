---
layout: wiki
title: "HUE Humidity sensor"
lang: de
permalink: /wiki/de-HUE%20Humidity%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Humidity%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Humidity%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Humidity%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Humidity%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Humidity%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Humidity%20sensor)

Dieser Knoten liest die relative Luftfeuchtigkeit (%) von einem HUE-Sensor und überträgt sie auf KNX.

Beginne im GA-Feld (Name oder Gruppenadresse) zu tippen, um die KNX-GA zu verknüpfen; während der Eingabe werden passende Geräte angezeigt.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX Gateway | Das zu verwendende KNX-Gateway auswählen |
| HUE Bridge | Die zu verwendende HUE-Bridge auswählen |
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
