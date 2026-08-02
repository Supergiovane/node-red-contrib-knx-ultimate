---
layout: wiki
title: "HUE Temperature sensor"
lang: it
permalink: /wiki/it-HUE%20Temperature%20sensor
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante arancione di migrazione converte localmente tutti i nodi HUE legacy; al termine apre una bozza email modificabile e la pagina per una donazione in una nuova finestra del browser. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK.

Questo nodo legge la temperatura (°C) da un sensore HUE e la mappa su KNX.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Sensore temperatura Hue | Sensore di temperatura HUE (autocompletamento) |
| Leggi lo stato all'avvio | All'avvio/riconnessione, leggi il valore corrente e invialo su KNX (predefinito: no) |

**Mapping**

| Proprietà | Descrizione |
|--|--|
| Temp | GA KNX per la temperatura in °C. DPT consigliato: <b>9.001</b> |

### Output

1. Uscita standard
   : `msg.payload` (number): temperatura corrente in °C

### Dettagli

`msg.payload` contiene il valore numerico della temperatura.
