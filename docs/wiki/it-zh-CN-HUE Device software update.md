---
layout: wiki
title: "zh-CN-HUE Device software update"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Device%20software%20update/
---
---
<p> Questo nodo monitora lo stato di aggiornamento del software del dispositivo HUE e lo pubblica su KNX.</p>
Inizia a digitare il nome o l'indirizzo di gruppo del dispositivo KNX nel campo GA e i dispositivi disponibili iniziano a visualizzare
Stai digitando.
**Generale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | Seleziona il portale KNX da utilizzare |
| Bridge Hua | Seleziona il bridge tone da usare |
| Dispositivo Hue | Dispositivo HUE da monitorare (completamento automatico) |
**mappatura**
| Proprietà | Descrizione |
|-|-|
| Stato | Indirizzo di gruppo KNX per gli aggiornamenti del software di mappatura: _true_ disponibile/preparazione/installazione, altrimenti _false_ |
| Leggi lo stato all'avvio | Leggi e pubblica su KNX durante l'avvio/riconnessione (predefinito "Sì") |
### Produzione
1. Output standard
: payload (booleano): flag di aggiornamento.
: status (stringa): **no \ _update, update \ _pending, ready \ _to \ _install, installazione** .
