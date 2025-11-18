---
layout: wiki
title: "zh-CN-Logger-Configuration"
lang: it
permalink: /wiki/it-zh-CN-Logger-Configuration
---
---
# Logger (log)
Il nodo Logger registra tutti i messaggi e emette un file XML compatibile con il monitor Bus ETS.
È possibile salvarlo su disco con il nodo file o inviarlo a FTP, ecc.Questo file può essere utilizzato in ETS per diagnosticare o riprodurre messaggi di riproduzione.
Questo nodo può anche contare il numero di messaggi (al secondo o intervallo personalizzato). <br/> <a href = "/node-red-contrib-knx-ultimate/wiki/logger-sample" target = "_ blank"> L'esempio è qui </a>
## impostare
| Proprietà | Descrizione |
|-|-|
| Gateway | KNX Gateway.|
| Argomento | L'argomento del nodo.|
| Nome | Nome nodo. |
## ETS File diagnostiche del bus compatibile
| Proprietà | Descrizione |
|-|-|
| Timer di avvio automatico | Avviare automaticamente il timer quando distribuito o avviato.|
| Output Nuovo XML ogni (in minuti) | Quanti minuti è output XML compatibile con ETS?|
| Numero massimo di righe in XML (0 = nessun limite) | Il numero massimo di righe di XML in questa finestra temporale; 0 significa nessun limite.|
## contatore di messaggi KNX
| Proprietà | Descrizione |
|-|-|
| Timer di avvio automatico | Avviare automaticamente il timer quando distribuito o avviato.|
| Contare l'intervallo (in secondi) | L'intervallo per l'outputing dei conteggi al processo in pochi secondi.|
---
#Node output
**PIN 1: ETS compatibile XML**
Utilizzare il nodo file per salvare `msg.payload` o inviarlo a FTP, ecc.

```javascript

msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
```

**PIN 2: conteggio dei messaggi KNX**
Output per ciclo di conteggio:

```javascript

msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```

---

# Immettere messaggio (input)
Controllo XML compatibile con ETS
**Avvia timer** 

```javascript

msg.etsstarttimer = true; return msg;
```

**Stop timer** 

```javascript

msg.etsstarttimer = false; return msg;
```

**output xml ora** 

```javascript

// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```Controllo

contatore di messaggi
**Avvia timer** 

```javascript

msg.telegramcounterstarttimer = true; return msg;
```

**Stop timer** 

```javascript

msg.telegramcounterstarttimer = false; return msg;
```

**Conto di output immediatamente** 

```javascript

msg.telegramcounteroutputnow = true; return msg;
```

## Vedere
- [Esempio di logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
