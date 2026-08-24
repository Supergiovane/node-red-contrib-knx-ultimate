---
layout: wiki
title: "KNX AI"
lang: it
permalink: /wiki/it-KNX%20AI
---
Questo nodo ascolta **tutti i telegrammi KNX** dal gateway KNX Ultimate selezionato, costruisce statistiche di traffico, rileva anomalie e può interrogare opzionalmente un LLM.

L'editor usa tre sezioni principali ad accordion: **Assistente AI** contiene configurazione, conoscenza/contesto, provider e limiti; **Conversazioni e casa** contiene canali chat, casa proattiva e memoria limitata; **Analisi traffico KNX** contiene telegrammi dal bus, storico/riepiloghi e anomalie/pattern. Aprendo una sezione principale vengono mostrate insieme tutte le opzioni relative. ID e valori salvati dei campi restano invariati.

## Output
1. **Summary/Statistiche** (`msg.payload` JSON)
2. **Anomalie** (`msg.payload` JSON)
3. **Assistente AI** (`msg.payload` testo, con `msg.summary`)
4. **Operazioni KNX** (un messaggio Universal Mode per ogni lettura o scrittura validata)

Ogni messaggio emesso dalle uscite 3 e 4 contiene anche una copia del messaggio originale in ingresso in `msg.inputMessage`. In questo modo payload, topic, metadati della chat e qualsiasi altra proprietà di ingresso restano disponibili per i nodi successivi. Gli errori di clonazione o di invio vengono intercettati e segnalati senza propagarsi al runtime di Node-RED.

## Comandi (input)
Invia `msg.topic`:
- `summary` (o vuoto): emette subito la summary
- `reset`: azzera storico, contatori, memoria domestica appresa e tutti i context CHAT persistenti; Educazione AI resta invariata
- `ask`: invia una domanda all'LLM configurato
- `confirm` / `cancel`: conferma o annulla i comandi KNX in attesa senza richiamare l'LLM
- `clear_chat`: azzera turni recenti, istruzioni persistenti e comandi in attesa per la sessione corrente

Per `ask`, passa la domanda in `msg.prompt` (consigliato), in `msg.payload` (stringa), oppure nei comuni campi Telegram `msg.payload.content` / `msg.payload.text`.

Ogni sessione Ask/chat conserva gli ultimi 8 turni e fino a 20 istruzioni esplicite a lungo termine, separate per `msg.knxAi.sessionId`, `msg.sessionId` o chat ID Telegram rilevato. Richieste come «Ricordati di non usare il termine unknown» diventano istruzioni persistenti. Tutti i nodi KNX AI che usano lo stesso storage condividono questo context in tempo reale e lo ricaricano dopo un riavvio di Node-RED da `knxultimatestorage/knxai/memory/knxai-chat-context.md`. Il file, scritto atomicamente, è limitato a 50 sessioni e 512 KB. Quando il controllo KNX è abilitato, collega l'uscita 3 al nodo di risposta della chat e l'uscita 4 a un nodo KNX Ultimate configurato in **Modalità Universale**. Con la conferma attiva, la prima risposta mostra GA, DPT e payload delle scritture senza emetterle; la stessa sessione deve poi rispondere `CONFERMA`/`ANNULLA` entro 5 minuti. Una nuova richiesta sostituisce l'eventuale piano precedente. Ogni comando confermato contiene `msg.destination`, `msg.dpt`, `msg.payload` e `msg.event = "GroupValue_Write"`.
Per le scritture DPT 1.xxx, gli equivalenti sicuri prodotti dall'AI `true`/`false`, `1`/`0` e `on`/`off` vengono normalizzati in un vero booleano prima della validazione locale e dell'uscita.

### Letture KNX aggiornate
Quando l'utente chiede esplicitamente uno stato attuale o aggiornato, l'AI può interrogare gli oggetti esatti del catalogo ETS importato, compresi gli oggetti di stato e di sola lettura. L'uscita 4 emette `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` e `msg.readstatus = true`. Il nodo attende fino a 6 secondi ogni `GroupValue_Response` o scrittura fresca, poi restituisce i valori decodificati sull'uscita 3 e i dettagli in `msg.knxAi.readResults`. Le letture non richiedono mai conferma e non vengono mai trasformate in scritture.

