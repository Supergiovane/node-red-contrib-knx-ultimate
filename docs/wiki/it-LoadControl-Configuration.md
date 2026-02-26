---
layout: wiki
title: "LoadControl-Configuration"
lang: it
permalink: /wiki/it-LoadControl-Configuration
---
# Nodo di controllo del carico KNX

 Con il nodo di controllo del carico è possibile gestire automaticamente la disconnessione dei carichi (lavatrice, forno, ecc.) Quando il consumo corrente supera una determinata soglia.

I dispositivi vengono disattivati ​​in modo intelligente, controllando il possibile consumo del dispositivo per determinare se disattivarlo con gli altri.

Il nodo può riattivare automaticamente i carichi.

Il nodo disattiva un dispositivo (o più dispositivi) alla volta, in base all'ordine selezionato. 

**Generale**

| Proprietà | Descrizione |
|-|-|
|Gateway |KNX Gateway.È anche possibile non selezionare alcun gateway;In questo caso verranno considerati solo i messaggi in arrivo al nodo.|
|Modalità |Seleziona _Automatica (interna)_ per usare Monitor W/soglia/timer. Seleziona _Manuale (msg.shedding)_ per disabilitare la logica interna ed usare solo i comandi `msg.shedding` (`shed`/`unshed`).|
|Monitor W |Indirizzo di gruppo che rappresenta il consumo totale del tuo edificio.|
|Soglia W |Soglia massima che il misuratore di elettricità può resistere.Quando questa soglia viene superata, il nodo inizia a disattivare i dispositivi.|
|Ritardo distacco (s) |Espresso in secondi, indica la frequenza con cui il nodo valuterà il consumo e spenderà ciascun dispositivo.|
|Ritardo ripristino (s) |Espresso in pochi secondi, indica la frequenza con cui il nodo valuterà il consumo e accenderà ciascun dispositivo spento.|

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
|`msg.shedding` |String. In modalità _Manuale_: `shed` stacca il prossimo carico, `unshed` ripristina il precedente. In modalità _Automatica_: `shed`/`unshed` forza la logica interna; `auto` ripristina il monitoraggio normale.|

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
