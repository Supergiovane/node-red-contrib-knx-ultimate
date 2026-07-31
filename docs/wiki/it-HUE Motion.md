---
layout: wiki
title: "HUE Motion"
lang: it
permalink: /wiki/it-HUE%20Motion
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante arancione di migrazione in questo editor apre lo stesso convertitore dell’intero flow disponibile in HUE Controller.

Questo nodo riceve gli eventi da un sensore di movimento Hue e li inoltra a KNX e al flow Node-RED.

Nel campo GA digita nome o indirizzo di gruppo KNX: i suggerimenti appaiono durante la digitazione. Il pulsante di refresh accanto a "Sensore Hue” consente di ricaricare la lista dal Bridge Hue.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Gateway KNX che riceve le segnalazioni di movimento (necessario per visualizzare le opzioni KNX) |
|Hue Bridge |Hue Bridge da interrogare |
| Sensore movimento Hue | Sensore di movimento Hue (supporta autocompletamento e refresh) |

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
