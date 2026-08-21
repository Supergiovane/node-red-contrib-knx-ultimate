---
layout: wiki
title: "Control Matter from KNX"
lang: it
permalink: /wiki/it-Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> Questo nodo è in **BETA**: il comportamento può cambiare mentre l'implementazione Matter viene rifinita.

Questo nodo controlla da KNX un endpoint Matter già abbinato. Seleziona il dispositivo Matter e l'editor rileva le sue capability, mostrando solo le mappature KNX coerenti con quell'endpoint.

Un click o il focus sul campo del dispositivo Matter apre sempre l'elenco completo degli endpoint abbinati, anche quando un dispositivo è già selezionato. Digitando, l'elenco continua a essere filtrato.

Sostituisce i nodi Matter separati non pubblicati e mantiene tutta la UI luce quando l'endpoint selezionato è una luce.

## Configurazione

|Campo|Descrizione|
|--|--|
| KNX GW | Gateway KNX usato per scrivere e rispondere sugli indirizzi di gruppo configurati. Può restare vuoto se serve solo l'output Node-RED. Il gateway salvato rimane selezionato durante l'inizializzazione dell'editor e cambia soltanto dopo una selezione esplicita dell'utente. |
| Matter controller | Nodo di configurazione Matter Controller in cui il dispositivo è stato associato. |
| Dispositivo Matter | Endpoint Matter selezionato tra i dispositivi abbinati. La UI viene ricostruita in base alle capability reali. |
| Switch / Presa / Luce On-Off | Indirizzi di gruppo di comando e stato On/Off, di solito DPT `1.001`. |
| Serratura | Un GA comando DPT `1.xxx` invoca `lockDoor` con `true` e `unlockDoor` con `false`; un GA di stato separato riceve soltanto gli stati non ambigui Bloccata/Sbloccata. Se richiesto dall'endpoint, salva il PIN per operazioni remote nel campo credential. I comandi non annunciati dall'endpoint vengono rifiutati. |
| Altri endpoint | Window Covering, Thermostat, Fan e Switch usano profili dedicati selezionati dalle capability; gli eventi Switch come pressione iniziale, lunga e multipla sono emessi dall'output flow opzionale. Prese, attuatori On/Off, sensori, batteria, potenza ed energia usano il fallback generico mappato. La TAB **Mappature** contiene soltanto le funzioni annunciate dall'endpoint; lascia vuoto un GA per disabilitarlo. |
| Controlli luce | Per gli endpoint luce viene usata la stessa UI luce completa: DIM relativo (DPT `3.007`), luminosità %, RGB/HSV, bianco dinamico, luminosità/temperatura all'accensione, modalità giorno/notte, livello min/max e velocità dimmer. Le sezioni non supportate restano nascoste. |
| Sensori | Gli endpoint sensore mostrano il relativo GA di misura/stato solo quando supportato: temperatura, umidità, illuminamento, presenza, contatto e batteria. |
| Read at startup | Pubblica il valore Matter in cache al deploy/avvio o quando il dispositivo si riconnette. |
| Update local state from KNX write | Aggiorna la cache locale Matter/KNX quando arriva una scrittura su un GA KNX configurato. |
| Node Input/Output PINs | Mostra i pin input/output Node-RED e la sezione **Input dal flow** subito sotto questo campo. Per le luci sono mostrati i messaggi di stato luce supportati al primo livello; per gli endpoint non luce sono mostrati il formato semplice `{function,value}` e i selettori Matter avanzati. La selezione viene mantenuta alla riapertura dell'editor. |

## Messaggi di input dal flow

Abilita **PIN di Input/Output del nodo** per mostrare la sezione **Input dal flow** subito sotto il selettore. Per le luci contiene esempi copiabili delle proprietà supportate al primo livello, come `msg.on`, `msg.dimming`, `msg.color_temperature` e `msg.color`. Per gli endpoint non luce viene generata dalla struttura annunciata e mostra l'Endpoint ID selezionato, tutti gli attributi leggibili/scrivibili e tutti i comandi accettati. Rimane disponibile anche quando il nodo viene usato soltanto dal flow senza gateway KNX.

Usa `msg.payload = {function:"position",value:35}` per scrivere in unità comprensibili. Ometti `value` per leggere uno stato supportato, per esempio `{function:"temperature"}`; il risultato viene emesso in `msg.payload`, con i dettagli Matter raw in `msg.matter`. In base all'endpoint, le funzioni possono includere `onoff`, `level`, `position`, `tiltposition`, `open`, `close`, `stop`, `setpoint`, `coolingsetpoint`, `currenttemp`, `fanspeed`, letture sensore e `identify`. Door Lock accetta `{function:"lock",value:true|false}`.

I flow esistenti restano compatibili. I messaggi avanzati continuano a usare `msg.clusterId` al primo livello con `msg.command`/`msg.args`, oppure `msg.attribute` con l'eventuale `msg.value`; `msg.requestFromRemote = true` forza la lettura dal dispositivo. Node ID ed Endpoint ID sono già selezionati dal nodo, ma `msg.endpointId` può sovrascrivere quest'ultimo.

## Comportamento

Il nodo mantiene una cache locale da aggiornamenti Matter e scritture KNX, risponde alle letture KNX dalla cache e può emettere/leggere i valori all'avvio. Ascolta solo gli indirizzi di gruppo configurati, quindi ignora il traffico KNX non pertinente.

I comandi vengono eseguiti in una coda ordinata separata per ciascun dispositivo associato. Un dispositivo offline, in timeout o rimosso non può quindi ritardare gli altri dispositivi Matter che usano lo stesso indirizzo di gruppo KNX. Un nodo che punta ancora a un dispositivo rimosso rifiuta subito il comando e mostra in rosso **Device no longer commissioned**; seleziona un dispositivo Matter valido oppure elimina il nodo Controller rimasto orfano.

L'errore di dispositivo non disponibile rimane agganciato: i successivi comandi KNX e flow vengono ignorati e non possono sovrascrivere lo stato rosso. Il nodo riprende automaticamente non appena quel dispositivo Matter segnala `connected`; anche l'apertura dell'editor del nodo azzera il blocco per consentire un tentativo manuale.
