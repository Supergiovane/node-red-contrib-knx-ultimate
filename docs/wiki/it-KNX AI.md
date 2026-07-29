---
layout: wiki
title: "KNX AI"
lang: it
permalink: /wiki/it-KNX%20AI
---
Questo nodo ascolta **tutti i telegrammi KNX** dal gateway KNX Ultimate selezionato, costruisce statistiche di traffico, rileva anomalie e può interrogare opzionalmente un LLM.

Le sezioni dell'editor utilizzano le stesse tab verticali a sinistra dei nodi Matter. **Configurazione rapida** contiene soltanto le scelte AI più comuni (abilitazione, provider, credenziali, modello, lettura stati/comando attuatori KNX e conferma); i parametri tecnici sono raggruppati per argomento nelle altre tab.

## Output
1. **Summary/Statistiche** (`msg.payload` JSON)
2. **Anomalie** (`msg.payload` JSON)
3. **Assistente AI** (`msg.payload` testo, con `msg.summary`)
4. **Operazioni KNX** (un messaggio Universal Mode per ogni lettura o scrittura validata)

Ogni messaggio emesso dalle uscite 3 e 4 contiene anche una copia del messaggio originale in ingresso in `msg.inputMessage`. In questo modo payload, topic, metadati della chat e qualsiasi altra proprietà di ingresso restano disponibili per i nodi successivi. Gli errori di clonazione o di invio vengono intercettati e segnalati senza propagarsi al runtime di Node-RED.

## Comandi (input)
Invia `msg.topic`:
- `summary` (o vuoto): emette subito la summary
- `reset`: azzera storico e contatori interni
- `ask`: invia una domanda all'LLM configurato
- `confirm` / `cancel`: conferma o annulla i comandi KNX in attesa senza richiamare l'LLM
- `clear_chat`: azzera la memoria della conversazione per la sessione corrente

Per `ask`, passa la domanda in `msg.prompt` (consigliato), in `msg.payload` (stringa), oppure nei comuni campi Telegram `msg.payload.content` / `msg.payload.text`.

Quando il controllo KNX è abilitato, i turni recenti sono conservati in RAM per `msg.knxAi.sessionId`, `msg.sessionId` o per il chat ID Telegram rilevato. Collega l'uscita 3 al nodo di risposta della chat e l'uscita 4 a un nodo KNX Ultimate configurato in **Modalità Universale**. Con la conferma attiva, la prima risposta mostra GA, DPT e payload delle scritture senza emetterle; la stessa sessione deve poi rispondere `CONFERMA`/`ANNULLA` entro 5 minuti. Una nuova richiesta sostituisce l'eventuale piano precedente. Ogni comando confermato contiene `msg.destination`, `msg.dpt`, `msg.payload` e `msg.event = "GroupValue_Write"`.
Per le scritture DPT 1.xxx, gli equivalenti sicuri prodotti dall'AI `true`/`false`, `1`/`0` e `on`/`off` vengono normalizzati in un vero booleano prima della validazione locale e dell'uscita.

### Letture KNX aggiornate
Quando l'utente chiede esplicitamente uno stato attuale o aggiornato, l'AI può interrogare gli oggetti esatti del catalogo ETS importato, compresi gli oggetti di stato e di sola lettura. L'uscita 4 emette `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` e `msg.readstatus = true`. Il nodo attende fino a 6 secondi ogni `GroupValue_Response` o scrittura fresca, poi restituisce i valori decodificati sull'uscita 3 e i dettagli in `msg.knxAi.readResults`. Le letture non richiedono mai conferma e non vengono mai trasformate in scritture.

### Richiesta di conferma per pulsanti chat
Quando un piano è in attesa, l'uscita 3 contiene `msg.knxAi.confirmationRequest`. L'oggetto include `required`, `status`, `sessionId`, `expiresAt`, `commandCount` e due elementi in `actions`. Usa `action.label` per il testo del pulsante Telegram, `action.callbackData` per il callback e reinvia `action.message` al nodo KNX AI per confermare o annullare senza digitare testo.

### Preset adattatori chat
La tab **Adattatori chat** carica le mappature selezionabili da `resources/KNXAIChatAdapterMappings.js`. Scegliendo un preset vengono inserite due mappature JavaScript sincrone e modificabili in caselle di testo a larghezza piena: una eseguita prima che KNX AI elabori l'ingresso e una prima dell'emissione sull'uscita 3. Restituisci `msg` per continuare oppure nessun valore per scartare il messaggio. Errori di sintassi o esecuzione vengono intercettati e segnalati senza arrestare Node-RED.

Il preset incluso **windkh/node-red-contrib-telegrambot** segue il contratto receiver/sender del pacchetto. Collega direttamente un `telegram receiver` a KNX AI e l'uscita 3 direttamente a un `telegram sender`; per usare i pulsanti inline di conferma, collega allo stesso ingresso KNX AI anche un `telegram event` configurato come `callback_query`. La mappatura d'ingresso estrae `msg.payload.content`, `msg.payload.chatId` e la lingua Telegram. Quella d'uscita crea i campi richiesti `msg.payload.chatId`, `type` e `content`, aggiungendo `options.reply_markup` da `msg.knxAi.confirmationRequest` quando una scrittura attende conferma. Il pacchetto Telegram resta una dipendenza opzionale separata.

