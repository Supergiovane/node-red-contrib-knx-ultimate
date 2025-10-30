🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)
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
Output del nodo ##```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```---
## Input Message (Input)
Il nodo si basa principalmente sui messaggi KNX per richiamare/salvare la scena; Può anche essere controllato attraverso i messaggi.I comandi dal bus possono essere disabilitati e solo i messaggi di elaborazione possono essere accettati.
**Scenario di richiamo** ```javascript
msg.recallscene = true; return msg;
``` **Salva scena** ```javascript
msg.savescene = true; return msg;
``` **Salva il valore corrente di un ga**
Sebbene la scena traccia automaticamente il valore dell'esecutore, in alcuni casi, è necessario registrare il valore corrente di un altro GA (come lo stato piuttosto che il comando) con un "valore della scena reale".
Ad esempio, l'otturatore a rulli: lo stato GA di altezza assoluta riflette la posizione esatta.Questo stato GA viene utilizzato per aggiornare il comando GA dell'esecutore pertinente nella scena.```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
``` **Disabilita il controller della scena**
Disabilita i comandi dal bus KNX (accetta ancora messaggi di processo).Ad esempio, è utile quando non si desidera ricordare/salvare una scena dal pulsante Entità di notte.```javascript
msg.disabled = true; // false 重新启用
return msg;
```## Vedere
[Esempio di controller scene](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)