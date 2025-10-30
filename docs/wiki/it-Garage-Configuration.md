🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Garage-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Garage-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Garage-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Garage-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Garage-Configuration)
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
# Porta garage
Il nodo **KNX Garage** comanda un portone motorizzato con GA dedicate ai comandi diretti o a impulso, integra fotocellula e stato di ostruzione, permette il blocco della richiusura e la disabilitazione e può richiudere automaticamente dopo un intervallo.
## Indirizzi di gruppo
|Scopo|Proprietà|Note|
|--|--|--|
| Comando diretto | `Command GA` (`gaCommand`) | GA booleana: `true` apre, `false` chiude (DPT 1.001). |
| Impulso toggle | `Impulse GA` (`gaImpulse`) | Il fronte attivo commuta il portone (DPT 1.017). Usata anche in assenza di comando diretto. |
| Movimento | `gaMoving` | Impulso opzionale quando il nodo comanda il portone, utile per logiche ausiliarie. |
| Ostruzione | `gaObstruction` | Replica lo stato di ostruzione così altri dispositivi possono reagire. |
| Blocco richiusura | `gaHoldOpen` | Mantiene aperto e cancella la richiusura automatica finché resta a true. |
| Disabilitazione | `gaDisable` | Blocca qualsiasi comando emesso dal nodo (modo manutenzione/manuale). |
| Fotocellula | `gaPhotocell` | Va a true quando la fotocellula rileva un ostacolo; il nodo riapre e segnala l'ostruzione. |
## Richiusura automatica
- Abilita il timer di richiusura per inviare automaticamente il comando di chiusura dopo il tempo impostato.
- Il timer è sospeso mentre blocco richiusura o disabilitazione sono attivi.
- Allo scadere viene emesso l'evento `auto-close` e, se configurato, il comando diretto o l'impulso.
## Sicurezza
- Una fotocellula a true durante la chiusura provoca la riapertura immediata e l'impostazione dello stato di ostruzione.
- Scritture esterne sulla GA ostruzione mantengono allineati dashboard e logiche.
- Gli impulsi di movimento possono pilotare ventilazione, illuminazione o sistemi di allarme.
## Integrazione con i flow
- `msg.payload` accetta `true`, `false`, `'open'`, `'close'`, `'toggle'` per azionare il portone.
- Con *Emetti eventi* attivo vengono generati oggetti con `event`, `state`, `disabled`, `holdOpen`, `obstruction`.
## Esempio dal flow
```javascript
// Apri il portone
msg.payload = 'open'; // oppure true
return msg;
```
```javascript
// Chiudi il portone
msg.payload = 'close'; // oppure false
return msg;
```
```javascript
// Commutazione del portone
msg.payload = 'toggle';
return msg;
```
