🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
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
# Logger
Il nodo Logger registra tutti i telegrammi e produce un file compatibile con l'XML del bus monitor ETS.
Puoi salvarlo su disco (nodo file) oppure inviarlo, ad esempio, a un server FTP. Il file può essere letto in ETS per diagnosi o per il replay dei telegrammi.
Il nodo può anche contare i telegrammi al secondo (o con l'intervallo che preferisci). <br/> <a href="/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">Esempi qui.</a>
## Impostazioni
|Proprietà|Descrizione|
|--|--|
| Gateway | Gateway KNX. |
| Topic | Topic del nodo. |
| Nome | Nome del nodo. |
## File diagnostico BUS compatibile ETS
|Proprietà|Descrizione|
|--|--|
| Auto start timer | Avvia automaticamente il timer al deploy o all'avvio di Node‑RED. |
| Output new XML every (in minutes) | Ogni quanti minuti emettere il file XML compatibile con ETS. |
| Max number of rows in XML (0 = no limit) | Numero massimo di righe contenute nell'XML nell'intervallo indicato; 0 per nessun limite. |
## Contatore telegrammi KNX
|Proprietà|Descrizione|
|--|--|
| Auto start timer | Avvia automaticamente il timer al deploy o all'avvio di Node‑RED. |
| Count interval (in seconds) | Ogni quanti secondi emettere nel flow il conteggio dei telegrammi. |
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
- [Sample Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
