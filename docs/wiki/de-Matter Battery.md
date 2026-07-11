---
layout: wiki
title: "Matter Battery"
lang: de
permalink: /wiki/de-Matter%20Battery
---
# Matter Batteriesensor (BETA)

> Dieser Knoten ist **BETA**: das Verhalten kann sich ändern, während die Matter-Implementierung weiter verfeinert wird.

Dieser Knoten verbindet einen Matter Batterie-/Stromversorgungs-Endpunkt mit KNX und optional mit einem Node-RED-Ausgang.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway zum Schreiben und Beantworten der konfigurierten Gruppenadressen. Kann leer bleiben, wenn nur der Node-RED-Ausgang benötigt wird. |
| Matter controller | Matter-Controller-Konfigurationsknoten, in dem das Gerät gekoppelt wurde. |
| Matter Batteriesensor | Matter Batterie-/Stromversorgungs-Endpunkt, ausgewählt aus den gekoppelten Geräten. Die Liste wird auf Endpunkte mit `PowerSource` gefiltert. |
| Batterie-GA | Batterie-GA für den konvertierten Wert. Standard-DPT: `5.001`. |
| Read at startup | Veröffentlicht den gecachten Matter-Wert beim Deploy/Start oder wenn sich das Gerät erneut verbindet. |
| Node output | Zeigt einen Node-RED-Ausgang und sendet jedes Matter-Update. |

## Verhalten

Der Knoten liest `PowerSource.batPercentRemaining`, konvertiert den Wert zu Batteriestand in Prozent, schreibt ihn auf die konfigurierte KNX-GA und beantwortet KNX-Leseanfragen mit dem letzten bekannten Wert.
