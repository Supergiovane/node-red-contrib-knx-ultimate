---
layout: wiki
title: "Control Matter from KNX"
lang: it
permalink: /wiki/it-Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> Questo nodo è in **BETA**: il comportamento può cambiare mentre l'implementazione Matter viene rifinita.

Questo nodo controlla da KNX un endpoint Matter già abbinato. Seleziona il dispositivo Matter e l'editor rileva le sue capability, mostrando solo le mappature KNX coerenti con quell'endpoint.

Sostituisce i nodi Matter separati non pubblicati e mantiene tutta la UI luce quando l'endpoint selezionato è una luce.

## Configurazione

|Campo|Descrizione|
|--|--|
| KNX GW | Gateway KNX usato per scrivere e rispondere sugli indirizzi di gruppo configurati. Può restare vuoto se serve solo l'output Node-RED. |
| Matter controller | Nodo di configurazione Matter Controller in cui il dispositivo è stato associato. |
| Dispositivo Matter | Endpoint Matter selezionato tra i dispositivi abbinati. La UI viene ricostruita in base alle capability reali. |
| Switch / Presa / Luce On-Off | Indirizzi di gruppo di comando e stato On/Off, di solito DPT `1.001`. |
| Serratura | Un GA comando DPT `1.xxx` invoca `lockDoor` con `true` e `unlockDoor` con `false`; un GA di stato separato riceve soltanto gli stati non ambigui Bloccata/Sbloccata. Se richiesto dall'endpoint, salva il PIN per operazioni remote nel campo credential. I comandi non annunciati dall'endpoint vengono rifiutati. |
| Altri endpoint | Window Covering, Thermostat, Fan e Switch usano profili dedicati selezionati dalle capability; gli eventi Switch come pressione iniziale, lunga e multipla sono emessi dall'output flow opzionale. Prese, attuatori On/Off, sensori, batteria, potenza ed energia usano il fallback generico mappato. La TAB **Mappature** contiene soltanto le funzioni annunciate dall'endpoint; lascia vuoto un GA per disabilitarlo. |
| Controlli luce | Per gli endpoint luce viene usata la stessa UI luce completa: DIM relativo (DPT `3.007`), luminosità %, RGB/HSV, bianco dinamico, luminosità/temperatura all'accensione, modalità giorno/notte, livello min/max e velocità dimmer. Le sezioni non supportate restano nascoste. |
| Sensori | Gli endpoint sensore mostrano il relativo GA di misura/stato solo quando supportato: temperatura, umidità, illuminamento, presenza, contatto e batteria. |
| Read at startup | Pubblica il valore Matter in cache al deploy/avvio o quando il dispositivo si riconnette. |
| Update local state from KNX write | Aggiorna la cache locale Matter/KNX quando arriva una scrittura su un GA KNX configurato. |
| Node Input/Output PINs | Mostra i pin input/output Node-RED. Per gli endpoint mappati, i selettori Matter appartengono direttamente a `msg`: `msg.clusterId` con `msg.attribute` legge un attributo ed emette il valore in `msg.payload`; `msg.requestFromRemote = true` forza la lettura dal dispositivo. Aggiungi `msg.value` per scrivere un attributo oppure usa `msg.clusterId`, `msg.command` e `msg.args` per un comando. L'ID attributo numerico `0` è valido. Door Lock accetta `msg.payload` booleano (`true` blocca, `false` sblocca). La selezione viene mantenuta alla riapertura dell'editor. |

## Comportamento

Il nodo mantiene una cache locale da aggiornamenti Matter e scritture KNX, risponde alle letture KNX dalla cache e può emettere/leggere i valori all'avvio. Ascolta solo gli indirizzi di gruppo configurati, quindi ignora il traffico KNX non pertinente.
