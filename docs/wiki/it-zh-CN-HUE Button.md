🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Button) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Button) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Button) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Button) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Button) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Button)
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
Il nodo del pulsante <p> HUE mappa l'evento del pulsante HUE su KNX utilizzando il pulsante <code> </p>
Digitare la casella di input GA (nome o indirizzo di gruppo) per associare KNX GA;Il dispositivo corrispondente verrà visualizzato quando si entra.
**convenzionale**
| Proprietà | Descrizione |
|-|-|
| KNX Gateway | Seleziona il gateway KNX da utilizzare |
| Bridge Hue | Seleziona il ponte Hue da usare |
| Button Hue | Pulsante Hue da utilizzare (completato automaticamente quando input) |
**interruttore**
| Proprietà | Descrizione |
|-|-|
| Interruttore | GA attivato da <code> corto \ _release </code> (rilascio press breve). |
| Stato GA |Feedback opzionale GA Quando è abilitato "Valore di commutazione per evento" per mantenere sincronizzato lo stato interno.|
**DIMMULIPLEX**
| Proprietà | Descrizione |
|-|-|
| Dimming | <code> Long \ _press </code>/<code> ripetizione </code> GA utilizzato per il bighellone durante l'evento (di solito DPT 3.007). |
**Comportamento**
|Proprietà | Descrizione |
|-|-|
| Switch Values ​​per ogni evento | Se abilitato, passare automaticamente tra <code> true/false </code> e la direzione di dimming.|
| Carico di commutazione |Carico fisso inviato a KNX/Processo quando la commutazione è disabilitata.|
| Carico di oscuramento | Dimpido di dignaggio fisso inviato a KNX/Flow quando la commutazione è disabilitata. |
### Produzione
1. Output standard
: `msg.payload` è un oggetto booleano o oscurante;`msg.event` è una stringa di eventi Hue (ad esempio` short_release`, `ripetizioni`).
### Dettagli
`msg.event` corrisponde a` button.button_report.event`, e l'evento Hue originale è contenuto in `msg.rawevent`.L'uso di uno stato opzionale GA consente allo stato di commutazione interno di essere coerente con dispositivi esterni come gli interruttori a parete.