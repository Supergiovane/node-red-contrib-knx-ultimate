🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)
<!-- NAV START -->
Navigazione: [Home](/node-red-contrib-knx-ultimate/wiki/it-Home)  
Panoramica: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) • [Sicurezza](/node-red-contrib-knx-ultimate/wiki/it-SECURITY) • [Docs: Barra lingue](/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar)  
Nodo KNX Dispositivo: [Gateway](/node-red-contrib-knx-ultimate/wiki/it-Gateway-configuration) • [Dispositivo](/node-red-contrib-knx-ultimate/wiki/it-Device) • [Protezioni](/node-red-contrib-knx-ultimate/wiki/it-Protections)  
Altri Nodi KNX: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) • [Controllo Carico](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/it-knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) • [Traduttore HA](/node-red-contrib-knx-ultimate/wiki/it-HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/it-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/it-HUE+Bridge+configuration) • [Luce](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light) • [Batteria](/node-red-contrib-knx-ultimate/wiki/it-HUE+Battery) • [Pulsante](/node-red-contrib-knx-ultimate/wiki/it-HUE+Button) • [Contatto](/node-red-contrib-knx-ultimate/wiki/it-HUE+Contact+sensor) • [Aggiornamento SW](/node-red-contrib-knx-ultimate/wiki/it-HUE+Device+software+update) • [Sensore Luce](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light+sensor) • [Movimento](/node-red-contrib-knx-ultimate/wiki/it-HUE+Motion) • [Scena](/node-red-contrib-knx-ultimate/wiki/it-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/it-HUE+Tapdial) • [Temperatura](/node-red-contrib-knx-ultimate/wiki/it-HUE+Temperature+sensor) • [Connettività Zigbee](/node-red-contrib-knx-ultimate/wiki/it-HUE+Zigbee+connectivity)  
Esempi: [Logger](/node-red-contrib-knx-ultimate/wiki/it-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribuisci alla Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/it-Manage-Wiki)
<!-- NAV END -->
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
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogethernetlevel.png" width = "90%"> <br/>
> Ethernet + KNX TP: rilevamento completo (supporta router/interfaccia).Invia leggi al dispositivo fisico e attendi la risposta;Verranno segnalati eventuali guasti su Ethernet o TP.Si prega di configurare uno stato **** GA in ETS per un attuatore che risponde alla lettura. <br/>
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogethernetknxtplevel.png" walidth = "90%"> <br/>
## opzioni avanzate
| Proprietà | Descrizione |
|-|-|
| Retry Interval (in secondi) | Intervallo di rilevamento in secondi. |
| Numero di pensionati prima di dare un errore |Quanti fallimenti consecutivi sono riportati. |
# Output del watchdog
Il cane da guardia emette un messaggio quando il rilevamento interno trova un errore o un nodo KNX -ultimo riporta un errore nel processo. ** Problema di connessione di Watchdog** <a href = "/node-red-contrib-knx-ultimate/wiki/watchdog-configuration" target = "_ blank"> vedi qui per i dettagli </a>```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
``` ** Eccezione si è verificata su uno dei tuoi nodi KNX -ultimo** ```javascript
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
``` ** Modifica la configurazione del gateway tramite setGatewayConfig** ```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
``` ** Connessione forzata/disconnessione** ```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```---
# Immettere messaggio (input)
## Avvia/Stop Watchdog```javascript
msg.start = true; return msg; // 启动
```
```javascript
msg.start = false; return msg; // 停止
```## Modifica le impostazioni del gateway KNX/IP durante il runtime
Modificare IP/Port/PhysicalAddress/Protocol, ecc. Attraverso `msg.setgatewayconfig`; Il nodo di configurazione applicherà la riconnessione.Node -Red si ripristina alle impostazioni nel nodo di configurazione dopo il riavvio.Tutti i parametri sono opzionali.```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Cambia solo l'IP:```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
``` ** Disconnettere e disabilitare la riconnessione automatica** ```javascript
msg.connectGateway = false; return msg;
``` ** Connessione forzata e abilitare la riconnessione automatica** ```javascript
msg.connectGateway = true; return msg;
```## Vedere
[Watchdog di esempio](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)