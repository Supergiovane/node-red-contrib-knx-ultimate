---
layout: wiki
title: "zh-CN-HUE Plug"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Plug/
---
---
# Presa / spina Hue
Panoramica ##
Il nodo plug Hue maps Philips Hue Smart Sockets to KNX Group Indirizzati da implementare:
- Controllo on/off sul bus;
- Feedback di stato dalla piattaforma Hue;
- Monitoraggio opzionale `Power_state` (ON/STANDBY).
## configurazione
|Fields | Descrizione |
|-|-|
| KNX GW | Gateway KNX usati |
| Bridge Hue | Bridge Hue usato |
| Nome | Hue Socket to Control (prompt automatico) |
| Controllo | Indirizzo Group invio/OFF KNX (Bolean DPT) |
| Stato | Indirizzo di ricezione dello stato ON/OFF Rapporto Hue |
| Stato di potere | Indirizzo di gruppo opzionale per la mappatura della tonalità `power_state` |
| Leggi lo stato all'avvio | Invia immediatamente lo stato corrente durante la distribuzione |
| Pin | Abilita il pin di ingresso/output rosso nodo per controllo avanzato o inoltro eventi |
Consigli ## KNX
- Si consiglia di controllo e stato per utilizzare DPT 1.xxx.
- `power_state` può essere mappato su un valore booleano (true = on, false = standby) o utilizzare la classe di testo dpt per visualizzare la stringa originale.
- Quando viene ricevuto una lettura KNX (`GroupValue_Read`), il nodo ritorna allo stato della tonalità memorizzata nella cache.
## integrazione del flusso
Quando i pin sono abilitati:
- **Input** : Invia payload Hue v2 (come `{on: {on: true}}`).
- **output** : output `{payload, on, power_state, rawevent}` ogni volta che evento Hue.
## API HUE
Il nodo chiama `/risorsa/plug/{id}`.I flussi di eventi HUE vengono utilizzati per acquisire i cambiamenti dello stato e sincronizzare a KNX.
