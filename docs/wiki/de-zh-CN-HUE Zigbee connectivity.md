---
layout: wiki
title: "zh-CN-HUE Zigbee connectivity"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Zigbee%20connectivity
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Zigbee%20connectivity) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Zigbee%20connectivity) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Zigbee%20connectivity) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Zigbee%20connectivity) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)
---

<p> Dieser Knoten liest den Zigbee -Verbindungsstatus aus dem Hue -Gerät und veröffentlicht ihn an KNX.</p>

Geben Sie den KNX -Gerätenamen oder die Gruppenadresse in das Feld GA ein und assoziieren automatisch bei der Eingabe.

**konventionell**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | KNX Gateway zum Freigabestatus |
| Hue Bridge | Hue Bridge zur Verwendung |
| Farbtonsensor | HUE -Sensor/Gerät zur Verfügung stellt ZigBee -Verbindungsinformationen (Autokaponetion) |

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
| Status | Kartieren Sie die KNX -Gruppenadresse der Zigbee -Konnektivität._true_ Wenn verbunden, sonst _false_. |
| Status bei Startup lesen |Lesen und veröffentlichen Sie sie während des Starts/Wiederverbindens an KNX.Standard: "Ja".|

### Ausgabe

1. Standardausgang
: Nutzlast (Boolean): Verbindungsstatus.

### Details

`msg.payload` ist wahr/falsch.\
`msg.Status` ist Text: **verbunden, getrennt, Konnektivität \ _issue, unidirektional \ _incoming** .
