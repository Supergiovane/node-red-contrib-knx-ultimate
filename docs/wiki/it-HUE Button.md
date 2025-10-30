---
layout: wiki
title: "HUE Button"
lang: it
permalink: /wiki/it-HUE%20Button
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Button) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Button) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Button) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Button) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Button) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Button)

Il nodo Hue Button inoltra gli eventi del pulsante Hue verso KNX e verso l'uscita del flow utilizzando il campo Hue <code>button.button_report.event</code>.

Nel campo GA (nome o indirizzo di gruppo) inizia a digitare per collegare la GA KNX; i dispositivi compaiono durante la digitazione.

**Generale**

|Proprietà|Descrizione|
|--|--|
| Gateway KNX | Seleziona il gateway KNX da utilizzare |
| Bridge HUE | Seleziona il bridge HUE da utilizzare |
| Pulsante Hue | Pulsante Hue da usare (autocompletamento) |

**Interruttore**

|Proprietà|Descrizione|
|--|--|
| Interruttore | GA attivata dall'evento <code>short\_release</code> (pressione rapida). |
| GA stato | GA opzionale quando <em>Alterna valori</em> è attivo; mantiene allineato lo stato interno con altri attuatori. |

**Dimmer**

|Proprietà|Descrizione|
|--|--|
| Dim | GA utilizzata durante gli eventi <code>long\_press</code>/<code>repeat</code> per il dimming (tipicamente DPT 3.007). |

**Comportamento**

|Proprietà|Descrizione|
|--|--|
| Alterna valori | Se attivo, il nodo alterna automaticamente tra <code>true/false</code> e direzioni di dimmer. |
| Payload interruttore | Payload inviato a KNX/flow quando Alterna valori è disattivato. |
| Payload dimmer | Direzione inviata a KNX/flow quando Alterna valori è disattivato. |

### Output

1. Uscita standard
   : `msg.payload` contiene il valore booleano (o l'oggetto di dimmer) inviato a KNX; `msg.event` è la stringa dell'evento Hue (es. `short_release`, `repeat`).

### Dettagli

`msg.event` replica `button.button_report.event`. L'evento originale di Hue è disponibile in `msg.rawEvent`. Usa la GA di stato opzionale per mantenere il toggle interno allineato con interruttori o attuatori esterni.
