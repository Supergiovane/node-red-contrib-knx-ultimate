---
layout: wiki
title: "Cerebrum Ultimate"
lang: de
permalink: /wiki/de-Cerebrum-Ultimate
---

# Cerebrum Ultimate

Der bisher in KNX Ultimate enthaltene KI-Knoten wurde durch das eigenständige Paket **Cerebrum Ultimate** ersetzt.

Cerebrum Ultimate behandelt KNX Ultimate als optionale kompatible Integration – ebenso wie Home Assistant, HUE, Matter, UniFi Protect und weitere registrierte Adapter. Neue Installationen sollen [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate) verwenden.

Ab **7.1.0-beta.0** wurden `knxUltimateAI`, `knxUltimateAIHomeAssistant` und ihre Weboberfläche aus KNX Ultimate entfernt. Vorhandene Flows mit diesen Typen zeigen unbekannte Knoten an. Migrieren Sie diese Flows vor dem Upgrade zum eigenständigen Paket Cerebrum Ultimate; eine automatische Konvertierung gibt es nicht. Auf dem Datenträger gespeicherte KI-Daten bleiben erhalten.

Die vollständige englische Dokumentation befindet sich im [README von Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
