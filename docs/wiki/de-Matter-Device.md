---
layout: wiki
title: "Matter-Device"
lang: de
permalink: /wiki/de-Matter-Device
---
# Matter-Gerät (BETA)

> Dieser Node ist in **BETA**: Er funktioniert, aber Details können sich zwischen Releases noch ändern.

## Übersicht

Der Matter Device Node verbindet ein **Matter-Gerät** mit **KNX-Gruppenadressen**. Der Node arbeitet über den Konfigurations-Node *Matter Controller*, der die Geräte in seine eigene Matter-Fabric kommissioniert.

- **Steuere** jedes gekoppelte Matter-Gerät vom KNX-Bus aus (Ein/Aus, Dimmen, Rollläden, Thermostate, Schlösser, ...).
- **Verfolge** jedes Attribut des Geräts auf KNX-Gruppenadressen (Statusmeldungen, Sensoren, Leistungsmessung, Batterie...).
- Vollständig generisch: Die Zuordnungsliste wird aus den **realen Endpoints/Clustern** des Geräts aufgebaut.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX GW | KNX-Gateway für die Telegramme |
| Matter Ctrl | Der Matter-Controller-Konfigurations-Node (dort werden die Geräte gekoppelt) |
| Gerät | Wähle das gekoppelte Matter-Gerät aus der Autovervollständigung |
| Zuordnungen | Eine Zeile pro Zuordnung Gruppenadresse ↔ Matter-Cluster |
| Status beim Start lesen | Wenn aktiviert, sendet der Node die aktuellen zwischengespeicherten Werte beim Deploy/Verbinden |
| Node Input/Output PINs | Aktiviert die Node-RED-Pins für den rohen Matter-Zugriff |

## Zuordnungen

Die Ziel-Liste zeigt die unterstützten Funktionen mit verständlichen Namen wie *"Ein/Aus-Schalter"* oder *"Momentanleistung (W)"*, gefiltert nach dem, was das Gerät wirklich bereitstellt, mit dem aktuellen Wert in eckigen Klammern.

Jede Zuordnungszeile hat eine **Richtung**:

- **KNX → Matter (Befehl)**: Ein Telegramm auf der Gruppenadresse ruft einen Matter-Cluster-Befehl auf oder schreibt ein Attribut. Beispiel: GA `1/1/1` DPT 1.001 → `OnOff.on/off` (der boolesche Wert wählt automatisch Ein oder Aus).
- **Matter → KNX (Status)**: Wenn sich das abonnierte Matter-Attribut ändert, wird sein Wert konvertiert und auf die Gruppenadresse geschrieben. `GroupValue_Read`-Anfragen werden mit dem zwischengespeicherten Wert beantwortet.

Die gängigen Cluster werden automatisch in KNX-freundliche Werte konvertiert:

|Cluster|Konvertierung|
|--|--|
| OnOff | boolesch (DPT 1.001) |
| LevelControl | 0-254 ↔ Prozent (DPT 5.001) |
| WindowCovering | percent100ths ↔ Prozent (DPT 5.001), Auf/Ab (DPT 1.008) |
| ColorControl | Mired ↔ Kelvin (DPT 7.600) |
| Thermostat | Zenti-°C ↔ °C (DPT 9.001) |
| Temperatur/Feuchte | Zenti-Einheiten ↔ Einheiten (DPT 9.001/9.007) |
| Beleuchtungsstärke | Log-Skala ↔ Lux (DPT 9.004) |
| PowerSource | Halb-Prozent ↔ Batterie-Prozent (DPT 5.001) |
| Elektrische Leistung/Energie | mW ↔ W (DPT 14.056), mWh ↔ kWh (DPT 13.013) |

Andere Cluster/Attribute werden unverändert durchgereicht; der gewählte DPT übernimmt die finale KNX-Kodierung.

## Node-PINs

Wenn du die Node-PINs aktivierst:

- **Input**: sende rohe Befehle: `msg.payload = { endpointId: 1, clusterId: 6, command: "toggle" }` oder Attribut-Schreibzugriffe: `msg.payload = { endpointId: 1, clusterId: 8, attribute: "onLevel", value: 128 }`
- **Output**: empfängt jede Attributänderung (`msg.matter` enthält das komplette Ereignis) und jedes Cluster-Ereignis (Tastendrücke usw.).
