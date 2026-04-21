---
layout: wiki
title: "KNX AI"
lang: it
permalink: /wiki/it-KNX%20AI
---
Questo nodo ascolta **tutti i telegrammi KNX** dal gateway KNX Ultimate selezionato, costruisce statistiche di traffico, rileva anomalie e può interrogare opzionalmente un LLM.

## Output
1. **Summary/Statistiche** (`msg.payload` JSON)
2. **Anomalie** (`msg.payload` JSON)
3. **Assistente AI** (`msg.payload` testo, con `msg.summary`)

## Comandi (input)
Invia `msg.topic`:
- `summary` (o vuoto): emette subito la summary
- `reset`: azzera storico e contatori interni
- `ask`: invia una domanda all'LLM configurato

Per `ask`, passa la domanda in `msg.prompt` (consigliato) oppure in `msg.payload` (stringa).

## Campi di configurazione
Di seguito sono elencati tutti i campi presenti nell'editor del nodo KNX AI.

### Generale
- **Gateway**: gateway/config node KNX Ultimate usato come sorgente telegrammi.
- **Nome**: nome del nodo e intestazione dashboard.
- **Topic**: topic base usato negli output del nodo.
- Pulsante **Open KNX AI Web**: apre la dashboard web completa (`/knxUltimateAI/sidebar/page`).

### Cattura
- **Cattura GroupValue_Write**: cattura telegrammi di scrittura.
- **Cattura GroupValue_Response**: cattura telegrammi di risposta.
- **Cattura GroupValue_Read**: cattura telegrammi di lettura.

### Analisi
- **Finestra analisi (secondi)**: finestra principale per summary/rate.
- **Finestra storico (secondi)**: finestra di retention dello storico interno telegrammi.
- **Eventi massimi in memoria**: numero massimo di telegrammi mantenuti in RAM.
- **Invia summary automatico (secondi, 0=off)**: intervallo di emissione summary periodica.
- **Dimensione lista Top**: numero di group address/sorgenti nella classifica summary.
- **Rileva pattern semplici (A -> B)**: abilita rilevamento transizioni/pattern.
- **Ritardo massimo pattern (ms)**: differenza temporale massima per correlare pattern.
- **Occorrenze minime pattern**: soglia minima prima di segnalare un pattern.

### Anomalie
- **Finestra rate (secondi)**: finestra scorrevole per i controlli di rate.
- **Max telegrammi/sec totale (0=off)**: soglia telegrammi/s sull'intero BUS.
- **Max telegrammi/sec per GA (0=off)**: soglia telegrammi/s per singolo group address.
- **Finestra flap (secondi)**: finestra temporale per rilevare flapping/cambi rapidi.
- **Max cambi per GA nella finestra (0=off)**: massimo numero di cambi consentiti.

### Assistente LLM
- Il tab **Assistente LLM** è mostrato per primo nell'editor, per semplificare la configurazione.
- **Abilita assistente LLM**: abilita funzioni Ask/chat.
- **Provider**: backend LLM (OpenAI-compatible o Ollama).
- **URL endpoint**: URL endpoint chat/completions.
- **API key**: chiave API (non necessaria con Ollama locale).
- **Modello**: ID/nome modello.
- **Prompt di sistema**: istruzione globale del comportamento analisi KNX.
- **Temperatura**: temperatura di campionamento.
- **Token massimi**: massimo numero di token di completamento.
- **Timeout (ms)**: timeout HTTP richieste LLM.
- **Eventi recenti inclusi**: massimo eventi recenti passati al prompt.
- **Includi payload raw in hex**: include payload raw esadecimale nel prompt.
- **Includi inventario nodi KNX nei flow**: include inventario flow nel prompt.
- **Max nodi del flow inclusi**: limite nodi inclusi dall'inventario flow.
- **Includi estratti documentazione (help/README/esempi)**: include contesto docs.
- **Lingua documentazione**: lingua preferita per gli estratti docs.
- **Max estratti docs**: numero massimo di estratti docs.
- **Max caratteri docs**: massimo totale caratteri docs.
- Pulsante **Aggiorna**: interroga il provider e popola i modelli disponibili.

### Setup rapido Ollama (locale)
- Seleziona **Provider = Ollama**.
- Endpoint predefinito: `http://localhost:11434/api/chat`.
- Se non trovi modelli locali, usa:
  - **1) Scarica il modello**: apre la pagina **Libreria modelli**.
  - **2) Installalo**: scarica e installa localmente il modello (esempio `llama3.1`).
- Durante refresh/installazione, KNX AI prova anche ad avviare automaticamente il server Ollama quando possibile.
- Se l'installazione fallisce per errore di connessione, verifica che Ollama sia avviato (app desktop o `ollama serve`).
- Se Node-RED gira in Docker, usa `host.docker.internal` al posto di `localhost` nell'endpoint.

## Nota sicurezza
Se l'LLM è abilitato, il contesto traffico KNX può essere inviato all'endpoint configurato. Per privacy on-prem, usa provider locali.
