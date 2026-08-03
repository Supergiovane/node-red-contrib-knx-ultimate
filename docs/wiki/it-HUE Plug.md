---
layout: wiki
title: "HUE Plug"
lang: it
permalink: /wiki/it-HUE%20Plug
---
> **Deprecato:** questo nodo HUE dedicato resta disponibile per i flow esistenti. Usa **HUE Controller** per i nuovi progetti. È contrassegnato con `(deprecated)` nella palette e sul canvas, usa un colore più chiaro di HUE Controller e il suo editor mostra in alto un avviso di migrazione. Il pulsante di migrazione arancione ad alto contrasto con testo bianco converte localmente tutti i nodi HUE legacy; al termine apre soltanto una bozza email modificabile. L'email non viene mai spedita automaticamente. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi OK e propone un pulsante facoltativo per sostenere il progetto; la pagina per la donazione si apre solo premendo quel pulsante. Prima di iniziare, [guarda il video esplicativo su YouTube](https://youtu.be/f0Evf2QFI7c).

# Presa / Plug Hue

## Panoramica

Il nodo Hue Plug collega una presa intelligente Philips Hue alle indirizzazioni KNX:

- comandi on/off dal BUS
- feedback dello stato dalla piattaforma Hue
- gestione opzionale del parametro `power_state`

## Configurazione

|Campo|Descrizione|
|--|--|
| Gateway KNX | Gateway KNX utilizzato |
| Hue Bridge | Hue Bridge configurata |
| Nome | Seleziona la presa Hue (autocomplete) |
| Comando | GA KNX per l'invio dell'on/off (DPT booleano) |
| Stato | GA optional per ricevere lo stato on/off dal bridge |
| Power state | GA optional che replica il campo `power_state` (on/standby) |
| Leggi stato all'avvio | Se abilitato, all'avvio il nodo invia lo stato corrente |
| Pin di I/O | Abilita i pin Node-RED per inviare payload Hue custom o ricevere gli eventi sul flow |

## Suggerimenti KNX

- Usa un DPT 1.xxx per comando e stato.
- Il `power_state` può essere mappato a un GA booleano (true = on, false = standby) oppure a un DPT testuale.
- In risposta a una lettura KNX (`GroupValue_Read`) il nodo restituisce l'ultimo valore memorizzato.

## Integrazione con i flow

Con i pin abilitati:

- **Input** : invia payload Hue v2 (es. `{ on: { on: true } }`).
- **Output** : ricevi `{ payload, on, power_state, rawEvent }` a ogni evento Hue.

## API Hue

Le richieste utilizzano l'endpoint `/resource/plug/{id}`. Le notifiche arrivano dallo stream eventi e sono utilizzate per aggiornare lo stato KNX.
