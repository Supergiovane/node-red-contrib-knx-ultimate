---
layout: wiki
title: "HUE Light sensor"
lang: de
permalink: /wiki/de-HUE%20Light%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor)

Dieser Node liest Lux‑Ereignisse eines HUE‑Lichtsensors und spiegelt sie nach KNX.

Es wird die Umgebungshelligkeit (Lux) bei Änderungen ausgegeben. Im GA‑Feld den KNX‑Gerätenamen oder die GA eingeben (Autocomplete), um die GA zu verknüpfen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX GW |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Farbtonbrücke aus |
| HUE Sensor | Zu verwendender HUE‑Lichtsensor (Autocomplete) |
|Status bei Startup lesen |Lesen Sie den Status beim Start und geben Sie das Ereignis bei Startup/Wiederverbindung an den KNX -Bus aus.(Standard "nein") |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Lux | KNX‑GA, die den Lux‑Wert erhält |

### Ausgänge

1. Standardausgang
   : payload (number): aktueller Lux‑Wert

### Details

`msg.payload` enthält den numerischen Lux‑Wert.
