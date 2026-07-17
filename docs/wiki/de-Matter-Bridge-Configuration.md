---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: de
permalink: /wiki/de-Matter-Bridge-Configuration
---
# Matter Bridge (BETA)

> Dieser Node ist in **BETA**: Er funktioniert, aber Details können sich zwischen Releases noch ändern.

## Übersicht

Dieser Konfigurations-Node ist die **Matter-Bridge selbst**: Er betreibt den Matter-Server, den Alexa, Google Home, Apple Home (oder jeder Matter-Controller) **einmal** koppeln. Jeder **Matter Bridge device**-Node in deinen Flows verweist hierher und erscheint in den Apps als ein Gerät der Bridge.

## Konfiguration

|Feld|Beschreibung|
|--|--|
| Name | Der Name dieses Konfigurations-Nodes in Node-RED |
| Name der Matter-Bridge | Wie die Bridge selbst in den Matter-Apps heißt. **Leer lassen, um den Namen dieses Nodes zu verwenden.** |
| Port | UDP-Port des Matter-Servers (Standard 5540). Jede Bridge braucht ihren eigenen Port, daher sind **mehrere unabhängige Bridges** möglich |

## Kopplung

1. **Deployen**, ein paar Sekunden warten, dann diesen Node erneut öffnen.
2. Das Kopplungs-Panel zeigt den **QR-Code** und den **manuellen Code**: scannen oder in Alexa / Google Home / Apple Home eingeben ("Matter-Gerät hinzufügen").
3. Mehrere Controller können mit derselben Bridge gekoppelt werden (Matter Multi-Fabric).

Um nach dem Ausblenden des QR-Codes einen weiteren Controller hinzuzufügen, den Kopplungsmodus über einen bereits gekoppelten Controller öffnen und dann im neuen Controller ein Matter-Gerät hinzufügen. **Kopplung zurücksetzen** nur verwenden, um alle vorhandenen Controller zu entfernen und neu zu beginnen.

Der Button **Kopplung zurücksetzen** entfernt alle gekoppelten Controller und startet die Kopplungs-Ankündigung neu.

## Identität und Speicherung

Die Bridge-Identität ist an diesen Konfigurations-Node gebunden und wird in `knxultimatestorage/matter` im Node-RED-Benutzerverzeichnis gespeichert: Re-Deploys (auch mit geändertem Port oder Namen) erfordern **KEINE** neue Kopplung. Nur das Löschen dieses Konfigurations-Nodes und das Anlegen eines neuen ändert die Identität — in dem Fall die alte Bridge aus der Matter-App entfernen und neu koppeln.

Mit **Exportieren** wird eine vollständige Sicherung dieser Bridge-Instanz heruntergeladen, einschließlich Fabrics, privater Zugangsdaten, Sitzungen und Kopplungsdaten. **Die Datei wie ein Passwort schützen.** Der Import ersetzt den Speicher dieser Instanz und startet die Bridge kurz neu. Eine Bridge-Sicherung kann nicht in einen Controller importiert werden.

## Hinweise

- Der Node-RED-Host muss **IPv6 link-local** aktiviert haben (Standard-Matter-Anforderung) und von den Controllern im lokalen Netzwerk erreichbar sein.
- Hinzugefügte/umbenannte/entfernte Device-Nodes werden von den gekoppelten Controllern innerhalb von Sekunden übernommen, ohne neue Kopplung.
- **Namen:** Alexa und Google Home übernehmen die hier gesetzten Namen (Bridge-Name und Device-Node-Namen). **Apple Home ignoriert sie und verlangt, jedes Zubehör bei der Einrichtung manuell zu benennen** — eine Einschränkung von Apple, nicht der Bridge.
