---
layout: wiki
title: "Upgrade auf KNX Ultimate 8"
lang: de
permalink: /wiki/de-Upgrade-to-v8
---
# Upgrade auf KNX Ultimate 8

Version 7 zeigt oben in jedem KNX-Ultimate-Knoteneditor eine kleine Schaltfläche **Auf v8 aktualisieren**. Ein geführter Vorgang erledigt die Migration; installieren Sie Version 8 nicht vorher manuell.

## Was die Schaltfläche erledigt

1. Lädt eine JSON-Sicherung aller aktuell im Editor vorhandenen Flows herunter. Geschützte Zugangsdaten sind wie beim Standardexport von Node-RED nicht in der Datei enthalten, bleiben aber in Node-RED gespeichert.
2. Installiert HUE Ultimate und/oder Matter Ultimate nur, wenn die Flows entsprechende Knoten enthalten.
3. Konvertiert kompatible KNX-Utility-, HUE- und Matter-Knoten am selben Ort und behält IDs, Verdrahtung, Gruppen, Konfigurationsverweise und Matter-Speicher bei.
4. Führt ein vollständiges Deploy aus und liest die gespeicherten Flows von Node-RED zurück. KNX Ultimate 8 wird nur installiert, wenn kein entfernter Knotentyp übrig ist.
5. Fordert zum Neustart des Node-RED-Dienstes auf. Dieser Neustart ist zwingend; ein Neuladen des Browsers genügt nicht.

Das aktuelle Knotenformular wird beim Start geschlossen. Speichern Sie daher zunächst dort vorgenommene Eingaben. Das Konto benötigt Rechte zum Lesen und Deployen von Flows sowie zum Installieren/Aktualisieren von Palettenmodulen.

Ist bereits eine ältere Version des separaten Pakets HUE Ultimate oder Matter Ultimate installiert, bereitet die Schaltfläche zunächst dessen Update vor und fordert zu einem vorläufigen Dienstneustart auf. Laden Sie den Editor neu und drücken Sie die Schaltfläche erneut; in diesem vorbereitenden Schritt wird kein Flow geändert. Bei einer normalen Installation von Version 7 ist dieser zusätzliche Neustart nicht nötig.

## Sicherheitsstopps

Der Vorgang stoppt vor jeder Änderung, wenn ein gesperrter Flow, ein nicht zur Migration gehörender unbekannter oder ungültiger Knoten oder ein bisheriger KNX-AI-/KNX-AI-Home-Assistant-Knoten gefunden wird. AI-Einstellungen lassen sich nicht sicher in Cerebrum Ultimate umwandeln; ersetzen oder entfernen Sie diese seltenen Knoten manuell und starten Sie die Schaltfläche erneut.

Schlägt eine Paketinstallation vor dem Deploy fehl, wird die Konvertierung im Editor zurückgenommen. Wurde der konvertierte Flow bereits deployed, aber die Installation von KNX Ultimate 8 schlägt fehl, bleiben Version 7 und die separaten Pakete nutzbar: Beheben Sie den gemeldeten Fehler und führen Sie die Schaltfläche erneut aus.

Läuft eine Paketanfrage in ein Zeitlimit und könnte noch aktiv sein, führen Sie kein Deploy aus: Starten Sie den Node-RED-Dienst neu, laden Sie den Editor neu und drücken Sie die Schaltfläche erneut.

Ist das Deploy-Ergebnis wegen einer unterbrochenen Verbindung nicht überprüfbar, nimmt der Vorgang kein Ergebnis an und führt keinen automatischen Rollback aus. Laden Sie den Editor neu und prüfen Sie die gespeicherten Flows, bevor Sie es erneut versuchen. Hat dagegen ein anderer Editor die Flow-Revision geändert, wird nur die automatische Konvertierung lokal zurückgenommen; prüfen oder exportieren Sie vorhandene lokale Änderungen und laden Sie den Editor anschließend neu.

Node-RED kann als Systemdienst, Docker-Container, Home-Assistant-Add-on oder unter einem anderen Supervisor laufen. Deshalb kann der Editor keinen universellen sicheren Neustartbefehl ausführen.
