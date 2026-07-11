---
layout: wiki
title: "Matter-Bridge"
lang: it
permalink: /wiki/it-Matter-Bridge
---
# Expose KNX to Matter (BETA)

> Questo nodo è in **BETA**: funziona, ma alcuni dettagli potrebbero cambiare tra una release e l'altra.

## Panoramica

Ogni nodo Expose KNX to Matter espone **un dispositivo KNX come dispositivo Matter**: i controller abbinati (Alexa, Google Home, Apple Home...) lo vedono, con il nome che hai scelto, pronto per il controllo da app e vocale. Puntalo a un nodo di configurazione **Bridge Matter** (il bridge vero e proprio, abbinato una sola volta - il QR di abbinamento vive lì) e aggiungi quanti nodi device vuoi, ovunque nei tuoi flow.

È la direzione opposta del nodo *Matter Device*: lì KNX controlla un dispositivo Matter, qui i controller Matter controllano KNX.

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

Queste opzioni sono nascoste finché non servono al tipo selezionato. I dispositivi dimmerabili possono ignorare il comando luminosità che alcuni controller inviano subito dopo `On`. Le tapparelle possono aggiornare ottimisticamente la posizione Matter dopo un comando, poi correggerla quando arriva la posizione reale dalla GA di stato KNX.

## PIN del nodo

Se abiliti i PIN input/output del nodo:

- **Input**: aggiorna lo stato Matter dal flow, senza passare dal bus KNX: `msg.payload = { function: "onoff", value: true }` (`function` è una tra `onoff`, `level`, `rgb`, `colortemp`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`, `fanspeed`, `smoke`, `co`, `leak`, `co2`, `rvcstate`, `rvcmode`). Utile per esporre ad Alexa & Co. valori calcolati nel flow (es. un sensore virtuale).
- **Output**: ogni comando ricevuto da un controller Matter viene inoltrato al flow: `msg.topic` = nome del dispositivo, `msg.payload` = valore, `msg.matter` = il comando grezzo. Un dispositivo senza GA di comando diventa un **dispositivo solo-flow**.

## Note

- L'identità Matter del dispositivo è legata a questo nodo: eliminando il nodo e creandone uno nuovo, le app vedono un dispositivo nuovo di zecca.
- I nodi device aggiunti/rinominati/rimossi vengono recepiti dai controller abbinati in pochi secondi, senza riabbinare il bridge.
