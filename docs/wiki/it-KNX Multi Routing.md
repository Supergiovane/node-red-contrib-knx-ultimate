---
layout: wiki
title: "KNX Multi Routing"
lang: it
permalink: /wiki/it-KNX%20Multi%20Routing
---
Questo nodo serve per **collegare tra loro più gateway KNX Ultimate** (più `knxUltimate-config`) tramite i collegamenti di Node-RED.

In output emette un oggetto con le informazioni **RAW** del telegramma (APDU + cEMI hex + indirizzi) per ogni telegramma ricevuto dal BUS KNX del gateway selezionato.
In input può ricevere gli stessi oggetti RAW e inoltrarli sul BUS KNX del gateway selezionato.

## Formato messaggio in output
`msg.payload` contiene:
- `knx.event`: `GroupValue_Write` / `GroupValue_Response` / `GroupValue_Read`
- `knx.source`: indirizzo fisico (es. `1.1.10`)
- `knx.destination`: group address (es. `0/0/1`)
- `knx.apdu.data`: payload APDU grezzo come `Buffer` (solo per Write/Response)
- `knx.apdu.bitlength`: bitlength del payload (`<=6` significa codificato nei bit bassi dell’APCI)
- `knx.cemi.hex`: cEMI completo in esadecimale (stile ETS)
- `knx.echoed`: `true` se telegramma echoed dal gateway
- `knxMultiRouting.gateway`: info gateway (`id`, `name`, `physAddr`)

## Nota
Quando inoltri su un altro gateway, l’**indirizzo fisico sorgente cambia** (diventa l’indirizzo fisico del gateway che invia). Usa `knx.source` e/o `knxMultiRouting.gateway` per filtrare i loop.
L’opzione **Scarta messaggi già marcati per questo gateway** aiuta a prevenire loop semplici quando colleghi più router tra loro.
