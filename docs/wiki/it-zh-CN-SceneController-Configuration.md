---
layout: wiki
title: "zh-CN-SceneController-Configuration"
lang: it
permalink: /wiki/it-zh-CN-SceneController-Configuration
---
---
# Controller di scena
Questo nodo è coerente con il controller della scena KNX: la scena può essere salvata e richiamata.
Impostazioni del nodo ##
| Proprietà | Descrizione |
|-|-|
| Gateway | Gateway KNX selezionato. |
| RICHIEME DI SCENA | **DataPoint ** e**Valore trigger** . L'indirizzo di gruppo utilizzato per ricordare lo scenario (come `0/0/1`).Il nodo ricorda la scena quando il messaggio viene ricevuto da questo GA.DPT è il tipo di richiamo GA;Il valore del trigger è il valore richiesto per attivare il richiamo.Suggerimento: se attivato in modalità Dim, si prega di impostare il valore dell'oggetto Dimming corretto (aggiornamento per `{decrec_incr: 1, dati: 5}` e il regolamento di discesa da `{decrec_incr: 0, dati: 5}`).|
| Scene Salva | **DataPoint ** e**Valore trigger** . L'indirizzo di gruppo utilizzato per salvare la scena (come `0/0/2`).Quando un nodo riceve un messaggio, salva il valore corrente di tutti i dispositivi nella scena (archiviazione non volatile).DPT è il tipo per salvare GA; Trigger Value Trigger Save (Dim supra). |
| Nome nodo | Nome nodo (scrivi "Ricorda: ... / Salva: ..."). |
| Argomento | L'argomento del nodo. |
## configurazione dello scenario
Come un vero controller di scena KNX, aggiungi dispositivi alla scena;Ogni riga rappresenta un dispositivo.
Una volta ricevuto un nuovo valore dal bus, il nodo registrerà automaticamente l'ultimo valore dell'attuatore nella scena.
| Proprietà | Descrizione |
|-|-|
|Aggiungi pulsante | Aggiungi una nuova riga. |
| Campo di riga |1) Indirizzo di gruppo 2) DataPoint 3) Valore della scena predefinito (può essere sovrascritto per salvataggio di scena).Il nome del dispositivo è sotto.<br/> Inserisci pausa: compila **Aspetta ** nella prima colonna e compila l'ultima colonna per la durata (millisecondi), come `2000`.<br/>**Wait** supporta anche secondi/minuto/ora: `12s`,` 5m`, `1H`. |
| Rimuovere |Rimuovere questa linea del dispositivo.|
Output del nodo ##

```javascript

msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```

---

## Input Message (Input)
Il nodo si basa principalmente sui messaggi KNX per richiamare/salvare la scena; Può anche essere controllato attraverso i messaggi.I comandi dal bus possono essere disabilitati e solo i messaggi di elaborazione possono essere accettati.
**Scenario di richiamo** 

```javascript

msg.recallscene = true; return msg;
```

**Salva scena** 

```javascript

msg.savescene = true; return msg;
```

**Salva il valore corrente di un ga**
Sebbene la scena traccia automaticamente il valore dell'esecutore, in alcuni casi, è necessario registrare il valore corrente di un altro GA (come lo stato piuttosto che il comando) con un "valore della scena reale".
Ad esempio, l'otturatore a rulli: lo stato GA di altezza assoluta riflette la posizione esatta.Questo stato GA viene utilizzato per aggiornare il comando GA dell'esecutore pertinente nella scena.

```javascript

msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
```

**Disabilita il controller della scena**
Disabilita i comandi dal bus KNX (accetta ancora messaggi di processo).Ad esempio, è utile quando non si desidera ricordare/salvare una scena dal pulsante Entità di notte.

```javascript

msg.disabled = true; // false 重新启用
return msg;
```

## Vedere
[Esempio di controller scene](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
