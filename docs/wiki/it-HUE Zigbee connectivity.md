---
layout: wiki
title: "HUE Zigbee connectivity"
lang: it
permalink: /wiki/it-HUE%20Zigbee%20connectivity
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante di migrazione arancione ad alto contrasto con testo bianco converte localmente tutti i nodi HUE legacy; al termine apre soltanto una bozza email modificabile. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK e propone un pulsante facoltativo per sostenere il progetto; la pagina per la donazione si apre solo premendo quel pulsante. Prima di iniziare, [guarda il video esplicativo su YouTube](https://youtu.be/f0Evf2QFI7c).

Questo nodo legge la connettività Zigbee da un dispositivo HUE ed espone lo stato su KNX.

Inizia a digitare il nome o l'indirizzo di gruppo nel campo GA: l'autocompletamento mostra i dispositivi disponibili.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX su cui pubblicare lo stato. |
| Hue Bridge | Hue Bridge da interrogare. |
| Connettività Zigbee Hue | Sensore/dispositivo HUE che fornisce la connettività Zigbee (autocompletamento durante la digitazione). |

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
