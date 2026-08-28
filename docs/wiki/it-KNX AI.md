Questo nodo ascolta **tutti i telegrammi KNX** dal gateway KNX Ultimate selezionato, costruisce statistiche di traffico, rileva anomalie e può interrogare opzionalmente un LLM.

L'editor usa due schede orizzontali: **Assistente AI** contiene configurazione, conoscenza/contesto, provider e limiti; **Conversazioni e casa** contiene i PIN di input e output della chat, casa proattiva e memoria limitata.

## Output
1. **Summary/Statistiche** (`msg.payload` JSON)
2. **Anomalie** (`msg.payload` JSON)
3. **Assistente AI** (`msg.payload` testo, con `msg.summary`)
4. **Operazioni KNX** (un messaggio Universal Mode per ogni lettura o scrittura validata)
5. **TTS Ultimate** (un messaggio di annuncio per ogni testo parlato scelto dal modello)

Ogni messaggio emesso dalle uscite 3 e 4 contiene anche una copia del messaggio originale in ingresso in `msg.inputMessage`. In questo modo payload, topic, metadati della chat e qualsiasi altra proprietà di ingresso restano disponibili per i nodi successivi. Gli errori di clonazione o di invio vengono intercettati e segnalati senza propagarsi al runtime di Node-RED.

### Setup Doctor e primo avvio sicuro
Il **Setup Doctor** automatico controlla gateway selezionato e importazione ETS, attivazione AI, provider, modello e chiave API, raggiungibilità del provider, collegamenti del flow, telecamere rilevate e collegamento TTS Ultimate opzionale. Il preflight del provider, senza costi, chiama soltanto l'endpoint che elenca i modelli: non invia mai una richiesta chat e non consuma token di inferenza. Telecamere e TTS sono opzionali, quindi non usarli non riduce la prontezza di base.

L'inventario mostra il numero esatto di segnali KNX con indirizzo di gruppo univoco, le aree/i gruppi ETS e una stima delle funzioni logiche. Non dichiara volutamente il numero di dispositivi fisici, perché non è ricavabile in modo affidabile dal CSV ETS. Il Setup Doctor legge l'ultimo flow di cui è stato eseguito il deploy: dopo modifiche a provider, modello, preset, gateway o collegamenti, esegui quindi il deploy prima di fare clic su **Aggiorna** per ripetere i controlli.

Invia `/start` o `/help` da una chat per ricevere sull'uscita chat (uscita 3) un benvenuto deterministico e localizzato, con statistiche personalizzate dell'impianto e fino a tre suggerimenti sicuri. Questo onboarding non chiama l'LLM, non legge o scrive KNX e non genera TTS. Con il preset Telegram, i suggerimenti appaiono come pulsanti della tastiera di risposta e vengono eseguiti solo dopo che l'utente ne seleziona o invia uno esplicitamente. Dopo questa selezione esplicita, un suggerimento iniziale può eseguire letture KNX esatte quando necessarie; restano invece inibiti scritture e routine KNX, azioni sulle telecamere, TTS, modifiche alla memoria persistente e apprendimento dei ruoli GA.

### Intelligenza Web
L'accesso Web è disattivato per impostazione predefinita. Quando **Consenti all'AI di usare il Web** è attivo, il modello conversazionale può scegliere il tool Web strutturato direttamente dalla richiesta corrente; non vengono usate parole chiave, logiche specifiche per argomento o classificatori d'intento. Ogni turno utente o ciclo proattivo può eseguire al massimo tre operazioni Web complessive. Tutte le operazioni Web esterne reali condividono il budget orario scorrevole configurato.

**Consenti controlli Web proattivi** è un opt-in separato. Richiede anche istruzioni esplicite scritte dall'utente in **Educazione AI**, rispetta l'intervallo minimo configurato e parte solo dopo che KNX AI ha appreso una chat destinataria da almeno una normale richiesta in chat. Senza entrambe le autorizzazioni non avviene alcuna operazione Web in background.

