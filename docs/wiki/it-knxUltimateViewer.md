---
layout: wiki
title: "knxUltimateViewer"
lang: it
permalink: /wiki/it-knxUltimateViewer
translation_key: "knxUltimateViewer"
---
# KNX Viewer

KNX Viewer mostra i cambiamenti di stato degli indirizzi di gruppo (GA) in una semplice tabella, simile a un monitor ETS essenziale.

## Configurazione

Seleziona il **gateway KNX** e assegna un **nome** al nodo. Esegui il deploy del flow, poi riapri il nodo e premi **Apri monitor KNX Viewer**. La pagina si apre in una nuova scheda e usa la stessa autenticazione e gli stessi permessi di lettura dell’editor Node-RED.

## Monitor web

Ogni riga mostra ora, tipo di telegramma (Read, Write, Response, ecc.), indirizzo sorgente, GA, nome, DPT, valore precedente e nuovo valore. Le registrazioni più recenti compaiono per prime. Per i telegrammi Write e Response vengono registrati il primo valore osservato per un GA e le variazioni successive; i valori invariati non aggiungono righe.

Anche le richieste Read vengono registrate nello storico di 24 ore, senza valore precedente o nuovo valore. Non modificano l’ultimo valore noto del GA.

Seleziona un Viewer, cerca nell’elenco o scorri le pagine per consultare i cambiamenti precedenti. **Pausa** blocca la visualizzazione per permetterne la lettura; **Live** riprende gli aggiornamenti. La registrazione continua durante la pausa e quando la pagina del browser è chiusa.

## Storico di 24 ore

Il nodo Viewer attivo salva automaticamente lo storico in file nella cartella `userDir/knxultimatestorage/viewer`, separati per Viewer e gateway. I cambiamenti più vecchi di 24 ore vengono eliminati automaticamente. Dopo un riavvio di Node-RED, il Viewer recupera lo storico ancora compreso in questa finestra.

La registrazione inizia quando il Viewer aggiornato viene distribuito con il deploy ed è in esecuzione. Non ricostruisce il traffico precedente del bus.

## Uscite del flow

Il nodo mantiene le tre uscite esistenti:

1. **Valori correnti degli indirizzi di gruppo** — `msg.payload` contiene una tabella HTML per un nodo Template della dashboard.
2. **Array degli indirizzi di gruppo** — `msg.payload` contiene i dati dei GA in un array, da elaborare o registrare nel flow.
3. **Coda dei telegrammi** — `msg.payload` contiene una tabella HTML della coda di trasmissione del gateway.

Il monitor web può essere usato senza collegare queste uscite.
