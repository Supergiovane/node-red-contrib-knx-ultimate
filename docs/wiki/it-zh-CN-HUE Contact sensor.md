---
layout: wiki
title: "zh-CN-HUE Contact sensor"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Contact%20sensor
---
---
<p> Questo nodo mappa l'evento del sensore di contatto Hue all'indirizzo del gruppo KNX.</p>
Inizia ad immettere il campo GA, il nome o l'indirizzo di gruppo del dispositivo KNX e il dispositivo disponibile inizia a visualizzare quando si entra.
**Generale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | Seleziona il portale KNX da utilizzare |
| Bridge Hua | Seleziona il bridge tone da usare |
| Sensore Hue | Sensore di contatto Hue da utilizzare (completamento automatico) |
| Proprietà | Descrizione |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contatto | Quando il sensore è acceso/spento: inviare valore knx _true_ (attiva/on), altrimenti _false_ |
### Produzione
1. Output standard
: Payload (boleano): output standard del comando.
### dettaglio
`msg.payload` è un evento HUE (booleano/oggetto) che può essere utilizzato per la logica personalizzata.
