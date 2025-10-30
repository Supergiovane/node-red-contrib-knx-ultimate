🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)
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
# Configurazione del nodo Alerter
Utilizzare il nodo Alerter per richiedere se il dispositivo selezionato è in uno stato di allarme sul monitor o tramite il nodo nodo-rosso-confrib-tts-ultimo (trasmissione vocale), cioè "payload" è **vero** .
Questo nodo emette messaggi contenenti i dettagli del dispositivo di allarme corrente ad un intervallo di tempo configurabile (uno alla volta).Ad esempio, può dirti "quante finestre sono aperte". <br/>
Il nodo legge direttamente il valore del dispositivo dal bus KNX.Inoltre, puoi anche inviare avvisi personalizzati ai nodi, indipendentemente dai dispositivi KNX.<br/>
La pagina di esempio mostra come viene utilizzata nel processo.<br/>
- **Gateway (gateway)**
> Seleziona il gateway KNX da utilizzare.Non puoi anche selezionare il gateway;In questo momento vengono elaborati solo i messaggi che entrano nel nodo.
- **nome (nome)**
> Nome nodo.
- **Come iniziare il sondaggio di allarme**
> Seleziona l'evento che innesca l'inizio dell'invio del messaggio di allarme.
- **Intervallo di ogni messaggio (secondi)**
> L'intervallo di tempo tra due messaggi di output consecutivi.
## attrezzatura che richiede il monitoraggio
Aggiungi i dispositivi che devono essere monitorati qui.<br/>
Compilare l'indirizzo del gruppo del dispositivo o specificare un'etichetta per il dispositivo.<br/>
- **Leggi il valore di ciascun dispositivo quando si collega/riconnetti**
> Quando si avvia o si riconnette, il nodo invia una richiesta di lettura per ciascun dispositivo nell'elenco.
- **Aggiungi pulsante**
> Aggiungi una riga all'elenco.
- **Linea dell'attrezzatura ** > La prima colonna è l'indirizzo di gruppo (è anche possibile compilare qualsiasi testo da utilizzare con i messaggi di input; vedere la pagina di esempio).La seconda colonna è l'abbreviazione del dispositivo (**fino a 14 caratteri** ).La terza colonna è il nome completo del dispositivo.
- **Elimina pulsante**
> Rimuovere il dispositivo dall'elenco.
<br/>
<br/>
## il messaggio di output del nodo
PIN1: ogni dispositivo di allarme emette un messaggio in base all'intervallo impostata.<br/>
PIN2: output Un messaggio di riepilogo contenente tutti i dispositivi nello stato di allarme.<br/>
Pin3: solo l'ultimo dispositivo che è entrato nello stato di allarme è in uscita.<br/>
**pin1** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
``` **pin2** ```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "入户门, 客厅壁灯, 地下室壁灯, 书房灯",
  longdevicename: "主入户门, 客厅左侧壁灯, 地下室右侧壁灯, 书房顶灯",
  count: 4,
  payload: true
}
``` **pin3** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```Output Quando tutti i dispositivi sono fermi (senza allarmi):
**pin1, pin2, pin3** ```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```<br/>
<br/>
## messaggio di input per nodo```javascript
msg.readstatus = true
```Legge il valore corrente di ciascun dispositivo nell'elenco.```javascript
msg.start = true
```Avvia un sondaggio che "attraversa tutti i dispositivi di allarme e le uscite a loro volta".Il sondaggio termina dopo l'ultimo dispositivo uscita; Se il sondaggio di nuovo, invia di nuovo il messaggio di input.
<br/>
**Allarme del dispositivo personalizzato** <br/>
Per aggiornare lo stato di un dispositivo personalizzato (true/false), invia il seguente messaggio di input:```javascript
msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```<br/>
## Esempio
<a href = "/node-red-contrib-knx-ultimate/wiki/samplealerter"> fai clic qui per visualizzare l'esempio </a>
<br/>
<br/>
<br/>
