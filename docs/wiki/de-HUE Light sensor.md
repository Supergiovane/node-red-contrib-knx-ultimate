---
layout: wiki
title: "HUE Light sensor"
lang: de
permalink: /wiki/de-HUE%20Light%20sensor
---
Dieser Node liest Lux‑Ereignisse eines HUE‑Lichtsensors und spiegelt sie nach KNX.

Es wird die Umgebungshelligkeit (Lux) bei Änderungen ausgegeben. Im GA‑Feld den KNX‑Gerätenamen oder die GA eingeben (Autocomplete), um die GA zu verknüpfen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX GW |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Farbtonbrücke aus |
| HUE Sensor | Zu verwendender HUE‑Lichtsensor (Autocomplete) |
|Status bei Startup lesen |Lesen Sie den Status beim Start und geben Sie das Ereignis bei Startup/Wiederverbindung an den KNX -Bus aus.(Standard "nein") |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Lux | KNX‑GA, die den Lux‑Wert erhält |

### Ausgänge

1. Standardausgang
   : payload (number): aktueller Lux‑Wert

### Details

`msg.payload` enthält den numerischen Lux‑Wert.
