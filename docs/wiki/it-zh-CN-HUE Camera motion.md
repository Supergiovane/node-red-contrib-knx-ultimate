---
layout: wiki
title: "zh-CN-HUE Camera motion"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Camera%20motion/
---
---
<p> Il nodo di movimento della telecamera Hue ascolta per eventi di movimento della fotocamera Hue Philips e mappe rilevate/non rilevate su KNX.</p>
Inizia ad inserire nella casella di input GA (nome o indirizzo di gruppo) per associare KNX GA;Il dispositivo di corrispondenza verrà visualizzato quando input.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX Gateway | Seleziona il gateway KNX da utilizzare |
| Bridge Hue | Seleziona il ponte Hue da usare |
| Sensore Hue | Sensore di movimento della fotocamera Hue (completato automaticamente quando input) |
| Leggi lo stato all'avvio | Leggi il valore corrente all'avvio/riconnessione e invia a KNX (impostazione predefinita: no) |
**mappatura**
| Proprietà | Descrizione |
|-|-|
| Movimento |Indirizzo di gruppo KNX (booleano) per il movimento della telecamera. DPT consigliato: <b> 1.001 </b> |
### Produzione
1. Output standard
: `msg.payload` (booleano):` vero` quando viene rilevato il movimento, altrimenti `false`
### Dettagli
`msg.payload` Salva l'ultimo stato di movimento riportato del servizio di telecamera Hue.</script>
