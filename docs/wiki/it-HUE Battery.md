---
layout: wiki
title: "HUE Battery"
lang: it
permalink: /wiki/it-HUE%20Battery
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante arancione di migrazione in questo editor apre lo stesso convertitore dell’intero flow disponibile in HUE Controller.

Questo nodo espone su KNX il livello batteria di un dispositivo Hue ed emette un evento ogni volta che il valore cambia.

Nel campo GA digita nome o indirizzo di gruppo KNX: i risultati compaiono durante la digitazione. Usa il pulsante di aggiornamento accanto a "Sensore Hue” per ricaricare l'elenco dal Bridge Hue dopo aver aggiunto nuovi dispositivi.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX su cui pubblicare il livello batteria (necessario per visualizzare le opzioni KNX). |
| Hue Bridge | Hue Bridge da utilizzare. |
| Sensore batteria Hue | Dispositivo/sensore Hue che fornisce il livello batteria (supporta autocompletamento e refresh). |

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
