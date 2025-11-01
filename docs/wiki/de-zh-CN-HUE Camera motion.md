---
layout: wiki
title: "zh-CN-HUE Camera motion"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Camera%20motion/
---
---

<p> Der Motionknoten der Farbtonkameras hört nach Bewegungsereignissen der Philips Hue -Kamera und Karten, die er erkannten/unentdeckte Zustände an KNX erfasst.</p>

Starten Sie in das GA -Eingangsfeld (Name oder Gruppenadresse), um die KNX GA zu verknüpfen.Das Matching -Gerät wird beim Eingang angezeigt.

**konventionell**
| Eigenschaften | Beschreibung |
|-|-|
| KNX Gateway | Wählen Sie das zu verwendende KNX -Gateway |
| Hue Bridge | Wählen Sie die zu verwendende Farbtonbrücke aus |
| Farbtonsensor | Hue -Kamera -Bewegungssensor (automatisch bei der Eingabe abgeschlossen) |
| Status bei Startup lesen | Lesen Sie den aktuellen Wert bei Start/Wiederverbindung und senden Sie an KNX (Standard: no) |

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
| Bewegung |KNX -Gruppenadresse (boolean) für Kamerabewegungen. Empfohlener DPT: <b> 1.001 </b> |

### Ausgabe

1. Standardausgang
: `msg.payload` (boolean):` true` Wenn die Bewegung erkannt wird, ansonsten `false`

### Details

`msg.payload` Speichern Sie den zuletzt gemeldeten Bewegungsstatus des Hue -Kamera -Dienstes.</script>
