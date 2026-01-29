---
layout: wiki
title: "HUE Light sensor"
lang: it
permalink: /wiki/it-HUE%20Light%20sensor
---
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
