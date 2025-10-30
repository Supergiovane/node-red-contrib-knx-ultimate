---
layout: wiki
title: "HUE Plug"
lang: de
permalink: /wiki/de-HUE%20Plug
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Plug) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Plug) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Plug) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Plug) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Plug) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Plug)

# Hue Steckdose / Plug

## Überblick

Der Hue-Plug-Node verbindet eine Philips-Hue-Steckdose mit KNX-Gruppenadressen:

- Ein/Aus-Steuerung über den KNX-Bus
- Rückmeldung des Zustands direkt aus der Hue-Bridge
- Optionale Übertragung des Parameters `power_state`

## Konfiguration

|Feld|Beschreibung|
|--|--|
| KNX GW | Verwendetes KNX-Gateway |
| Hue Bridge | Konfigurierte Hue-Bridge |
| Name | Hue-Steckdose auswählen (Autocomplete) |
| Befehl | KNX-GA für Ein/Aus (Boolean-DPT) |
| Status | GA für die Rückmeldung des Hue-Ein/Aus-Zustands |
| Power state | Optionale GA für den Hue-Parameter `power_state` (on/standby) |
| Status beim Start lesen | Sendet beim Deploy den aktuellen Zustand |
| Node I/O Pins | Aktiviert Node-RED-Ein/Ausgänge für eigene Hue-Payloads bzw. Ereignisse |

## KNX-Hinweise

- Befehl und Status als DPT 1.xxx definieren.
- `power_state` auf eine boolesche GA mappen (true = on, false = standby) oder DPT 16.xxx für Klartext nutzen.
- Auf KNX-Leseanforderungen antwortet der Node mit dem letzten bekannten Hue-Wert.

## Flow-Integration

Mit aktivierten Pins:

- **Input:** Hue v2 Payloads senden (z. B. `{ on: { on: true } }`).
- **Output:** `{ payload, on, power_state, rawEvent }` für jedes Hue-Ereignis.

## Hue API

Die Kommunikation erfolgt über `/resource/plug/{id}`. Änderungen werden über den Event-Stream empfangen und für KNX beibehalten.
