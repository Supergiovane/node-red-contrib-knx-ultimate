---
layout: wiki
title: "HUE Device software update"
lang: it
permalink: /wiki/it-HUE%20Device%20software%20update
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante di migrazione arancione ad alto contrasto con testo bianco converte localmente tutti i nodi HUE legacy; al termine apre soltanto una bozza email modificabile. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK e propone un pulsante facoltativo per sostenere il progetto; la pagina per la donazione si apre solo premendo quel pulsante. Prima di iniziare, [guarda il video esplicativo su YouTube](https://youtu.be/f0Evf2QFI7c).

Questo nodo monitora se un dispositivo HUE ha un aggiornamento software disponibile e pubblica lo stato su KNX.

Inizia a digitare il nome o l'indirizzo di gruppo del dispositivo KNX nel campo GA, i dispositivi disponibili iniziano a mostrare mentre
stai digitando.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
| Dispositivo Hue | Dispositivo HUE da monitorare (autocompletamento) |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Stato | GA KNX che riflette lo stato: _true_ se update disponibile/pronto/in installazione, altrimenti _false_. |
| Leggi stato all'avvio | Leggi all'avvio/riconnessione ed emetti su KNX (default "Sì”). |

### Output

1. Uscita standard
   : payload (boolean): flag aggiornamento.
   : status (string): **no\_update, update\_pending, ready\_to\_install, installing** .
