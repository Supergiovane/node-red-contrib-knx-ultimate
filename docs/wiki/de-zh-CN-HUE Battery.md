---
layout: wiki
title: "zh-CN-HUE Battery"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Battery
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Battery) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Battery) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Battery) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Battery) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery)
---

<p> Dieser Knoten synchronisiert den Batteriepegel des Farbtongeräts mit KNX und löst ein Ereignis aus, wenn sich der Wert ändert.</p>

Geben Sie den KNX -Gerätenamen oder die Gruppenadresse in das Feld GA ein, um automatisch abzuschließen. Klicken Sie auf die Schaltfläche Aktualisieren neben dem "Hue -Sensor", um die Liste der Farbtöne Geräte neu zu laden.

**konventionell**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | KNX -Gateway zum Freigeben von Strom (KNX -Mapping -Einstellungen werden erst nach der Auswahl angezeigt).|
| Hue Bridge | Hue Bridge verwendet. |
| Farbtonsensor |Hue -Gerät/Sensor, der Strominformationen liefert (unterstützt automatische Fertigstellung und Aktualisierung).|

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
| Batterie | KNX-Gruppenadresse des Batterieprozentsatzes (0-100%), empfohlener DPT: <b> 5.001 </b>. |

**Verhalten**
| Eigenschaften | Beschreibung |
|-|-|
| Status im Start | lesen | Lesen Sie die aktuelle Leistung während der Bereitstellung/Wiederverbindung und veröffentlichen Sie an KNX. Standardwert: "Ja".|
|Knotenausgangsstift | Zeigen oder verbergen Sie die Knoten-rote Ausgabe.Wenn das KNX -Gateway nicht ausgewählt ist, bleibt der Ausgangsstift aktiviert, um sicherzustellen, dass das HUE -Ereignis weiterhin den Prozess eingeben kann.|

> ℹ️ Wenn das KNX-Gateway nicht ausgewählt ist, wird das KNX-Mapping-Feld automatisch versteckt, um die Verwendung von Knoten als reine Farbton → Knoten-Red-Ereignisquellen zu erleichtern.
