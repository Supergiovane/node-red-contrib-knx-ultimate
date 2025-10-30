---
layout: wiki
title: "zh-CN-KNXAutoResponder"
lang: it
permalink: /wiki/it-zh-CN-KNXAutoResponder
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)
---
<p> Questo nodo risponderà alla richiesta di lettura del bus KNX.
Il nodo registra tutti i telegrammi che vengono trasferiti al bus KNX e memorizzare i valori in memoria.
Quindi risponde alla richiesta di lettura inviando tali valori memorizzati al bus in base alla richiesta.
Se l'indirizzo di gruppo da leggere non ha ancora valore, il nodo risponderà con il valore predefinito.
Questo nodo risponderà solo all'indirizzo di gruppo specificato nel campo **Response** JSON.
Per impostazione predefinita, esiste un testo JSON **Esempio ** precompilato**che puoi semplicemente cambiare/eliminare il contenuto.Assicurati ** NON premere**per usarlo!!! ** Configurazione** | Proprietà | Descrizione |
|-|-|
| Gateway | Seleziona il portale KNX da utilizzare |
| Risposta | Il nodo risponderà a una richiesta di lettura dall'indirizzo di gruppo specificato in questo array JSON.Il formato è specificato di seguito.|
<br/>
\*\*JSON FORMAT \*\*
JSON è sempre una serie di oggetti contenenti ogni istruzione. Ogni istruzione dice al nodo cosa fare.
| Proprietà | Descrizione |
|-|-|
| Nota | ** Chiave facoltativo** Nota per ottenere promemoria. Non verrà usato da nessuna parte.|
| Ga |Indirizzo di gruppo.Puoi anche usare ".." monete selvagge a gruppi specifici di indirizzi.".." può essere usato solo con il terzo livello GA, ad esempio: \*\*1/1/0..257**. Si prega di consultare il campione qui sotto.|
| Dpt | Point dati dell'indirizzo di gruppo, formato "1.001".Se il file CSV ETS è stato importato, **opzionale \*\*. |
| Impostazione predefinita |Quando il valore dell'indirizzo del componente non è stato ricordato dal nodo, viene inviato al bus in una risposta alla richiesta di lettura.| ** Cominciamo con un comando** Il nodo AutoResponder risponderà a una richiesta di lettura all'indirizzo di gruppo 2/7/1.Se non è ancora in memoria, risponderà con _true _. |
Il file CSV ETS deve essere importato, altrimenti è necessario anche aggiungere il tasto __"dpt": "1.001" \*\*.```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` ** Istruzioni più complete** Il nodo auto-rispondente risponderà alle richieste di lettura a partire dal 3/1/1, incluso il 3/1/22.Se la memoria non ha ancora valore, risponderà con _false _.
C'è anche una__ nota \*\*, che viene utilizzata solo come nota di promemoria.Non verrà usato da nessuna parte.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` ** Comando connesso** Dal 2/2/5 al 2/2/21, il nodo AutoResponder risponderà a una richiesta di lettura all'indirizzo del gruppo.Se non c'è ancora valore in memoria, risponderà con un valore di 25.
Il nodo AutoResponder risponderà anche alle richieste di lettura del componente 2/4/22.Se non c'è ancora valore in memoria, utilizzerà lo stato di stringa \*sconosciuto!\*rispondere.
Nota la ** virgola** tra gli oggetti JSON di ciascuna direttiva.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```<br/>