### Richiesta di conferma per pulsanti chat
Quando un piano è in attesa, l'uscita 3 contiene `msg.knxAi.confirmationRequest`. L'oggetto include `required`, `status`, `sessionId`, `expiresAt`, `commandCount` e due elementi in `actions`. Usa `action.label` per il testo del pulsante Telegram, `action.callbackData` per il callback e reinvia `action.message` al nodo KNX AI per confermare o annullare senza digitare testo.

### Preset adattatori chat
La tab **Adattatori chat** carica le mappature selezionabili da `resources/KNXAIChatAdapterMappings.js`. Scegliendo un preset vengono inserite due mappature JavaScript sincrone e modificabili in caselle di testo a larghezza piena: una eseguita prima che KNX AI elabori l'ingresso e una prima dell'emissione sull'uscita 3. Restituisci `msg` per continuare oppure nessun valore per scartare il messaggio. Errori di sintassi o esecuzione vengono intercettati e segnalati senza arrestare Node-RED.

Il preset incluso **windkh/node-red-contrib-telegrambot** segue il contratto receiver/sender del pacchetto. Collega direttamente un `telegram receiver` a KNX AI e l'uscita 3 direttamente a un `telegram sender`; per usare i pulsanti inline di conferma, collega allo stesso ingresso KNX AI anche un `telegram event` configurato come `callback_query`. La mappatura d'ingresso estrae `msg.payload.content`, `msg.payload.chatId` e la lingua Telegram. Quella d'uscita crea i campi richiesti `msg.payload.chatId`, `type` e `content`, aggiungendo `options.reply_markup` da `msg.knxAi.confirmationRequest` quando una scrittura attende conferma. Il pacchetto Telegram resta una dipendenza opzionale separata.

Il preset incluso **RedBot / node-red-contrib-chatbot (Telegram)** segue il formato comune dei messaggi RedBot. Collega direttamente `chatbot-telegram-receive` a KNX AI e l'uscita 3 direttamente a `chatbot-telegram-send`; non serve un nodo callback separato perché RedBot converte i postback dei pulsanti inline in normali messaggi in ingresso. La mappatura d'ingresso legge `transport`, `chatId`, `type`, `content` e la lingua Telegram. Quella d'uscita conserva i dati di tracciamento RedBot `originalMessage`, `chat`, `api` e `client`, quindi emette un payload `message` oppure un payload `inline-buttons` con azioni `postback` per la conferma. RedBot resta una dipendenza opzionale separata.

## Intelligenza domestica proattiva e memoria limitata
La sottosezione **Casa proattiva e memoria** dentro **Conversazioni e casa** abilita le notifiche proattive su scelta dell'utente. Da gerarchia ETS, nomi, ruoli e DPT, il nodo crea un modello semantico deterministico per persiane, finestre, porte, luci, temperatura, clima, presenza e allarmi usando termini italiani, inglesi, tedeschi, francesi, spagnoli e cinesi. Il primo rilevatore proattivo osserva soltanto stati non di comando di persiane/finestre/porte riconosciuti con sufficiente affidabilità. Dopo il tempo di apertura configurato e fuori dalle ore silenziose, l'uscita 3 emette un messaggio localizzato con `msg.knxAi.type = "proactive_notification"`. Non emette mai l'uscita 4 e non modifica autonomamente KNX; un'eventuale richiesta successiva dell'utente passa sempre dalla normale validazione e conferma.

L'ultima sessione chat viene ricordata come proprietario, oppure **Destinatario principale / chat ID** consente di impostarla esplicitamente. Un `msg.inputMessage` sintetico conserva il destinatario affinché l'adattatore Telegram possa inviare una notifica spontanea. Il cooldown e il limite di tre notifiche proattive all'ora evitano messaggi ripetuti.

