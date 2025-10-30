---
layout: wiki
title: "zh-CN-HUE Plug"
lang: de
permalink: /wiki/de-zh-CN-HUE%20Plug
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Plug) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Plug) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Plug) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Plug) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Plug) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Plug)
---

# Hue Socket / Stecker

## Übersicht

Der Hue -Plug -Knoten bildet Philips Hue Smart Sockets an KNX -Gruppenadressen, um sie zu implementieren:

- Ein/Aus -Kontrolle im Bus;
- Status -Feedback von der Hue -Plattform;
- Optionale Überwachung von `power_state` (on/Standby).

## Konfiguration

| Felder |Beschreibung |
|-|-|
| KNX GW | KNX Gateways verwendet |
| Hue Bridge | Hue Bridge verwendet |
| Name | Hue Socket zur Steuerung (automatische Eingabeaufforderung) |
| Kontrolle | Ein/Aus -KNX -Gruppenadresse (Bolean DPT) |
| Status | Hue -Bericht ein-/Aus -Status -Empfangsadresse |
| Leistungsstatus | Optionale Gruppenadresse zum Zuordnen von Hue `power_state` |
| Status bei Startup lesen | Senden Sie den aktuellen Status während der Bereitstellung sofort |
| Pin | Aktivieren Sie den Node-Red-Eingangs-/Ausgangspin für die erweiterte Steuerung oder Ereignisweiterleitung |

## KNX -Empfehlungen

- Steuerung und Status werden empfohlen, um DPT 1.xxx zu verwenden.
- `power_state` kann einem booleschen Wert (true = on, false = Standby) zugeordnet werden oder verwenden die Textklasse DPT, um die ursprüngliche Zeichenfolge anzuzeigen.
- Wenn ein KNX -Lesen (`GroupValue_Read`) empfangen wird, kehrt der Knoten zum zwischengespeicherten Farbton zurück.

## Flow -Integration

Wenn Stifte aktiviert sind:

- **Eingabe** : HUE V2 Payload senden (wie `{on: {on: true}}`).
.

## Hue -API

Der Knoten ruft `/ressourcen/plug/{id}` auf.Hue -Ereignisströme werden verwendet, um Zustandsänderungen zu erfassen und mit KNX zu synchronisieren.
