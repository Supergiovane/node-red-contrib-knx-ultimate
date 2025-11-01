---
layout: wiki
title: "HUE Tapdial"
lang: it
permalink: /wiki/it-HUE%20Tapdial/
---
Il nodo **Hue Tap Dial** collega il servizio di rotazione del Tap Dial alle GA KNX e inoltra l'evento Hue originale al flow. Dopo aver associato un nuovo Tap Dial, premi l'icona di aggiornamento accanto al campo dispositivo.

### Schede

- **Mappatura** - scegli GA KNX e DPT per gli eventi di rotazione. Sono supportati DPT 3.007 (dim relativo), DPT 5.001 (livello 0‑100 %) e DPT 232.600 (controllo colore vendor).
- **Comportamento** - mostra/nasconde il pin di output del nodo. Se non è configurato un gateway KNX il pin resta attivo così gli eventi Hue raggiungono comunque il flow.

### Impostazioni generali

| Proprietà | Descrizione |
|--|--|
| KNX GW | Gateway KNX usato per l'autocompletamento delle GA. |
| Bridge Hue | Bridge Hue che espone il Tap Dial. |
| Hue Tap Dial | Dispositivo rotativo (autocomplete; il pulsante di refresh ricarica l'elenco). |

### Scheda Mappatura

| Proprietà | Descrizione |
|--|--|
| GA rotazione | GA KNX che riceve gli eventi di rotazione (supporta DPT 3.007, 5.001, 232.600). |
| Nome | Etichetta descrittiva della GA. |

### Output

|#|Porta|Payload|
|--|--|--|
|1|Uscita standard|`msg.payload` (oggetto) Evento Hue grezzo generato dal Tap Dial.|

> ℹ️ I controlli legati a KNX compaiono solo dopo la selezione del gateway; la scheda Mappatura resta nascosta finché non sono configurati sia bridge sia gateway.
