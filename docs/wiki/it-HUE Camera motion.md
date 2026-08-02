---
layout: wiki
title: "HUE Camera motion"
lang: it
permalink: /wiki/it-HUE%20Camera%20motion
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante arancione di migrazione converte localmente tutti i nodi HUE legacy; al termine apre una bozza email modificabile e la pagina per una donazione in una nuova finestra del browser. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK.

Il nodo Hue Camera Motion ascolta il servizio di motion delle camere Philips Hue e replica in KNX lo stato rilevato/non rilevato.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Motion camera HUE | Sensore motion della camera Hue (autocompletamento durante la digitazione) |
| Leggi lo stato all'avvio | All'avvio/riconnessione legge il valore corrente e lo invia a KNX (predefinito: no) |

**Associazione**

|Proprietà|Descrizione|
|--|--|
| Movimento | GA KNX per il movimento (booleano). DPT consigliato: <b>1.001</b> |

### Uscite

1. Uscita standard
   : `msg.payload` (boolean): `true` quando viene rilevato movimento, altrimenti `false`

### Dettagli

`msg.payload` contiene l'ultimo stato di movimento fornito dal servizio camera di Hue.
