---
layout: wiki
title: "HUE Motion"
lang: it
permalink: /wiki/it-HUE%20Motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion)

Questo nodo riceve gli eventi da un sensore di movimento Hue e li inoltra a KNX e al flow Node-RED.

Nel campo GA digita nome o indirizzo di gruppo KNX: i suggerimenti appaiono durante la digitazione. Il pulsante di refresh accanto a "Sensore Hue” consente di ricaricare la lista dal Bridge Hue.

**Generale**

| Proprietà | Descrizione |
|-|-|
|KNX GW |Gateway KNX che riceve le segnalazioni di movimento (necessario per visualizzare le opzioni KNX) |
|Bridge Hue |Bridge Hue da interrogare |
| HUE Sensor | Sensore di movimento Hue (supporta autocompletamento e refresh) |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Movimento | GA KNX che riceve `true` quando viene rilevato movimento e `false` quando termina (DPT consigliato: <b>1.001</b>) |

**Comportamento**

| Proprietà | Descrizione |
|--|--|
| Pin di uscita del nodo | Mostra o nasconde l'uscita Node-RED; senza gateway KNX il pin resta attivo così gli eventi Hue raggiungono comunque il flow |

> ℹ️ Le sezioni KNX compaiono solo dopo aver scelto un gateway KNX, così puoi usare il nodo anche come semplice listener Hue → Node-RED.

### Output

1. Uscita standard — `msg.payload` (boolean)
   : `true` quando viene rilevato movimento, `false` quando termina.
