---
layout: wiki
title: "DateTime-Configuration"
lang: it
permalink: /wiki/it-DateTime-Configuration
---
# Configurazione Data/Ora

Il nodo **KNX DateTime** scrive la data/ora corrente su uno o più indirizzi di gruppo KNX.

Supporta:
- **DPT 19.001** (Data/Ora) – consigliato
- **DPT 11.001** (Data) – opzionale
- **DPT 10.001** (Ora) – opzionale

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

## Output del nodo

Il nodo emette un messaggio per ogni invio:
- `msg.payload`: la `Date` inviata
- `msg.sent`: array di `{ ga, dpt, name }`
- `msg.reason`: `input`, `startup`, `periodic` o `button`

## Auto-compilazione (ETS)

Quando aggiungi un nodo nuovo, può selezionare automaticamente il primo Gateway KNX che ha un import ETS e compilare le GA coerenti.

