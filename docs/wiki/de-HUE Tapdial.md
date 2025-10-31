---
layout: wiki
title: "HUE Tapdial"
lang: de
permalink: /wiki/de-HUE%20Tapdial
---
Der **Hue Tap Dial** -Node verknüpft den Rotationsdienst des Tap Dial mit KNX und gibt das unveränderte Hue-Ereignis an Ihren Flow weiter. Nach dem Koppeln eines neuen Tap Dial verwenden Sie bitte das Refresh-Symbol neben dem Geräteeingabefeld.

### Reiter

- **Zuordnung** - Wählen Sie GA und DPT für die Rotationsereignisse (unterstützt DPT 3.007, 5.001 und 232.600).
- **Verhalten** - Blendet den Node-RED-Ausgang ein oder aus. Ohne KNX-Gateway bleibt der Ausgang erzwungen aktiv, damit Hue-Ereignisse weiterhin den Flow erreichen.

### Allgemeine Einstellungen

| Eigenschaft | Beschreibung |
|--|--|
| KNX GW | KNX-Gateway, das für die Autovervollständigung der GA verwendet wird. |
| Hue Bridge | Hue-Bridge, die das Tap Dial bereitstellt. |
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
