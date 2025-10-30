🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Staircase-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Staircase-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Staircase-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Staircase-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Staircase-Configuration)
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
# Temporizzatore scale
Il nodo **Temporizzatore scale KNX** replica il timer delle luci scala. Quando la GA di impulso riceve un fronte attivo il portone viene acceso, parte il conto alla rovescia e (se configurato) viene emesso un preavviso prima dello spegnimento. Sono disponibili override manuale, blocco e generazione di eventi per l'integrazione con Node-RED.
## Indirizzi di gruppo
|Scopo|Proprietà|Note|
|--|--|--|
| Impulso | `Trigger GA` (`gaTrigger`) | Il valore `1` avvia o estende il timer. Con l'opzione "Il valore 0 annulla" lo `0` spegne subito la luce. |
| Uscita | `Output GA` (`gaOutput`) | Pilota l'attuatore (DPT predefinito 1.001). |
| Stato | `Status GA` (`gaStatus`) | Replica lo stato attivo e il flag di preavviso. |
| Override | `gaOverride` | Mantiene la luce accesa finché resta a `1` e sospende il timer. |
| Blocco | `gaBlock` | Evita nuove attivazioni e può forzare lo spegnimento. |
## Timer e preavviso
- **Durata timer** definisce il tempo base del ciclo.
- **Nuovo impulso** consente di riavviare, prolungare o ignorare gli impulsi successivi.
- **Il valore 0 annulla il ciclo** ferma il timer con motivo `manual-off` quando l'impulso torna a `0`.
- **Quando è bloccato** decide se il blocco inibisce soltanto gli impulsi o spegne anche l'uscita.
- Il preavviso può segnalare lo spegnimento commutando la GA di stato o lampeggiando l'attuatore per la durata impostata.
## Eventi e output
- Attivando *Emit events* il nodo invia oggetti con `event`, `remaining`, `active`, `override`, `blocked` (`trigger`, `extend`, `prewarn`, `timeout`, `manual-off`, `override`, `block`).
- In alternativa puoi usare la GA di stato come feedback direttamente sul bus KNX.
## Esempio dal flow
```javascript
// Avvia il temporizzatore scale
msg.payload = true;
return msg;
```
```javascript
// Annulla il ciclo (opzione "Il valore 0 annulla")
msg.payload = false;
return msg;
```
## Suggerimenti operativi
- Usa l'override durante la manutenzione o le pulizie.
- Associa la GA di stato a un indicatore visivo o a una dashboard.
- Il lampeggio di preavviso richiede attuatori in grado di commutare rapidamente.
