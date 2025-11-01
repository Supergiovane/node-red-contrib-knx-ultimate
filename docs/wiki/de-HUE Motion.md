---
layout: wiki
title: "HUE Motion"
lang: de
permalink: /wiki/de-HUE%20Motion/
---
Dieser Node empfängt Bewegungsereignisse eines Hue-Bewegungssensors und leitet sie an KNX bzw. den Node-RED-Flow weiter.

Im GA-Feld den KNX-Gerätenamen oder die Gruppenadresse eingeben; beim Tippen erscheinen Vorschläge. Über das Aktualisieren-Symbol neben "Hue Sensor" lässt sich die Geräteliste der Hue-Bridge neu laden.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX GW | KNX-Gateway, das die Bewegungszustände erhält (erforderlich, damit die KNX-Optionen angezeigt werden). |
| Hue Bridge | Hue-Bridge, auf der der Sensor liegt. |
| Hue Sensor | Hue-Bewegungssensor (unterstützt Autovervollständigung und Refresh). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Bewegung | KNX-GA, die bei Bewegung `true` und sonst `false` erhält. Empfohlener DPT: <b>1.001</b>. |

**Verhalten**

| Eigenschaft | Beschreibung |
|--|--|
| Node-Ausgangspin | Node-RED-Ausgang ein-/ausblenden. Ohne KNX-Gateway bleibt der Ausgang aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen. |

> ℹ️ Die KNX-Felder werden erst sichtbar, nachdem ein KNX-Gateway gewählt wurde - praktisch, wenn der Node nur als Hue → Node-RED Listener dient.

### Ausgang

1. Standardausgang — `msg.payload` (boolean)
   : `true` bei Bewegung, `false` sobald sie endet.
