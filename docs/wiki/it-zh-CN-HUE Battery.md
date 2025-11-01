---
layout: wiki
title: "zh-CN-HUE Battery"
lang: it
permalink: /wiki/it-zh-CN-HUE%20Battery/
---
---
<p> Questo nodo sincronizza il livello della batteria del dispositivo HUE in KNX e innesca un evento quando il valore cambia.</p>
Immettere il nome del dispositivo KNX o l'indirizzo di gruppo nel campo GA per completare automaticamente; Fai clic sul pulsante Aggiorna accanto a "Hue Sensor" per ricaricare l'elenco dei dispositivi Hue.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX GW | KNX Gateway per il rilascio di potenza (le impostazioni di mappatura KNX verranno visualizzate solo dopo la selezione).|
| Bridge Hue | Bridge Hue utilizzato. |
| Sensore Hue |Dispositivo/sensore HUE che fornisce informazioni di alimentazione (supporta il completamento e l'aggiornamento automatici).|
**mappatura**
| Proprietà | Descrizione |
|-|-|
| Batteria | Indirizzo del gruppo KNX della percentuale della batteria (0-100%), DPT consigliato: <b> 5,001 </b>. |
**Comportamento**
| Proprietà |Descrizione |
|-|-|
| Leggi lo stato sull'avvio | Leggi la potenza corrente durante la distribuzione/riconnessione e pubblica su KNX. Valore predefinito: "Sì".|
| Pin di output del nodo | Mostra o nascondi l'output rosso-nodo.Quando il gateway KNX non è selezionato, il pin di uscita rimane abilitato per garantire che l'evento HUE possa ancora immettere il processo.|
> ℹ️ Quando il gateway KNX non è selezionato, il campo di mappatura KNX viene automaticamente nascosto per facilitare l'uso dei nodi come tonalità pura → origini eventi rosso nodo.
