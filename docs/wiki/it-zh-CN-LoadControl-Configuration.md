---
layout: wiki
title: "zh-CN-LoadControl-Configuration"
lang: it
permalink: /wiki/it-zh-CN-LoadControl-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)
---
# Nodo di controllo del carico KNX
<p> Utilizzando il nodo di controllo del carico, è possibile gestire automaticamente la disconnessione del carico (lavatrice, forno, ecc.) Quando il consumo corrente supera una determinata soglia.
Il dispositivo viene interrotto in modo intelligente, controllando il possibile consumo del dispositivo per determinare se è disattivato con altri dispositivi.<br/>
Il nodo può riattivare automaticamente il carico.<br/>
Questo nodo spegne un dispositivo (o dispositivi) alla volta in base all'ordine scelto. <br/>
**Generale**
| Proprietà | Descrizione |
|-|-|
| Gateway | Portale KNX.È anche possibile non selezionare alcun gateway.In questo caso, verranno presi in considerazione solo i messaggi inseriti nel nodo.|
| Sorveglianza WH | L'indirizzo di gruppo rappresenta il consumo totale del tuo edificio.|
| Limite wh | Soglia massima che il contatore può resistere.Quando questa soglia viene superata, il nodo inizia a chiudere il dispositivo.|
| Ritardato (s) | Indica in secondi, indicando che il nodo valuterà la frequenza del consumo e l'arresto di ciascun dispositivo.|
| Ritardo su (S) | indica in secondi, indicando che il nodo valuta la frequenza consumata e gira su ciascun dispositivo chiuso.|
<br/>
**Controllo del carico**
Qui puoi aggiungere il dispositivo per spegnere in caso di sovraccarico.<br/>
Seleziona il dispositivo per spegnere.Immettere il nome del dispositivo o il suo indirizzo di gruppo.<br/>
Immettere qualsiasi indirizzo di gruppo che indica il consumato dal dispositivo selezionato nella prima riga. **Questo è un parametro opzionale** .Se il dispositivo consuma più di una certa quantità di watt, significa che è in uso.Se consumato di meno, il dispositivo verrà considerato "non utilizzato" e il dispositivo verrà disattivato immediatamente.<br/>
Se \*AutoRecovery \* è abilitato, il dispositivo verrà riattivato automaticamente quando scade il ritardo di ripristino.
## INVIO
| Proprietà | Descrizione |
| - |- |
| `msg.readstatus = true` | Forzare il bus KNX di ciascun dispositivo nell'elenco per leggere il valore. _ **Il nodo stesso ha fatto tutte le operazioni** _, ma se necessario, è possibile utilizzare questo comando per forzare una rileggere il valore corrente in Watt.| | |
| `msg.enable = true` | Abilita il controllo del carico. |
| `msg.disable = true` | Disabilita il controllo del carico. |
| `msg.reset = true` |Ripristina lo stato del nodo e riapri tutti i dispositivi. |
| `msg.shedding` | string._ """"""""" prima produggendo "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" Usa questo messaggio per forzare il timer di fallimento per iniziare/fermare, ignorando l'indirizzo di gruppo \*\* |
## Produzione
1. Output standard
: Payload (stringa | oggetto): output standard del comando.
## dettaglio```javascript
msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}
```# Campione
\ <a href = "/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> fai clic qui ad esempio </a>
<br/>