Il riferimento appreso condiviso viene caricato all'avvio da `<userDir>/knxai/memory/knxai-home-memory.md`, riscritto atomicamente ogni 15 minuti e sempre limitato rigidamente a 5 MB. Conserva al massimo 120 osservazioni significative, 80 abitudini aggregate, 80 notifiche e 300 oggetti ETS semantici, mai un flusso illimitato di telegrammi raw. Gli elementi vecchi e meno importanti vengono eliminati per primi. **Educazione AI** è limitata a 16.000 caratteri e proviene sempre dalla configurazione del nodo: l'AI può leggerla come istruzione autorevole, ma non può modificarla o sovrascriverla. Se l'Educazione è presente ma l'LLM non riesce a valutarla, la notifica candidata viene soppressa invece di rischiare di contraddirla.

## Esempio pratico di configurazione
Questo esempio crea un assistente conciso che avvisa il proprietario delle aperture importanti, ma accetta che la persiana dello studio possa rimanere aperta:

| Campo dell'editor | Valore di esempio | Risultato |
|---|---|---|
| **Abilita notifiche domestiche proattive** (`proactiveEnabled`) | attivo | Il nodo valuta gli stati aperti di persiane, finestre e porte riconosciuti con affidabilità. |
| **Destinatario principale / chat ID** (`proactiveRecipient`) | `123456789` | I messaggi spontanei vengono inviati a questa chat. Lascia vuoto per ricordare l'ultima sessione Ask. |
| **Avvisa dopo apertura** (`proactiveOpenMinutes`) | `120` | Dopo due ore viene valutata una possibile notifica. |
| **Inizio / fine ore silenziose** | `23:00` / `07:00` | Durante la notte non vengono emessi messaggi proattivi. |
| **Intervallo prima di ripetere** (`proactiveCooldownMinutes`) | `360` | Lo stesso oggetto non può generare un altro avviso per sei ore. |

Esempio per **Educazione AI** (`aiEducation`):

```text
Chiamami Massimo e rispondi nella stessa lingua che uso.
Mantieni le risposte brevi, salvo quando chiedo dettagli tecnici.
La persiana dello studio può restare aperta durante il giorno: non avvisarmi.
Avvisami quando un'altra persiana, finestra o porta rimane aperta insolitamente a lungo.
Quando "luce soggiorno" è ambiguo, chiedimi quale luce intendo.
Non dire mai che un attuatore è cambiato finché un oggetto di stato KNX non lo conferma.
```

Con queste impostazioni:

1. Se lo stato della persiana del soggiorno rimane aperto per 120 minuti fuori dalle ore silenziose, l'uscita 3 può emettere una `proactive_notification` localizzata.
2. Se rimane aperta la persiana dello studio, l'LLM legge l'Educazione e sopprime quella notifica candidata.
3. Se Massimo chiede poi di chiudere la persiana del soggiorno, KNX AI prepara il comando ETS esatto e applica comunque la normale validazione e conferma prima dell'uscita 4.

Usa gerarchie e nomi oggetto ETS descrittivi, con ruoli di stato/comando corretti. L'Educazione può personalizzare decisioni e formulazione, ma non può autorizzare un group address inventato, cambiare un DPT o aggirare la validazione KNX.

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
KNX AI ascolta automaticamente i telegrammi `GroupValue_Write`, `GroupValue_Response` e `GroupValue_Read`. L'analisi di pattern e anomalie viene sempre inizializzata con i valori predefiniti interni, quindi non occorre configurare i tipi di telegramma o il rilevamento.

### Analisi
- **Finestra analisi (secondi)**: finestra principale per summary/rate.
- **Finestra storico (secondi)**: finestra di retention dello storico interno telegrammi.
- **Archivia anche i telegrammi catturati su disco**: salva i telegrammi anche in `knxultimatestorage/knxai/history/<node-id>/YYYY-MM-DD.jsonl`, oltre che in RAM.
- **Retention archivio su disco (giorni)**: numero di giorni mantenuti su disco prima della cancellazione automatica dei file piu' vecchi.
- **Eventi massimi in memoria**: numero massimo di telegrammi mantenuti in RAM.
- **Invia summary automatico (secondi, 0=off)**: intervallo di emissione summary periodica.
- **Dimensione lista Top**: numero di group address/sorgenti nella classifica summary.

