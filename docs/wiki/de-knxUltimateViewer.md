---
layout: wiki
title: "knxUltimateViewer"
lang: de
permalink: /wiki/de-knxUltimateViewer
---
## Upgrade auf KNX Ultimate 8

Version 7 ergänzt oben in jedem Knoteneditor eine kleine Schaltfläche **Auf v8 aktualisieren**. Sie sichert die Flows, installiert die benötigten HUE-/Matter-Pakete, konvertiert kompatible Knoten, führt ein vollständiges Deploy aus, prüft die gespeicherten Flows und installiert Version 8. Starten Sie den Node-RED-Dienst anschließend wie aufgefordert neu; nur den Browser neu zu laden genügt nicht. Bisherige KNX-AI-Knoten stoppen den automatischen Vorgang.

[Vollständige Upgrade-Anleitung lesen](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Upgrade-to-v8)

# KNX Viewer

KNX Viewer zeigt Zustandsänderungen von Gruppenadressen (GA) in einer einfachen Tabelle, ähnlich einem auf das Wesentliche beschränkten ETS-Monitor.

## Konfiguration

Wählen Sie das **KNX-Gateway** und vergeben Sie einen **Namen**. Übernehmen Sie den Flow mit Deploy, öffnen Sie den Knoten erneut und klicken Sie auf **KNX Viewer Monitor öffnen**. Die Seite öffnet sich in einem neuen Tab und verwendet dieselbe Authentifizierung und dieselben Leseberechtigungen wie der Node-RED-Editor.

## Webmonitor

Jede Zeile zeigt Uhrzeit, Telegrammtyp (Read, Write, Response usw.), Quelladresse, GA, Name, DPT, vorherigen und neuen Wert. Die neuesten Einträge stehen oben. Bei Write- und Response-Telegrammen werden der erste beobachtete Wert einer GA und nachfolgende Änderungen aufgezeichnet; unveränderte Werte erzeugen keine zusätzlichen Zeilen.

Read-Anfragen werden ebenfalls im 24-Stunden-Verlauf aufgezeichnet, ohne vorherigen oder neuen Wert. Sie ändern den zuletzt bekannten Wert der GA nicht.

Wählen Sie einen Viewer, durchsuchen Sie die Liste oder blättern Sie zu älteren Änderungen. **Pause** hält die Anzeige zum Lesen an; **Live** setzt die Aktualisierung fort. Die Aufzeichnung läuft während einer Pause und bei geschlossener Browserseite weiter.

## Verlauf der letzten 24 Stunden

Der aktive Viewer-Knoten speichert den Verlauf automatisch in Dateien unter `userDir/knxultimatestorage/viewer`, getrennt nach Viewer und Gateway. Änderungen, die älter als 24 Stunden sind, werden automatisch entfernt. Nach einem Neustart von Node-RED lädt der Viewer den noch in diesem Zeitraum liegenden Verlauf.

Die Aufzeichnung beginnt, sobald der aktualisierte Viewer bereitgestellt ist und läuft. Frühere Bustelegramme werden nicht nachträglich rekonstruiert.

## Flow-Ausgänge

Die drei vorhandenen Ausgänge bleiben erhalten:

1. **Aktuelle Gruppenadresswerte** — `msg.payload` enthält eine HTML-Tabelle für einen Template-Knoten im Dashboard.
2. **Gruppenadress-Array** — `msg.payload` enthält die GA-Daten als Array zur Verarbeitung oder Aufzeichnung im Flow.
3. **Telegrammwarteschlange** — `msg.payload` enthält eine HTML-Tabelle der Sendewarteschlange des Gateways.

Der Webmonitor kann ohne angeschlossene Ausgänge verwendet werden.
