---
layout: wiki
title: "HUE Controller"
lang: it
permalink: /wiki/it-HUE%20Controller
---
# HUE Controller

[**Tutorial video KNX-Ultimate (playlist YouTube)**](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)

<div data-hue-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 55%,#2a8dff 100%);box-shadow:0 14px 30px rgba(11,45,90,0.24);color:#f4f9ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#cfe4ff;">Hue API v2 · KNX · Node-RED</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Un nodo. Quindici funzioni Hue.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f4f9ff;">HUE Controller riunisce tutte le funzionalità consolidate dei precedenti nodi Hue dedicati in un unico nodo autonomo e manutenuto. Scegli un dispositivo o una risorsa Hue: il tipo viene rilevato automaticamente e editor, mappature KNX e pin del flow si adattano.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">15</strong><span style="font-size:0.76rem;color:#e8f3ff;">funzioni dispositivo</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">Hue API v2</strong><span style="font-size:0.76rem;color:#e8f3ff;">risorse native</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">KNX</strong><span style="font-size:0.76rem;color:#e8f3ff;">integrazione opzionale</span></div>
  </div>
</div>

## Tutto disponibile da un solo nodo

| Area | Funzioni | Funzionalità principali |
|---|---|---|
| **Luci e potenza** | Luce / gruppo luci, Presa | On/Off, dimming relativo e assoluto, bianco regolabile, RGB/HSV, effetti, profili giorno/notte, localizzazione, comando potenza e feedback bidirezionale. |
| **Scene e comandi** | Scena, Pulsante, Tap dial | Richiamo scena singola o numerata, mappature DPT 1/18, pressioni brevi/lunghe/ripetute, toggle ed eventi rotativi. |
| **Presenza e sicurezza** | Movimento, Movimento area, Movimento telecamera, Contatto | Stati di movimento e aperto/chiuso, sincronizzazione iniziale, pubblicazione KNX ed eventi flow opzionali. |
| **Ambiente** | Livello luce, Temperatura, Umidità | Valori dei sensori Hue mappati sui datapoint KNX appropriati. |
| **Salute dispositivo** | Batteria, Connettività Zigbee, Aggiornamento software | Percentuale batteria, stato della connessione e disponibilità aggiornamenti su KNX o nel flow Node-RED. |

## Un’esperienza Controller coerente

- Un unico selettore Hue con ricerca e aggiornamento: la funzione corretta viene ricavata automaticamente dalla risorsa scelta.
- Un click o il focus sul campo dispositivo apre sempre l'elenco Hue completo anche dopo una selezione; digitando, l'elenco viene filtrato.
- La selezione di un'altra risorsa Hue resta soltanto un'anteprima finché l'editor non viene salvato. Premendo `Annulla` vengono ripristinati il dispositivo, la funzione e le mappature salvati in precedenza.
- Il selettore del dispositivo Hue resta nascosto finché Hue Bridge non è selezionato, connesso e ha caricato il catalogo delle risorse. Durante l'attesa viene mostrato un indicatore di caricamento. Riportando il bridge su `none`, indicatore, selettore ed editor del dispositivo vengono nuovamente nascosti.
- Un nodo già configurato mantiene visibile ma disabilitato il selettore del dispositivo Hue salvato mentre il bridge selezionato è offline; le TAB delle mappature KNX restano disponibili. Dopo 15 secondi, l'etichetta di attesa segnala che Hue Bridge non è raggiungibile. La ricerca continua in background e, se il bridge non diventa disponibile, compare infine un errore rosso fisso.
- Selezionando `none` per il gateway KNX vengono nascoste soltanto le TAB delle mappature Luce. I campi GA, DPT e Nome restano montati e invariati, e ricompaiono immediatamente quando il gateway viene riselezionato, insieme al corretto layout verticale delle TAB.
- I valori segnaposto temporanei emessi programmaticamente da Node-RED durante l'inizializzazione dei selettori KNX e Hue non sostituiscono i gateway salvati. Soltanto la selezione esplicita di `none` nasconde le TAB delle mappature Luce.
- Le TAB delle mappature Luce contengono soltanto i controlli di configurazione; le immagini decorative Dimmer, Bianco regolabile e RGB sono state eliminate.
- Mappature luce basate sulle capacità: Dimmer, Bianco regolabile, RGB/HSV ed effetti nativi seguono le proprietà live `dimming`, `color_temperature`, `color` ed `effects` della risorsa luce Hue API v2 selezionata.
- Editor Luce non bloccante: le mappature salvate vengono mostrate subito senza attendere la cache delle risorse Hue del runtime. Le capability correnti si caricano in background; in caso di errore, mappature e selettore dei pin restano disponibili e compare un errore Node-RED rosso e fisso.
- Editor Luce resiliente: Locate e il contenitore delle mappature vengono inizializzati prima dei widget opzionali Effetti e schede. Un gateway KNX salvato sopravvive ai valori del selettore temporaneamente vuoti durante l'avvio dell'editor. Gli errori del browser e il rifiuto del primo comando Locate producono un errore Node-RED rosso e fisso con il dettaglio tecnico, invece di lasciare l'editor silenzioso.
- Righe KNX compatte mantengono GA, DPT e Nome sulla stessa linea; DPT e Nome hanno larghezze ridotte e Nome può restringersi negli editor più stretti senza alterare il valore memorizzato. I valori DPT salvati vengono conservati mentre le opzioni del selettore si caricano in modo asincrono.
- Gateway KNX opzionale: usa indirizzi di gruppo o nomi ETS importati; i datapoint compatibili arrivano dal gateway selezionato.
- Pin Node-RED dinamici per input Hue API v2 validati e output degli eventi Hue, dove supportati.
- Lettura stato all’avvio, sincronizzazione Hue→KNX e protezione dai loop conservate in ogni profilo privato.
- Migrazione interamente locale per tutti i quindici node type deprecati, seguita da una bozza email modificabile, da un pulsante facoltativo nel messaggio finale per sostenere il progetto, dal controllo locale e dal Deploy manuale.

