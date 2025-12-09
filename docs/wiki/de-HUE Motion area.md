---
layout: wiki
title: "HUE Motion area"
lang: de
permalink: /wiki/de-HUE%20Motion%20area
---
Der Hue Motion Area Node lauscht auf MotionAware-Bereichsereignisse (Hue Bridge Pro) und spiegelt den aggregierten Bewegungsstatus (Bewegung / keine Bewegung) nach KNX bzw. in Ihren Node-RED-Flow.

Geben Sie im GA-Feld den KNX-Gerätenamen oder die Gruppenadresse ein; passende Vorschläge erscheinen während der Eingabe.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway, das den Bewegungsstatus erhält. |
| HUE Bridge | Zu verwendende Hue Bridge Pro. |
| HUE Area | Zu überwachender MotionAware-Bereich (Convenience oder Security, mit Autovervollständigung). |
| Status beim Start auslesen | Liest beim Start/bei Wiederverbindung den aktuellen Wert und sendet ihn an KNX (Standard: ja). |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Bewegung | KNX-GA für den Bewegungsstatus des Bereichs (Boolean). Empfohlener DPT: <b>1.001</b>. |

**Verhalten**

|Eigenschaft|Beschreibung|
|--|--|
| Node-Ausgangspin | Node-RED-Ausgang ein-/ausblenden. Ohne KNX-Gateway bleibt der Ausgang aktiv, damit MotionAware-Ereignisse weiterhin den Flow erreichen. |

### Ausgang

1. Standardausgang  
   : `msg.payload` (Boolean): `true`, wenn im Bereich Bewegung erkannt wird, sonst `false`.

### Details

`msg.payload` enthält den von MotionAware gelieferten, aggregierten Bewegungsstatus des ausgewählten Bereichs.

