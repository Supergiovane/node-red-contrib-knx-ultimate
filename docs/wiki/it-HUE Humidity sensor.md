---
layout: wiki
title: "HUE Humidity sensor"
lang: it
permalink: /wiki/it-HUE%20Humidity%20sensor
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante arancione di migrazione converte localmente tutti i nodi HUE legacy; al termine apre una bozza email modificabile e la pagina per una donazione in una nuova finestra del browser. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK.

Questo nodo legge l'umidità relativa (%) da un sensore HUE e la invia verso KNX.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Sensore HUE | Sensore di umidità HUE (autocompletamento durante la digitazione) |
| Leggi lo stato all'avvio | All'avvio/riconnessione legge il valore corrente e lo invia a KNX (predefinito: no) |

**Associazione**

|Proprietà|Descrizione|
|--|--|
| Umidità | GA KNX per l'umidità relativa %. DPT consigliato: <b>9.007</b> |

### Uscite

1. Uscita standard
   : `msg.payload` (numero): valore corrente di umidità relativa in %

### Dettagli

`msg.payload` contiene il valore numerico dell'umidità (percentuale).
