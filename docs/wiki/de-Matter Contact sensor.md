---
layout: wiki
title: "Matter Contact sensor"
lang: de
permalink: /wiki/de-Matter%20Contact%20sensor
---
# Matter Kontaktsensor (BETA)

> Dieser Knoten ist **BETA**: das Verhalten kann sich ändern, während die Matter-Implementierung weiter verfeinert wird.

Dieser Knoten verbindet einen Matter Kontakt-Endpunkt mit KNX und optional mit einem Node-RED-Ausgang.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway zum Schreiben und Beantworten der konfigurierten Gruppenadressen. Kann leer bleiben, wenn nur der Node-RED-Ausgang benötigt wird. |
| Matter controller | Matter-Controller-Konfigurationsknoten, in dem das Gerät gekoppelt wurde. |
| Matter Kontaktsensor | Matter Kontakt-Endpunkt, ausgewählt aus den gekoppelten Geräten. Die Liste wird auf Endpunkte mit `BooleanState` gefiltert. |
| Kontakt-GA | Kontakt-GA für den konvertierten Wert. Standard-DPT: `1.019`. |
| Read at startup | Veröffentlicht den gecachten Matter-Wert beim Deploy/Start oder wenn sich das Gerät erneut verbindet. |
| Node output | Zeigt einen Node-RED-Ausgang und sendet jedes Matter-Update. |

## Verhalten

Der Knoten liest `BooleanState.stateValue`, konvertiert den Wert zu boolescher Kontaktzustand, schreibt ihn auf die konfigurierte KNX-GA und beantwortet KNX-Leseanfragen mit dem letzten bekannten Wert.