Ogni risposta basata sul Web contiene citazioni validate dal runtime con URL della fonte sanificato e ora di consultazione, oltre all'ora di pubblicazione quando disponibile. Il contenuto esterno è un dato non attendibile, mai un'istruzione, e non può sostituire le regole o i permessi dell'assistente. Sono accettate soltanto risorse HTTPS pubbliche e limitate; destinazioni private, locali, link-local e di metadata cloud, redirect non sicuri, navigazione autenticata e cookie vengono bloccati. Se nessuna fonte può essere verificata, KNX AI segnala il limite invece di generare una risposta priva di fonti.

Dopo che sono disponibili risultati Web verificati, il modello può comporre gli altri tool abilitati quando la chat corrente o Educazione AI lo autorizzano. L'accesso Web non amplia mai i permessi: disponibilità di telecamere, TTS e memoria, così come letture e scritture KNX, validazione locale ETS/DPT e conferma configurata per le scritture KNX, restano invariate. Le richieste Web espongono la query e l'IP pubblico del server ai siti esterni o al servizio di ricerca; dati KNX/ETS, contenuti delle telecamere, identificativi chat, memoria appresa e credenziali non vengono mai aggiunti automaticamente.

## Comandi (input)
Invia `msg.topic`:
- `summary` (o vuoto): emette subito la summary
- `reset`: azzera storico, contatori, memoria domestica appresa e tutti i context CHAT persistenti; Educazione AI resta invariata
- `ask`: invia una domanda all'LLM configurato
- `confirm` / `cancel`: conferma o annulla i comandi KNX in attesa senza richiamare l'LLM
- `clear_chat`: azzera turni recenti, istruzioni persistenti e comandi in attesa per la sessione corrente

Per `ask`, passa la domanda in `msg.prompt` (consigliato), in `msg.payload` (stringa), oppure nei comuni campi Telegram `msg.payload.content` / `msg.payload.text`.

Se l'elaborazione dura più di 1,2 secondi, l'uscita 3 emette subito il messaggio intermedio localizzato «Sto pensando…», con `msg.knxAi.type = "thinking"` e `msg.knxAi.transient = true`. L'adattatore chat lo invia allo stesso utente, mentre la risposta finale arriva normalmente appena pronta. Questo messaggio di avanzamento non viene mai salvato nel contesto della conversazione né nella memoria appresa.

Le richieste Ollama e Bionic LM Studio usano automaticamente un timeout minimo di 10 minuti; i provider cloud mantengono un minimo di 2 minuti. Non esiste un campo timeout da gestire nell'editor. Se viene raggiunto anche il limite locale, KNX AI segnala che il modello non ha completato la risposta e suggerisce di riprovare o ridurre il contesto del prompt.

Per i provider locali, **Quantità contesto chat** permette di scegliere esplicitamente 4K, 8K o 16K; 16K resta il valore predefinito. La scelta limita proporzionalmente i dati KNX, memoria, progetto Node-RED e adapter forniti al modello, mantenendo completo il contratto degli strumenti dell’agente. Nessuna funzione viene abilitata o disabilitata in base a formulazioni, parole chiave o intent linguistici.

Lo stato del nodo sul canvas è riservato intenzionalmente all'ultima richiesta in ingresso e al messaggio localizzato «Sto pensando…» mentre l'LLM è in esecuzione. Telegrammi KNX, aggiornamenti del gateway, frequenze del traffico, messaggi ready e risultati tecnici non lo sovrascrivono mai; restano disponibili tramite uscite, log e dati dell'Assistente.

