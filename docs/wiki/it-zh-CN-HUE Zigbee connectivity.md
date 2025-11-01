---
layout: wiki
title: "zh-CN-HUE Zigbee connectivity"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Zigbee%20connectivity/
---
---
<p> Questo nodo legge lo stato di connessione Zigbee dal dispositivo HUE e lo pubblica su KNX.</p>
Immettere il nome del dispositivo KNX o l'indirizzo di gruppo nel campo GA e si associerà automaticamente quando input.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | KNX Gateway per lo stato di rilascio |
| Bridge Hue | Bridge Hue da usare |
| Sensore Hue | Sensore/dispositivo HUE che fornisce informazioni di connessione Zigbee (completamento automatico) |
**mappatura**
| Proprietà | Descrizione |
|-|-|
| Stato | Mappare l'indirizzo del gruppo KNX della connettività Zigbee._true_ quando connesso, altrimenti _false_. |
|Leggi lo stato all'avvio | Leggi e pubblica a KNX durante l'avvio/riconnessione.Predefinito: "Sì".|
### Produzione
1. Output standard
: payload (booleano): stato di connessione.
### Dettagli
`msg.payload` è vero/falso.\
`msg.status` è testo: **connesso, disconnesso, connettività \ _issue, unidirezionale \ _incoming** .
