---
layout: wiki
title: "Matter-Controller-Configuration"
lang: de
permalink: /wiki/de-Matter-Controller-Configuration
---
# Matter Controller

## Übersicht

Dieser Konfigurations-Node ist ein vollwertiger **Matter-Controller**: Er erstellt seine eigene Matter-*Fabric* und koppelt (kommissioniert) deine Matter-Geräte. Die gekoppelten Geräte stehen anschließend den **Matter Device**-Nodes zur Verfügung, die sie auf KNX-Gruppenadressen abbilden.

Der Controller kommuniziert mit den Geräten über das **IP-Netzwerk** (WLAN, Ethernet oder Thread über einen Border Router). Bluetooth-Kommissionierung wird nicht unterstützt: Das Gerät muss bereits im Netzwerk erreichbar sein.

## Ein Gerät koppeln

1. Zuerst diesen Konfigurations-Node **deployen** (der Controller muss laufen).
2. Den Node erneut öffnen und den **Kopplungscode** eingeben: entweder den 11-stelligen manuellen Code (z.B. `3497-011-2332`) oder den QR-Code-Inhalt (`MT:....`).
3. Auf **KOPPELN** klicken. Die Kommissionierung kann bis zu einer Minute dauern.

Wenn das Gerät fabrikneu ist und nur Bluetooth-Kommissionierung unterstützt, kopple es zuerst mit der Hersteller-App oder einem anderen Matter-Controller (Alexa, Google Home, Apple Home) und nutze dann dessen Funktion **"mit weiterem Hub teilen"**, um einen neuen Kopplungscode für KNX-Ultimate zu erzeugen. So tritt das Gerät mehreren Fabrics gleichzeitig bei.

Bevorzuge den QR-Payload (`MT:...`): Er enthält den vollständigen Diskriminator. Der manuelle Code enthält nur den kurzen Diskriminator und kann bei mehreren identischen Modellen im Kopplungsmodus das falsche Gerät auswählen. Immer nur ein Gerät gleichzeitig koppeln.

## Universeller Modus

Wähle in **Control Matter from KNX** den **Universellen Modus**, um alle Geräte zu überwachen. Ein KNX-Gateway ist optional und wird nur für die Alarm-/Text-GAs des Batteriemonitors benötigt.

Der **Universelle Batteriemonitor** durchsucht alle gekoppelten Nodes und Endpunkte nach Power Source, sendet einen anfänglichen Snapshot und speichert den vollständigen normalisierten Batteriestatus. Er kann nur Batterien unter dem Schwellwert oder jede Aktualisierung ausgeben. `{payload:{action:"getAllBatteries"}}` liefert das Cache-Inventar; rohe Matter-Metadaten stehen in `msg.matter`.

Eingaben benötigen `nodeId`, `endpointId`, `clusterId` sowie `command` oder `attribute` (direkt oder unter `msg.matter`):

- Ein: `{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- Lesen: `{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- Schreiben: `{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## Speicherung

Die Fabric-Zugangsdaten und die gekoppelten Geräte werden im Ordner `knxultimatestorage/matter` im Node-RED-Benutzerverzeichnis gespeichert. Das Löschen dieses Ordners entfernt alle Kopplungen.

Mit **Exportieren** wird eine vollständige Sicherung dieser Controller-Instanz heruntergeladen. Sie enthält Fabric, private Zugangsdaten, Sitzungen und Daten gekoppelter Geräte. **Die Datei wie ein Passwort schützen.** Der Import ersetzt den Matter-Speicher dieser Instanz und startet den Controller kurz neu. Eine Controller-Sicherung kann nicht in eine Bridge importiert werden.

## Ein Gerät entfernen

Nutze den Papierkorb-Button in der Liste der gekoppelten Geräte. Der Controller versucht, das Gerät sauber zu dekommissionieren; ist es nicht erreichbar, wird es trotzdem aus der Fabric entfernt (danach kann ein Werksreset des Geräts nötig sein).

Im universellen Batteriemonitor senden optionale KNX-Ausgänge den Sammelalarm als DPT 1.005 und wechseln alle 2 Sekunden die Gerätenamen als 14-Byte-Text DPT 16.001.
