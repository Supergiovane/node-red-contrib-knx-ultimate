---
layout: wiki
title: "HUE Contact sensor"
lang: it
permalink: /wiki/it-HUE%20Contact%20sensor
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante arancione di migrazione converte localmente tutti i nodi HUE legacy; al termine apre una bozza email modificabile e la pagina per una donazione in una nuova finestra del browser. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK.

Questo nodo inoltra gli eventi di un sensore di contatto HUE mappandoli su indirizzi di gruppo KNX.

Inizia a digitare nel campo GA, il nome o l'indirizzo di gruppo del dispositivo KNX, i dispositivi disponibili iniziano a mostrare mentre si digita.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
| Sensore contatto Hue | Sensore di contatto HUE da usare (autocompletamento) |

|Proprietà |Descrizione |
|-------- |-------------------------------------------------------------------------------------------------------------------------------------- |
| Contatto | All'apertura/chiusura, invia su KNX: _true_ se attivo/aperto, altrimenti _false_. |

### Output

1. Output standard
   : payload (booleano): l'output standard del comando.

### Dettagli

`msg.payload` contiene l'evento HUE (boolean/oggetto) per eventuale logica personalizzata.
