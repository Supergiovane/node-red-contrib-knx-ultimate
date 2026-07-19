---
layout: wiki
title: "Control Matter from KNX"
lang: de
permalink: /wiki/de-Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> Dieser Knoten ist **BETA**: das Verhalten kann sich ändern, während die Matter-Implementierung weiter verfeinert wird.

Dieser Knoten steuert einen bereits gekoppelten Matter-Endpunkt über KNX. Wähle das Matter-Gerät aus; der Editor erkennt die Fähigkeiten des Endpunkts und zeigt nur die passenden KNX-Zuordnungen.

Er ersetzt die unveröffentlichten getrennten Matter-Controller-Nodes und behält die komplette Licht-UI bei, wenn der gewählte Endpunkt ein Licht ist.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway zum Schreiben und Beantworten der konfigurierten Gruppenadressen. Kann leer bleiben, wenn nur der Node-RED-Ausgang benötigt wird. |
| Matter controller | Matter-Controller-Konfigurationsknoten, in dem das Gerät gekoppelt wurde. |
| Matter device | Matter-Endpunkt aus den gekoppelten Geräten. Die UI wird aus den echten Fähigkeiten neu aufgebaut. |
| Switch / Steckdose / Licht On-Off | On/Off-Befehls- und Status-Gruppenadressen, normalerweise DPT `1.001`. |
| Türschloss | Eine DPT-`1.xxx`-Befehls-GA ruft bei `true` `lockDoor` und bei `false` `unlockDoor` auf; eine separate Status-GA erhält nur eindeutige Verriegelt/Entriegelt-Zustände. Falls erforderlich, wird die Fernbedienungs-PIN im Credential-Feld gespeichert. Nicht angebotene Befehle werden abgewiesen. |
| Andere Endpunkte | Steckdosen, Ein/Aus-Aktoren, Jalousien, Thermostate, Lüfter, Umwelt-/Kontakt-/Belegungssensoren sowie Batterie-, Leistungs- und Energieendpunkte verwenden das Mehrzweckprofil. Der Tab **Zuordnungen** enthält nur tatsächlich angebotene Cluster, Attribute und Befehle. |
| Lichtsteuerung | Für Licht-Endpunkte wird die vollständige Licht-UI verwendet: relatives DIM (DPT `3.007`), Helligkeit %, RGB/HSV, Tunable White, Einschalt-Helligkeit/-Temperatur, Tag/Nacht-Licht, Min/Max-Dimmlevel und Dimmgeschwindigkeit. Nicht unterstützte Bereiche bleiben ausgeblendet. |
| Sensoren | Sensor-Endpunkte zeigen ihre Mess-/Status-GA nur bei Unterstützung: Temperatur, Feuchte, Helligkeit, Präsenz, Kontakt und Batterie. |
| Read at startup | Veröffentlicht den gecachten Matter-Wert beim Deploy/Start oder wenn sich das Gerät erneut verbindet. |
| Update local state from KNX write | Aktualisiert den lokalen Matter/KNX-Cache, wenn ein Telegramm auf eine konfigurierte KNX-GA geschrieben wird. |
| Node Input/Output PINs | Zeigt Node-RED-Eingangs-/Ausgangspins. Der Eingang akzeptiert boolesche Payloads sowie Matter-ähnliche `msg.payload` oder `msg.on.on`; der Ausgang sendet Statusupdates. |

## Verhalten

Der Knoten pflegt einen lokalen Cache aus Matter-Updates und KNX-Schreibtelegrammen, beantwortet KNX-Leseanfragen aus diesem Cache und kann Werte beim Start lesen/ausgeben. Er hört nur auf konfigurierte Gruppenadressen, daher wird fremder KNX-Verkehr ignoriert.
