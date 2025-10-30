---
layout: wiki
title: "zh-CN-HUE Temperature sensor"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)
---
<p> Questo nodo legge la temperatura (° C) del sensore di temperatura della tonalità e la mappa a KNX.</p>
Immettere nel campo GA (nome o indirizzo di gruppo) per associare KNX GA;I suggerimenti del dispositivo vengono visualizzati quando inseriti.
**Generale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | Seleziona il gateway KNX da utilizzare |
| Bridge Hue | Seleziona il ponte Hue da usare |
| Sensore Hue | Sensore di temperatura Hue (completato automaticamente quando input) |
| Leggi lo stato all'avvio | Leggi il valore corrente durante l'avvio/riconnessione e invia a KNX (impostazione predefinita: no) |
**mappatura**
| Proprietà | Descrizione |
|-|-|
|Temperatura | Temperatura (° C) KNX GA. DPT consigliato: <b> 9.001 </b> |
### Produzione
1. Output standard
: `msg.payload` (numero): temperatura di corrente (° C)
### Dettagli
`msg.payload` contiene temperatura numerica.
