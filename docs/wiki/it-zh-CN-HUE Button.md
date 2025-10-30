---
layout: wiki
title: "zh-CN-HUE Button"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Button
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Button) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Button) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Button) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Button) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Button) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Button)
---
Il nodo del pulsante <p> HUE mappa l'evento del pulsante HUE su KNX utilizzando il pulsante <code> </p>
Digitare la casella di input GA (nome o indirizzo di gruppo) per associare KNX GA;Il dispositivo corrispondente verrà visualizzato quando si entra.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX Gateway | Seleziona il gateway KNX da utilizzare |
| Bridge Hue | Seleziona il ponte Hue da usare |
| Button Hue | Pulsante Hue da utilizzare (completato automaticamente quando input) |
**interruttore**
| Proprietà | Descrizione |
|-|-|
| Interruttore | GA attivato da <code> corto \ _release </code> (rilascio press breve). |
| Stato GA |Feedback opzionale GA Quando è abilitato "Valore di commutazione per evento" per mantenere sincronizzato lo stato interno.|
**DIMMULIPLEX**
| Proprietà | Descrizione |
|-|-|
| Dimming | <code> Long \ _press </code>/<code> ripetizione </code> GA utilizzato per il bighellone durante l'evento (di solito DPT 3.007). |
**Comportamento**
|Proprietà | Descrizione |
|-|-|
| Switch Values ​​per ogni evento | Se abilitato, passare automaticamente tra <code> true/false </code> e la direzione di dimming.|
| Carico di commutazione |Carico fisso inviato a KNX/Processo quando la commutazione è disabilitata.|
| Carico di oscuramento | Dimpido di dignaggio fisso inviato a KNX/Flow quando la commutazione è disabilitata. |
### Produzione
1. Output standard
: `msg.payload` è un oggetto booleano o oscurante;`msg.event` è una stringa di eventi Hue (ad esempio` short_release`, `ripetizioni`).
### Dettagli
`msg.event` corrisponde a` button.button_report.event`, e l'evento Hue originale è contenuto in `msg.rawevent`.L'uso di uno stato opzionale GA consente allo stato di commutazione interno di essere coerente con dispositivi esterni come gli interruttori a parete.
