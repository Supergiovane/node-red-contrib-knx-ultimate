---
layout: wiki
title: "HUE Device software update"
lang: de
permalink: /wiki/de-HUE%20Device%20software%20update
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Device%20software%20update) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Device%20software%20update) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Device%20software%20update) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Device%20software%20update) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update)

Dieser Node überwacht, ob ein HUE‑Gerät ein Software‑Update hat, und spiegelt den Status nach KNX.

Geben Sie den Namen oder die Gruppenadresse Ihres KNX -Geräts im Feld GA ein.
Sie tippen.

**Allgemein**

| Eigenschaft | Beschreibung |
|-|-|
|KNX GW |Wählen Sie das zu verwendende KNX -Gateway |
|Hue Bridge |Wählen Sie die zu verwendende Farbtonbrücke aus |
| HUE Device | Zu überwachendes HUE‑Gerät (Autocomplete) |

**Zuordnung**

| Eigenschaft | Beschreibung |
|--|--|
| Status | KNX‑GA für Update‑Status: _true_, wenn verfügbar/bereit/in Installation, sonst _false_. |
| Status beim Start lesen | Beim Start/Wiederverbindung lesen und an KNX ausgeben (Standard "Ja"). |

### Ausgänge

1. Standardausgang
   : payload (boolean): Update‑Flag.
   : status (string): **no\_update, update\_pending, ready\_to\_install, installing** .