## Workflow rapido: controllo KNX
1. Importa il CSV ETS nel gateway e configura provider, modello e credenziali LLM.
2. Abilita **Assistente LLM** e **lettura stati e controllo attuatori KNX**; lascia attiva la conferma.
3. Collega l'ingresso della chat al nodo KNX AI mantenendo un ID sessione/chat stabile.
4. Collega l'uscita 3 alla risposta della chat e l'uscita 4 a KNX Ultimate in **Modalità Universale**.
5. L'utente invia una richiesta; gli stati aggiornati vengono letti subito, mentre per le scritture l'AI mostra prima GA, DPT e valore senza scrivere sul bus.
6. Entro 5 minuti, la stessa chat risponde esattamente `CONFERMA` oppure `ANNULLA`.
7. Solo `CONFERMA` rivalida ed emette i comandi sull'uscita 4; verifica l'esecuzione tramite una GA di stato.

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
- **Archivia anche i telegrammi catturati su disco**: salva i telegrammi anche in `knxultimatestorage/knxai/history/<node-id>/YYYY-MM-DD.jsonl`, oltre che in RAM.
- **Retention archivio su disco (giorni)**: numero di giorni mantenuti su disco prima della cancellazione automatica dei file piu' vecchi.
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

### Assistente AI
- **Abilita assistente LLM**: abilita funzioni Ask/chat.
- **Provider**: backend LLM (OpenAI-compatible o Ollama).
- **URL endpoint**: URL endpoint chat/completions.
- **API key**: chiave API (non necessaria con Ollama locale).
- **Modello**: ID/nome modello.
- **Compatibilità modello chat**: il modello selezionato deve supportare l'endpoint Chat Completions configurato. I modelli legacy disponibili solo tramite completions, come `gpt-3.5-turbo-instruct`, vengono esclusi quando si aggiorna la lista. Se il provider rifiuta un valore personalizzato di temperature o il parametro del limite token, KNX AI riprova rimuovendo o sostituendo soltanto il campo incompatibile.
- **Prompt di sistema**: istruzione globale del comportamento analisi KNX (Advanced).
- **Consenti all'AI di leggere stati KNX e comandare attuatori**: abilita l'uscita 4 ed è disattivato per default. Gli oggetti esatti del catalogo ETS possono essere letti; le scritture sono accettate solo per gli oggetti classificati come `command`. Operazioni sconosciute, con DPT discordante, non valide o eccessive e scritture verso oggetti di stato/neutrali vengono rifiutate localmente.
- **Chiedi conferma prima di inviare comandi KNX**: attivo per default. Mostra prima le modifiche validate e non emette comandi KNX finché la stessa sessione chat non le conferma. Quando ci sono comandi in attesa, la risposta aggiunge sempre le istruzioni esatte per confermare o annullare nella lingua della richiesta corrente. I comandi vengono validati nuovamente subito prima dell'uscita.
- **Preset adattatore**: carica una coppia di mappature ingresso/uscita dal file degli adattatori chat incluso. La selezione sostituisce intenzionalmente entrambe le caselle di testo; il codice resta modificabile.
- **Mappatura ingresso (chat → KNX AI)**: JavaScript sincrono applicato prima dell'elaborazione del comando in ingresso.
- **Mappatura uscita (KNX AI → chat)**: JavaScript sincrono applicato solo ai messaggi dell'uscita 3.
- Se l'archivio su disco e' attivo, **Ask** lo usa di default: rispetta date/intervalli espliciti e, se non presenti, cerca nelle ultime 24 ore piu' gli eventi correnti in RAM.
- **Includi payload raw in hex**: include payload raw esadecimale nel prompt.
- **Includi inventario del progetto Node-RED**: include nel prompt l'inventario dell'intero progetto Node-RED, compresi nodi KNX e altri nodi utili come function/change/inject/template quando contengono logica KNX o group address.
- **Includi estratti documentazione (help/README/esempi)**: include contesto docs.
- **Lingua documentazione**: lingua preferita per gli estratti docs.
- Pulsante **Aggiorna**: interroga il provider e popola i modelli disponibili.

### Advanced
- **Finestra analisi (secondi)**: finestra principale per summary/rate.
- **Eventi massimi in memoria**: numero massimo di telegrammi mantenuti in RAM.
- **Dimensione lista Top**: numero di group address/sorgenti nella classifica summary.
- **Ritardo massimo pattern (ms)**: differenza temporale massima per correlare pattern.
- **Occorrenze minime pattern**: soglia minima prima di segnalare un pattern.
- **Finestra rate (secondi)**: finestra scorrevole per i controlli di rate.
- **Max telegrammi/sec totale (0=off)**: soglia telegrammi/s sull'intero BUS.
- **Max telegrammi/sec per GA (0=off)**: soglia telegrammi/s per singolo group address.
- **Finestra flap (secondi)**: finestra temporale per rilevare flapping/cambi rapidi.
- **Max cambi per GA nella finestra (0=off)**: massimo numero di cambi consentiti.

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
Se l'LLM è abilitato, il contesto traffico KNX può essere inviato all'endpoint configurato. Per privacy on-prem, usa provider locali. Un comando emesso sull'uscita 4 ha superato la validazione locale ed è stato inoltrato al flow, ma non prova che l'attuatore lo abbia eseguito. Per la conferma usa una GA di stato KNX.
