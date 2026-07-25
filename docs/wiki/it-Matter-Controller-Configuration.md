---
layout: wiki
title: "Matter-Controller-Configuration"
lang: it
permalink: /wiki/it-Matter-Controller-Configuration
---
# Controller Matter

## Panoramica

Questo nodo di configurazione è un **controller Matter** completo: crea una propria *fabric* Matter e vi associa (commissiona) i tuoi dispositivi Matter. I dispositivi associati diventano poi disponibili ai nodi **Matter Device**, che li mappano sugli indirizzi di gruppo KNX.

Il controller comunica con i dispositivi tramite la **rete IP** (WiFi, Ethernet, oppure Thread attraverso un border router). Il commissioning via Bluetooth non è supportato: il dispositivo deve essere già raggiungibile in rete.

## Associare un dispositivo

1. Fai prima il **deploy** di questo nodo di configurazione (il controller deve essere in esecuzione).
2. Riapri il nodo e inserisci il **codice di abbinamento**: il codice manuale a 11 cifre (es. `3497-011-2332`) oppure il contenuto del QR code (`MT:....`).
3. Clicca **ASSOCIA**. Il commissioning può richiedere fino a un minuto.

Se il dispositivo è nuovo di fabbrica e supporta solo il commissioning Bluetooth, associalo prima con l'app del produttore o con un altro controller Matter (Alexa, Google Home, Apple Home), poi usa la funzione **"condividi / abbina con altro hub"** di quel controller per generare un nuovo codice di abbinamento per KNX-Ultimate. In questo modo il dispositivo entra in più fabric contemporaneamente.

Preferisci il payload QR (`MT:...`): contiene il discriminatore completo. Il codice manuale contiene solo quello corto e può selezionare il dispositivo sbagliato quando più modelli identici sono in modalità abbinamento. Associa un dispositivo alla volta.

## Modalità Universale

Nel nodo **Control Matter from KNX**, scegli **Modalità Universale** per osservare tutti i dispositivi con un unico nodo flow. Ha sempre un input e un output e non usa le mappature del singolo endpoint. Il gateway KNX è opzionale e serve solo alle GA allarme/testo del Monitor batterie.

Il **Monitor batterie universale** scansiona tutti i nodi e gli endpoint commissionati cercando Power Source, emette uno snapshot iniziale e conserva lo stato normalizzato completo. Può emettere solo batterie sotto soglia oppure ogni aggiornamento. L'output include percentuale, valore raw, livello di carica, sostituzione, sostituibilità, tensione e identità del device; i metadati Matter raw sono in `msg.matter`. Invia `{payload:{action:"getAllBatteries"}}` per ottenere l'inventario in cache.

Gli input dinamici richiedono `nodeId`, `endpointId`, `clusterId` e `command` oppure `attribute` (a livello principale o sotto `msg.matter`):

- Accensione: `{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- Lettura: `{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- Scrittura: `{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## Archiviazione

Le credenziali della fabric e i dispositivi associati sono salvati nella cartella `knxultimatestorage/matter` dentro la directory utente di Node-RED. Cancellando quella cartella si perdono tutte le associazioni.

Usa **Esporta** per scaricare un backup completo di questa istanza controller. Include fabric, credenziali private, sessioni e dati dei dispositivi associati. **Proteggi il file come una password.** L'importazione sostituisce lo storage Matter di questa istanza e riavvia brevemente il controller. Un backup controller non può essere importato in un bridge.

## Rimuovere un dispositivo

Usa il pulsante cestino nella lista dei dispositivi associati. Il controller prova a decommissionare correttamente il dispositivo; se non è raggiungibile, viene comunque rimosso dalla fabric (potrebbe poi servire un reset di fabbrica del dispositivo).

Nel Monitor batterie universale, le uscite KNX opzionali pubblicano l'allarme complessivo come DPT 1.005 e ciclano ogni 2 secondi i nomi dei device scarichi come testo DPT 16.001 da 14 byte.