## Primi passi in quattro mosse

1. Configura una volta il **Bridge Hue**.
2. Aggiungi **HUE Controller**, quindi scegli o aggiorna un **Dispositivo Hue**; il **Tipo dispositivo** viene compilato automaticamente.
3. Seleziona un **Gateway KNX** e mappa comandi/stati disponibili, oppure lascia `none` per l’uso esclusivo nel flow.
4. Imposta comportamento e pin specifici della funzione, fai il deploy e controlla lo stato live del nodo.

> **Nessun gateway KNX?** Il Controller continua a funzionare come integrazione Hue–Node-RED. I campi KNX vengono nascosti e restano disponibili le opzioni flow supportate dalla funzione selezionata.

Le sezioni sottostanti costituiscono il riferimento completo per funzione, consolidato dai precedenti nodi dedicati.

## Conversione dei nodi HUE legacy

Il pulsante di migrazione compare solo quando l'editor Node-RED rileva almeno un nodo HUE legacy nei flow correnti. Un link al [video esplicativo della migrazione su YouTube](https://youtu.be/f0Evf2QFI7c) appare immediatamente prima dello stesso pulsante arancione ad alto contrasto con testo bianco in HUE Controller e in ogni editor HUE legacy. Il disclaimer conferma che nessun dato del flow o dei nodi lascia il browser.

Premi **Converti nodi HUE legacy** e conferma. Il browser esegue tutta la conversione in locale e non invia da nessuna parte dati relativi a flow, nodi, `hue-config`, `knxUltimate-config`, indirizzi di gruppo, collegamenti, credenziali, nomi, posizioni o ID. Dopo la conversione apre soltanto una bozza email modificabile indirizzata all'autore senza abbandonare Node-RED. La bozza contiene soltanto il numero dei nodi convertiti e uno spazio per note facoltative; decidi tu se inviarla e non viene mai spedita automaticamente. Il messaggio finale di Node-RED propone un pulsante facoltativo per sostenere il progetto; la pagina per la donazione si apre solo premendo quel pulsante.

Prima di iniziare, esporta un backup dei tuoi flow. Il browser chiude l'editor del nodo corrente e trasforma soltanto i nodi HUE legacy individuati in istanze HUE Controller. Tutte le proprietà salvate, i riferimenti alle configurazioni, le posizioni, l'appartenenza ai gruppi e i collegamenti restano invariati. Il workspace viene segnato come modificato, ma lo strumento non esegue mai il deploy: controlla il risultato e premi personalmente **Deploy**. Un nodo cambiato, un flow bloccato o un errore di conversione locale lascia il workspace invariato. **Controllo di sicurezza:** prima del Deploy esamina ogni nodo HUE modificato e verifica funzione, riferimenti alle configurazioni, pin di ingresso/uscita e collegamenti. Al termine del processo, un messaggio fisso di Node-RED resta visibile finché non premi **OK**.

Gli eventi Hue restano aggiornamenti di stato e non diventano nuovi comandi Hue. HUE Controller contiene profili privati per runtime, editor, template e traduzioni, quindi non dipende dal caricamento dei node type deprecati. Il nodo Hue Light originale resta invariato. I nodi Hue dedicati restano registrati per i flow esistenti, ma sono congelati e non ricevono nuove funzioni o aggiornamenti di manutenzione. Node-RED nasconde dalla palette la loro categoria speciale `deprecated`; le istanze esistenti restano modificabili e distribuibili, usano un colore più chiaro di HUE Controller, sono contrassegnate con `(deprecated)` sul canvas e mostrano in alto nell'editor un avviso di migrazione.

<!-- HUE_CONTROLLER_PROFILE_DOCS_START -->

## Funzione dispositivo

