---
layout: wiki
title: "HUE Light sensor"
lang: de
permalink: /wiki/de-HUE%20Light%20sensor
---
> **Veraltet:** Dieser dedizierte HUE-Knoten bleibt für bestehende Flows verfügbar. Verwenden Sie **HUE Controller** für neue Projekte. Er ist in der Palette und auf der Arbeitsfläche mit `(deprecated)` gekennzeichnet, verwendet eine hellere Farbe als HUE Controller und sein Editor zeigt oben einen Migrationshinweis. Der orange Migrationsbutton in diesem Editor öffnet denselben vollständigen Flow-Konverter wie HUE Controller.

Dieser Node liest Lux-Ereignisse eines HUE-Lichtsensors und spiegelt sie nach KNX.

Es wird die Umgebungshelligkeit (Lux) bei Änderungen ausgegeben. Im GA-Feld den KNX-Gerätenamen oder die GA eingeben (Autocomplete), um die GA zu verknüpfen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX-Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Hue Bridge aus |
| Hue Lichtsensor | Zu verwendender HUE-Lichtsensor (Autocomplete) |
|Status bei Startup lesen |Lesen Sie den Status beim Start und geben Sie das Ereignis bei Startup/Wiederverbindung an den KNX -Bus aus.(Standard "nein") |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Lux | KNX-GA, die den Lux-Wert erhält |

### Ausgänge

1. Standardausgang
   : payload (number): aktueller Lux-Wert

### Details

`msg.payload` enthält den numerischen Lux-Wert.
