---
layout: wiki
title: "HUE Contact sensor"
lang: it
permalink: /wiki/it-HUE%20Contact%20sensor
---
Questo nodo inoltra gli eventi di un sensore di contatto HUE mappandoli su indirizzi di gruppo KNX.

Inizia a digitare nel campo GA, il nome o l'indirizzo di gruppo del dispositivo KNX, i dispositivi disponibili iniziano a mostrare mentre si digita.

**Generale**

| Proprietà | Descrizione |
|-|-|
|KNX GW |Seleziona il gateway KNX da utilizzare |
|Bridge Hue |Seleziona il ponte Hue da utilizzare |
| HUE Sensor | Sensore di contatto HUE da usare (autocompletamento) |

|Proprietà |Descrizione |
|-------- |-------------------------------------------------------------------------------------------------------------------------------------- |
| Contatto | All'apertura/chiusura, invia su KNX: _true_ se attivo/aperto, altrimenti _false_. |

### Output

1. Output standard
   : payload (booleano): l'output standard del comando.

### Dettagli

`msg.payload` contiene l'evento HUE (boolean/oggetto) per eventuale logica personalizzata.
