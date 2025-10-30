---
layout: wiki
title: "zh-CN-HUE Motion"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion)
---

<p> Dieser Knoten abonniert die Ereignisse des Farbtonbewegungssensors und synchronisiert sie mit dem KNX und dem Knoten-Red-Prozess.</p>

Geben Sie den KNX -Gerätenamen oder die Gruppenadresse in das Feld GA ein, um automatisch abzuschließen. Die Taste für Aktualisierung neben dem "Hue -Sensor" kann die Liste der Farbtongeräte neu laden.

**konventionell**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | KNX Gateway, das den Bewegungsstatus empfängt (KNX -Einstellungen werden erst nach der Auswahl angezeigt) |
| Hue Bridge | verwendet von Hue Bridge |
| Farbtonsensor | Zu verwendender Farbton -Bewegungssensor (unterstützt automatische Fertigstellung und Aktualisierung) |

**Abbildung**
| Eigenschaften | Beschreibung |
|-|-|
| Bewegung | Entsprechende KNX -Gruppenadresse; Senden Sie `true`, wenn eine Bewegung erkannt wird, und senden Sie` false`, wenn der Leerlauf wiederhergestellt wird (empfohlene DPT: <b> 1.001 </b>) |

**Verhalten**
| Eigenschaften | Beschreibung |
|-|-|
| Knotenausgangsstift | Node-rote Ausgabe zeigen oder ausblenden; bleibt aktiviert, wenn KNX Gateway nicht ausgewählt ist, um sicherzustellen, dass HUE -Ereignisse weiterhin in den Prozess eingeben können |

> ℹ️ Wenn das KNX-Gateway nicht ausgewählt ist, wird das KNX-Feld automatisch versteckt und der Knoten kann als reine Farbton → Knoten-Red-Hörer verwendet werden.

### Ausgabe

1. Standardausgang - `msg.payload` (boolean)
: Die Bewegung wird als "wahr" erkannt und das Ende der Bewegung ist "falsch".
