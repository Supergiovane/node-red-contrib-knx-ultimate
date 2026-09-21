---
layout: wiki
title: "KNX Utility"
lang: de
permalink: /wiki/de-KNX-Utility
---
## Upgrade auf KNX Ultimate 8

Version 7 ergänzt oben in jedem Knoteneditor eine kleine Schaltfläche **Auf v8 aktualisieren**. Sie sichert die Flows, installiert die benötigten HUE-/Matter-Pakete, konvertiert kompatible Knoten, führt ein vollständiges Deploy aus, prüft die gespeicherten Flows und installiert Version 8. Starten Sie den Node-RED-Dienst anschließend wie aufgefordert neu; nur den Browser neu zu laden genügt nicht. Bisherige KNX-AI-Knoten stoppen den automatischen Vorgang.

[Vollständige Upgrade-Anleitung lesen](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Upgrade-to-v8)

# KNX Utility

**KNX Utility** vereint elf KNX-Hilfsfunktionen in einem Palettenknoten. Wählen Sie eine **Funktion**, um ihre Einstellungen, ihr Symbol und ihre Flow-Anschlüsse anzuzeigen. **KNX Device (KNXUltimate)** bleibt der Hauptknoten zum Senden und Empfangen von KNX-Telegrammen.

## Elf Funktionen, ein Knoten

| Funktion und Einstellungsreferenz | Aufgabe | Eingänge / Ausgänge |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | Meldet alarmierte Geräte einzeln, zusammen oder als zuletzt ausgelösten Alarm. | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | Beantwortet KNX-Leseanfragen mit konfigurierten oder zuvor empfangenen Werten. | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/de-DateTime-Configuration) | Sendet Datum und Uhrzeit mit DPT 19.001, 11.001 und 10.001. | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | Überwacht das Gateway oder ein KNX-Gerät und meldet Verbindungsprobleme. | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | Stellt KNX-Werte im gewählten globalen Node-RED-Kontextspeicher bereit. | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | Protokolliert Telegramme als ETS-kompatibles XML und zählt den Busverkehr. | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/de-Staircase-Configuration) | Steuert zeitgesteuertes Treppenlicht mit Status, Übersteuerung und Vorwarnung. | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/de-Garage-Configuration) | Verwaltet Garagenbefehle, Impulse, Sicherheitseingänge und automatisches Schließen. | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | Ruft Szenen ab, lernt und speichert sie mit konfigurierbaren Gruppenadressen und Werten. | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | Schaltet konfigurierte Lasten anhand von Verbrauch und Leistungsgrenzen ab und wieder ein. | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | Übersetzt Home-Assistant-Zustände anhand einer konfigurierbaren Nachrichteneigenschaft und Zuordnungstabelle in boolesche Werte. | 1 / 1 |

Die Tabelle zeigt die Flow-Anschlüsse jeder Funktion. AutoResponder und Global Context arbeiten direkt mit Bus und Kontext. DateTime verwendet geplante Sendungen und die Schaltfläche am Knoten; es hat keine Flow-Ein- oder -Ausgänge.

Home Assistant Translator hat einen Eingang und einen Ausgang und benötigt kein KNX-Gateway. Wählen Sie die zu übersetzende Nachrichteneigenschaft (etwa `payload` oder `data.new_state.state`) und bearbeiten Sie die Zuordnungen `Quelle:true` / `Quelle:false`, zum Beispiel `open:true` und `closed:false`. Der übersetzte boolesche Wert wird in `msg.payload` ausgegeben. Verbinden Sie den Ausgang mit KNX Device, wenn ein Schreiben auf den Bus erforderlich ist.

## Einen Utility-Knoten konfigurieren

1. Ziehen Sie **KNX Utility** aus der Palette in den Flow.
2. Wählen Sie die **Funktion**, bei Bedarf das KNX-Gateway, und ergänzen Sie die angezeigten Einstellungen.
3. Speichern Sie den Knoten und prüfen Sie die Anschlüsse. Aktivieren Sie ihn mit **Deploy**.

Ein Funktionswechsel im Editor zeigt zunächst eine Vorschau der Einstellungen. **Abbrechen** erhält die zuvor gespeicherte Konfiguration. Die Tabellenlinks führen zu Einstellungen und Beispielen der jeweiligen Funktion; die bisherigen Seiten bleiben als Referenz der Einzelknoten verfügbar.

## Alle kompatiblen bisherigen Knoten konvertieren

Öffnen Sie **KNX Utility** oder einen kompatiblen bisherigen Knoten, klicken Sie auf **Alle kompatiblen bisherigen KNX-Knoten konvertieren** und bestätigen Sie. Die Konvertierung erfasst jede Instanz der elf Funktionen in **allen Flows und Subflows** des Editors, unabhängig von aktivem Tab und Auswahl.

Nach der Bestätigung und bevor Knoten geändert werden, startet der Browser automatisch den Download einer mit Datum und Uhrzeit versehenen JSON-Sicherung aller aktuell im Editor vorhandenen Flows, einschließlich Tabs, Subflows, Konfigurationsknoten, Gruppen und Verbindungen. Die Datei verwendet das Standardexportformat von Node-RED und kann wieder importiert werden. Von Knoten deklarierte Zugangsdaten sind wie beim Standardexport ausgeschlossen. Ihr Browser fragt möglicherweise nach dem Speicherort. Kann die Sicherung nicht vorbereitet oder ihr Download nicht gestartet werden, wird kein Knoten konvertiert.

Die Konvertierung erfolgt lokal im Browser. IDs, gespeicherte Einstellungen, Gateway-Verweise, Verbindungen, Positionen und Gruppenzugehörigkeit bleiben erhalten. Die IDs erhalten AutoResponder-Wertedateien und aufgezeichnete Scene-Controller-Szenen. Global Context behält Variablennamen und Speicherwahl; Logger behält seine Dateieinstellungen. Home Assistant Translator behält die Eingabeeigenschaft und die eigene Übersetzungstabelle bei, auch wenn diese absichtlich leer ist.

Die Bestätigung schließt den aktuellen Knoten-Editor und verwirft nicht gespeicherte Änderungen. Die gesamte Konvertierung lässt sich mit einem einzigen **Rückgängig** aufheben und mit **Wiederholen** erneut anwenden. Prüfen Sie die konvertierten Knoten und klicken Sie selbst auf **Deploy**. Die Migration führt kein automatisches Deploy aus. Ein gesperrter Flow verhindert die Konvertierung, bis er entsperrt wird.

Bestehende Einzelknoten werden weiterhin geladen und funktionieren. Sie sind in der Palette ausgeblendet und in vorhandenen Flows mit `(deprecated)` gekennzeichnet; ihre Einstellungen bleiben bearbeitbar. KNX Device, Viewer sowie weitere Integrations- und Routingknoten behalten ihre jeweiligen Aufgaben.
