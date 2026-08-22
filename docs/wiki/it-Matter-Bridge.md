---
layout: wiki
title: "Matter-Bridge"
lang: it
permalink: /wiki/it-Matter-Bridge
---
# Expose KNX to Matter

Il nodo usa lo sfondo ufficiale Matter **Day** (`#F3FFFF`) con l'iconografia **Night** (`#131926`).

<div data-matter-bridge-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#073b3a 0%,#087f78 54%,#21b8a6 100%);box-shadow:0 14px 30px rgba(7,59,58,0.25);color:#f2fffd;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#c9fff7;">Matter Bridge · Dispositivi KNX · Assistenti vocali</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Porta KNX nell’ecosistema Matter.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f2fffd;">Ogni nodo trasforma una funzione KNX o alimentata dal flow in un endpoint Matter nativo per Alexa, Google Home, Apple Home e altri controller. Abbina il bridge una volta, poi amplialo un dispositivo alla volta.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">17</strong><span style="font-size:0.76rem;color:#ddfffa;">profili dispositivo Matter</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Abbina una volta</strong><span style="font-size:0.76rem;color:#ddfffa;">un solo QR del bridge</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Endpoint live</strong><span style="font-size:0.76rem;color:#ddfffa;">nessun riavvio ordinario</span></div>
  </div>
</div>

## Diciassette profili, un solo bridge

| Area | Profili Matter |
|---|---|
| **Luci e potenza** | Luce On/Off, presa, luce dimmerabile, RGB e bianco dinamico. |
| **Clima e ambiente** | Temperatura, umidità, luminosità, qualità aria, termostato e ventola. |
| **Presenza e sicurezza** | Presenza, contatto, fumo/CO e rilevamento allagamento. |
| **Movimento e automazione** | Tapparella/tenda e robot aspirapolvere pilotato dal flow. |

## Primi passi in quattro mosse

1. Configura e fai il deploy di un nodo di configurazione **Matter Bridge**.
2. Aggiungi un nodo **Expose KNX to Matter** per ogni dispositivo o funzione virtuale.
3. Scegli profilo, nome e indirizzi di gruppo KNX, oppure abilita i PIN solo-flow.
4. Abbina il QR del bridge al controller Matter desiderato; gli endpoint successivi vengono riconciliati live.

> Cambiare profilo dopo l’abbinamento modifica la struttura dell’endpoint Matter e può richiedere un nuovo abbinamento o un nuovo dispositivo esposto.

## Panoramica tecnica

Ogni nodo Expose KNX to Matter espone **un dispositivo KNX come dispositivo Matter**: i controller abbinati (Alexa, Google Home, Apple Home...) lo vedono, con il nome che hai scelto, pronto per il controllo da app e vocale. Puntalo a un nodo di configurazione **Bridge Matter** (il bridge vero e proprio, abbinato una sola volta - il QR di abbinamento vive lì) e aggiungi quanti nodi device vuoi, ovunque nei tuoi flow.

È la direzione opposta del nodo *Matter Device*: lì KNX controlla un dispositivo Matter, qui i controller Matter controllano KNX.

Cambiare il tipo dispositivo dopo l'abbinamento del bridge modifica la struttura dell'endpoint Matter. I controller possono conservare il vecchio endpoint come irraggiungibile; in tal caso resetta/riabbina il bridge oppure crea un nuovo dispositivo esposto.

## Configurazione

|Campo|Descrizione|
|--|--|
| Bridge Matter | Il nodo di configurazione Bridge Matter a cui appartiene questo dispositivo |
| GW KNX | Gateway KNX usato per i telegrammi. **Opzionale**: senza, il dispositivo funziona in modalità solo-flow tramite i PIN del nodo. Selezionato automaticamente se il progetto ha un solo gateway |
| Nome | Quello che Alexa & Co. mostrano e usano per i comandi vocali |
| Tipo dispositivo | Il tipo di dispositivo Matter (vedi sotto); determina quali campi indirizzo di gruppo compaiono |
| Leggi lo stato all'avvio | Invia una `GroupValue_Read` ai GA di stato all'avvio, per popolare gli attributi Matter |

