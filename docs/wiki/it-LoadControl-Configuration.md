🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)
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
# Nodo di controllo del carico KNX
<p> Con il nodo di controllo del carico è possibile gestire automaticamente la disconnessione dei carichi (lavatrice, forno, ecc.) Quando il consumo corrente supera una determinata soglia.
I dispositivi vengono disattivati ​​in modo intelligente, controllando il possibile consumo del dispositivo per determinare se disattivarlo con gli altri.<br/>
Il nodo può riattivare automaticamente i carichi.<br/>
Il nodo disattiva un dispositivo (o più dispositivi) alla volta, in base all'ordine selezionato. <br/>
**Generale**
| Proprietà | Descrizione |
|-|-|
|Gateway |KNX Gateway.È anche possibile non selezionare alcun gateway;In questo caso verranno considerati solo i messaggi in arrivo al nodo.|
|Monitor WH |Indirizzo di gruppo che rappresenta il consumo totale del tuo edificio.|
|Limite WH |Soglia massima che il misuratore di elettricità può resistere.Quando questa soglia viene superata, il nodo inizia a disattivare i dispositivi.|
|Spegnere di ritardo Off (S) |Espresso in secondi, indica la frequenza con cui il nodo valuterà il consumo e spenderà ciascun dispositivo.|
|Interruttore di ritardo su (S) |Espresso in pochi secondi, indica la frequenza con cui il nodo valuterà il consumo e accenderà ciascun dispositivo spento.|
<br/>
\*\* Controllo del carico \*\*
Qui puoi aggiungere dispositivi per disattivare in caso di sovraccarico.<br/>
Scegli il dispositivo per spegnere.Immettere il nome del dispositivo o il suo indirizzo di gruppo.<br/>
Immettere qualsiasi indirizzo di gruppo che indica il consumo del dispositivo scelto nella prima riga.\*\* Questo è un parametro opzionale \*\*.Se il dispositivo consuma più di un certo numero di watt, significa che è in uso.Se consuma meno, il dispositivo verrà considerato "non in uso" e sia questo che il prossimo verranno disattivati ​​contemporaneamente. <br/>
Se \*Recupero automatico \* è abilitato, il dispositivo viene riattivato automaticamente quando il "ritardo di ripristino" scade.
## Input
| Proprietà | Descrizione |
|-|-|
|`msg.readstatus = true` |Forzare la lettura dei valori dal bus KNX di ciascun dispositivo nell'elenco.\*\*\* Il nodo fa già tutto da solo ___, ma se necessario, è possibile utilizzare questo comando per forzare una rilettura dei valori correnti in Watt. |
|`msg.enable = true` |Abilita il controllo del carico. |
|`msg.disable = true` |Disabilita il controllo del carico. |
|`msg.reset = true` |Ripristina gli stati del nodo e riaccendi tutti i dispositivi |
|`msg.shedding` |Corda._ Shed_ per iniziare la sequenza di spargimento di Formward,_ non è stato rilasciato\*per iniziare lo spargimento inverso.Utilizzare questo MSG per forzare il timer di spargimento ad avviare/fermare, ignorando l'indirizzo del gruppo \*\*Monitor WH \*\*.Impost&#x61;_&#x41;ut&#x6F;_&#x70;er abilitare di nuovo il monitoraggio dell'indirizzo del gruppo \*\*monitor wh \*\*.|
## Output
1. Output standard
   : payload (stringa | oggetto): l'output standard del comando.
## Dettagli
```javascript
msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}
```
# Campione
<a href = "/node-red-contrib-knx-ultimate/wiki/sampleloadcontrol"> fai clic qui per l'esempio </a>
<br/>