Ogni sessione Ask/chat conserva gli ultimi 8 turni e fino a 20 istruzioni a lungo termine scelte dal modello, separate per `msg.knxAi.sessionId`, `msg.sessionId` o chat ID Telegram rilevato. È il modello a decidere semanticamente quando il significato di una conversazione vada ricordato o dimenticato tramite lo strumento di memoria strutturato: non esistono liste di parole chiave o intent linguistici. Tutti i nodi KNX AI che usano lo stesso storage condividono questo context in tempo reale e lo ricaricano dopo un riavvio di Node-RED da `knxultimatestorage/knxai/memory/knxai-chat-context.knxctx`. Il file, scritto atomicamente, è limitato a 50 sessioni e 512 KB. Quando il controllo KNX è abilitato, collega l'uscita 3 al nodo di risposta della chat e l'uscita 4 a un nodo KNX Ultimate configurato in **Modalità Universale**. Con la conferma attiva, la prima risposta mostra GA, DPT e payload delle scritture senza emetterle; la stessa sessione deve poi rispondere `CONFERMA`/`ANNULLA` entro 5 minuti. Una nuova richiesta sostituisce l'eventuale piano precedente. Ogni comando confermato contiene `msg.destination`, `msg.dpt`, `msg.payload` e `msg.event = "GroupValue_Write"`.
La memoria recente della sessione viene collocata immediatamente accanto alla richiesta corrente, così i modelli locali mantengono fatti forniti dall'utente, come nome preferito o lingua, anche dentro un prompt KNX molto grande. Il modello può rendere persistenti fatti, preferenze e istruzioni durevoli tramite `memoryActions`; resta una scelta semantica dello strumento, senza classificatori di frasi o routing per intent. Credenziali, codici di sicurezza e API key non devono mai essere appresi.

Per le scritture DPT 1.xxx, gli equivalenti sicuri prodotti dall'AI `true`/`false`, `1`/`0` e `on`/`off` vengono normalizzati in un vero booleano prima della validazione locale e dell'uscita.

### Letture KNX aggiornate
Quando l'utente chiede esplicitamente uno stato attuale o aggiornato, l'AI può interrogare gli oggetti esatti del catalogo ETS importato, compresi gli oggetti di stato e di sola lettura. L'uscita 4 emette `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` e `msg.readstatus = true`. Il nodo attende fino a 6 secondi ogni `GroupValue_Response` o scrittura fresca, poi restituisce i valori decodificati sull'uscita 3 e i dettagli in `msg.knxAi.readResults`. Le letture non richiedono mai conferma e non vengono mai trasformate in scritture. Se un piccolo modello locale omette il tipo di operazione e il payload, gli oggetti ETS esatti vengono normalizzati in modo sicuro come letture; un elemento con payload resta una scrittura validata.

### Routine conversazionali multi-step
Richieste come «Sto uscendo», «Buonanotte» o «Modalità cinema» possono coordinare una routine basata sullo stato corrente senza aggiungere opzioni all'editor. Nel primo passaggio LLM vengono accettate soltanto letture ETS esatte (massimo 20); KNX AI le invia e passa i risultati aggiornati GA/DPT/valore a un secondo passaggio di pianificazione isolato. Quest'ultimo può preparare fino a 12 scritture validate, ma non può avviare un altro ciclo di letture. Con la conferma attiva, l'intero piano richiede una sola conferma localizzata e nessuna scrittura o annuncio TTS richiesto viene emesso prima. Dopo la conferma ogni scrittura viene rivalidata, inoltrata in ordine e osservata fino a 4 secondi per un feedback immediato corrispondente sul bus. La risposta finale distingue il feedback osservato dalle operazioni senza feedback immediato, senza considerare queste ultime come dispositivi guasti. I dettagli sono disponibili in `msg.knxAi.routine`, `readResults`, `verifiedCount` e `unverifiedCount`.

### Richiesta di conferma per pulsanti chat
Quando un piano è in attesa, l'uscita 3 contiene `msg.knxAi.confirmationRequest`. L'oggetto include `required`, `status`, `sessionId`, `expiresAt`, `commandCount` e due elementi in `actions`. Usa `action.label` per il testo del pulsante Telegram, `action.callbackData` per il callback e reinvia `action.message` al nodo KNX AI per confermare o annullare senza digitare testo.