- [Luce / gruppo luci (`light`)](#hue-controller-docs-light)
- [Presa / uscita (`plug`)](#hue-controller-docs-plug)
- [Pulsante (`button`)](#hue-controller-docs-button)
- [Tap dial (`relative_rotary`)](#hue-controller-docs-relative_rotary)
- [Movimento (`motion`)](#hue-controller-docs-motion)
- [Movimento area (`area_motion`)](#hue-controller-docs-area_motion)
- [Movimento telecamera (`camera_motion`)](#hue-controller-docs-camera_motion)
- [Contatto (`contact`)](#hue-controller-docs-contact)
- [Livello luce (`light_level`)](#hue-controller-docs-light_level)
- [Temperatura (`temperature`)](#hue-controller-docs-temperature)
- [Umidità (`humidity`)](#hue-controller-docs-humidity)
- [Scena (`scene`)](#hue-controller-docs-scene)
- [Batteria (`device_power`)](#hue-controller-docs-device_power)
- [Connettività Zigbee (`zigbee_connectivity`)](#hue-controller-docs-zigbee_connectivity)
- [Aggiornamento software dispositivo (`device_software_update`)](#hue-controller-docs-device_software_update)

<span id="hue-controller-docs-light" data-hue-controller-type="light"></span>

## Luce / gruppo luci (`light`)

Questo nodo controlla le luci HUE (singole o raggruppate) e mappa comandi/stati su KNX.

Senza un gateway KNX, al posto dell'intestazione duplicata “Philips HUE” compare l'avviso per l'uso tramite input del flow.

**Gruppi di luci:** quando è configurato un gateway KNX, selezionando un `grouped_light` vengono sempre mostrate tutte le mappature Switch, Dim, Tunable White, RGB/HSV, Effetti e Comportamento. L'editor non limita questi campi in base alle luci attualmente incluse nel gruppo.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
|Nome |Luce Hue o gruppo da utilizzare. Le luci e i gruppi disponibili compaiono mentre digiti|

**Localizza dispositivo**

Il pulsante `Locate` (icona play) avvia una sessione di identificazione Hue per la risorsa selezionata. Quando la sessione è attiva il pulsante mostra l'icona stop e il bridge fa lampeggiare la luce — o tutte le luci del gruppo — ogni secondo. Premi di nuovo il pulsante per interrompere subito; in caso contrario la sessione termina automaticamente dopo 10 minuti.

**Opzioni**

Qui puoi scegliere gli indirizzi KNX per essere collegati ai comandi/stati della luce Avable Hue.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) e i dispositivi disponibili compariranno mentre digiti.

**Interruttore**

| Proprietà | Descrizione |
|-|-|
|Controllo |Questo GA viene utilizzato per accendere/disattivare la luce della tonalità tramite un valore KNX booleano True/False |
|Stato |Collegalo all'indirizzo del gruppo di stato dell'interruttore della luce |

**Dim**

| Proprietà | Descrizione |
|-|-|
|Control Dim | Dim relativo della luce HUE. La velocità si imposta nella scheda **Behaviour** .|
|Controllo % |Cambia la luminosità della luce della tonalità assoluta (0-100%) |
|Stato % |Collegalo all'indirizzo del gruppo KNX di luminosità della luce |
|Dim Speed (ms) | Velocità di dimming in millisecondi. Vale per la luce e per il "tunable white”. Calcolata sul range 0%→100%.|
|Min Dim Luminosità |La luminosità minima che la lampada può raggiungere.Ad esempio, se si sta dimmulando la luce, la luce smetterà di attenuare la luminosità specificata.|
|Max Dim Brightness |La massima luminosità che la lampada può raggiungere.Ad esempio, se si sta dimmulando la luce, la luce smetterà di attenuare la luminosità specificata.|

**Tunable White**

| Proprietà | Descrizione |
|-|-|
|Control Dim | Cambia la temperatura del bianco con DPT 3.007 (velocità in **Behaviour** ). |
|Controllo % | Cambia la temperatura del bianco con DPT 5.001. 0 = caldo, 100 = freddo |
|Stato %| GA di stato temperatura (DPT 5.001). 0 = caldo, 100 = freddo |
|Controllo Kelvin | **DPT 7.600: ** imposta in Kelvin con range KNX 2000-6535 (convertito in mirek).
**DPT 9.002:** imposta in Kelvin con range HUE 2000-6535 (Ambiance da 2200). Possibili piccole variazioni per conversioni. |
|Stato Kelvin | **DPT 7.600: ** leggi in Kelvin via range KNX 2000-6535 (convertito).
**DPT 9.002:** leggi in Kelvin via range HUE 2000-6535 (Ambiance da 2200). Possibili piccole variazioni per conversioni. |
|Inverti Dim Direction |Inverte la direzione fioca.|

**RGB/HSV**

| Proprietà | Descrizione |
|-|-|
| **Sezione RGB** ||
|Controllo RGB | Cambia colore con tripla RGB (r,g,b); gestione gamut inclusa. L'invio colore accende la luce impostando colore/luminosità; con r,g,b=0 la luce si spegne |
|Stato RGB |L'indirizzo del gruppo di stato del colore della luce.DataPoint accettato è RGB Triplet (R, G, B) |
| **Sezione HSV** ||
|Color H Dim | Scorri la tonalità (HSV) con DPT 3.007; velocità in **Behaviour** |
|Stato H %|Stato del circolo cromatico HSV. |
|Control S Dim | Cambia saturazione con DPT 3.007; velocità in **Behaviour** |
|Stato S %|L'indirizzo del gruppo di stato di saturazione del colore chiaro. |
|Dim Speed ​​(MS) |La velocità di oscuramento, in millisecondi, dal basso alla scala superiore.|

Per controllare la "V” (luminosità) dell'HSV, usa i controlli standard nella scheda **Dim** .

**Effetti**

_Effetti base non HUE_

| Proprietà | Descrizione |
|-|-|
| Blink | _true_ fa lampeggiare la luce, _false_ ferma il lampeggio. Alterna acceso/spento; utile per segnalazioni. Funziona con tutte le luci HUE. |
| Color Cycle | _true_ avvia il ciclo colori, _false_ lo interrompe. Cambia casualmente il colore della luce HUE a intervalli regolari. Funziona con le luci HUE che supportano il colore. L'effetto parte dopo 10 secondi. |

_Effetti nativi HUE_

La tabella **Effetti nativi HUE** consente di associare valori KNX agli effetti supportati dalla lampada selezionata (per esempio `candle`, `fireplace`, `prism`). Ogni riga collega un valore KNX (booleano, numerico o testuale a seconda del datapoint scelto) a uno degli effetti esposti dal bridge. Dal lato KNX puoi:

- inviare il valore mappato per attivare l'effetto corrispondente;
- impostare facoltativamente un indirizzo di stato: il nodo restituisce il valore mappato quando il bridge Hue segnala un cambio di effetto; se non trova corrispondenze invia il nome grezzo dell'effetto (necessita di un DPT testuale, ad esempio 16.xxx).

**Comportamento**

|Proprietà |Descrizione |
|------------------------------------------------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Leggi lo stato all'avvio |Leggi lo stato della luce HUE all'avvio del nodo-rosso o al rosso nodo-rosso del nodo e invia quello stato al bus KNX |
|Stato di luminosità KNX |Aggiorna lo stato dell'indirizzo del gruppo di luminosità KNX, ogni volta che la lampada Hue viene accesa/disattivata.Le opzioni sono \*\* quando Hue Light è spento, inviare lo 0%.Quando accesa, ripristinare il valore precedente (comportamento KNX predefinito) \*\* e \*\* lasciano come (comportamento di tonalità predefinito) \*\*.Se si dispone di Dimmer KNX con stato di luminosità, come MDT, l'opzione suggerita è \*\*\*quando la luce della tonalità è disattivata, inviare lo 0%.Quando accesa, ripristinare il valore precedente (comportamento KNX predefinito) \*\*\* |
|Aggiorna lo stato HUE locale in cache dai write KNX |Opzione avanzata, abilitata di default. Se attiva, i write che arrivano dal bus KNX aggiornano subito anche lo stato HUE locale in cache del nodo, senza attendere feedback/eventi dal bridge Hue. Questo rende le reazioni locali piu rapide e le risposte immediate ai read KNX piu coerenti, soprattutto quando la luce o il grouped_light sono spenti. Disattivala se preferisci che la cache segua solo il feedback/evento reale del bridge Hue. |
|Accendi comportamento |Imposta il comportamento delle luci quando acceso.Puoi scegliere tra comportamenti diversi.
 \*\* Seleziona colore: \*\* La luce verrà accesa con il colore di tua scelta.Per cambiare il colore, fai clic sul selettore dei colori (sotto il controll&#x6F;_&#x53;eleziona colore_).
 \*\* Seleziona temperatura e luminosità: \*\* La luce verrà accesa con la temperatura (kelvin) e la luminosità (0-100) di tua scelta.
 \*\* Nessuna: \*\* La luce manterrà il suo ultimo stato.Nel caso in cui tu abbia abilitato l'illuminazione notturna, dopo la fine della notte, la lampada riprenderà lo stato del colore/temperatura/luminosità fissata al giorno.|
|Illuminazione notturna |Permette di impostare un particolare colore/luminosità della luce di notte.Le opzioni sono le stesse del giorno.È possibile selezionare una temperatura/luminosità o colore.Una temperatura accogliente di 2700 Kelvin, con una luminosità del 10% o 20%, è una buona scelta per la luce notturna del bagno |
|Giorno/notte |Seleziona l'indirizzo di gruppo utilizzato per impostare il comportamento giorno/notte.Il valore dell'indirizzo di gruppo è _true_ se giorno, _false_ se notturno.|
|Valore giorno/notte invertito |Inverti i valori dell'indirizzo di gruppo _day/night_.Il valore predefinito è \*\* non controllato **.|
|Leggi lo stato all'avvio |Leggi lo stato all'avvio ed emetti l'evento al bus KNX all'avvio/riconnessione.(Predefinito "no") |
|Forza modalità diurna |È possibile forzare la modalità diurna cambiando manualmente la luce come descritto qui: \*\* Passa alla modalità Day spostando rapidamente il Ligth OFF e poi solo questa luce) \*\* fa ciò che ha descritto e agisce solo su questa luce.** Passa alla modalità Day mediante rapido spegnimento del LIGTH OFF e quindi (applica tutti i nodi leggeri) \*\* agisce a tutti i nodi leggeri, impostando l'indirizzo del gruppo Day/Night in modalità Day.|
|Pin di input/output del nodo |Nascondi o mostra i pin di input/output.I pin di input/output consentono al nodo di accettare l'ingresso MSG dal flusso e inviare l'uscita MSG al flusso.L'MSG di input deve seguire gli standard API V.2 HUE.Questo è un esempio di MSG, che accende la luce: <code> msg.on = {"on": true} </code>.Fare riferimento alla \[pagina API HUE ufficiale](§url0§) |

##### Nota

La funzione Dimming funziona in modalità \*\* KNX `start` e` stop` \*\*.Per iniziare a Dimming, invia solo un telegramma KNX "Start".Per smettere di oscurarsi, invia un telegramma KNX "Stop".Per favore \*\* ricorda che \*\*, quando imposti le proprietà del tuo muro.

---

<span id="hue-controller-docs-plug" data-hue-controller-type="plug"></span>

## Presa / uscita (`plug`)

### Presa / Plug Hue

#### Panoramica

Il nodo Hue Plug collega una presa intelligente Philips Hue alle indirizzazioni KNX:

- comandi on/off dal BUS
- feedback dello stato dalla piattaforma Hue
- gestione opzionale del parametro `power_state`

#### Configurazione

|Campo|Descrizione|
|--|--|
| Gateway KNX | Gateway KNX utilizzato |
| Hue Bridge | Hue Bridge configurata |
| Nome | Seleziona la presa Hue (autocomplete) |
| Comando | GA KNX per l'invio dell'on/off (DPT booleano) |
| Stato | GA optional per ricevere lo stato on/off dal bridge |
| Power state | GA optional che replica il campo `power_state` (on/standby) |
| Leggi stato all'avvio | Se abilitato, all'avvio il nodo invia lo stato corrente |
| Pin di I/O | Abilita i pin Node-RED per inviare payload Hue custom o ricevere gli eventi sul flow |

#### Suggerimenti KNX

- Usa un DPT 1.xxx per comando e stato.
- Il `power_state` può essere mappato a un GA booleano (true = on, false = standby) oppure a un DPT testuale.
- In risposta a una lettura KNX (`GroupValue_Read`) il nodo restituisce l'ultimo valore memorizzato.

#### Integrazione con i flow

Con i pin abilitati:

- **Input** : invia payload Hue v2 (es. `{ on: { on: true } }`).
- **Output** : ricevi `{ payload, on, power_state, rawEvent }` a ogni evento Hue.

#### API Hue

Le richieste utilizzano l'endpoint `/resource/plug/{id}`. Le notifiche arrivano dallo stream eventi e sono utilizzate per aggiornare lo stato KNX.

---

<span id="hue-controller-docs-button" data-hue-controller-type="button"></span>

## Pulsante (`button`)

Il nodo Hue Button inoltra gli eventi del pulsante Hue verso KNX e verso l'uscita del flow utilizzando il campo Hue <code>button.button_report.event</code>.

Nel campo GA (nome o indirizzo di gruppo) inizia a digitare per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Pulsante Hue | Pulsante Hue da usare (autocompletamento) |

**Interruttore**

|Proprietà|Descrizione|
|--|--|
| Interruttore | GA attivata dall'evento <code>short\_release</code> (pressione rapida). |
| GA stato | GA opzionale quando <em>Alterna valori</em> è attivo; mantiene allineato lo stato interno con altri attuatori. |

**Dimmer**

|Proprietà|Descrizione|
|--|--|
| Dim | GA utilizzata durante gli eventi <code>long\_press</code>/<code>repeat</code> per il dimming (tipicamente DPT 3.007). |

**Comportamento**

|Proprietà|Descrizione|
|--|--|
| Alterna valori | Se attivo, il nodo alterna automaticamente tra <code>true/false</code> e direzioni di dimmer. |
| Payload interruttore | Payload inviato a KNX/flow quando Alterna valori è disattivato. |
| Payload dimmer | Direzione inviata a KNX/flow quando Alterna valori è disattivato. |

##### Output

1. Uscita standard
   : `msg.payload` contiene il valore booleano (o l'oggetto di dimmer) inviato a KNX; `msg.event` è la stringa dell'evento Hue (es. `short_release`, `repeat`).

##### Dettagli

`msg.event` replica `button.button_report.event`. L'evento originale di Hue è disponibile in `msg.rawEvent`. Usa la GA di stato opzionale per mantenere il toggle interno allineato con interruttori o attuatori esterni.

---

<span id="hue-controller-docs-relative_rotary" data-hue-controller-type="relative_rotary"></span>

## Tap dial (`relative_rotary`)

Il nodo **Hue Tap Dial** collega il servizio di rotazione del Tap Dial alle GA KNX e inoltra l'evento Hue originale al flow. Dopo aver associato un nuovo Tap Dial, premi l'icona di aggiornamento accanto al campo dispositivo.

##### Schede

- **Mappatura** - scegli GA KNX e DPT per gli eventi di rotazione. Sono supportati DPT 3.007 (dim relativo), DPT 5.001 (livello 0-100 %) e DPT 232.600 (controllo colore vendor).
- **Comportamento** - mostra/nasconde il pin di output del nodo. Se non è configurato un gateway KNX il pin resta attivo così gli eventi Hue raggiungono comunque il flow.

##### Impostazioni generali

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX usato per l'autocompletamento delle GA. |
| Hue Bridge | Hue Bridge che espone il Tap Dial. |
| Hue Tap Dial | Dispositivo rotativo (autocomplete; il pulsante di refresh ricarica l'elenco). |

##### Scheda Mappatura

| Proprietà | Descrizione |
|--|--|
| GA rotazione | GA KNX che riceve gli eventi di rotazione (supporta DPT 3.007, 5.001, 232.600). |
| Nome | Etichetta descrittiva della GA. |

##### Output

|#|Porta|Payload|
|--|--|--|
|1|Uscita standard|`msg.payload` (oggetto) Evento Hue grezzo generato dal Tap Dial.|

> ℹ️ I controlli legati a KNX compaiono solo dopo la selezione del gateway; la scheda Mappatura resta nascosta finché non sono configurati sia bridge sia gateway.

---

<span id="hue-controller-docs-motion" data-hue-controller-type="motion"></span>

## Movimento (`motion`)

Questo nodo riceve gli eventi da un sensore di movimento Hue e li inoltra a KNX e al flow Node-RED.

Nel campo GA digita nome o indirizzo di gruppo KNX: i suggerimenti appaiono durante la digitazione. Il pulsante di refresh accanto a "Sensore Hue” consente di ricaricare la lista dal Bridge Hue.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Gateway KNX che riceve le segnalazioni di movimento (necessario per visualizzare le opzioni KNX) |
|Hue Bridge |Hue Bridge da interrogare |
| Sensore movimento Hue | Sensore di movimento Hue (supporta autocompletamento e refresh) |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Movimento | GA KNX che riceve `true` quando viene rilevato movimento e `false` quando termina (DPT consigliato: <b>1.001</b>) |

**Comportamento**

| Proprietà | Descrizione |
|--|--|
| Pin di uscita del nodo | Mostra o nasconde l'uscita Node-RED; senza gateway KNX il pin resta attivo così gli eventi Hue raggiungono comunque il flow |

> ℹ️ Le sezioni KNX compaiono solo dopo aver scelto un gateway KNX, così puoi usare il nodo anche come semplice listener Hue → Node-RED.

##### Output

1. Uscita standard — `msg.payload` (boolean)
   : `true` quando viene rilevato movimento, `false` quando termina.

---

<span id="hue-controller-docs-area_motion" data-hue-controller-type="area_motion"></span>

## Movimento area (`area_motion`)

Il nodo Hue Motion Area riceve gli eventi di movimento aggregati di un'area MotionAware (Hue Bridge Pro) e li inoltra a KNX o al flow Node-RED.

Nel campo GA digita nome o indirizzo di gruppo KNX per collegare l'indirizzo: i suggerimenti appaiono durante la digitazione.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX che riceve lo stato di movimento dell'area. |
| Hue Bridge | Bridge Hue Pro da utilizzare. |
| Area movimento Hue (MotionAware) | Area MotionAware (convenience o security) da monitorare (autocomplete durante la digitazione). |
| Leggi stato all'avvio | All'avvio o alla riconnessione legge il valore corrente e lo invia a KNX (predefinito: sì). |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Movimento | GA KNX per lo stato di movimento dell'area (boolean). DPT consigliato: <b>1.001</b>. |

**Comportamento**

| Proprietà | Descrizione |
|--|--|
| Pin di uscita del nodo | Mostra o nasconde l'uscita Node-RED; senza gateway KNX il pin resta attivo così gli eventi MotionAware raggiungono comunque il flow. |

##### Output

1. Uscita standard
   : `msg.payload` (boolean): `true` quando l'area risulta in movimento, `false` quando è libera.

##### Dettagli

`msg.payload` contiene lo stato di movimento aggregato fornito dal servizio MotionAware per l'area selezionata.

---

<span id="hue-controller-docs-camera_motion" data-hue-controller-type="camera_motion"></span>

## Movimento telecamera (`camera_motion`)

Il nodo Hue Camera Motion ascolta il servizio di motion delle camere Philips Hue e replica in KNX lo stato rilevato/non rilevato.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Motion camera HUE | Sensore motion della camera Hue (autocompletamento durante la digitazione) |
| Leggi lo stato all'avvio | All'avvio/riconnessione legge il valore corrente e lo invia a KNX (predefinito: no) |

**Associazione**

|Proprietà|Descrizione|
|--|--|
| Movimento | GA KNX per il movimento (booleano). DPT consigliato: <b>1.001</b> |

##### Uscite

1. Uscita standard
   : `msg.payload` (boolean): `true` quando viene rilevato movimento, altrimenti `false`

##### Dettagli

`msg.payload` contiene l'ultimo stato di movimento fornito dal servizio camera di Hue.

---

<span id="hue-controller-docs-contact" data-hue-controller-type="contact"></span>

## Contatto (`contact`)

Questo nodo inoltra gli eventi di un sensore di contatto HUE mappandoli su indirizzi di gruppo KNX.

Inizia a digitare nel campo GA, il nome o l'indirizzo di gruppo del dispositivo KNX, i dispositivi disponibili iniziano a mostrare mentre si digita.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
| Sensore contatto Hue | Sensore di contatto HUE da usare (autocompletamento) |

|Proprietà |Descrizione |
|-------- |-------------------------------------------------------------------------------------------------------------------------------------- |
| Contatto | All'apertura/chiusura, invia su KNX: _true_ se attivo/aperto, altrimenti _false_. |

##### Output

1. Output standard
   : payload (booleano): l'output standard del comando.

##### Dettagli

`msg.payload` contiene l'evento HUE (boolean/oggetto) per eventuale logica personalizzata.

---

<span id="hue-controller-docs-light_level" data-hue-controller-type="light_level"></span>

## Livello luce (`light_level`)

Questo nodo legge gli eventi (lux) da un sensore di luce HUE e li espone su KNX.

Emette l'illuminamento ambientale (lux) a ogni variazione. Nel campo GA digita nome o indirizzo di gruppo per collegare la GA KNX (autocompletamento).

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
| Sensore luce Hue | Sensore di luce HUE da usare (autocompletamento) |
|Leggi lo stato all'avvio |Leggi lo stato all'avvio ed emetti l'evento al bus KNX all'avvio/riconnessione.(Predefinito "no") |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Lux | GA KNX che riceve il valore in lux |

##### Output

1. Uscita standard
   : payload (number): valore corrente in lux

##### Dettagli

`msg.payload` contiene il valore numerico in lux.

---

<span id="hue-controller-docs-temperature" data-hue-controller-type="temperature"></span>

## Temperatura (`temperature`)

Questo nodo legge la temperatura (°C) da un sensore HUE e la mappa su KNX.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Sensore temperatura Hue | Sensore di temperatura HUE (autocompletamento) |
| Leggi lo stato all'avvio | All'avvio/riconnessione, leggi il valore corrente e invialo su KNX (predefinito: no) |

**Mapping**

| Proprietà | Descrizione |
|--|--|
| Temp | GA KNX per la temperatura in °C. DPT consigliato: <b>9.001</b> |

##### Output

1. Uscita standard
   : `msg.payload` (number): temperatura corrente in °C

##### Dettagli

`msg.payload` contiene il valore numerico della temperatura.

---

<span id="hue-controller-docs-humidity" data-hue-controller-type="humidity"></span>

## Umidità (`humidity`)

Questo nodo legge l'umidità relativa (%) da un sensore HUE e la invia verso KNX.

Inizia a digitare nel campo GA (nome o indirizzo di gruppo) per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Hue Bridge | Seleziona la Hue Bridge da utilizzare |
| Sensore HUE | Sensore di umidità HUE (autocompletamento durante la digitazione) |
| Leggi lo stato all'avvio | All'avvio/riconnessione legge il valore corrente e lo invia a KNX (predefinito: no) |

**Associazione**

|Proprietà|Descrizione|
|--|--|
| Umidità | GA KNX per l'umidità relativa %. DPT consigliato: <b>9.007</b> |

##### Uscite

1. Uscita standard
   : `msg.payload` (numero): valore corrente di umidità relativa in %

##### Dettagli

`msg.payload` contiene il valore numerico dell'umidità (percentuale).

---

<span id="hue-controller-docs-scene" data-hue-controller-type="scene"></span>

## Scena (`scene`)

Il nodo **Hue Scene** pubblica le scene Hue su KNX e può inoltrare gli eventi grezzi al flow di Node-RED. Il campo scena supporta l'autocompletamento; dopo aver creato nuove scene sulla bridge premi l'icona di aggiornamento per ricaricare l'elenco.

##### Schede disponibili

- **Mappatura** - collega gli indirizzi di gruppo KNX alla scena selezionata. I DPT 1.xxx eseguono un richiamo booleano, mentre i DPT 18.xxx inviano un numero scena KNX.
- **Multi scena** - crea un elenco di regole che associano numeri scena KNX a scene Hue e definiscono se richiamarle come _active_, _dynamic\_palette_ o _static_.
- **Comportamento** - mostra/nasconde il pin di output del nodo. Senza un gateway KNX configurato il pin rimane comunque attivo, così gli eventi Hue raggiungono il flow.

##### Impostazioni generali

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX che fornisce il catalogo delle GA per l'autocomplete. |
| Hue Bridge | Hue Bridge che ospita le scene. |
| Scena HUE | Scena da richiamare (autocomplete; il pulsante di refresh ricarica il catalogo). |

##### Scheda Mappatura

| Proprietà | Descrizione |
|--|--|
| Richiama | Indirizzo KNX che richiama la scena. Usa DPT 1.xxx per un comando booleano o DPT 18.xxx per inviare un numero scena. |
| DPT | Datapoint usato per il richiamo (1.xxx oppure 18.001). |
| Nome | Etichetta descrittiva per la GA di richiamo. |
| # | Appare quando è selezionato un DPT scena KNX; scegli il numero scena da inviare. |
| GA stato | GA opzionale che indica se la scena è attualmente attiva (booleano). |

##### Scheda Multi scena

| Proprietà | Descrizione |
|--|--|
| Richiama | GA KNX (DPT 18.001) che consente di selezionare le scene tramite numero. |
| Selettore scena | Lista modificabile che abbina numeri scena KNX a scene Hue e imposta la modalità di richiamo. Trascina le "grip” per riordinare. |

> ℹ️ Gli elementi KNX vengono mostrati solo dopo aver selezionato un gateway KNX. Le schede di mappatura restano nascoste finché non sono configurati sia bridge sia gateway.

---

<span id="hue-controller-docs-device_power" data-hue-controller-type="device_power"></span>

## Batteria (`device_power`)

Questo nodo espone su KNX il livello batteria di un dispositivo Hue ed emette un evento ogni volta che il valore cambia.

Nel campo GA digita nome o indirizzo di gruppo KNX: i risultati compaiono durante la digitazione. Usa il pulsante di aggiornamento accanto a "Sensore Hue” per ricaricare l'elenco dal Bridge Hue dopo aver aggiunto nuovi dispositivi.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX su cui pubblicare il livello batteria (necessario per visualizzare le opzioni KNX). |
| Hue Bridge | Hue Bridge da utilizzare. |
| Sensore batteria Hue | Dispositivo/sensore Hue che fornisce il livello batteria (supporta autocompletamento e refresh). |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Livello | GA KNX per la percentuale batteria (0-100%). DPT consigliato: <b>5.001</b>. |

**Comportamento**

| Proprietà | Descrizione |
|--|--|
| Leggi stato all'avvio | All'avvio/riconnessione legge il valore corrente e lo invia su KNX. Default: "sì”. |
| Pin di uscita del nodo | Mostra o nasconde l'uscita Node-RED. Se non selezioni alcun gateway KNX, il pin resta attivo così gli eventi Hue raggiungono comunque il flow. |

> ℹ️ Le sezioni KNX vengono visualizzate solo dopo aver scelto un gateway KNX, evitando modifiche accidentali quando il nodo è usato solo verso Node-RED.

---

<span id="hue-controller-docs-zigbee_connectivity" data-hue-controller-type="zigbee_connectivity"></span>

## Connettività Zigbee (`zigbee_connectivity`)

Questo nodo legge la connettività Zigbee da un dispositivo HUE ed espone lo stato su KNX.

Inizia a digitare il nome o l'indirizzo di gruppo nel campo GA: l'autocompletamento mostra i dispositivi disponibili.

**Generale**

| Proprietà | Descrizione |
|--|--|
| Gateway KNX | Gateway KNX su cui pubblicare lo stato. |
| Hue Bridge | Hue Bridge da interrogare. |
| Connettività Zigbee Hue | Sensore/dispositivo HUE che fornisce la connettività Zigbee (autocompletamento durante la digitazione). |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Stato | Indirizzo di gruppo KNX che riflette la connettività Zigbee. Diventa _true_ se connesso, altrimenti _false_. |
| Leggi stato all'avvio | Legge lo stato all'avvio/riconnessione ed emette su KNX. Default: "Sì”. |

##### Output

1. Uscita standard
   : payload (boolean): stato di connettività.

##### Dettagli

`msg.payload` contiene true/false.\
`msg.status` contiene il testo: **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .

---

<span id="hue-controller-docs-device_software_update" data-hue-controller-type="device_software_update"></span>

## Aggiornamento software dispositivo (`device_software_update`)

Questo nodo monitora se un dispositivo HUE ha un aggiornamento software disponibile e pubblica lo stato su KNX.

Inizia a digitare il nome o l'indirizzo di gruppo del dispositivo KNX nel campo GA, i dispositivi disponibili iniziano a mostrare mentre
stai digitando.

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway KNX |Seleziona il gateway KNX da utilizzare |
|Hue Bridge |Seleziona la Hue Bridge da utilizzare |
| Dispositivo Hue | Dispositivo HUE da monitorare (autocompletamento) |

**Mappatura**

| Proprietà | Descrizione |
|--|--|
| Stato | GA KNX che riflette lo stato: _true_ se update disponibile/pronto/in installazione, altrimenti _false_. |
| Leggi stato all'avvio | Leggi all'avvio/riconnessione ed emetti su KNX (default "Sì”). |

##### Output

1. Uscita standard
   : payload (boolean): flag aggiornamento.
   : status (string): **no\_update, update\_pending, ready\_to\_install, installing** .

<!-- HUE_CONTROLLER_PROFILE_DOCS_END -->
