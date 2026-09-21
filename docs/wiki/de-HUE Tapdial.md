---
layout: wiki
title: "HUE Tapdial"
lang: de
permalink: /wiki/de-HUE%20Tapdial
---
## Upgrade auf KNX Ultimate 8

Version 7 ergänzt oben in jedem Knoteneditor eine kleine Schaltfläche **Auf v8 aktualisieren**. Sie sichert die Flows, installiert die benötigten HUE-/Matter-Pakete, konvertiert kompatible Knoten, führt ein vollständiges Deploy aus, prüft die gespeicherten Flows und installiert Version 8. Starten Sie den Node-RED-Dienst anschließend wie aufgefordert neu; nur den Browser neu zu laden genügt nicht. Bisherige KNX-AI-Knoten stoppen den automatischen Vorgang.

[Vollständige Upgrade-Anleitung lesen](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Upgrade-to-v8)

> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der kontrastreiche orange Migrationsbutton mit weißer Beschriftung konvertiert alle Legacy-HUE-Knoten lokal; anschließend öffnet er nur einen bearbeitbaren E-Mail-Entwurf. Die E-Mail wird niemals automatisch gesendet. Nach Abschluss des Vorgangs bleibt eine feste Node-RED-Meldung sichtbar, bis Sie auf OK klicken, und bietet eine optionale Unterstützungsschaltfläche; die Spendenseite öffnet sich nur nach einem Klick darauf. Sehen Sie sich vor dem Start die [Videoanleitung auf YouTube](https://youtu.be/f0Evf2QFI7c) an.

Der **Hue Tap Dial** -Node verknüpft den Rotationsdienst des Tap Dial mit KNX und gibt das unveränderte Hue-Ereignis an Ihren Flow weiter. Nach dem Koppeln eines neuen Tap Dial verwenden Sie bitte das Refresh-Symbol neben dem Geräteeingabefeld.

### Reiter

- **Zuordnung** - Wählen Sie GA und DPT für die Rotationsereignisse (unterstützt DPT 3.007, 5.001 und 232.600).
- **Verhalten** - Blendet den Node-RED-Ausgang ein oder aus. Ohne KNX-Gateway bleibt der Ausgang erzwungen aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen.

### Allgemeine Einstellungen

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway, das für die Autovervollständigung der GA verwendet wird. |
| Hue Bridge | Hue Bridge, die das Tap Dial bereitstellt. |
| Hue Tap Dial | Drehgerät, das gesteuert wird (Autocomplete; Refresh lädt die Liste neu). |

### Reiter Zuordnung

| Eigenschaft | Beschreibung |
|--|--|
| Dreh-GA | KNX-GA für die Rotationsereignisse (DPT 3.007, 5.001 oder 232.600). |
| Name | Beschreibung der GA. |

### Ausgänge

|#|Port|Payload|
|--|--|--|
|1|Standardausgang|`msg.payload` (Objekt) Rohes Hue-Ereignis des Tap Dial.|

> ℹ️ KNX-bezogene Steuerelemente erscheinen erst nach Auswahl eines KNX-Gateways; der Zuordnung-Reiter bleibt verborgen, bis sowohl Bridge als auch Gateway konfiguriert sind.