### Adattatori messaggi ingresso/uscita
La sezione **Chat PIN Input e Output** carica le mappature selezionabili da `resources/KNXAIChatAdapterMappings.js`. Scegliendo un adattatore vengono installate internamente due mappature JavaScript sincrone predefinite: una eseguita prima che KNX AI elabori l'ingresso e una prima dell'emissione sull'uscita 3. Le mappature restano nascoste nell'editor. Errori di sintassi o esecuzione vengono intercettati e segnalati senza arrestare Node-RED.

Il preset incluso **windkh/node-red-contrib-telegrambot** segue il contratto receiver/sender del pacchetto. Collega direttamente un `telegram receiver` a KNX AI e l'uscita 3 direttamente a un `telegram sender`. La conferma usa una tastiera Telegram temporanea: premendo **Conferma** o **Annulla** viene inviato un normale messaggio localizzato attraverso lo stesso receiver, quindi non servono `telegram event` né collegamenti callback. I vecchi messaggi `callback_query` restano accettati. La mappatura d'ingresso estrae `msg.payload.content`, `msg.payload.chatId` e la lingua Telegram. Quella d'uscita crea i campi richiesti `msg.payload.chatId`, `type` e `content`, aggiungendo `options.reply_markup` da `msg.knxAi.confirmationRequest` quando una scrittura attende conferma. Il pacchetto Telegram resta una dipendenza opzionale separata.

Con questo preset, un messaggio vocale Telegram (`msg.payload.type = "voice"`) viene gestito automaticamente solo quando **Provider** è impostato su **OpenAI-compatible**. Prima di scaricare qualsiasi dato, KNX AI verifica il provider, riutilizza **URL endpoint** e **API key** già configurati e deriva `/audio/transcriptions` e `/audio/speech` dalla stessa connessione. Il collegamento `msg.payload.weblink`, che contiene il token, viene usato soltanto per il download limitato e rimosso prima che il messaggio raggiunga gli output o l'LLM. L'audio OGG/Opus viene trascritto con il default integrato `gpt-4o-mini-transcribe`; a una richiesta elaborata correttamente risponde con un vocale Telegram OGG/Opus generato con `gpt-4o-mini-tts` e `alloy`, conservando la didascalia testuale e l'eventuale tastiera di conferma. Se è selezionato un altro provider, l'utente riceve un'indicazione localizzata per scegliere OpenAI-compatible oppure inviare testo. Se la sintesi non è disponibile, fallisce o supera il limite vocale, viene inviato come fallback il testo completo. L'audio scaricato e il testo della risposta vengono inviati allo stesso provider selezionato. Messaggi di testo, foto e vecchie mappature Telegram salvate restano compatibili.

La didascalia di ogni vocale nativo inizia con l'indicazione localizzata **Voce generata dall’IA**, visibile al destinatario Telegram.

Il preset incluso **RedBot / node-red-contrib-chatbot (Telegram)** segue il formato comune dei messaggi RedBot. Collega direttamente `chatbot-telegram-receive` a KNX AI e l'uscita 3 direttamente a `chatbot-telegram-send`; non serve un nodo callback separato perché RedBot converte i postback dei pulsanti inline in normali messaggi in ingresso. La mappatura d'ingresso legge `transport`, `chatId`, `type`, `content` e la lingua Telegram. Quella d'uscita conserva i dati di tracciamento RedBot `originalMessage`, `chat`, `api` e `client`, quindi emette un payload `message` oppure un payload `inline-buttons` con azioni `postback` per la conferma. RedBot resta una dipendenza opzionale separata.

### Adapter telecamera rilevati automaticamente
I pacchetti di telecamere installati possono pubblicare a runtime un adapter per KNX AI. Non esistono selettori né nodi telecamera da collegare a KNX AI: adapter, controller e telecamere disponibili vengono rilevati automaticamente e inseriti nel contesto della chat. `node-red-contrib-unifi-ultimate` è il primo provider supportato; altri pacchetti, come `hikvision-ultimate`, possono registrarsi tramite lo stesso contratto indipendente dal produttore.

