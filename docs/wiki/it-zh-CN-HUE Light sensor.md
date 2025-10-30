---
layout: wiki
title: "zh-CN-HUE Light sensor"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Light%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor)
---
<p> Questo nodo legge un evento Lux dal sensore di luce Hue e lo pubblica su KNX.</p>
Il valore Lux viene emesso ogni volta che la luce ambientale cambia.Immettere il nome del dispositivo KNX o l'indirizzo di gruppo (complesso automatico) nel campo GA per l'associazione.
**Generale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | Seleziona il portale KNX da utilizzare |
| Bridge Hua | Seleziona il bridge tone da usare |
| Sensore Hue | Sensore di luce Hue da utilizzare (completamento automatico) |
| Leggi lo stato all'avvio | Leggi lo stato all'avvio e trasmetti gli eventi al bus KNX all'avvio/riconnessione.(Predefinito "no") |
**mappatura**
| Proprietà | Descrizione |
|-|-|
| Lux | Indirizzo di gruppo KNX che riceve valori Lux |
### Produzione
1. Output standard
: payload (numero): valore Lux corrente
### dettaglio
`msg.payload` è un lux numerico.
