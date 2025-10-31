---
layout: wiki
title: "HUE Button"
lang: de
permalink: /wiki/de-HUE%20Button
---
Der Hue-Taster-Node spiegelt Hue-Taster-Ereignisse auf KNX und den Flow-Ausgang und nutzt das Attribut <code>button.button_report.event</code>.

Tippen Sie im GA-Feld (Name oder Gruppenadresse), um die KNX-GA zu verknüpfen; passende Einträge erscheinen während der Eingabe.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX-Gateway | Zu verwendendes KNX-Gateway |
| HUE-Bridge | Zu verwendende HUE-Bridge |
| Hue-Taster | Zu verwendender Hue-Taster (Autovervollständigung) |

**Schalten**

|Eigenschaft|Beschreibung|
|--|--|
| Schalter | GA, die vom Ereignis <code>short\_release</code> ausgelöst wird (kurzer Druck). |
| Status-GA | Optionale Rückmelde-GA, wenn <em>Werte toggeln</em> aktiv ist; hält den internen Zustand synchron. |

**Dimmen**

|Eigenschaft|Beschreibung|
|--|--|
| Dimmen | GA für <code>long\_press</code>/<code>repeat</code>-Ereignisse beim Dimmen (typischerweise DPT 3.007). |

**Verhalten**

|Eigenschaft|Beschreibung|
|--|--|
| Werte toggeln | Schaltet automatisch zwischen <code>true/false</code> und Dimmen hoch/runter. |
| Schalt-Payload | Payload, der bei deaktiviertem Toggle an KNX/Flow gesendet wird. |
| Dim-Payload | Richtung, die bei deaktiviertem Toggle an KNX/Flow gesendet wird. |

### Ausgänge

1. Standardausgang
   : `msg.payload` enthält den boolean/dimm-Payload; `msg.event` die Hue-Ereignis-Zeichenfolge (z. B. `short_release`, `repeat`).

### Details

`msg.event` entspricht `button.button_report.event`. Das originale Hue-Ereignis steht in `msg.rawEvent`. Nutzen Sie die optionale Status-GA, um den Toggle-Zustand mit anderen Schaltern zu synchronisieren.
