---
layout: wiki
title: "Matter Battery"
lang: it
permalink: /wiki/it-Matter%20Battery
---
# Sensore batteria Matter (BETA)

> Questo nodo è in **BETA**: il comportamento può cambiare mentre l'implementazione Matter viene rifinita.

Questo nodo collega un endpoint batteria/alimentazione Matter a KNX e, opzionalmente, a un output Node-RED.

## Configurazione

|Campo|Descrizione|
|--|--|
| KNX GW | Gateway KNX usato per scrivere e rispondere sugli indirizzi di gruppo configurati. Può restare vuoto se serve solo l'output Node-RED. |
| Matter controller | Nodo di configurazione Matter Controller in cui il dispositivo è stato associato. |
| Sensore batteria Matter | endpoint batteria/alimentazione Matter selezionato tra i dispositivi associati. La lista è filtrata sugli endpoint che espongono `PowerSource`. |
| GA batteria | GA batteria che riceve il valore convertito. DPT predefinito: `5.001`. |
| Read at startup | Pubblica il valore Matter in cache al deploy/avvio o quando il dispositivo si riconnette. |
| Node output | Mostra un pin di output Node-RED ed emette ogni aggiornamento Matter. |

## Comportamento

Il nodo legge `PowerSource.batPercentRemaining`, lo converte in livello batteria in percentuale, lo scrive sulla GA KNX configurata e risponde alle letture KNX con l'ultimo valore noto.
