---
layout: wiki
title: "SceneController-Configuration"
lang: it
permalink: /wiki/it-SceneController-Configuration/
---
# Scene Controller

Il nodo Scene Controller si comporta come un dispositivo KNX di controllo scene: consente di salvare e richiamare una scena.

## Impostazioni del nodo

| Proprietà | Descrizione |
|--|--|
| Gateway | Gateway KNX selezionato. |
| Scene Recall | **Datapoint ** e**Trigger Value** . Indirizzo di gruppo per il richiamo scena (es. `0/0/1`). Il nodo reagisce ai telegrammi ricevuti su questa GA richiamando la scena. Il Datapoint è il DPT della GA di richiamo scena. Il Trigger Value è il valore che deve essere ricevuto per attivare il richiamo. Ricorda: per richiamare/salvare una scena con un comando DIM, inserisci nel Trigger Value l'oggetto corretto di dimming (`{decr_incr:1,data:5}` per alzare, `{decr_incr:0,data:5}` per abbassare). |
| Scene Save | **Datapoint ** e**Trigger Value** . Indirizzo di gruppo per il salvataggio scena (es. `0/0/2`). Il nodo reagisce ai telegrammi ricevuti salvando i valori correnti di tutti i dispositivi della scena in memoria non volatile. Il Datapoint è il DPT della GA di salvataggio. Il Trigger Value è il valore che deve essere ricevuto per attivare il salvataggio. Ricorda: per richiamare/salvare una scena con DIM usa l'oggetto di dimming come sopra. |
| Node name | Nome nodo (puoi indicare ad es. "Recall: <dispositivo> / Save: <dispositivo>"). |
| Topic | Topic del nodo. |

## Configurazione scena

Aggiungi i dispositivi alla scena, come faresti con un vero controllore scene KNX. Ogni riga rappresenta un dispositivo.

La scena salva automaticamente i nuovi valori degli attuatori della lista non appena arrivano dal BUS.

| Proprietà | Descrizione |
|--|--|
| Pulsante ADD | Aggiunge una riga. |
| Campi riga | 1) Indirizzo di gruppo 2) Datapoint 3) Valore di default per questo dispositivo nella scena (può essere sovrascritto da Scene Save). Sotto, il nome del dispositivo.
 Per inserire una pausa, scrivi **wait ** nel primo campo e un numero nell'ultimo campo, che rappresenta la durata (millisecondi), ad es. `2000`.
 Il comando**wait** accetta anche secondi, minuti o ore: aggiungi `s` (es. `12s`), `m` (es. `5m`) o `h` (es. `1h`). |
| Pulsante Remove | Rimuove una riga/dispositivo. |

## Messaggi in uscita

```javascript

msg = {
  topic: "Scene Controller", // topic del nodo
  recallscene: true|false, // true se è stata richiamata una scena
  savescene: true|false, // true se è stata salvata una scena
  savevalue: true|false, // true se è stato salvato manualmente il valore di una GA di un attuatore della scena
  disabled: true|false // true se il controller scena è stato disabilitato via msg.disabled = true
}
```

---

## Messaggi di ingresso (INPUT)

Il nodo reagisce principalmente ai telegrammi KNX per richiamare/salvare le scene, ma puoi anche pilotarlo via msg. È possibile disabilitare i comandi provenienti dal BUS KNX e usare solo quelli dal flow.

**Richiama una scena**

```javascript

msg.recallscene = true;
return msg;
```

**Salva una scena**

```javascript

msg.savescene = true;
return msg;
```

**Salva il valore corrente di una GA**

La scena salva già automaticamente i valori aggiornati degli attuatori. A volte però è utile salvare come "valore reale di scena” il valore attuale di una GA diversa da quella prevista in scena (es. usare una GA di stato al posto di una GA di comando).

Esempio: un attuatore tapparella ha GA di comando e GA di stato; il valore certo della posizione è nella GA di stato "altezza assoluta”. Con questa GA puoi aggiornare le GA di comando degli attuatori presenti in scena.

```javascript

// Salva lo stato (ad es. 70%) di una tapparella appartenente alla scena
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // valore da salvare
return msg;
```

**Disabilita il Scene Controller**

Disabilita i comandi dal BUS KNX (i msg dal flow restano accettati). Utile ad esempio di notte se non vuoi richiamare/salvare scene da pulsanti reali.

```javascript

msg.disabled = true; // false per riabilitare
return msg;
```

## Vedi anche

[Sample Scene Controller](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
