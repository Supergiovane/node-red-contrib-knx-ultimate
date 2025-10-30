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
Con il nodo Alerter puoi segnalare su un display o al nodo node-red-contrib-tts-ultimate (feedback vocale) se i dispositivi selezionati sono in stato di allarme, cioè hanno `payload` **true** .
Il nodo emette messaggi a intervalli configurabili (uno alla volta) contenenti i dettagli di ciascun dispositivo in allarme. Ad esempio, può dirti quante e quali finestre sono aperte.<br/>
Il nodo legge i valori dei dispositivi direttamente dal BUS KNX. Inoltre puoi inviare al nodo messaggi personalizzati, non collegati a dispositivi KNX.<br/>
Nella pagina di esempio trovi come usarlo nel flusso.<br/>
- **Gateway**
> Gateway KNX selezionato. È anche possibile non selezionare alcun gateway; in tal caso verranno considerati solo i messaggi in ingresso al nodo.
- **Nome**
> Nome del nodo.
- **Tipo di avvio del ciclo di avvisi**
> Seleziona l'evento che fa partire il ciclo di invio dei messaggi relativi ai dispositivi in allarme.
- **Intervallo tra ciascun MSG (in secondi)**
> Intervallo fra ciascun messaggio emesso dal nodo.
## Dispositivi da monitorare
Qui puoi aggiungere i dispositivi da tenere sotto controllo.<br/>
Inserisci l'indirizzo di gruppo o un'etichetta per il dispositivo.<br/>
- **Leggi il valore di ciascun dispositivo alla connessione/riconnessione**
> All'avvio o alla riconnessione, il nodo invia una richiesta di lettura per ogni dispositivo presente in elenco.
- **Pulsante Aggiungi**
> Aggiunge una riga all'elenco.
- **Righe dei dispositivi ** > Il primo campo è l'indirizzo di gruppo (puoi anche inserire un testo qualsiasi, utile con i messaggi in ingresso: vedi la pagina di esempio), il secondo è il nome breve del dispositivo (**MAX 14 CARATTERI** ), il terzo è il nome esteso.
- **Pulsante Elimina**
> Rimuove il dispositivo dall'elenco.
<br/>
<br/>
## Messaggi in uscita dal nodo
PIN1: il nodo emette un messaggio per ciascun dispositivo in allarme, a intervalli selezionabili.<br/>
PIN2: il nodo emette un unico messaggio che contiene tutti i dispositivi in allarme.<br/>
PIN3: il nodo emette un messaggio che contiene solo l'ultimo dispositivo andato in allarme.<br/>
**PIN1**
```javascript
msg = {
  topic: "0/1/12",
  count: 3, // Numero TOTALE di dispositivi in allarme
  devicename: "Finestra camera",
  longdevicename: "Finestra principale camera",
  payload: true
}
```
**PIN2**
```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "Porta ingresso, Applique soggiorno, Applique taverna, Luce studio",
  longdevicename: "Porta d'ingresso principale, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
  count: 4,
  payload: true
}
```
**PIN3**
```javascript
msg = {
  topic: "0/1/12",
  count: 3, // Numero TOTALE di dispositivi in allarme
  devicename: "Finestra camera",
  longdevicename: "Finestra principale camera",
  payload: true
}
```
Messaggio in uscita quando tutti i dispositivi sono a riposo:
**PIN1, PIN2, PIN3**
```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```
<br/>
<br/>
## Messaggi in ingresso al nodo
```javascript
msg.readstatus = true
```
Legge il valore di ciascun dispositivo presente in elenco.
```javascript
msg.start = true
```
Avvia il ciclo di invio di tutti i dispositivi in allarme. Il ciclo termina con l'ultimo dispositivo; per ripeterlo, reinvia questo messaggio.
<br/>
**Allarme dispositivo personalizzato** <br/>
Per aggiornare lo stato (true/false) di un dispositivo personalizzato, invia questo messaggio in ingresso:
```javascript
msg = {
  topic: "door",
  payload: true // Oppure false per azzerare l'allarme di questo dispositivo
}
```
<br/>
## Esempio
<a href="/node-red-contrib-knx-ultimate/wiki/SampleAlerter">FAI CLIC QUI PER L'ESEMPIO</a>
<br/>
<br/>
<br/>