L'utente può chiedere uno snapshot aggiornato oppure domandare al modello vision che cosa è visibile. I preset Telegram e RedBot inviano l'immagine come foto nativa con didascalia. L'utente può anche creare notifiche persistenti per movimento, attraversamento di una linea intelligente o ingresso in una zona di intrusione/stazionamento, limitandole facoltativamente alle persone rilevate e a una linea o zona nominata esatta. Le regole vengono salvate nello stesso file `knxai-chat-context.knxctx` e ripristinate dopo i riavvii di Node-RED. Le sottoscrizioni agli eventi UniFi e le richieste snapshot avvengono direttamente tramite il provider rilevato: l'uscita 4 di KNX AI non è coinvolta e non servono collegamenti intermedi nel flow.

Ogni evento pubblicato da un adapter rilevato automaticamente viene normalizzato e aggiunto direttamente nel formato nativo compatto a righe di KNX AI a un file giornaliero `YYYY-MM-DD.knxctx` sotto `knxultimatestorage/knxai/adapter-history/<id-nodo>/`. L'archivio dei telegrammi KNX usa lo stesso formato compatto, senza serializzazione JSON intermedia. L'archivio conserva 10 giorni, garantisce più di 24 ore di storico e salva i metadati degli eventi, non le immagini. Gli archivi JSONL esistenti non vengono letti né migrati. I totali comprendono tutte le righe memorizzate nell'intervallo richiesto; i dettagli selezionati sono soltanto un campione pertinente.

### Annunci con TTS Ultimate
Collega l'uscita 5 a uno o più nodi `ttsultimate` del pacchetto opzionale `node-red-contrib-tts-ultimate`. I normali collegamenti di Node-RED determinano destinazione e fan-out; usa Link Out/Link In quando il nodo TTS si trova in un'altra scheda del flow. Il precedente selettore del nodo TTS e l'iniezione interna sono stati rimossi. Le posizioni delle uscite 1–4 restano invariate, ma nei flow aggiornati occorre collegare fisicamente l'uscita 5 prima che gli annunci vocali possano raggiungere TTS Ultimate.

Il modello decide se preparare un annuncio ragionando sulla richiesta corrente, sulle istruzioni persistenti della chat e sull'Educazione AI gestita dall'utente: non esistono intent per gli annunci né liste di frasi di attivazione. Valori KNX, eventi degli adapter, immagini e archivi restano dati e non diventano istruzioni, ma le indicazioni autorevoli dell'utente possono insegnare al modello come agire su quei dati. L'uscita 5 emette il testo esatto da pronunciare in `msg.payload`, imposta `msg.topic = "knx_ai_announcement"` e aggiunge `msg.knxAi.type = "tts_announcement"` insieme a `msg.knxAi.sourceNodeId`, `msg.knxAi.sessionId` e `msg.knxAi.reason`. TTS Ultimate gestisce poi player, voce, volume, hailing e coda.

### Riepilogo del contesto della chat
L'editor del nodo mostra una scheda compatta con le fonti disponibili alla chat: traffico KNX corrente e archiviato, eventi persistenti degli adapter, semantica ETS e progetto Node-RED, memoria di sessione e domestica, Educazione AI e telecamere rilevate. Mostra anche il contesto operativo massimo scelto dall'utente e il peso UTF-8 effettivo dell'ultimo prompt della chat; quando il provider comunica i token di input viene usato il valore esatto, altrimenti il conteggio è indicato come stima. La scheda elenca le directory assolute degli archivi KNX e degli eventi adapter e il formato giornaliero `YYYY-MM-DD.knxctx`.

Il modello riceve letture e scritture KNX, adapter telecamera, annunci TTS e memoria persistente come strumenti strutturati. Può sceglierli e combinarli semanticamente partendo dalla richiesta corrente e dalle indicazioni autorevoli apprese, senza routing per intent linguistici. Il runtime valida soltanto argomenti, disponibilità degli adapter telecamera e confini di sicurezza; le scritture KNX conservano validazione ETS/DPT locale e conferma configurata.

