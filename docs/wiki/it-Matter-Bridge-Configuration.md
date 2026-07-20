---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: it
permalink: /wiki/it-Matter-Bridge-Configuration
---
# Bridge Matter (BETA)

> Questo nodo è in **BETA**: funziona, ma alcuni dettagli potrebbero cambiare tra una release e l'altra.

## Panoramica

Questo nodo di configurazione è il **bridge Matter vero e proprio**: esegue il server Matter che Alexa, Google Home, Apple Home (o qualunque controller Matter) associano **una sola volta**. Ogni nodo **Matter Bridge device** nei tuoi flow punta qui e compare nelle app come un dispositivo del bridge.

Gli editor dei dispositivi Matter Bridge dispongono **Mappature** e **Opzioni avanzate** come tab verticali a sinistra, coerentemente con Matter Controller.

## Configurazione

|Campo|Descrizione|
|--|--|
| Nome | Il nome di questo nodo di configurazione in Node-RED |
| Nome del bridge Matter | Come viene chiamato il bridge stesso nelle app Matter. **Lascia vuoto per riusare il Nome di questo nodo.** |
| Porta | Porta UDP del server Matter (default 5540). Ogni bridge richiede la propria porta, quindi puoi eseguire **più bridge indipendenti** |

## Abbinamento

1. Fai il **deploy**, attendi qualche secondo, poi riapri questo nodo.
2. Il pannello di abbinamento mostra il **QR code** e il **codice manuale**: scansiona o digita in Alexa / Google Home / Apple Home ("aggiungi dispositivo Matter").
3. Più controller possono essere abbinati allo stesso bridge (multi-fabric Matter).

Per aggiungere un altro controller quando il QR code è nascosto, apri la modalità di abbinamento da un controller già associato, poi aggiungi un dispositivo Matter nel nuovo controller. Usa **Reset abbinamento** solo per rimuovere tutti i controller esistenti e ripartire.

Il pulsante **Reset abbinamento** rimuove tutti i controller abbinati e riavvia l'advertising di abbinamento.

## Identità e archiviazione

L'identità del bridge è legata a questo nodo di configurazione ed è salvata in `knxultimatestorage/matter` nella directory utente di Node-RED: i re-deploy (anche cambiando porta o nome) **NON** richiedono un nuovo abbinamento. Solo eliminando questo nodo di configurazione e creandone uno nuovo cambia l'identità — in quel caso rimuovi il vecchio bridge dall'app Matter e riabbina.

Usa **Esporta** per scaricare un backup completo di questa istanza bridge, incluse fabric, credenziali private, sessioni e dati di abbinamento. **Proteggi il file come una password.** L'importazione sostituisce lo storage dell'istanza e riavvia brevemente il bridge. Un backup bridge non può essere importato in un controller.

## Note

- L'host Node-RED deve avere **IPv6 link-local** attivo (requisito standard Matter) ed essere raggiungibile dai controller sulla rete locale.
- I nodi device aggiunti/rinominati/rimossi vengono recepiti dai controller abbinati in pochi secondi, senza riabbinare.
- **Nomi:** Alexa e Google Home rispettano i nomi che imposti qui (nome del bridge e nomi dei nodi device). **Apple Home li ignora e ti chiede di nominare manualmente ogni accessorio durante l'abbinamento** — è un limite di Apple, non del bridge.
