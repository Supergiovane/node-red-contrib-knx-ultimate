---
layout: wiki
title: "zh-CN-HUE Temperature sensor"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)
---

<p> Dieser Knoten liest die Temperatur (° C) des Farbtemperatursensors und ordnet sie auf KNX ab.</p>

Geben Sie in das Feld GA (Name oder Gruppenadresse) ein, um die KNX GA zu verknüpfen.Gerätevorschläge werden bei der Eingabe angezeigt.

**Allgemein**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Wählen Sie das zu verwendende KNX -Gateway |
| Hue Bridge | Wählen Sie die zu verwendende Farbtonbrücke aus |
| Farbtonsensor | Hue -Temperatursensor (automatisch abgeschlossen, wenn sie eingegeben werden) |
| Status bei Startup lesen | Lesen Sie den aktuellen Wert während des Starts/Wiederverbindens und senden Sie an KNX (Standard: no) |

**Abbildung**
| Eigenschaften |Beschreibung |
|-|-|
| Temperatur | Temperatur (° C) KNX GA. Empfohlener DPT: <b> 9.001 </b> |

### Ausgabe

1. Standardausgang
: `msg.payload` (Nummer): Stromtemperatur (° C)

### Details

`msg.payload` enthält numerische Temperatur.
