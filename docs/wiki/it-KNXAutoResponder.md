---
layout: wiki
title: "KNXAutoResponder"
lang: it
permalink: /wiki/it-KNXAutoResponder
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)

Questo nodo risponderà alle richieste di lettura del bus KNX.

Il nodo registra tutti i telegrammi trasmessi al bus KNX e memorizzano i valori in memoria.
Risponde quindi alle richieste di lettura inviando tale valore memorizzato al bus come richiesta.
Se l'indirizzo di gruppo da leggere non ha ancora valore, il nodo risponderà con un valore predefinito.
Il nodo risponderà solo agli indirizzi di gruppo specificati nel \*\* Rispondi al campo \*\* JSON.
Per impostazione predefinita, esiste un esempio pre-compilato \*\* "Rispondi a" JSON Testo, in cui puoi semplicemente cambiare/eliminare le cose.Assicurati \*\* di non usarlo così come \*\* !!!

**Configurazione**

| Proprietà | Descrizione |
|-|-|
|Gateway |Seleziona il gateway KNX da utilizzare |
|Rispondi a |Il nodo risponderà alle richieste di lettura provenienti dagli indirizzi di gruppo specificati in questo array JSON.Il formato è specificato di seguito.|

\*\* Formato JSON \*\*

Il JSON è \*\* sempre \*\* una serie di oggetti, contenente ciascuna direttiva.Ogni direttiva indica al nodo cosa fanno.

| Proprietà | Descrizione |
|-|-|
|Nota |\*\* Chiave Nota opzionale \*\*, per promemoria.Non verrà utilizzato da nessuna parte.|
|ga |L'indirizzo di gruppo.Puoi anche usare i ".." Wildchars, per la specifica una serie di indirizzi di gruppo.Il ".." può essere usato solo con il livello del terzo GA, ex: \*\* 1/1/0..257 \*\*.Vedi i campioni sottostanti.|
|dpt |Il punto dati dell'indirizzo di gruppo, nel formato "1.001".È \*\* opzionale \*\* se il file CSV ETS è stato importato.|
|Predefinito |Il valore inviato al bus in risposta a una richiesta di lettura, quando il valore dell'indirizzo di gruppo non è stato ancora memorizzato dal nodo.|

\*\* Cominciamo con una direttiva \*\*

Il nodo AutoResponder risponderà alle richieste di lettura per l'indirizzo di gruppo 2/7/1.Se nessun valore è ancora in memoria, risponderà con \*true \*.
Il file CSV ETS deve essere stato importato, altrimenti è necessario aggiungere anche il tasto \*\* "DPT": "1.001" \*\*.

```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

\*\* Direttiva un po 'più completa \*\*

Il nodo AutoResponder risponderà alle richieste di lettura per l'indirizzo di gruppo a partire dal 3/1/1, al 3/1/22 incluso.Se nessun valore è ancora in memoria, risponderà con \*false \*.
C'è anche una chiave \*\* Nota \*\*, semplicemente come nota di promemoria.Non verrà utilizzato da nessuna parte.

```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
```

\*\* direttive concatenanti \*\*

Il nodo AutoResponder risponderà alle richieste di lettura per l'indirizzo di gruppo a partire dal 2/2/5, al 2/2/21 incluso.Se nessun valore è ancora in memoria, risponderà con un valore di 25.
Il nodo AutoResponder risponderà anche alle richieste di lettura per l'indirizzo di gruppo 2/4/22.Se nessun valore è ancora in memoria, risponderà con lo stato di stringa \*sconosciuto! \*.
Si prega di notare la \*\* virgola \*\* tra l'oggetto JSON di ciascuna direttiva.

```json
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
```