### Assistente AI
- **Abilita assistente LLM**: abilita funzioni Ask/chat.
- **Provider**: backend LLM (OpenAI-compatible o Ollama).
- **URL endpoint**: URL endpoint chat/completions.
- **API key**: chiave API (non necessaria con Ollama locale).
- **Modello**: ID/nome modello.
- **Compatibilità modello chat**: il modello selezionato deve supportare l'endpoint Chat Completions configurato. I modelli legacy disponibili solo tramite completions, come `gpt-3.5-turbo-instruct`, vengono esclusi quando si aggiorna la lista. Se il provider rifiuta un valore personalizzato di temperature o il parametro del limite token, KNX AI riprova rimuovendo o sostituendo soltanto il campo incompatibile.
- **Consenti all'AI di leggere stati KNX e comandare attuatori**: abilita l'uscita 4 ed è disattivato per default. Gli oggetti esatti del catalogo ETS possono essere letti; le scritture sono accettate solo per gli oggetti classificati come `command`. Operazioni sconosciute, con DPT discordante, non valide o eccessive e scritture verso oggetti di stato/neutrali vengono rifiutate localmente.
- **Chiedi conferma prima di inviare comandi KNX**: attivo per default. Mostra prima le modifiche validate e non emette comandi KNX finché la stessa sessione chat non le conferma. Quando ci sono comandi in attesa, la risposta aggiunge sempre le istruzioni esatte per confermare o annullare nella lingua della richiesta corrente. I comandi vengono validati nuovamente subito prima dell'uscita.
- **Preset adattatore**: parte da **Nessun adattatore**. Gli editor JavaScript restano nascosti finché non viene selezionato un adattatore; la selezione carica e mostra la coppia di mappature ingresso/uscita modificabile.
- **Mappatura ingresso (chat → KNX AI)**: JavaScript sincrono applicato prima dell'elaborazione del comando in ingresso. Usa l'editor JavaScript verde.
- **Mappatura uscita (KNX AI → chat)**: JavaScript sincrono applicato solo ai messaggi dell'uscita 3. Usa l'editor JavaScript giallo.
- **Abilita notifiche domestiche proattive**: rilevatore opzionale per stati aperti affidabili di persiane/finestre/porte; non scrive mai autonomamente su KNX.
- **Destinatario principale / chat ID**: destinazione opzionale dei messaggi spontanei; altrimenti viene ricordata l'ultima sessione Ask.
- **Avvisa dopo apertura (minuti)**: soglia di durata dell'apertura prima di valutare una notifica proattiva; 120 minuti per default.
- **Inizio / fine ore silenziose**: intervallo giornaliero in cui i messaggi proattivi sono sospesi.
- **Educazione AI**: istruzioni autorevoli gestite soltanto dall'utente, lette dall'AI e mai modificate.
- **Cooldown ripetizione (minuti)**: intervallo minimo prima che lo stesso oggetto possa generare un altro avviso; 360 minuti per default.
- Se l'archivio su disco e' attivo, **Ask** lo usa di default: rispetta date/intervalli espliciti e, se non presenti, cerca nelle ultime 24 ore piu' gli eventi correnti in RAM.
- **Includi inventario del progetto Node-RED**: include nel prompt l'inventario dell'intero progetto Node-RED, compresi nodi KNX e altri nodi utili come function/change/inject/template quando contengono logica KNX o group address.
- Gli estratti pertinenti di help, README ed esempi vengono sempre inclusi automaticamente.
- **Lingua documentazione**: lingua preferita per gli estratti documentali inclusi automaticamente.
- Pulsante **Aggiorna**: interroga il provider e popola i modelli disponibili. Durante il caricamento l'icona ruota; il completamento corretto non mostra messaggi.

### Advanced
- **Finestra analisi (secondi)**: finestra principale per summary/rate.
- **Eventi massimi in memoria**: numero massimo di telegrammi mantenuti in RAM.
- **Dimensione lista Top**: numero di group address/sorgenti nella classifica summary.

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
