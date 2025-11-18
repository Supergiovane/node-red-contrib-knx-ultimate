---
layout: wiki
title: "zh-CN-HUE Contact sensor"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Contact%20sensor
---
---

<p> Dieser Knoten ordnet das Ereignis des Farbtonkontaktsensors an die KNX -Gruppenadresse ab.</p>

Starten Sie das Feld GA, den Namen oder die Gruppenadresse des KNX -Geräts, und das verfügbare Gerät wird beim Eingeben angezeigt.

**Allgemein**
| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Wählen Sie das zu verwendende KNX -Portal |
| Hua Bridge | Wählen Sie die zu verwendende Tonbrücke aus |
| Farbtonsensor | Hue -Kontaktsensor (automatische Fertigstellung) |

| Eigenschaften | Beschreibung |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------/ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kontakt | Wenn der Sensor ein-/aus ist: Senden Sie den KNX -Wert _true_ (aktivieren/eins), ansonsten _false_ |

### Ausgabe

1. Standardausgang
: Nutzlast (bolean): Standardausgabe des Befehls.

### Detail

`msg.payload` ist ein Hue -Ereignis (Boolean/Objekt), das für die benutzerdefinierte Logik verwendet werden kann.
