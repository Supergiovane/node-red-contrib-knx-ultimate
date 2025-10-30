---
layout: wiki
title: "LoadControl-Configuration"
lang: it
permalink: /wiki/it-LoadControl-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)

# Nodo di controllo del carico KNX

 Con il nodo di controllo del carico è possibile gestire automaticamente la disconnessione dei carichi (lavatrice, forno, ecc.) Quando il consumo corrente supera una determinata soglia.

I dispositivi vengono disattivati ​​in modo intelligente, controllando il possibile consumo del dispositivo per determinare se disattivarlo con gli altri.

Il nodo può riattivare automaticamente i carichi.

Il nodo disattiva un dispositivo (o più dispositivi) alla volta, in base all'ordine selezionato. 

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway |KNX Gateway.È anche possibile non selezionare alcun gateway;In questo caso verranno considerati solo i messaggi in arrivo al nodo.|
|Monitor WH |Indirizzo di gruppo che rappresenta il consumo totale del tuo edificio.|
|Limite WH |Soglia massima che il misuratore di elettricità può resistere.Quando questa soglia viene superata, il nodo inizia a disattivare i dispositivi.|
|Spegnere di ritardo Off (S) |Espresso in secondi, indica la frequenza con cui il nodo valuterà il consumo e spenderà ciascun dispositivo.|
|Interruttore di ritardo su (S) |Espresso in pochi secondi, indica la frequenza con cui il nodo valuterà il consumo e accenderà ciascun dispositivo spento.|

\*\* Controllo del carico \*\*

Qui puoi aggiungere dispositivi per disattivare in caso di sovraccarico.

Scegli il dispositivo per spegnere.Immettere il nome del dispositivo o il suo indirizzo di gruppo.

Immettere qualsiasi indirizzo di gruppo che indica il consumo del dispositivo scelto nella prima riga.\*\* Questo è un parametro opzionale \*\*.Se il dispositivo consuma più di un certo numero di watt, significa che è in uso.Se consuma meno, il dispositivo verrà considerato "non in uso" e sia questo che il prossimo verranno disattivati ​​contemporaneamente. 

Se \*Recupero automatico \* è abilitato, il dispositivo viene riattivato automaticamente quando il "ritardo di ripristino" scade.

## Input

| Proprietà | Descrizione |
|-|-|
|`msg.readstatus = true` |Forzare la lettura dei valori dal bus KNX di ciascun dispositivo nell'elenco.\*\*\* Il nodo fa già tutto da solo ___, ma se necessario, è possibile utilizzare questo comando per forzare una rilettura dei valori correnti in Watt. |
|`msg.enable = true` |Abilita il controllo del carico. |
|`msg.disable = true` |Disabilita il controllo del carico. |
|`msg.reset = true` |Ripristina gli stati del nodo e riaccendi tutti i dispositivi |
|`msg.shedding` |Corda._ Shed_ per iniziare la sequenza di spargimento di Formward,_ non è stato rilasciato\*per iniziare lo spargimento inverso.Utilizzare questo MSG per forzare il timer di spargimento ad avviare/fermare, ignorando l'indirizzo del gruppo \*\*Monitor WH \*\*.Impost&#x61;_&#x41;ut&#x6F;_&#x70;er abilitare di nuovo il monitoraggio dell'indirizzo del gruppo \*\*monitor wh \*\*.|

## Output

1. Output standard
   : payload (stringa | oggetto): l'output standard del comando.

## Dettagli

```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```

# Campione

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> fai clic qui per l'esempio </a>
