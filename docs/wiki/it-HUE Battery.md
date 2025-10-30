---
layout: wiki
title: "HUE Battery"
lang: it
permalink: /wiki/it-HUE%20Battery
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Battery) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Battery) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Battery) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Battery) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery)

Questo nodo espone su KNX il livello batteria di un dispositivo Hue ed emette un evento ogni volta che il valore cambia.

Nel campo GA digita nome o indirizzo di gruppo KNX: i risultati compaiono durante la digitazione. Usa il pulsante di aggiornamento accanto a "Sensore Hue” per ricaricare l'elenco dal Bridge Hue dopo aver aggiunto nuovi dispositivi.

**Generale**

| Proprietà | Descrizione |
|--|--|
| KNX GW | Gateway KNX su cui pubblicare il livello batteria (necessario per visualizzare le opzioni KNX). |
| Bridge Hue | Bridge Hue da utilizzare. |
| Sensore Hue | Dispositivo/sensore Hue che fornisce il livello batteria (supporta autocompletamento e refresh). |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Livello | GA KNX per la percentuale batteria (0-100%). DPT consigliato: <b>5.001</b>. |

**Comportamento**

| Proprietà | Descrizione |
|--|--|
| Leggi stato all'avvio | All'avvio/riconnessione legge il valore corrente e lo invia su KNX. Default: "sì”. |
| Pin di uscita del nodo | Mostra o nasconde l'uscita Node-RED. Se non selezioni alcun gateway KNX, il pin resta attivo così gli eventi Hue raggiungono comunque il flow. |

> ℹ️ Le sezioni KNX vengono visualizzate solo dopo aver scelto un gateway KNX, evitando modifiche accidentali quando il nodo è usato solo verso Node-RED.
