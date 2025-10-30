---
layout: wiki
title: "HATranslator"
lang: it
permalink: /wiki/it-HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)

Questo nodo traduce il msg di input in valori True/False validi. 

Può tradurre un payload input, in valori booleani True /False. 

Ogni riga nella casella di testo, rappresenta un comando di traduzione.

Puoi aggiungere la tua riga di traduzione. 

| Proprietà | Descrizione |
|-|-|
|Nome |Il nome del nodo.|
|Input |La proprietà di input MSG da valutare e tradurre.|
|Tradurre |Aggiungi, elimina o modifica il tuo comando di traduzione.Il comando di traduzione della riga deve essere \*\* stringa di input da HA: valore knx \*\* (_valore kn&#x78;_&#x63;ome vero o falso).Ad esempio: <code> Apri: true </code> <code> chiuso: false </code>.|
