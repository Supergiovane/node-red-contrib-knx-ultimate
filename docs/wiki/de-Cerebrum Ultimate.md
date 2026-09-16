---
layout: wiki
title: "Cerebrum Ultimate"
lang: de
permalink: /wiki/de-Cerebrum-Ultimate
---

# Cerebrum Ultimate

Der bisher in KNX Ultimate enthaltene KI-Knoten wurde durch das eigenständige Paket **Cerebrum Ultimate** ersetzt.

Cerebrum Ultimate behandelt KNX Ultimate als optionale kompatible Integration – ebenso wie Home Assistant, HUE, Matter, UniFi Protect und weitere registrierte Adapter. Neue Installationen sollen [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate) verwenden.

Seit **7.1.1** sind die bisherigen Knoten `knxUltimateAI` und `knxUltimateAIHomeAssistant` samt Weboberfläche wieder enthalten, damit vorhandene Flows kompatibel bleiben. Die Knoten sind in der Palette ausgeblendet; bestehende Konfigurationen und gespeicherte KI-Daten werden weiterhin unterstützt. Die Migration zum eigenständigen Paket Cerebrum Ultimate ist optional; eine automatische Konvertierung gibt es nicht.

Die vollständige englische Dokumentation befindet sich im [README von Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
