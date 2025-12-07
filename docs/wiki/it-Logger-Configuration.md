---
layout: wiki
title: "Logger-Configuration"
lang: it
permalink: /wiki/it-Logger-Configuration
---
# Logger

Il nodo Logger registra tutti i telegrammi e produce un file compatibile con l'XML del bus monitor ETS.

Puoi salvarlo su disco (nodo file) oppure inviarlo, ad esempio, a un server FTP. Il file può essere letto in ETS per diagnosi o per il replay dei telegrammi.
Il nodo può anche contare i telegrammi al secondo (o con l'intervallo che preferisci). 
 <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">Esempi qui.</a>

## Impostazioni

|Proprietà|Descrizione|
|--|--|
| Gateway | Gateway KNX. |
| Topic | Topic del nodo. |
| Nome | Nome del nodo. |

## File diagnostico BUS compatibile ETS

|Proprietà|Descrizione|
|--|--|
| Avvia il timer automaticamente | Avvia automaticamente il timer al deploy o all'avvio di Node-RED. |
| Nuovo file XML ogni (in minuti) | Ogni quanti minuti emettere il file XML compatibile con ETS. |
| Numero massimo di righe nel file (0 = nessun limite) | Numero massimo di righe contenute nell'XML; le più vecchie vengono eliminate per prime. 0 per nessun limite. |
| Azione | Emetti solo il payload, oppure emetti il payload e salva su file. |
| Percorso file (assoluto o relativo) | Dove salvare l'XML quando è selezionato il salvataggio. |

## Contatore telegrammi KNX

|Proprietà|Descrizione|
|--|--|
| Avvia il timer automaticamente | Avvia automaticamente il timer al deploy o all'avvio di Node-RED. |
| Intervallo conteggio (in secondi) | Ogni quanti secondi emettere nel flow il conteggio dei telegrammi. |

---

# Uscite del Logger

**PIN 1: file XML compatibile ETS bus monitor**

Usa un nodo file per salvare `msg.payload` su filesystem, o invialo ad esempio a un server FTP.

```javascript

msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // stringa XML
}
```

**PIN 2: contatore telegrammi KNX**

Ad ogni conteggio, il nodo emette un messaggio come questo:

```javascript

msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```

---

# Messaggi di ingresso (INPUT)

Controllo del file XML ETS compatibile

**Avvio timer**

```javascript

msg.etsstarttimer = true;
return msg;
```

**Stop timer**

```javascript

msg.etsstarttimer = false;
return msg;
```

**Output immediato del file ETS**

```javascript

// Emette subito l'XML; se il timer era attivo, lo riavvia
msg.etsoutputnow = true;
return msg;
```

Contatore telegrammi KNX

**Avvio timer**

```javascript

msg.telegramcounterstarttimer = true;
return msg;
```

**Stop timer**

```javascript

msg.telegramcounterstarttimer = false;
return msg;
```

**Output immediato del conteggio**

```javascript

msg.telegramcounteroutputnow = true;
return msg;
```

## Vedi anche

- [Sample Logger](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
