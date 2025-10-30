---
layout: wiki
title: "HUE Device software update"
lang: it
permalink: /wiki/it-HUE%20Device%20software%20update
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Device%20software%20update) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Device%20software%20update) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Device%20software%20update) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Device%20software%20update) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update)

Questo nodo monitora se un dispositivo HUE ha un aggiornamento software disponibile e pubblica lo stato su KNX.

Inizia a digitare il nome o l'indirizzo di gruppo del dispositivo KNX nel campo GA, i dispositivi disponibili iniziano a mostrare mentre
stai digitando.

**Generale**

| Proprietà | Descrizione |
|-|-|
|KNX GW |Seleziona il gateway KNX da utilizzare |
|Bridge Hue |Seleziona il ponte Hue da utilizzare |
| HUE Device | Dispositivo HUE da monitorare (autocompletamento) |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Stato | GA KNX che riflette lo stato: _true_ se update disponibile/pronto/in installazione, altrimenti _false_. |
| Leggi stato all'avvio | Leggi all'avvio/riconnessione ed emetti su KNX (default "Sì”). |

### Output

1. Uscita standard
   : payload (boolean): flag aggiornamento.
   : status (string): **no\_update, update\_pending, ready\_to\_install, installing** .
