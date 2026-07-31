---
layout: wiki
title: "HUE Battery"
lang: de
permalink: /wiki/de-HUE%20Battery
---
> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der orange Migrationsbutton in diesem Editor öffnet denselben vollständigen Flow-Konverter wie HUE Controller.

Dieser Node spiegelt den Batteriestand eines Hue-Geräts nach KNX und löst Ereignisse aus, sobald sich der Wert ändert.

Im GA-Feld den KNX-Gerätenamen oder die Gruppenadresse eingeben; beim Tippen erscheinen Vorschläge. Über das Aktualisieren-Symbol neben "Hue Sensor" lässt sich die Geräteliste der Hue-Bridge neu laden.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, auf das der Batteriestand veröffentlicht wird (erforderlich, damit KNX-Felder angezeigt werden). |
| Hue Bridge | Hue Bridge, auf der das Gerät eingebunden ist. |
| Hue-Batteriesensor | Hue-Gerät/Sensor, das den Batteriestand liefert (unterstützt Autovervollständigung und Refresh). |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Level | KNX-GA für den Batteriestand (0-100 %). Empfohlener DPT: <b>5.001</b>. |

**Verhalten**

| Eigenschaft | Beschreibung |
|--|--|
| Status beim Start lesen | Beim Deploy/Wiederverbinden aktuellen Wert lesen und an KNX senden. Standard: "ja". |
| Node-Ausgangspin | Node-RED-Ausgang anzeigen/ausblenden. Ohne KNX-Gateway bleibt der Ausgang aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen. |

> ℹ️ Die KNX-Mapping-Felder bleiben ausgeblendet, bis ein KNX-Gateway gewählt wurde - ideal, wenn der Node nur als Hue → Node-RED Ereignisquelle dient.
