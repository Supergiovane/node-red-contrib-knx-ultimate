---
layout: wiki
title: "DateTime-Configuration"
lang: it
permalink: /wiki/it-DateTime-Configuration
---
## Aggiornamento a KNX Ultimate 8

La versione 7 aggiunge un piccolo pulsante **Aggiorna alla v8** nella parte alta di ogni editor. Il pulsante esegue il backup dei flow, installa i package HUE/Matter necessari, converte i nodi compatibili, esegue un Deploy completo, verifica i flow salvati e installa la versione 8. Quando richiesto, riavvia il servizio Node-RED: ricaricare soltanto il browser non basta. I nodi KNX AI legacy fermano la procedura automatica.

[Leggi la guida completa all’aggiornamento](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Questo nodo dedicato resta compatibile con i flow esistenti. Per i nuovi flow usa [KNX Utility](/node-red-contrib-knx-ultimate/wiki/it-KNX-Utility) e seleziona **DateTime**. Il suo editor permette di convertire tutti i nodi utility legacy compatibili in tutti i flow e subflow, con un unico Annulla e Deploy manuale.

# Configurazione Data/Ora

Il nodo **KNX DateTime** scrive la data/ora corrente su uno o più indirizzi di gruppo KNX.

Supporta:
- **DPT 19.001** (Data/Ora) – consigliato
- **DPT 11.001** (Data) – opzionale
- **DPT 10.001** (Ora) – opzionale

Nota su **DPT 19.001**:
- il nodo parte da una `Date` JavaScript e la converte in DateTime KNX tramite l'engine KNX.

## Indirizzi di gruppo

|Scopo|Proprietà|DPT|
|--|--|--|
| Data/Ora | `GA Data/Ora` (`gaDateTime`) | `19.001` |
| Data | `GA Data` (`gaDate`) | `11.001` |
| Ora | `GA Ora` (`gaTime`) | `10.001` |

Puoi configurare una sola GA (caso tipico) o più GA (il nodo scrive su tutte quelle configurate).

## Quando invia

- **Al deploy/avvio** (opzionale) con ritardo configurabile.
- **Invio periodico** (opzionale) con intervallo in secondi/minuti.
- **Su input** (sempre): ogni messaggio in ingresso scatena un invio.
- **Pulsante in editor**: invio immediato.

## Payload in ingresso

Se `msg.payload` è assente/vuoto, il nodo invia la data/ora di sistema corrente.

Valori supportati:
- oggetto `Date` (`new Date()`)
- numero timestamp (millisecondi dall'epoch)
- stringa accettata da `new Date("...")`
- `"now"`
- oggetto con uno dei campi: `msg.payload.dateTime`, `msg.payload.timestamp`, `msg.payload.epoch`

## Gateway non connesso

Se il gateway KNX non è connesso, l'invio viene accodato e parte automaticamente alla riconnessione.
Il nodo mantiene **una sola richiesta pendente** (sempre l'ultima ricevuta).

## Output del nodo

Il nodo emette un messaggio per ogni invio:
- `msg.payload`: la `Date` inviata
- `msg.sent`: array di `{ ga, dpt, name }`
- `msg.reason`: `input`, `startup`, `periodic` o `button`
- `msg.knxUltimateDateTime.date`: data/ora in formato ISO (`toISOString()`)

## Auto-compilazione (ETS)

Quando aggiungi un nodo nuovo, può selezionare automaticamente il primo Gateway KNX che ha un import ETS e compilare le GA coerenti.
