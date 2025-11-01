---
layout: wiki
title: "zh-CN-HUE Button"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Button/
---
---

Der Knoten der <p> -Hue -Taste ordnet das Ereignis von Hue -Taste mit <Code> button.button_report.event </code> an KNX ab und bietet dasselbe Ereignis in der Prozessausgabe.</p>

Geben Sie das GA -Eingangsfeld (Name oder Gruppenadresse) ein, um die KNX GA zu verknüpfen. Das Matching -Gerät wird beim Eintritt angezeigt.

**konventionell**
| Eigenschaften | Beschreibung |
|-|-|
| KNX Gateway | Wählen Sie das zu verwendende KNX -Gateway |
| Hue Bridge | Wählen Sie die zu verwendende Farbtonbrücke aus |
| Farbtaste | HUE -Schaltfläche zum Verwenden (automatisch abgeschlossen, wenn sie eingibt) |

**schalten**
| Eigenschaften | Beschreibung |
|-|-|
| Schalter | GA, ausgelöst von <Code> kurz \ _release </code> (kurze Veröffentlichung). |
| Status ga |Optionales Feedback GA Wenn "Wertschalter pro Ereignis" aktiviert ist, um den internen Zustand synchron zu halten.|

**Dimmultiplex**
| Eigenschaften | Beschreibung |
|-|-|
| Dimmen | <code> long \ _press </code>/<code> Wiederholung </code> Die GA, die während des Ereignisses zum Dimmen verwendet wird (normalerweise DPT 3.007). |

**Verhalten**
|Eigenschaften | Beschreibung |
|-|-|
| Schalten Sie die Werte für jedes Ereignis | Wechseln Sie beim Aktivieren automatisch zwischen <code> true/false </code> und die Dimmrichtung.|
| Switch -Last |Last wurde an KNX/Prozess beim Schalten deaktiviert.|
| Dimmlast | Die an KNX/FLOWS gesendete Dimmrichtung beim Schalten ist deaktiviert. |

### Ausgabe

1. Standardausgang
: `msg.payload` ist ein Boolescher oder Dimmobjekt;`msg.event` ist eine Hue -Ereignisstring (z.

### Details

`msg.event` entspricht` button.button_report.event`, und das ursprüngliche Hue -Ereignis ist in `msg.rawevent` enthalten. Durch die Verwendung eines optionalen Zustands GA kann der interne Schaltzustand mit externen Geräten wie Wandschalter übereinstimmen.
