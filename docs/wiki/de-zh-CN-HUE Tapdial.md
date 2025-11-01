---
layout: wiki
title: "zh-CN-HUE Tapdial"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Tapdial/
---
---

**Hue-TAP-Dial-Dial** Knoten kartiert den Rotationsdienst von Tap Dial an KNX und sendet das ursprüngliche Hue-Ereignis an den Knoten-Red-Prozess.Klicken Sie nach dem Koppeln eines neuen Geräts auf das Symbol für Aktualisieren neben dem Feld Gerät.

### Registerkarte

- **Mapping** - Wählen Sie die KNX -Gruppenadresse und DPT, die dem Rotationsereignis entspricht, und unterstützt DPT 3.007, 5.001, 232.600.
- **Verhalten** - steuert, ob der Knoten -rot -Ausgangspin angezeigt wird.Wenn das KNX -Gateway nicht konfiguriert ist, bleibt die PIN aktiviert, sodass Ereignisse weiterhin den Prozess eingeben.

### Allgemeine Einstellungen

| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | KNX -Tor für die automatische Fertigstellung von GA.|
| Hue Bridge | Die Hue Bridge bietet die Hue Bridge von Tap Dial. |
| Hue Tippen Sie auf Zifferblatt |Knob-Gerät (unterstützt die automatische Fertigstellung; Aktualisieren Sie die Taste, um die Liste neu zu machen).|

### Mapping -Registerkarte

| Eigenschaften | Beschreibung |
|-|-|
| Rotierende ga | KNX -Gruppenadresse, die Rotationsereignisse empfängt (unterstützt DPT 3.007, 5.001, 232.600). |
| Name |Beschreibung Name von Ga. |

### Ausgabe

|#|Port | Nutzlast |
|-|-|-|-|
| 1 | Standardausgabe | `msg.payload` (Objekt) Original -HUE -Ereignis, das durch Tap Dial generiert wird. |

> ℹ️ KNX-bezogene Steuerelemente werden erst nach Auswahl des KNX-Gateways angezeigt.Die Registerkarte Mapping bleibt versteckt, bis sowohl die Hue -Brücke als auch das KNX -Gateway konfiguriert sind.
