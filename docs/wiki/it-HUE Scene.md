🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Scene) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Scene) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Scene) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene)
🌐 Lingua: [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Scene) | [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene)
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
Il nodo **Hue Scene** pubblica le scene Hue su KNX e può inoltrare gli eventi grezzi al flow di Node-RED. Il campo scena supporta l'autocompletamento; dopo aver creato nuove scene sulla bridge premi l'icona di aggiornamento per ricaricare l'elenco.
### Schede disponibili
- **Mappatura** - collega gli indirizzi di gruppo KNX alla scena selezionata. I DPT 1.xxx eseguono un richiamo booleano, mentre i DPT 18.xxx inviano un numero scena KNX.
- **Multi scena** - crea un elenco di regole che associano numeri scena KNX a scene Hue e definiscono se richiamarle come _active_, _dynamic\_palette_ o _static_.
- **Comportamento** - mostra/nasconde il pin di output del nodo. Senza un gateway KNX configurato il pin rimane comunque attivo, così gli eventi Hue raggiungono il flow.
### Impostazioni generali
| Proprietà | Descrizione |
|--|--|
| KNX GW | Gateway KNX che fornisce il catalogo delle GA per l'autocomplete. |
| Bridge Hue | Bridge Hue che ospita le scene. |
| Hue Scene | Scena da richiamare (autocomplete; il pulsante di refresh ricarica il catalogo). |
### Scheda Mappatura
| Proprietà | Descrizione |
|--|--|
| GA richiamo | Indirizzo KNX che richiama la scena. Usa DPT 1.xxx per un comando booleano o DPT 18.xxx per inviare un numero scena. |
| DPT | Datapoint usato per il richiamo (1.xxx oppure 18.001). |
| Nome | Etichetta descrittiva per la GA di richiamo. |
| # | Appare quando è selezionato un DPT scena KNX; scegli il numero scena da inviare. |
| GA stato | GA opzionale che indica se la scena è attualmente attiva (booleano). |
### Scheda Multi scena
| Proprietà | Descrizione |
|--|--|
| GA richiamo | GA KNX (DPT 18.001) che consente di selezionare le scene tramite numero. |
| Selettore scene | Lista modificabile che abbina numeri scena KNX a scene Hue e imposta la modalità di richiamo. Trascina le "grip” per riordinare. |
> ℹ️ Gli elementi KNX vengono mostrati solo dopo aver selezionato un gateway KNX. Le schede di mappatura restano nascoste finché non sono configurati sia bridge sia gateway.
