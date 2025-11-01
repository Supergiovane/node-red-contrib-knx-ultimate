---
layout: wiki
title: "zh-CN-WatchDog-Configuration"
lang: it
permalink: /wiki/it-zh-CN-WatchDog-Configuration/
---
---
# Watchdog (watchdog)
Utilizzato per rilevare lo stato di connessione con un gateway o un dispositivo KNX specifico ed eseguire operazioni automatizzate in caso di guasto.
**Funzione**
1. Invia periodicamente i messaggi e attendi una risposta. Se la connessione del bus è anormale, output dei messaggi nel processo.Sono disponibili due livelli di rilevamento (vedi sotto).
2. Modifica i parametri gateway del nodo di configurazione (configurazione) tramite il messaggio per realizzare la commutazione del router/interfaccia KNX/IP (come la commutazione del supporto master).
3. Forzare l'istituzione/disconnessione dal bus KNX.
## Ethernet Layer e KNX Twisted Pair Straying Detection
Watchdog fornisce test a due livelli:
- Livello Ethernet: rileva solo la connettività tra KNX -ultimo e l'interfaccia KNX/IP (Unicast).
- Ethernet + KNX -TP: controlla l'intero collegamento (Ethernet → TP).È richiesto un dispositivo fisico che risponde alle richieste di lettura.
Adatto per allarmi di errore di errore/connessione (notifiche e -mail, commutazione automatica del gateway di backup, ecc.).
## Impostazioni (impostazioni)
| Proprietà | Descrizione |
|-|-|
| Gateway | Gateway KNX selezionato. |
|Indirizzo di gruppo per monitorare |Indirizzo di gruppo utilizzato per l'invio e il monitoraggio; DPT deve essere 1.x (booleano).|
| Nome | Nome nodo. |
|Auto Avvia il timer del cane da guardia | Avviare automaticamente il timer su distribuzione/avvio. |
| Controlla livello |Vedi sopra. |
**Controlla livello**
> Ethernet: rilevare connessioni tra KNX -ultimo (unicast) e l'interfaccia KNX/IP. <br/>
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width = "90%"> <br/>
> Ethernet + KNX TP: rilevamento completo (supporta router/interfaccia).Invia leggi al dispositivo fisico e attendi la risposta;Verranno segnalati eventuali guasti su Ethernet o TP.Si prega di configurare uno stato **** GA in ETS per un attuatore che risponde alla lettura. <br/>
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" walidth = "90%"> <br/>
## opzioni avanzate
| Proprietà | Descrizione |
|-|-|
| Retry Interval (in secondi) | Intervallo di rilevamento in secondi. |
| Numero di pensionati prima di dare un errore |Quanti fallimenti consecutivi sono riportati. |
# Output del watchdog
Il cane da guardia emette un messaggio quando il rilevamento interno trova un errore o un nodo KNX -ultimo riporta un errore nel processo. ** Problema di connessione di Watchdog** <a href = "/node-red-contrib-knx-ultimate/wiki/watchdog-configuration" target = "_ blank"> vedi qui per i dettagli </a>

```javascript

msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
```

** Eccezione si è verificata su uno dei tuoi nodi KNX -ultimo** 

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

** Modifica la configurazione del gateway tramite setGatewayConfig** 

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

** Connessione forzata/disconnessione** 

```javascript

msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```

---

# Immettere messaggio (input)
## Avvia/Stop Watchdog

```javascript

msg.start = true; return msg; // 启动
```

```javascript
msg.start = false; return msg; // 停止
```

## Modifica le impostazioni del gateway KNX/IP durante il runtime
Modificare IP/Port/PhysicalAddress/Protocol, ecc. Attraverso `msg.setgatewayconfig`; Il nodo di configurazione applicherà la riconnessione.Node -Red si ripristina alle impostazioni nel nodo di configurazione dopo il riavvio.Tutti i parametri sono opzionali.

```javascript

msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Cambia

solo l'IP:

```javascript

msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
```

** Disconnettere e disabilitare la riconnessione automatica** 

```javascript

msg.connectGateway = false; return msg;
```

** Connessione forzata e abilitare la riconnessione automatica** 

```javascript

msg.connectGateway = true; return msg;
```

## Vedere
[Watchdog di esempio](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
