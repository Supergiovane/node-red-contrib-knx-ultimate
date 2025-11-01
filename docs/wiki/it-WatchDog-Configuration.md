---
layout: wiki
title: "WatchDog-Configuration"
lang: it
permalink: /wiki/it-WatchDog-Configuration/
---
# WatchDog

Controlla la connessione al Gateway o a uno specifico dispositivo KNX e consente azioni automatiche in caso di problemi.

**Cosa fa**

1. Verifica la salute della comunicazione KNX inviando periodicamente un telegramma, attende una risposta e invia un msg al flow se la connessione al BUS è interrotta. Due livelli di controllo (vedi sotto).
2. Modifica via messaggio i parametri del nodo di configurazione (Config‑Node), quindi la connessione verso il tuo KNX/IP Router/Interface (es. switch tra due gateway per backup).
3. Forza connessione/disconnessione del gateway verso il BUS KNX.

## Verifiche a livello Ethernet e a livello KNX Twisted Pair

Il WatchDog ha due livelli di controllo.

- Primo livello: controlla solo la connessione tra KNX‑Ultimate e l'interfaccia KNX/IP in modalità unicast.
- Secondo livello: controlla l'intera catena, dal nodo Gateway KNX‑Ultimate alla rete Ethernet fino al KNX TP e viceversa; richiede un dispositivo fisico che risponda a richieste di lettura.

Il WatchDog è molto utile per notificare errori e problemi di connessione: puoi inviare un'email all'installatore KNX o passare automaticamente a un gateway di backup.

## Impostazioni (SETTINGS)

| Proprietà | Descrizione |
|--|--|
| Gateway | Gateway KNX selezionato. |
| Group Address to monitor | GA a cui inviare il telegramma e da cui attendere risposta sul BUS KNX. Il Datapoint deve essere DPT 1.x (boolean). |
| Name | Nome del nodo. |
| Auto start the watchdog timer | Avvio automatico del timer al deploy o all'avvio di Node‑RED. |
| Check level | Vedi sotto. |

**Check level**

> Ethernet: controlla la connessione tra il Gateway KNX‑Ultimate (in unicast) e la tua KNX/IP Interface.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width="90%">

> Ethernet e KNX TP: controllo completo (KNX/IP Router o Interface). Verifica la comunicazione con un dispositivo fisico inviando una richiesta di lettura e attendendo una risposta. Qualsiasi problema lato Ethernet o KNX TP viene segnalato. Riserva una GA di "Status” in ETS su un attuatore che risponda ai Read.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" width="90%">

## Opzioni avanzate

| Proprietà | Descrizione |
|--|--|
| Retry interval (in seconds) | Intervallo (s) tra due verifiche: il nodo invia un telegramma al BUS con questa cadenza. |
| Number of retry before giving an error | Dopo questo numero di tentativi senza risposta, il nodo genera errore. |

# Messaggi in uscita dal WatchDog

Il nodo emette un messaggio quando riceve un errore da un qualsiasi nodo KNX‑Ultimate nel flow, oppure quando il watchdog interno intercetta un errore di comunicazione sul BUS KNX.

**In caso di problema di connessione rilevato dal WatchDog**

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration" target="_blank">Vedi qui.</a>

```javascript

msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // oppure "Eth+KNX"
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
```

**In caso di errore di un tuo nodo KNX‑Ultimate**

```javascript

msg = {
  type: "NodeError",
  checkPerformed: "Self KNX-Ultimate node reporting a red color status",
  nodeid: "23HJ.2355",
  payload: true,
  description: "...",
  completeError: {
    nodeid: "23HJ.2355",
    topic: "0/1/1",
    devicename: "Kitchen Light",
    GA: "0/1/1"
  }
}
```

**Se viene richiamata una nuova configurazione gateway tramite setGatewayConfig**

```javascript

msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
```

**Connessione/Disconnessione forzata**

```javascript

msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=connessione, false=disconnessione
  description: "Connection",
  completeError: ""
}
```

---

# Messaggi di ingresso (INPUT)

Il WatchDog accetta input dal flow ed emette output verso il flow. Di seguito il formato dei messaggi da inviare/attesi.

## Avviare e fermare il WatchDog

**START**

```javascript

msg.start = true;
return msg;
```

**STOP**

```javascript

msg.start = false;
return msg;
```

## Modificare al volo le impostazioni del KNX/IP Router/Interface

Con `msg.setGatewayConfig` puoi cambiare IP, Porta, Indirizzo Fisico, Protocollo, ecc., del gateway configurato nel Config‑Node. Il Config‑Node applica i parametri e si riconnette. Al riavvio di Node‑RED, le impostazioni tornano a quelle del Config‑Node.

Tutti i parametri sono opzionali.

```javascript

// IP, Port, PhysicalAddress, BindToEthernetInterface ("Auto" o nome scheda, es. "en0"), Protocol: "TunnelUDP"|"TunnelTCP"|"Multicast"
// importCSV: contenuto ETS CSV/ESF (vedi wiki Gateway Config)
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```

Per cambiare solo l'IP:

```javascript

msg.setGatewayConfig = { IP:"224.0.23.12" };
return msg;
```

**Forzare disconnessione e disabilitare i tentativi di auto‑reconnect**

```javascript

msg.connectGateway = false;
return msg;
```

**Forzare connessione e abilitare i tentativi di auto‑reconnect**

```javascript

msg.connectGateway = true;
return msg;
```

## Vedi anche

[Sample WatchDog](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