## Tipi di dispositivo e indirizzi di gruppo

|Tipo|Indirizzi di gruppo|
|--|--|
| Luce On/Off, Presa | GA comando On/Off, GA stato On/Off (DPT 1.001) |
| Luce dimmerabile | + GA comando/stato dimmer % (DPT 5.001) |
| Luce RGB (colore) | + GA comando/stato colore RGB (DPT 232.600). Il colore Matter (hue/saturation o XY, dalla ruota colore dell'app) viene convertito da/verso la terna RGB KNX |
| Luce bianco dinamico | + GA comando/stato temperatura colore in Kelvin (DPT 7.600) |
| Tapparella / Tenda | Su/Giù (DPT 1.008), Stop (DPT 1.017), posizione % comando/stato (DPT 5.001), inversione posizione opzionale |
| Termostato (riscaldamento) | GA temperatura attuale, GA comando/stato setpoint (DPT 9.001) |
| Ventola / VMC | GA comando/stato velocità % (DPT 5.001) |
| Sensori (temperatura, umidità, luminosità, presenza, contatto) | Un GA di stato ciascuno |
| Rilevatore fumo/CO | GA stato allarme fumo + GA stato allarme CO opzionale (DPT 1.005): notifiche critiche sul telefono |
| Rilevatore allagamento | GA stato allagamento (DPT 1.005) |
| Sensore qualità aria (CO2) | GA stato CO2 in ppm (DPT 9.008); la classe qualità aria (buona/discreta/moderata/scarsa...) è derivata automaticamente |
| Robot aspirapolvere | **Solo-flow**: nessun indirizzo di gruppo. Abilita i PIN del nodo: i comandi dell'assistente ("avvia pulizia", pausa/riprendi/torna alla base) arrivano sull'output come `rvcmode`/`rvccommand`; riporta lo stato con `msg.payload = { function: "rvcstate", value: "running"\|"docked"\|"charging"\|"paused"\|"error" }` e la modalità con `function: "rvcmode", value: "cleaning"\|"idle"` |

- **GA comando**: scritto sul bus KNX quando l'assistente invia un comando.
- **GA stato**: letto dal bus per tenere aggiornati gli attributi Matter (e le app).

## Compatibilità avanzata

Queste opzioni sono nascoste finché non servono al tipo selezionato. I dispositivi dimmerabili possono ignorare il comando luminosità che alcuni controller inviano subito dopo `On`. Per le tapparelle, **Scambia Apri / Chiudi** inverte sia il comando KNX binario sia la direzione percentuale. **Debounce slider tapparella** accorpa i target intermedi rapidi prima della scrittura KNX: `0` usa finestre adattive (400 ms per il primo comando, 150 ms per i successivi); `1`–`5000` imposta una finestra fissa. Le tapparelle possono inoltre aggiornare ottimisticamente la posizione Matter e correggerla quando arriva la posizione reale dalla GA di stato KNX.

## PIN del nodo

Se abiliti i PIN input/output del nodo:

- **Input**: aggiorna lo stato Matter dal flow, senza passare dal bus KNX: `msg.payload = { function: "onoff", value: true }` (`function` è una tra `onoff`, `level`, `rgb`, `colortemp`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`, `fanspeed`, `smoke`, `co`, `leak`, `co2`, `rvcstate`, `rvcmode`). Utile per esporre ad Alexa & Co. valori calcolati nel flow (es. un sensore virtuale).
- **Output**: ogni comando ricevuto da un controller Matter viene inoltrato al flow: `msg.topic` = nome del dispositivo, `msg.payload` = valore, `msg.matter` = il comando grezzo. Un dispositivo senza GA di comando diventa un **dispositivo solo-flow**.

## Note

- L'identità Matter del dispositivo è legata a questo nodo: eliminando il nodo e creandone uno nuovo, le app vedono un dispositivo nuovo di zecca.
- I nodi device aggiunti/rinominati/rimossi vengono recepiti dai controller abbinati in pochi secondi, senza riabbinare il bridge.
