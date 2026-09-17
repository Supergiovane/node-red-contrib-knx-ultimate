---
layout: wiki
title: "HATranslator"
lang: it
permalink: /wiki/it-HATranslator
translation_key: "HATranslator"
---

> Nella versione 8 usa **KNX Utility** e seleziona **Home Assistant Translator**. Le impostazioni qui sotto descrivono questa funzione. Il vecchio nodo separato non è più incluso.
>
> [KNX Utility]({{ '/wiki/it-KNX-Utility' | relative_url }}) · [Passare dalla versione 7]({{ '/wiki/it-Migration-8' | relative_url }})


Home Assistant Translator ha un ingresso e un’uscita e non richiede un gateway KNX. Scegli la proprietà del messaggio da tradurre (ad esempio `payload` o `data.new_state.state`) e modifica le associazioni `origine:true` / `origine:false`, come `open:true` e `closed:false`. Invia il valore booleano tradotto in `msg.payload`; collega l’uscita a KNX Device quando occorre scrivere sul bus.

Questo nodo traduce il msg di input in valori True/False validi. 

Può tradurre un payload input, in valori booleani True /False. 

Ogni riga nella casella di testo, rappresenta un comando di traduzione.

Puoi aggiungere la tua riga di traduzione. 

| Proprietà | Descrizione |
|-|-|
|Nome |Il nome del nodo.|
|Input |La proprietà di input MSG da valutare e tradurre.|
|Tradurre |Aggiungi, elimina o modifica il tuo comando di traduzione.Il comando di traduzione della riga deve essere \*\* stringa di input da HA: valore knx \*\* (_valore kn&#x78;_&#x63;ome vero o falso).Ad esempio: <code> Apri: true </code> <code> chiuso: false </code>.|
