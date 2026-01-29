---
layout: wiki
title: "HUE Temperature sensor"
lang: de
permalink: /wiki/de-HUE%20Temperature%20sensor
---
Dieser Node liest die Temperatur (°C) eines HUE-Temperatursensors und spiegelt sie nach KNX.

Beginnen Sie im GA-Feld (Name oder Gruppenadresse) zu tippen, um die KNX-GA zu verknüpfen; Geräte werden während der Eingabe vorgeschlagen.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | Zu verwendendes KNX-Gateway |
| Hue Bridge | Zu verwendende Hue Bridge |
| Hue-Temperatursensor | HUE-Temperatursensor (Autocomplete während der Eingabe) |
| Status beim Start lesen | Beim Start/Wiederverbindung aktuellen Wert lesen und auf KNX senden (Standard: nein) |

**Mapping**

| Eigenschaft | Beschreibung |
|--|--|
| Temperatur | KNX-GA für Temperatur in °C. Empfohlener DPT: <b>9.001</b> |

### Ausgänge

1. Standardausgang
   : `msg.payload` (number): aktuelle Temperatur in °C

### Details

`msg.payload` enthält den numerischen Temperaturwert.
