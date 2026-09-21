---
layout: wiki
title: "HUE Light sensor"
lang: it
permalink: /wiki/it-HUE%20Light%20sensor
---
## Aggiornamento a KNX Ultimate 8

La versione 7 aggiunge un piccolo pulsante **Aggiorna alla v8** nella parte alta di ogni editor. Il pulsante esegue il backup dei flow, installa i package HUE/Matter necessari, converte i nodi compatibili, esegue un Deploy completo, verifica i flow salvati e installa la versione 8. Quando richiesto, riavvia il servizio Node-RED: ricaricare soltanto il browser non basta. I nodi KNX AI legacy fermano la procedura automatica.

[Leggi la guida completa all’aggiornamento](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Upgrade-to-v8)

> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante di migrazione arancione ad alto contrasto con testo bianco converte localmente tutti i nodi HUE legacy; al termine apre soltanto una bozza email modificabile. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK e propone un pulsante facoltativo per sostenere il progetto; la pagina per la donazione si apre solo premendo quel pulsante. Prima di iniziare, [guarda il video esplicativo su YouTube](https://youtu.be/f0Evf2QFI7c).

Questo nodo legge gli eventi (lux) da un sensore di luce HUE e li espone su KNX.

Emette l'illuminamento ambientale (lux) a ogni variazione. Nel campo GA digita nome o indirizzo di gruppo per collegare la GA KNX (autocompletamento).

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
| Sensore luce Hue | Sensore di luce HUE da usare (autocompletamento) |
|Leggi lo stato all'avvio |Leggi lo stato all'avvio ed emetti l'evento al bus KNX all'avvio/riconnessione.(Predefinito "no") |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Lux | GA KNX che riceve il valore in lux |

### Output

1. Uscita standard
   : payload (number): valore corrente in lux

### Dettagli

`msg.payload` contiene il valore numerico in lux.
