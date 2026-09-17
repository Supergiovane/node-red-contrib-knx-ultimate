---
layout: wiki
title: "Upgrade von Version 7"
lang: de
permalink: /wiki/de-Migration-8
translation_key: "Migration-8"
---

# Upgrade von Version 7

Version 8 entfernt die alten HUE-, Matter- und KI-Knoten samt Konfigurationen sowie die separaten KNX-Utility-Knoten. Schließe die Migration ab, solange KNX Ultimate 7 noch installiert ist.

1. Sichere das gesamte Node-RED-Benutzerverzeichnis: Flows, Zugangsdaten, Einstellungen und `knxultimatestorage`. Ein Flow-JSON allein sichert keine Matter-Kopplungen.

2. Nutze in KNX Ultimate 7 **Migrate KNX** oder den Konvertierungsbutton in KNX Utility für die alten Utility-Knoten. Prüfe alle Flows und Subflows und führe Deploy aus.

3. Installiere `node-red-contrib-hue-ultimate` und/oder `node-red-contrib-matter-ultimate` und starte Node-RED neu. Bestätige den Migrationshinweis. HUE konvertiert sowohl einzelne alte Knoten als auch den bisherigen multimodalen Controller.

4. Prüfe die konvertierten Flows und führe Deploy aus. IDs und Konfigurationsverweise bleiben erhalten. Behalte das Benutzerverzeichnis und lösche `knxultimatestorage/matter` nicht: Dort liegen Matter-Kopplungsidentitäten und Fabrics.

5. Ersetze oder entferne `knxUltimateAI` und `knxUltimateAIHomeAssistant` vor dem Upgrade. Cerebrum Ultimate ist das separate KI-Paket; eine automatische KI-Konvertierung gibt es nicht. Entferne auch ungenutzte alte Konfigurationen.

6. Prüfe die Gerätefunktion. Installiere dann KNX Ultimate 8 und starte Node-RED neu. HUE- und Matter-Knoten mit KNX verwenden weiterhin das vorhandene Gateway.

## Wenn die Installation blockiert wird

Die Installation von Version 8 prüft gespeicherte Flows auf alte HUE- und Matter-Knoten, einschließlich Konfigurationen, deaktivierter Flows und Subflows. Die neuen Pakete zu installieren genügt nicht: Konvertiere zuerst und führe Deploy aus. Benutzerdefinierte Speicher und ungespeicherte Änderungen können nicht vollständig geprüft werden; die Migrationsschritte bleiben notwendig.

Bei einem zu frühen Upgrade installiere KNX Ultimate 7 erneut und starte Node-RED vor der Migration neu. Stelle bei Bedarf die vollständige Sicherung wieder her. Lösche keine unbekannten Knoten und setze Matter-Kopplungen nicht zurück.

## Dokumentation

- [KNX Utility]({{ '/wiki/de-KNX-Utility' | relative_url }})
- [HUE Ultimate](https://supergiovane.github.io/node-red-contrib-hue-ultimate/de/index.html)
- [Matter Ultimate](https://supergiovane.github.io/node-red-contrib-matter-ultimate/de/index.html)
- [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)
