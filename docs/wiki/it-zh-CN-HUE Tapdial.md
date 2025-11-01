---
layout: wiki
title: "zh-CN-HUE Tapdial"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Tapdial/
---
---
**HUE TAP COMPLIO** Il nodo mappa il servizio di rotazione di tap compositura su KNX e invia l'evento HUE originale al processo rosso nodo.Dopo aver accoppiato un nuovo dispositivo, fare clic sull'icona di aggiornamento accanto al campo del dispositivo.
Tab ###
- **Mappatura** - Selezionare l'indirizzo del gruppo KNX e DPT corrispondente all'evento di rotazione, supportando DPT 3.007, 5.001, 232.600.
- **Comportamento** - Controlla se viene visualizzato il pin di uscita rosso -rosso.Quando il gateway KNX non è configurato, il pin rimane abilitato in modo che gli eventi continuino ad immettere il processo.
### impostazioni generali
| Proprietà | Descrizione |
|-|-|
| KNX GW | KNX Gateway per il completamento automatico GA.|
| Bridge Hue | Hue Bridge fornisce il ponte Hue di Tap Dial. |
| Quadrante tocco di tonalità |Dispositivo a manopola (supporta il completamento automatico; pulsante Aggiorna per re-elenco).|
Scheda di mappatura ###
| Proprietà | Descrizione |
|-|-|
| Rotante ga | Indirizzo del gruppo KNX che riceve eventi di rotazione (supporta DPT 3.007, 5.001, 232.600). |
| Nome | Descrizione Nome di Ga. |
### Produzione
|#| Porta | Payload |
|-|-|-|-|
| 1 | Output standard | `msg.payload` (oggetto) Evento di tonalità originale generato da tap compositura. |
> ℹ️ I controlli relativi a KNX verranno visualizzati solo dopo aver selezionato il gateway KNX;La scheda di mappatura rimarrà nascosta fino a quando non saranno configurati sia il ponte Hue che il gateway KNX.
