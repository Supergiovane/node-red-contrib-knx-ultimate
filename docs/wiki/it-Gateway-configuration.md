---
layout: wiki
title: "Gateway-configuration"
lang: it
permalink: /wiki/it-Gateway-configuration
---
# Configurazione del KNX Gateway

Questo nodo si connette al tuo KNX/IP Gateway.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Nome | Nome del nodo. |
| Gateway | Inserisci l'indirizzo IP/hostname del gateway KNX oppure il percorso seriale (es. `/dev/ttyUSB0`). Puoi anche scegliere un gateway rilevato dall'elenco: se selezioni una porta seriale FT1.2 il protocollo viene impostato su Serial FT1.2 e i parametri UART predefiniti vengono compilati automaticamente. |

**Configurazione**

|Proprietà|Descrizione|
|--|--|
| Porta gateway | Porta di connessione. Default: `3671`. Non utilizzata in modalità Serial FT1.2. |
| Protocollo di connessione | `Tunnel UDP` per interfacce KNX/IP, `Multicast UDP` per router KNX/IP, `Serial FT1.2` per interfacce TP/FT1.2 (selezionato automaticamente quando scegli una porta seriale). Lascia **Auto** per rilevare il protocollo più adatto. |
| Modalità Serial FT1.2 | Definisce come inizializzare l'interfaccia Serial FT1.2: **KBerry/BAOS** abilita la sequenza specifica per moduli Weinzierl KBerry/BAOS (reset, modalità Link Layer/BAOS, nessun filtro GA), mentre **Standard FT1.2** usa un adattatore FT1.2 generico senza passi specifici per KBerry. Il default è KBerry/BAOS. |
| Indirizzo fisico KNX | Indirizzo fisico KNX, es. `1.1.200`. Default: `15.15.22`. |
| Utilizza l'interfaccia locale | Interfaccia di rete locale usata dal nodo. Lascia "Auto" per selezione automatica. Se hai più interfacce (Ethernet/Wi-Fi), è consigliato impostarla manualmente per evitare perdita di telegrammi UDP. Default: "Auto". |
| Connetti al BUS KNX automaticamente all'avvio | Connessione automatica al BUS all'avvio. Default: "Yes". |
| Origine credenziali KNX Secure | Scegli come fornire i dati KNX Secure: **File keyring ETS** (le chiavi Data Secure e, se presenti, le credenziali di tunnelling arrivano dal keyring), **Credenziali manuali** (solo KNX IP Tunnelling Secure con utente inserito a mano) oppure **File keyring + password tunnel manuale** (chiavi Data Secure dal keyring, utente/password del tunnel impostati manualmente). Ricorda: i telegrammi KNX Data Secure richiedono sempre un file keyring. |
| Indirizzo individuale interfaccia tunnel | Visibile quando la modalità selezionata prevede credenziali manuali (Credenziali manuali o File keyring + password tunnel manuale). Indirizzo individuale opzionale dell'interfaccia tunnel sicura (es. `1.1.1`); lascia vuoto per negoziazione automatica da parte di KNX Ultimate. |
| ID utente tunnel | Visibile quando sono attive credenziali manuali. ID opzionale dell'utente tunnel KNX Secure definito in ETS. |
| Password utente tunnel | Visibile quando sono attive credenziali manuali. Password dell'utente tunnel KNX Secure configurata in ETS. |

> **Nota su KNX Secure** \
> • _KNX Data Secure_ protegge i telegrammi sugli indirizzi di gruppo e richiede sempre un file keyring con le chiavi di gruppo.\
> • _KNX IP Tunnelling Secure_ protegge l'handshake della connessione tramite una password di commissioning, che può essere letta dal keyring oppure inserita manualmente in base alla modalità scelta.\
> • KNX/IP Secure (handshake del tunnel) si applica solo ai trasporti IP (Tunnel TCP / routing sicuro). KNX Data Secure protegge i telegrammi sugli indirizzi di gruppo e può essere usato sia su IP (tunnelling/routing) sia su TP via Serial FT1.2 quando è presente un file keyring ETS.

**Avanzate**

|Proprietà|Descrizione|
|--|--|
| Echo sent message to all node with same Group Address | Inoltra ai nodi con lo stesso GA i msg inviati dal flow, come se provenissero dal BUS. Utile in emulazione KNX o senza connessione al BUS. **Opzione in deprecazione e presto abilitata di default.** Default: abilitato. |
| Suppress repeated (R-Flag) telegrams fom BUS | Ignora i telegrammi ripetuti (flag R) dal BUS. Default: disabilitato. |
| Suppress ACK request in tunneling mode | Per vecchie interfacce KNX/IP: ignora l'ACK e accetta tutti i telegrammi. Default: disabilitato. |
| Delay between each telegram (ms) | Lo standard KNX prevede max 50 telegrammi/s. Un intervallo 25-50ms è adeguato. Con gateway remoto su link lento aumenta (es. 200-500ms). |
| Loglevel | Livello di log per il debug. Default: "Error". |
| Limitazione aggiornamento stato nodi | Imposta ogni quanto aggiornare il badge di stato dei nodi. Con un ritardo attivo gli stati intermedi vengono ignorati e viene mostrato solo l'ultimo dopo l'intervallo scelto. Seleziona **Immediato** per mantenere l'aggiornamento in tempo reale. |
| Formato data/ora nello stato | Scegli come visualizzare la data/ora nel badge di stato dei nodi (utile su sistemi in cui non è possibile configurare il locale, ad es. Home Assistant OS). |
| Formato personalizzato | Usato quando selezioni **Personalizzato (token)**. Token: `YYYY`, `YY`, `MMM`, `MM`, `DD`, `HH`, `mm`, `ss`, `A`, `a`, `Z`. Usa `[testo]` per testo letterale. |
| Locale (override) | Locale opzionale (BCP47), es. `it-IT` o `en-GB`. Usato per i nomi dei mesi (`MMM`) quando è attivo il formato personalizzato. |

