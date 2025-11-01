---
layout: wiki
title: "zh-CN-HUE Humidity sensor"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Humidity%20sensor/
---
---
<p> Questo nodo legge umidità relativa (%) dal sensore di umidità della tonalità e mappe a KNX.</p>
Inizia ad inserire (nome o indirizzo di gruppo) nel campo GA per associare KNX GA;Il dispositivo di corrispondenza viene visualizzato durante l'input.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX Gateway | Seleziona il gateway KNX da utilizzare |
| Bridge Hue | Seleziona il ponte Hue da usare |
| Sensore Hue | Sensore di umidità HUE (completato automaticamente quando input) |
| Leggi lo stato all'avvio | Leggi il valore corrente all'avvio/riconnessione e invia a KNX (impostazione predefinita: no) |
**mappatura**
| Proprietà | Descrizione |
|-|-|
|Umidità | KNX GA con umidità relativa %. DPT consigliato: <b> 9.007 </b> |
### Produzione
1. Output standard
: `msg.payload` (numero): umidità relativa corrente (%)
### Dettagli
`msg.payload` Il valore (percentuale) dell'umidità.
