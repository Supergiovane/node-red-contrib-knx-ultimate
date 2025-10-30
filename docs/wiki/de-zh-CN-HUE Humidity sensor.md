---
layout: wiki
title: "zh-CN-HUE Humidity sensor"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Humidity%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Humidity%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Humidity%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Humidity%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Humidity%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Humidity%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Humidity%20sensor)
---

<p> Dieser Knoten liest relative Luftfeuchtigkeit (%) vom Farbton -Feuchtigkeitssensor und Karten bis KNX.</p>

Starten Sie die Eingabe (Name oder Gruppenadresse) im GA -Feld, um die KNX GA zu verbinden.Das Matching -Gerät wird beim Eingang angezeigt.

**konventionell**
| Eigenschaften | Beschreibung |
|-|-|
| KNX Gateway | Wählen Sie das zu verwendende KNX -Gateway |
| Hue Bridge | Wählen Sie die zu verwendende Farbtonbrücke aus |
| Farbtonsensor | Farbton -Luftfeuchtigkeitssensor (automatisch abgeschlossen, wenn sie eingibt) |
| Status bei Startup lesen | Lesen Sie den aktuellen Wert bei Start/Wiederverbindung und senden Sie an KNX (Standard: no) |

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
|Luftfeuchtigkeit | KNX GA mit relativer Luftfeuchtigkeit %. Empfohlener DPT: <b> 9.007 </b> |

### Ausgabe

1. Standardausgang
: `msg.payload` (Zahl): aktuelle relative Luftfeuchtigkeit (%)

### Details

`msg.payload` Der Wert (Prozentsatz) der Luftfeuchtigkeit.
