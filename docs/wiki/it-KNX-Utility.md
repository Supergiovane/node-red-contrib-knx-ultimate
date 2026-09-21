---
layout: wiki
title: "KNX Utility"
lang: it
permalink: /wiki/it-KNX-Utility
---
## Aggiornamento a KNX Ultimate 8

La versione 7 aggiunge un piccolo pulsante **Aggiorna alla v8** nella parte alta di ogni editor. Il pulsante esegue il backup dei flow, installa i package HUE/Matter necessari, converte i nodi compatibili, esegue un Deploy completo, verifica i flow salvati e installa la versione 8. Quando richiesto, riavvia il servizio Node-RED: ricaricare soltanto il browser non basta. I nodi KNX AI legacy fermano la procedura automatica.

[Leggi la guida completa all’aggiornamento](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Upgrade-to-v8)

# KNX Utility

**KNX Utility** riunisce undici funzioni accessorie KNX in un solo nodo nella palette. Seleziona una **Funzione** per visualizzare impostazioni, icona e porte del flow corrispondenti. **KNX Device (KNXUltimate)** resta il nodo principale per inviare e ricevere telegrammi KNX.

## Undici funzioni, un nodo

| Funzione e riferimento impostazioni | Scopo | Ingressi / uscite |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | Segnala i dispositivi in allarme singolarmente, insieme o come ultimo allarme. | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | Risponde alle richieste di lettura KNX con valori configurati o ricevuti in precedenza. | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/it-DateTime-Configuration) | Invia data e ora correnti con DPT 19.001, 11.001 e 10.001. | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | Controlla il gateway o un dispositivo KNX e segnala problemi di connessione. | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | Condivide i valori KNX nello storage del contesto globale Node-RED configurato. | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | Registra i telegrammi in XML compatibile con ETS e conta il traffico. | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/it-Staircase-Configuration) | Gestisce la luce scale temporizzata con stato, forzatura e preavviso. | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/it-Garage-Configuration) | Gestisce comandi garage, impulsi, ingressi di sicurezza e chiusura automatica. | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | Richiama, registra e salva scene con indirizzi di gruppo e valori configurabili. | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | Scollega e ripristina i carichi configurati in base a consumi e limiti di potenza. | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | Traduce gli stati Home Assistant in valori booleani con proprietà di ingresso e tabella configurabili. | 1 / 1 |

La tabella mostra le porte del flow per ciascuna funzione. AutoResponder e Global Context lavorano direttamente con bus e contesto. DateTime usa invii programmati e il pulsante sul nodo; non ha ingressi o uscite nel flow.

Home Assistant Translator ha un ingresso e un’uscita e non richiede un gateway KNX. Scegli la proprietà del messaggio da tradurre (ad esempio `payload` o `data.new_state.state`) e modifica le associazioni `origine:true` / `origine:false`, come `open:true` e `closed:false`. Invia il valore booleano tradotto in `msg.payload`; collega l’uscita a KNX Device quando occorre scrivere sul bus.

## Configurare un nodo Utility

1. Trascina **KNX Utility** dalla palette nel flow.
2. Scegli la **Funzione**, seleziona il gateway KNX dove richiesto e compila le impostazioni visualizzate.
3. Salva il nodo e controlla i collegamenti di ingresso e uscita. Premi **Deploy** quando vuoi attivarlo.

Cambiare funzione nell’editor mostra le relative impostazioni in anteprima. **Annulla** mantiene la configurazione salvata in precedenza. I collegamenti nella tabella aprono impostazioni ed esempi della singola funzione; le vecchie pagine restano disponibili come riferimento dei nodi dedicati.

## Convertire tutti i nodi legacy compatibili

Apri **KNX Utility** o un nodo legacy compatibile e premi **Converti tutti i nodi KNX legacy compatibili**, quindi conferma. La conversione comprende tutte le istanze delle undici funzioni elencate, in **tutti i flow e subflow** dell’editor, indipendentemente dalla scheda attiva o dalla selezione.

Dopo la conferma e prima di modificare i nodi, il browser avvia automaticamente il download di un backup JSON con data e ora di tutti i flow attualmente nell’editor, inclusi schede, subflow, nodi di configurazione, gruppi e collegamenti. Il file usa il formato di esportazione standard di Node-RED e può essere reimportato. Le credenziali dichiarate dai nodi sono escluse, come nell’esportazione standard. Il browser può chiedere dove salvare il file. Se non è possibile preparare il backup o avviarne il download, nessun nodo viene convertito.

La conversione avviene localmente nel browser. Conserva ID, impostazioni salvate, riferimenti al gateway, collegamenti, posizioni e appartenenza ai gruppi. Gli ID conservati mantengono i file dei valori AutoResponder e le scene registrate da Scene Controller; Global Context mantiene nome della variabile e storage selezionato, Logger le impostazioni dei file. Home Assistant Translator conserva la proprietà di ingresso e la tabella di traduzione personalizzata, anche quando è volutamente vuota.

La conferma chiude l’editor del nodo corrente e scarta le modifiche non salvate. L’intera conversione è una singola operazione **Annulla** e supporta anche **Ripristina**. Controlla i nodi convertiti e premi **Deploy** per rendere effettive le modifiche. La migrazione non esegue Deploy automaticamente. Un flow bloccato impedisce la conversione finché non viene sbloccato.

I nodi dedicati esistenti continuano a caricarsi e funzionare. Sono nascosti nella palette e contrassegnati con `(deprecated)` nei flow esistenti, dove restano modificabili. KNX Device, Viewer, altri nodi di integrazione e routing mantengono i rispettivi ruoli.
