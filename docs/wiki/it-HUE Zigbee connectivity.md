---
layout: wiki
title: "HUE Zigbee connectivity"
lang: it
permalink: /wiki/it-HUE%20Zigbee%20connectivity
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Zigbee%20connectivity) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Zigbee%20connectivity) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Zigbee%20connectivity) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Zigbee%20connectivity) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)

Questo nodo legge la connettività Zigbee da un dispositivo HUE ed espone lo stato su KNX.

Inizia a digitare il nome o l'indirizzo di gruppo nel campo GA: l'autocompletamento mostra i dispositivi disponibili.

**Generale**

| Proprietà | Descrizione |
|--|--|
| KNX GW | Gateway KNX su cui pubblicare lo stato. |
| HUE Bridge | HUE Bridge da interrogare. |
| HUE Sensor | Sensore/dispositivo HUE che fornisce la connettività Zigbee (autocompletamento durante la digitazione). |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Stato | Indirizzo di gruppo KNX che riflette la connettività Zigbee. Diventa _true_ se connesso, altrimenti _false_. |
| Leggi stato all'avvio | Legge lo stato all'avvio/riconnessione ed emette su KNX. Default: "Sì”. |

### Output

1. Uscita standard
   : payload (boolean): stato di connettività.

### Dettagli

`msg.payload` contiene true/false.\
`msg.status` contiene il testo: **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .
