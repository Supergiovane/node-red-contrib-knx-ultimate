---
layout: wiki
title: "HUE Device software update"
lang: de
permalink: /wiki/de-HUE%20Device%20software%20update
---
> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der kontrastreiche orange Migrationsbutton mit weißer Beschriftung konvertiert alle Legacy-HUE-Knoten lokal; anschließend öffnet er nur einen bearbeitbaren E-Mail-Entwurf. Die E-Mail wird niemals automatisch gesendet. Nach Abschluss des Vorgangs bleibt eine feste Node-RED-Meldung sichtbar, bis Sie auf OK klicken, und bietet eine optionale Unterstützungsschaltfläche; die Spendenseite öffnet sich nur nach einem Klick darauf. Sehen Sie sich vor dem Start die [Videoanleitung auf YouTube](https://youtu.be/f0Evf2QFI7c) an.

Dieser Node überwacht, ob ein HUE-Gerät ein Software-Update hat, und spiegelt den Status nach KNX.

Geben Sie den Namen oder die Gruppenadresse Ihres KNX -Geräts im Feld GA ein.
Sie tippen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX-Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Hue Bridge aus |
| Hue-Gerät | Zu überwachendes HUE-Gerät (Autocomplete) |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Status | KNX-GA für Update-Status: _true_, wenn verfügbar/bereit/in Installation, sonst _false_. |
| Status beim Start lesen | Beim Start/Wiederverbindung lesen und an KNX ausgeben (Standard "Ja"). |

### Ausgänge

1. Standardausgang
   : payload (boolean): Update-Flag.
   : status (string): **no\_update, update\_pending, ready\_to\_install, installing** .
