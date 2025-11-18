---
layout: wiki
title: "zh-CN-HUE Motion"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Motion
---
---
<p> Questo nodo si iscrisse agli eventi del sensore di movimento Hue e li sincronizza al processo KNX e rosso nodo.</p>
Immettere il nome del dispositivo KNX o l'indirizzo di gruppo nel campo GA per completare automaticamente; Il pulsante di aggiornamento accanto al "Sensore Hue" può ricaricare l'elenco dei dispositivi Hue.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | KNX Gateway che riceve lo stato del movimento (le impostazioni KNX vengono visualizzate solo dopo la selezione) |
| Hue Bridge | usato da Hue Bridge |
| Sensore Hue | Sensore di movimento Hue da utilizzare (supporta il completamento e l'aggiornamento automatici) |
**mappatura**
| Proprietà | Descrizione |
|-|-|
| Motion | Indirizzo del gruppo KNX corrispondente; Invia `True` quando viene rilevato il movimento e invia` false` quando il minimo viene ripristinato (dpt consigliato: <b> 1.001 </b>) |
**Comportamento**
| Proprietà | Descrizione |
|-|-|
| Pin di output del nodo | Mostra o nascondi l'output rosso-rosso; Resti abilitati quando KNX Gateway non è selezionato per garantire che gli eventi HUE possano ancora immettere il processo |
> ℹ️ Quando il gateway KNX non è selezionato, il campo KNX viene automaticamente nascosto e il nodo può essere usato come un listener Rosso-nodo puro → nodo.
### Produzione
1. Output standard - `msg.payload` (booleano)
: Il movimento viene rilevato come `vero 'e la fine del movimento è` false`.
