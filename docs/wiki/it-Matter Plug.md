---
layout: wiki
title: "Matter Plug"
lang: it
permalink: /wiki/it-Matter%20Plug
---
# Presa Matter (BETA)

> Questo nodo è in **BETA**: il comportamento può cambiare mentre l'implementazione Matter viene rifinita.

Questo nodo collega una presa Matter che espone il cluster `OnOff` agli indirizzi di gruppo KNX di comando e stato.

## Configurazione

|Campo|Descrizione|
|--|--|
| KNX GW | Gateway KNX usato per scrivere e rispondere sugli indirizzi di gruppo configurati. Può restare vuoto se serve solo l'output Node-RED. |
| Matter controller | Nodo di configurazione Matter Controller in cui il dispositivo è stato associato. |
| Presa Matter | Endpoint presa Matter che espone `OnOff.onOff`. |
| Control | GA KNX di comando. Le scritture booleane accendono o spengono la presa Matter. DPT predefinito: `1.001`. |
| Status | GA KNX di stato aggiornata dai cambi stato Matter e usata per rispondere alle letture KNX. DPT predefinito: `1.001`. |
| Read at startup | Pubblica il valore Matter in cache al deploy/avvio o quando il dispositivo si riconnette. |
| Node I/O | Mostra i pin input/output Node-RED. L'input accetta payload booleani e messaggi stile Matter in `msg.payload` o `msg.on.on`; l'output emette gli aggiornamenti di stato. |

## Comportamento

Le variazioni Matter di `OnOff.onOff` aggiornano la GA di stato. Le scritture KNX sulla GA di comando inviano il comando on/off Matter corrispondente.
