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

## Speicherung

Die Fabric-Zugangsdaten und die gekoppelten Geräte werden im Ordner `knxultimatestorage/matter` im Node-RED-Benutzerverzeichnis gespeichert. Das Löschen dieses Ordners entfernt alle Kopplungen.

## Ein Gerät entfernen

Nutze den Papierkorb-Button in der Liste der gekoppelten Geräte. Der Controller versucht, das Gerät sauber zu dekommissionieren; ist es nicht erreichbar, wird es trotzdem aus der Fabric entfernt (danach kann ein Werksreset des Geräts nötig sein).