**Import file ETS**

|Proprietà|Descrizione|
|--|--|
| If Group Address has no Datapoint | Se un GA non ha datapoint: interrompi import, salta il GA o aggiungi un datapoint fittizio `1.001` e continua. |
| ETS group address list | Incolla qui il contenuto del file ETS (CSV o ESF) oppure indica un percorso file (es. `/home/pi/mycsv.csv`). Consulta i link di help per i dettagli. |

**Utility**

|Proprietà|Descrizione|
|--|--|
| Gather debug info for troubleshoot | Clicca il pulsante e allega l'output alla issue su GitHub: aiuta molto l'analisi. |
| Get all used GA for KNX routing filter | Clicca READ per ottenere l'elenco di tutti i GA usati nei flow associati a questo gateway, utile per popolare la tabella filtri del tuo KNX/IP Router. |
| Cancella cache GA persistente | Elimina il file di cache persistente delle GA per questo gateway (usato per initial read / valori in cache). Usalo solo se devi resettare valori obsoleti/errati. |

# Lavorare con i file ETS CSV o ESF

Invece di creare un nodo per ogni GA da controllare, puoi importare il file ETS di indirizzi di gruppo in formato CSV (consigliato) o ESF (da v1.1.35, utile con ETS Inside). ETS supportata: v4+.

Da v1.4.18 puoi anche indicare direttamente il percorso al file nel campo (es.: `/home/pi/mycsv.csv`).

Con **Universal mode (listen to all Group Addresses)** il nodo diventa I/O universale, consapevole di Datapoint, GA e nomi dispositivi. Invia un `payload` al nodo e lui codifica col DPT corretto; viceversa, decodifica i telegrammi in arrivo usando il DPT dell'ETS.

Da v1.1.11 puoi usare la modalità universale anche senza file ETS: invia al nodo un messaggio con tipo DPT e valore. Alla ricezione da BUS, il nodo emette anche il RAW e prova a decodificare senza DPT.

Nota: il file CSV contiene DPT precisi con sottotipo; l'ESF è più semplice e non include il sottotipo. Se puoi, preferisci il CSV: l'ESF può generare valori errati; controlla e correggi eventuali DPT dopo l'import. Da v1.4.1 è possibile importare anche a runtime via msg (nodo WatchDog).

Video: <a href="https://youtu.be/egRbR_KwP9I"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png'></a>

- **Import ETS CSV Group Addresses** ATTENZIONE: nel nome del GA non devono esserci caratteri di tabulazione. **If Group Address has no Datapoint** > Se in ETS un GA non ha DPT, puoi: interrompere l'import, saltare il GA, oppure aggiungere il GA con DPT fittizio e continuare. **Come esportare l'elenco GA in formato CSV da ETS**

> In ETS seleziona l'elenco GA, click destro → Esporta indirizzi di gruppo. Nella finestra di export imposta:

> Output Format: CSV

> CSV Format: 1/1 Name/Address

> Export with header line: spuntato

> CSV Separator: Tabulator

> Poi incolla qui il contenuto del file.

> Il file deve contenere i Datapoint per ogni GA. Il nodo analizza il file e mostra risultati nel DEBUG di Node-RED.

> Esiti possibili: **ERROR** (manca DPT → import interrotto) e **WARNING** (manca sottotipo → aggiunto default, ma va verificato). Il sottotipo è il numero dopo il punto, es. `5.001`.

> I campi devono essere racchiusi tra virgolette `"`.

**Come esportare l'elenco GA in formato ESF da ETS**

> In ETS seleziona il progetto, icona export (freccia in su), scegli formato ESF (non `.knxprod`). Copia e incolla nel campo "ETS group address list" del gateway.

    <table style="font-size:12px">
        <tr><th colspan="2" style="font-size:14px">Significato colori stato nodo</th></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"></td><td>Reagisci a telegrammi di scrittura</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"></td><td>Protezione da riferimenti circolari (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target="_blank">vedi pagina</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"></td><td>Reagisci a telegrammi di risposta</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"></td><td>Invio automatico del valore del nodo come risposta al BUS (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target="_blank">Virtual Device</a>)</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"></td><td>Reagisci a telegrammi di lettura</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"></td><td>Filtro RBE: nessun telegramma è stato inviato</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"></td><td>Errore o disconnesso</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"></td><td>Nodo DISABILITATO per riferimento circolare (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target="_blank">vedi pagina</a>)</td></tr>
    </table>
