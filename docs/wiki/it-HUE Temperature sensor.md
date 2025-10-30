---
layout: wiki
title: "HUE Temperature sensor"
lang: it
permalink: /wiki/it-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)

Questo nodo legge la temperatura (°C) da un sensore HUE e la mappa su KNX.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

| Proprietà | Descrizione |
|--|--|
| KNX GW | Seleziona il gateway KNX da utilizzare |
| Bridge HUE | Seleziona la HUE Bridge da utilizzare |
| Sensore HUE | Sensore di temperatura HUE (autocompletamento) |
| Leggi lo stato all'avvio | All'avvio/riconnessione, leggi il valore corrente e invialo su KNX (predefinito: no) |

**Mapping**

| Proprietà | Descrizione |
|--|--|
| Temp | GA KNX per la temperatura in °C. DPT consigliato: <b>9.001</b> |

### Output

1. Uscita standard
   : `msg.payload` (number): temperatura corrente in °C

### Dettagli

`msg.payload` contiene il valore numerico della temperatura.
