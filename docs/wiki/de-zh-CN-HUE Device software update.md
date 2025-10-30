---
layout: wiki
title: "zh-CN-HUE Device software update"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Device%20software%20update
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Device%20software%20update) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Device%20software%20update) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Device%20software%20update) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Device%20software%20update) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update)
---

<p> Dieser Knoten überwacht den Software -Update -Status des Hue -Geräts und veröffentlicht es an KNX.</p>

Geben Sie den Namen oder die Gruppenadresse des KNX -Geräts im Feld GA ein, und die verfügbaren Geräte beginnen mit der Anzeige
Sie tippen.

**Allgemein**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Wählen Sie das zu verwendende KNX -Portal |
| Hua Bridge | Wählen Sie die zu verwendende Tonbrücke aus |
| Hue -Gerät | Zu überwachender Farbtöne (Autokaponetion) |

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
| Status | KNX -Gruppenadresse für Mapping -Software -Updates: _true_ verfügbar/Vorbereitung/Installation, ansonsten _false_ |
| Status bei Startup lesen | Lesen und veröffentlichen Sie bei KNX während des Starts/Wiederverbindens (Standard "Ja") |

### Ausgabe

1. Standardausgang
: Nutzlast (Boolean): Flag Update.
: status (string): **no \ _update, update \ _pending, ready \ _to \ _install, installieren** .