### Modifica e backup dell'apprendimento CHAT
La scheda **Conversazioni e casa** nella configurazione Node-RED di KNX AI include il pulsante **Apri Apprendimento AI Chat**, che apre la Web UI Vue direttamente su questo editor per il nodo corrente.

Nella UI web Vue, apri **Impostazioni → Apprendimento AI Chat** per visualizzare e modificare il file condiviso esatto `knxai-chat-context.knxctx` e il suo percorso assoluto. Il file può essere copiato, scaricato come backup o ripristinato da un altro file `.knxctx`. **Re-inizializza memoria**, protetto da una conferma esplicita, lo sostituisce con un nuovo contesto vuoto e cancella sessioni, istruzioni, sorveglianze telecamera e conferme chat pendenti in ogni nodo KNX AI che usa lo stesso archivio. I record nativi separati da tabulazioni `KNXAI_CHAT_CONTEXT 3` sono autorevoli e direttamente modificabili: `SESSION` contiene record `INSTRUCTION`, `TURN` e `CAMERA_WATCH` fino a `END_SESSION`. Il salvataggio valida e limita questi record, riscrive atomicamente il file e aggiorna il contesto attivo di ogni nodo KNX AI che usa lo stesso archivio. Un controllo di revisione impedisce di sovrascrivere o azzerare l'apprendimento cambiato dopo il caricamento nell'editor.

È supportato soltanto il formato nativo V3. I precedenti file Markdown/JSON V2 e Base64 V1 non vengono volutamente letti, importati né migrati; il vecchio file `.md` resta intatto e KNX AI avvia un nuovo contesto `.knxctx`. Restano validi i limiti di 50 sessioni e 512 KB.

### Ruoli appresi dei group address KNX
Il ruolo `neutral` indica un'incertezza iniziale, non un divieto permanente di controllo. Il modello può usare lo strumento strutturato `gaRoleActions` per imparare che un group address ETS esatto è un oggetto di comando, stato o neutro partendo dall'insegnamento autorevole dell'utente, dalle indicazioni persistenti della chat, dall'Educazione AI o da una semantica inequivocabile del progetto ETS. Non servono parole chiave né intent di ruolo; se le prove sono ambigue, il modello chiede un chiarimento invece di imparare.

Ruolo, motivazione e prova appresi vengono salvati per nodo in `<userDir>/knxai/config/knxai-config-<id-nodo>.json` e sincronizzati nella memoria semantica domestica limitata. Un ruolo appreso come `command` può rendere valida una scrittura già nella stessa risposta e resta disponibile dopo il riavvio; il modello può anche dimenticarlo e ripristinare la classificazione automatica. L'apprendimento non può inventare un GA, cambiarne il DPT ETS, aggirare la validazione del payload o saltare la conferma di scrittura configurata.

## Intelligenza domestica proattiva guidata dall'Educazione e memoria limitata
Da gerarchia ETS, nomi, ruoli e DPT, il nodo crea un modello semantico deterministico per persiane, finestre, porte, luci, temperatura, clima, presenza e allarmi usando termini italiani, inglesi, tedeschi, francesi, spagnoli e cinesi. Il rilevatore proattivo osserva soltanto stati non di comando di persiane, finestre e porte riconosciuti con sufficiente affidabilità.

Non esistono un interruttore o impostazioni proattive avanzate separate. Una condizione viene valutata soltanto quando l'LLM è attivo e **Educazione AI** richiede esplicitamente quella notifica. L'Educazione è l'unica policy per condizioni, durata dell'apertura, ore silenziose e ripetizione. L'AI riceve durata attuale, data/ora locale e storico recente delle notifiche; decide se avvisare e quando rivalutare la stessa apertura. Senza una regola esplicita nell'Educazione, o se l'LLM non riesce a valutarla, non viene inviato alcun messaggio.

