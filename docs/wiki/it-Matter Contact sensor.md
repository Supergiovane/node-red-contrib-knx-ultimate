---
layout: wiki
title: "Matter Contact sensor"
lang: it
permalink: /wiki/it-Matter%20Contact%20sensor
---
# Sensore contatto Matter (BETA)

> Questo nodo è in **BETA**: il comportamento può cambiare mentre l'implementazione Matter viene rifinita.

Questo nodo collega un endpoint contatto Matter a KNX e, opzionalmente, a un output Node-RED.

## Configurazione

|Campo|Descrizione|
|--|--|
| KNX GW | Gateway KNX usato per scrivere e rispondere sugli indirizzi di gruppo configurati. Può restare vuoto se serve solo l'output Node-RED. |
| Matter controller | Nodo di configurazione Matter Controller in cui il dispositivo è stato associato. |
| Sensore contatto Matter | endpoint contatto Matter selezionato tra i dispositivi associati. La lista è filtrata sugli endpoint che espongono `BooleanState`. |
| GA contatto | GA contatto che riceve il valore convertito. DPT predefinito: `1.019`. |
| Read at startup | Pubblica il valore Matter in cache al deploy/avvio o quando il dispositivo si riconnette. |
| Node output | Mostra un pin di output Node-RED ed emette ogni aggiornamento Matter. |

## Comportamento

Il nodo legge `BooleanState.stateValue`, lo converte in stato booleano del contatto, lo scrive sulla GA KNX configurata e risponde alle letture KNX con l'ultimo valore noto.
