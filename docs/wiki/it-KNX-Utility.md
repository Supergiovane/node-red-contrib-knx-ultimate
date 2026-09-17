---
layout: wiki
title: "KNX Utility"
lang: it
permalink: /wiki/it-KNX-Utility
translation_key: "KNX-Utility"
---
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

Cambiare funzione nell’editor mostra le relative impostazioni in anteprima. **Annulla** mantiene la configurazione salvata in precedenza. I collegamenti nella tabella aprono impostazioni ed esempi della singola funzione; le pagine di riferimento descrivono queste funzioni di KNX Utility.

## Passare dalla versione 7

Converti i vecchi nodi separati con **KNX Ultimate 7** ancora installato e fai Deploy prima di aggiornare. La conversione conserva ID, impostazioni e collegamenti e offre backup dei flow e Annulla. La versione 8 non carica i tipi di nodo rimossi.

[Passare dalla versione 7]({{ '/wiki/it-Migration-8' | relative_url }})
