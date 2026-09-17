---
layout: wiki
title: "KNX Utility"
lang: de
permalink: /wiki/de-KNX-Utility
translation_key: "KNX-Utility"
---
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

## Upgrade von Version 7

Konvertiere die alten separaten Knoten noch mit **KNX Ultimate 7** und führe Deploy vor dem Upgrade aus. Die Konvertierung erhält IDs, Einstellungen und Verbindungen und bietet Flow-Sicherung und Rückgängig. Version 8 lädt die entfernten Knotentypen nicht.

[Upgrade von Version 7]({{ '/wiki/de-Migration-8' | relative_url }})
