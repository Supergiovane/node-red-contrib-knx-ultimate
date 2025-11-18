---
layout: wiki
title: "HUE Contact sensor"
lang: de
permalink: /wiki/de-HUE%20Contact%20sensor
---
Dieser Node leitet Ereignisse eines HUE‑Kontaktsensors weiter und ordnet sie KNX‑Gruppenadressen zu.

Tippen Sie in das Feld GA, die Name oder die Gruppenadresse Ihres KNX -Geräts, die avabaren Geräte werden beim Eingeben angezeigt.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX GW |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Farbtonbrücke aus |
| HUE Sensor | Zu verwendender HUE‑Kontaktsensor (Autocomplete) |

|Eigenschaft |Beschreibung |
|-------- |------------------------------------------------------------------------------------------------------------------ |
| Kontakt | Bei Öffnen/Schließen senden: _true_ (aktiv/offen), sonst _false_ |

### Ausgänge

1. Standardausgabe
   : Nutzlast (Boolean): Die Standardausgabe des Befehls.

### Details

`msg.payload` enthält das HUE‑Ereignis (Boolean/Objekt) für eigene Logik.
