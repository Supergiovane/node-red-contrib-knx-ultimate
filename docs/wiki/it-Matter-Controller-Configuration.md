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

## Archiviazione

Le credenziali della fabric e i dispositivi associati sono salvati nella cartella `knxultimatestorage/matter` dentro la directory utente di Node-RED. Cancellando quella cartella si perdono tutte le associazioni.

## Rimuovere un dispositivo

Usa il pulsante cestino nella lista dei dispositivi associati. Il controller prova a decommissionare correttamente il dispositivo; se non è raggiungibile, viene comunque rimosso dalla fabric (potrebbe poi servire un reset di fabbrica del dispositivo).
