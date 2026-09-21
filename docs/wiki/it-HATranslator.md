---
layout: wiki
title: "HATranslator"
lang: it
permalink: /wiki/it-HATranslator
---
## Aggiornamento a KNX Ultimate 8

La versione 7 aggiunge un piccolo pulsante **Aggiorna alla v8** nella parte alta di ogni editor. Il pulsante esegue il backup dei flow, installa i package HUE/Matter necessari, converte i nodi compatibili, esegue un Deploy completo, verifica i flow salvati e installa la versione 8. Quando richiesto, riavvia il servizio Node-RED: ricaricare soltanto il browser non basta. I nodi KNX AI legacy fermano la procedura automatica.

[Leggi la guida completa all’aggiornamento](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Questo nodo dedicato resta compatibile con i flow esistenti. Per i nuovi flow usa [KNX Utility](/node-red-contrib-knx-ultimate/wiki/it-KNX-Utility) e seleziona **Home Assistant Translator**. Il suo editor permette di convertire tutti i nodi utility legacy compatibili in tutti i flow e subflow, con un unico Annulla e Deploy manuale.

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
