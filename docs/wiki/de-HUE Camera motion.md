---
layout: wiki
title: "HUE Camera motion"
lang: de
permalink: /wiki/de-HUE%20Camera%20motion
---
> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der kontrastreiche orange Migrationsbutton mit weißer Beschriftung konvertiert alle Legacy-HUE-Knoten lokal; anschließend öffnet er nur einen bearbeitbaren E-Mail-Entwurf. Die E-Mail wird niemals automatisch gesendet. Nach Abschluss des Vorgangs bleibt eine feste Node-RED-Meldung sichtbar, bis Sie auf OK klicken, und bietet eine optionale Unterstützungsschaltfläche; die Spendenseite öffnet sich nur nach einem Klick darauf. Sehen Sie sich vor dem Start die [Videoanleitung auf YouTube](https://youtu.be/f0Evf2QFI7c) an.

Der Hue Camera Motion Node lauscht auf Bewegungsereignisse der Philips-Hue-Kameras und spiegelt den erkannt/nicht-erkannt-Status in KNX.

Geben Sie im GA-Feld (Name oder Gruppenadresse) den gewünschten Wert ein; passende Geräte werden während der Eingabe vorgeschlagen.

**Allgemein**

|Eigenschaft|Beschreibung|
|--|--|
| KNX Gateway | Zu verwendendes KNX-Gateway auswählen |
| Hue Bridge | Zu verwendende Hue Bridge auswählen |
| HUE Kamerabewegung | Hue-Kamera-Bewegungssensor (Autovervollständigung während der Eingabe) |
| Status beim Start auslesen | Liest beim Start/bei Wiederverbindung den aktuellen Wert und sendet ihn an KNX (Standard: nein) |

**Zuordnung**

|Eigenschaft|Beschreibung|
|--|--|
| Bewegung | KNX-GA für die Kamerabewegung (Boolean). Empfohlener DPT: <b>1.001</b> |

### Ausgaben

1. Standardausgang
   : `msg.payload` (Boolean): `true`, wenn Bewegung erkannt wird, sonst `false`

### Details

`msg.payload` enthält den zuletzt vom Hue-Kameraservice gemeldeten Bewegungsstatus.
