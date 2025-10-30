---
layout: wiki
title: "zh-CN-HUE Light sensor"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Light%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor)
---

<p> Dieser Knoten liest ein Lux -Ereignis aus dem Hue -Licht -Sensor und veröffentlicht ihn an KNX.</p>

Der Lux -Wert wird ausgegeben, wenn sich das Umgebungslicht ändert.Geben Sie den KNX -Gerätenamen oder die Gruppenadresse (automatisch vervollständigt) in das Feld GA für die Assoziation ein.

**Allgemein**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Wählen Sie das zu verwendende KNX -Portal |
| Hua Bridge | Wählen Sie die zu verwendende Tonbrücke aus |
| Farbtonsensor | Hue -Licht -Sensor (automatische Abschluss) |
| Status beim Start lesen |Status beim Start lesen und Ereignisse beim KNX -Bus beim Start/Wiederverbinden übertragen. (Standard "nein") |

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
| Lux | KNX -Gruppenadresse, die Lux -Werte empfängt |

### Ausgabe

1. Standardausgang
: Nutzlast (Nummer): Aktueller Luxwert

### Detail

`msg.payload` ist ein numerischer Lux.
