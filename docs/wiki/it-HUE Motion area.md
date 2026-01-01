---
layout: wiki
title: "HUE Motion area"
lang: it
permalink: /wiki/it-HUE%20Motion%20area
---
Il nodo Hue Motion Area riceve gli eventi di movimento aggregati di un'area MotionAware (Hue Bridge Pro) e li inoltra a KNX o al flow Node-RED.

Nel campo GA digita nome o indirizzo di gruppo KNX per collegare l'indirizzo: i suggerimenti appaiono durante la digitazione.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX che riceve lo stato di movimento dell'area. |
| Hue Bridge | Bridge Hue Pro da utilizzare. |
| Area movimento Hue (MotionAware) | Area MotionAware (convenience o security) da monitorare (autocomplete durante la digitazione). |
| Leggi stato all'avvio | All'avvio o alla riconnessione legge il valore corrente e lo invia a KNX (predefinito: sì). |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Movimento | GA KNX per lo stato di movimento dell'area (boolean). DPT consigliato: <b>1.001</b>. |

**Comportamento**

| Proprietà | Descrizione |
|--|--|
| Pin di uscita del nodo | Mostra o nasconde l'uscita Node-RED; senza gateway KNX il pin resta attivo così gli eventi MotionAware raggiungono comunque il flow. |

### Output

1. Uscita standard  
   : `msg.payload` (boolean): `true` quando l'area risulta in movimento, `false` quando è libera.

### Dettagli

`msg.payload` contiene lo stato di movimento aggregato fornito dal servizio MotionAware per l'area selezionata.