L'ultima sessione chat viene ricordata come proprietario e riceve i messaggi spontanei. L'uscita 3 emette un messaggio localizzato con `msg.knxAi.type = "proactive_notification"`; un `msg.inputMessage` sintetico conserva la sessione per l'adattatore chat. Un limite rigido di tre notifiche proattive all'ora evita abusi. Il nodo non emette mai l'uscita 4 e non modifica autonomamente KNX; un'eventuale richiesta successiva passa sempre dalla normale validazione e conferma.

Il riferimento appreso condiviso viene caricato all'avvio da `<userDir>/knxai/memory/knxai-home-memory.md`, riscritto atomicamente ogni 15 minuti e sempre limitato rigidamente a 5 MB. Conserva al massimo 120 osservazioni significative, 80 abitudini aggregate, 80 notifiche e 300 oggetti ETS semantici, mai un flusso illimitato di telegrammi raw. Gli elementi vecchi e meno importanti vengono eliminati per primi. **Educazione AI** è limitata a 16.000 caratteri e proviene sempre dalla configurazione del nodo: l'AI può leggerla come istruzione autorevole, ma non può modificarla o sovrascriverla.

## Esempio pratico di configurazione
Inserisci l'intera policy di notifica in **Educazione AI** (`aiEducation`):

```text
Chiamami Massimo e rispondi nella stessa lingua che uso.
Mantieni le risposte brevi, salvo quando chiedo dettagli tecnici.
Avvisa la mia ultima chat quando una persiana, finestra o porta resta aperta per almeno 120 minuti.
Non avvisarmi tra le 23:00 e le 07:00 e non ripetere lo stesso avviso prima di sei ore.
La persiana dello studio può restare aperta durante il giorno: non avvisarmi.
Quando "luce soggiorno" è ambiguo, chiedimi quale luce intendo.
Non dire mai che un attuatore è cambiato finché un oggetto di stato KNX non lo conferma.
```

Con questa Educazione:

1. Se lo stato della persiana del soggiorno rimane aperto per 120 minuti fuori dalle ore silenziose indicate, l'uscita 3 può emettere una `proactive_notification` localizzata verso l'ultima sessione chat.
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

### Assistente AI
- **Abilita assistente LLM**: abilita funzioni Ask/chat.
- **Provider**: backend LLM (OpenAI-compatible, Anthropic, Ollama o Bionic LM Studio).
- **URL endpoint**: URL endpoint chat/completions.
- **API key**: chiave API (non necessaria con Ollama locale; opzionale per Bionic LM Studio, salvo autenticazione attiva sul server).
- **Modello**: ID/nome modello.
- **Consenti all'AI di usare il Web**: disattivato per impostazione predefinita. Permette al modello di scegliere semanticamente il tool Web generale e restituire fonti verificate e citate.
- **Consenti controlli Web proattivi**: opt-in separato per i controlli in background; richiede anche istruzioni esplicite scritte dall'utente in **Educazione AI**.
- **Intervallo minimo dei controlli proattivi**: tempo minimo tra i cicli proattivi; non ritarda le operazioni Web richieste durante un turno utente attivo.
- **Numero massimo di chiamate Web all'ora**: budget scorrevole condiviso dalle operazioni Web interattive e proattive. Ogni turno o ciclo può usare al massimo tre operazioni complessive.
- **Voce Telegram**: disponibile soltanto con il provider **OpenAI-compatible**. Riutilizza automaticamente endpoint e API key di quel provider con i default integrati `gpt-4o-mini-transcribe`, `gpt-4o-mini-tts` e `alloy`; non esistono impostazioni vocali separate.
- **Compatibilità modello chat**: il modello selezionato deve supportare l'endpoint Chat Completions configurato. I modelli legacy disponibili solo tramite completions, come `gpt-3.5-turbo-instruct`, vengono esclusi quando si aggiorna la lista. Se il provider rifiuta un valore personalizzato di temperature o il parametro del limite token, KNX AI riprova rimuovendo o sostituendo soltanto il campo incompatibile.
- **Consenti all'AI di leggere stati KNX e comandare attuatori**: abilita l'uscita 4 ed è disattivato per default. Gli oggetti esatti del catalogo ETS possono essere letti; le scritture sono accettate solo per gli oggetti classificati come `command`. Operazioni sconosciute, con DPT discordante, non valide o eccessive e scritture verso oggetti di stato/neutrali vengono rifiutate localmente.
- **Chiedi conferma prima di inviare comandi KNX**: attivo per default. Mostra prima le modifiche validate e non emette comandi KNX finché la stessa sessione chat non le conferma. Quando ci sono comandi in attesa, la risposta aggiunge sempre le istruzioni esatte per confermare o annullare nella lingua della richiesta corrente. I comandi vengono validati nuovamente subito prima dell'uscita.
- **Adattatore messaggi ingresso/uscita**: parte da **Nessun adattatore**. La selezione carica la coppia predefinita di mappature ingresso/uscita; entrambe restano nascoste nell'editor.
- **Educazione AI**: istruzioni autorevoli gestite soltanto dall'utente, lette dall'AI e mai modificate. È anche l'unico punto in cui richiedere notifiche proattive e definirne condizioni, durata, ore silenziose e ripetizione.
- Gli estratti inclusi nel pacchetto da help, README, changelog, wiki ed esempi non vengono inviati nei prompt di Telegram, RedBot o CHAT personalizzate. Restano disponibili soltanto all'Assistente web per le domande tecniche sul pacchetto.
- Pulsante **Aggiorna**: interroga il provider e popola i modelli disponibili. Durante il caricamento l'icona ruota; il completamento corretto non mostra messaggi.

