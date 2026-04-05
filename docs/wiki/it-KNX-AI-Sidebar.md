---
layout: wiki
title: "KNX-AI-Sidebar"
lang: it
permalink: /wiki/it-KNX-AI-Sidebar
---
La **Dashboard KNX AI** ti aiuta a controllare il tuo impianto KNX in modo semplice.
Puoi vedere cosa sta succedendo, trovare anomalie, lanciare test e fare domande in linguaggio naturale.
Questa pagina mantiene il nome storico `KNX-AI-Sidebar` per compatibilita'.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Cosa puoi fare

- Controllare lo stato dell'impianto a colpo d'occhio.
- Vedere quali group address sono piu' attivi.
- Creare e gestire aree con supporto AI.
- Eseguire test guidati e leggere risultati chiari.
- Chiedere all'assistente "cosa non va?" e ottenere suggerimenti rapidi.

## Come aprirla in pochi secondi

1. Aprila dall'editor del nodo KNX AI con il pulsante **Open Web Page**.
2. Seleziona il tuo nodo KNX AI dalla lista.
3. Premi **Refresh** se serve.

## Sezioni principali (guida veloce)

- **Overview**: riepilogo live e attivita'.
- **Areas**: stanze/zone e relativi indirizzi di gruppo.
- **Tests**: prepara ed esegue controlli.
- **Test Results**: storico pass/warn/fail.
- **Ask**: scrivi domande in linguaggio naturale.
- **Settings**: selezione nodo e import/export.

## Percorso consigliato (prima volta)

1. Parti da **Overview** e controlla se l'impianto sembra stabile.
2. Vai in **Areas** e verifica che stanze/zone siano corrette.
3. Se serve, usa **Regenerate AI Areas** per rigenerare i suggerimenti.
4. Apri **Tests**, esegui un test, poi controlla **Test Results**.
5. In **Ask**, descrivi il problema in una frase e segui i controlli suggeriti.

## Pulsanti che userai di piu'

- **Refresh**: aggiorna subito i dati.
- **Regenerate AI Areas**: ricrea i suggerimenti aree AI dagli indirizzi ETS.
- **Delete AI Areas**: elimina in blocco tutte le aree generate dall'AI.
- **New Area**: crea una nuova area manuale.

## Quando l'AI sta lavorando

Quando le aree vengono generate o eliminate, appare una schermata di attesa al centro.
E' normale: la pagina blocca i click fino al termine dell'operazione, per evitare modifiche involontarie.

## Requisiti

- Almeno un nodo KNX AI configurato.
- Un gateway collegato e attivo.
- Per le risposte in chat: LLM abilitato e API key configurata nel nodo KNX AI.
