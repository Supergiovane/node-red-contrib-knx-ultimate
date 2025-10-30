---
layout: wiki
title: "HUE Temperature sensor"
lang: de
permalink: /wiki/de-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)

Dieser Node liest die Temperatur (°C) eines HUE‑Temperatursensors und spiegelt sie nach KNX.

Beginnen Sie im GA‑Feld (Name oder Gruppenadresse) zu tippen, um die KNX‑GA zu verknüpfen; Geräte werden während der Eingabe vorgeschlagen.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX GW | Zu verwendendes KNX‑Gateway |
| HUE Bridge | Zu verwendende HUE Bridge |
| HUE Sensor | HUE‑Temperatursensor (Autocomplete während der Eingabe) |
| Status bei Start lesen | Beim Start/Wiederverbindung aktuellen Wert lesen und auf KNX senden (Standard: nein) |

**Mapping**

| Eigenschaft | Beschreibung |
|--|--|
| Temperatur | KNX‑GA für Temperatur in °C. Empfohlener DPT: <b>9.001</b> |

### Ausgänge

1. Standardausgang
   : `msg.payload` (number): aktuelle Temperatur in °C

### Details

`msg.payload` enthält den numerischen Temperaturwert.