### Setup rapido Ollama (locale)
- Seleziona **Provider = Ollama**.
- Endpoint predefinito: `http://localhost:11434/api/chat`.
- Se non trovi modelli locali, usa:
  - **1) Scarica il modello**: apre la pagina **Libreria modelli**.
  - **2) Installalo**: scarica e installa localmente il modello (esempio `llama3.1`).
- Durante refresh/installazione, KNX AI prova anche ad avviare automaticamente il server Ollama quando possibile.
- Se l'installazione fallisce per errore di connessione, verifica che Ollama sia avviato (app desktop o `ollama serve`).
- Il contesto massimo dichiarato da `/api/show` resta informativo. KNX AI invia come `num_ctx` il budget scelto di 4K, 8K o 16K (oppure il massimo del modello se inferiore) e limita proporzionalmente ogni fonte di contesto senza rimuovere capacità dell'agente.
- Se Node-RED gira in Docker, usa `host.docker.internal` al posto di `localhost` nell'endpoint.

### Setup rapido Bionic LM Studio (locale)
- Seleziona **Provider = Bionic LM Studio**.
- Avvia il server API di LM Studio dalla pagina **Developer** oppure con `lms server start`.
- Endpoint predefinito: `http://localhost:1234/v1/chat/completions`.
- Premi **Aggiorna** per caricare tutti i modelli esposti da `/v1/models`; se non è configurato un modello viene selezionato il primo.
- Se un modello è già caricato, KNX AI conserva la lunghezza del contesto attiva. KNX AI non carica mai un modello Bionic inattivo tramite l'API di gestione: la prima richiesta chat lascia che Bionic lo carichi JIT con i valori predefiniti salvati per il modello. Indipendentemente dal contesto dichiarato da Bionic, KNX AI usa il budget prompt scelto di 4K, 8K o 16K e mantiene disponibili ragionamento, KNX, routine, telecamere e TTS.
- La API key è opzionale, salvo autenticazione attiva nelle impostazioni del server LM Studio. In Docker sostituisci `localhost` con `host.docker.internal`.

## Nota sicurezza
Se l'LLM è abilitato, il contesto traffico KNX può essere inviato all'endpoint configurato. Per privacy on-prem, usa provider locali. Un comando emesso sull'uscita 4 ha superato la validazione locale ed è stato inoltrato al flow, ma non prova che l'attuatore lo abbia eseguito. Per la conferma usa una GA di stato KNX.
