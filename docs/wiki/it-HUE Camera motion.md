---
layout: wiki
title: "HUE Camera motion"
lang: it
permalink: /wiki/it-HUE%20Camera%20motion/
---
Il nodo Hue Camera Motion ascolta il servizio di motion delle camere Philips Hue e replica in KNX lo stato rilevato/non rilevato.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Bridge HUE | Seleziona il bridge HUE da utilizzare |
| Sensore HUE | Sensore motion della camera Hue (autocompletamento durante la digitazione) |
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
