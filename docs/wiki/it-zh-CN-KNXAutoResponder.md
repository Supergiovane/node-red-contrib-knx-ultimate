🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)
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
<p> Questo nodo risponderà alla richiesta di lettura del bus KNX.
Il nodo registra tutti i telegrammi che vengono trasferiti al bus KNX e memorizzare i valori in memoria.
Quindi risponde alla richiesta di lettura inviando tali valori memorizzati al bus in base alla richiesta.
Se l'indirizzo di gruppo da leggere non ha ancora valore, il nodo risponderà con il valore predefinito.
Questo nodo risponderà solo all'indirizzo di gruppo specificato nel campo **Response** JSON.
Per impostazione predefinita, esiste un testo JSON **Esempio ** precompilato**che puoi semplicemente cambiare/eliminare il contenuto.Assicurati ** NON premere**per usarlo!!! ** Configurazione** | Proprietà | Descrizione |
|-|-|
| Gateway | Seleziona il portale KNX da utilizzare |
| Risposta | Il nodo risponderà a una richiesta di lettura dall'indirizzo di gruppo specificato in questo array JSON.Il formato è specificato di seguito.|
<br/>
\*\*JSON FORMAT \*\*
JSON è sempre una serie di oggetti contenenti ogni istruzione. Ogni istruzione dice al nodo cosa fare.
| Proprietà | Descrizione |
|-|-|
| Nota | ** Chiave facoltativo** Nota per ottenere promemoria. Non verrà usato da nessuna parte.|
| Ga |Indirizzo di gruppo.Puoi anche usare ".." monete selvagge a gruppi specifici di indirizzi.".." può essere usato solo con il terzo livello GA, ad esempio: \*\*1/1/0..257**. Si prega di consultare il campione qui sotto.|
| Dpt | Point dati dell'indirizzo di gruppo, formato "1.001".Se il file CSV ETS è stato importato, **opzionale \*\*. |
| Impostazione predefinita |Quando il valore dell'indirizzo del componente non è stato ricordato dal nodo, viene inviato al bus in una risposta alla richiesta di lettura.| ** Cominciamo con un comando** Il nodo AutoResponder risponderà a una richiesta di lettura all'indirizzo di gruppo 2/7/1.Se non è ancora in memoria, risponderà con _true _. |
Il file CSV ETS deve essere importato, altrimenti è necessario anche aggiungere il tasto __"dpt": "1.001" \*\*.```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` ** Istruzioni più complete** Il nodo auto-rispondente risponderà alle richieste di lettura a partire dal 3/1/1, incluso il 3/1/22.Se la memoria non ha ancora valore, risponderà con _false _.
C'è anche una__ nota \*\*, che viene utilizzata solo come nota di promemoria.Non verrà usato da nessuna parte.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` ** Comando connesso** Dal 2/2/5 al 2/2/21, il nodo AutoResponder risponderà a una richiesta di lettura all'indirizzo del gruppo.Se non c'è ancora valore in memoria, risponderà con un valore di 25.
Il nodo AutoResponder risponderà anche alle richieste di lettura del componente 2/4/22.Se non c'è ancora valore in memoria, utilizzerà lo stato di stringa \*sconosciuto!\*rispondere.
Nota la ** virgola** tra gli oggetti JSON di ciascuna direttiva.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```<br/>