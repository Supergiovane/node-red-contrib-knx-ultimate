---
layout: wiki
title: "HUE Camera motion"
lang: de
permalink: /wiki/de-HUE%20Camera%20motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Camera%20motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Camera%20motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Camera%20motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Camera%20motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Camera%20motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Camera%20motion)

Der Hue Camera Motion Node lauscht auf Bewegungsereignisse der Philips-Hue-Kameras und spiegelt den erkannt/nicht-erkannt-Status in KNX.

Geben Sie im GA-Feld (Name oder Gruppenadresse) den gewünschten Wert ein; passende Geräte werden während der Eingabe vorgeschlagen.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX-Gateway | Zu verwendendes KNX-Gateway auswählen |
| HUE-Bridge | Zu verwendende HUE-Bridge auswählen |
| HUE-Sensor | Hue-Kamera-Bewegungssensor (Autovervollständigung während der Eingabe) |
| Status beim Start auslesen | Liest beim Start/bei Wiederverbindung den aktuellen Wert und sendet ihn an KNX (Standard: nein) |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Bewegung | KNX-GA für die Kamerabewegung (Boolean). Empfohlener DPT: <b>1.001</b> |

### Ausgaben

1. Standardausgang
   : `msg.payload` (Boolean): `true`, wenn Bewegung erkannt wird, sonst `false`

### Details

`msg.payload` enthält den zuletzt vom Hue-Kameraservice gemeldeten Bewegungsstatus.
