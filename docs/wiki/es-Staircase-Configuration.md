🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Staircase-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Staircase-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Staircase-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Staircase-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Staircase-Configuration)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
---
# Temporizador de escalera
El nodo **KNX Staircase** reproduce el comportamiento de un temporizador de escalera. Cuando la GA de impulso recibe un `1` la luz se enciende, se inicia la cuenta atrás y, si está configurado, se avisa antes de apagar. También admite override manual, bloqueo y emisión de eventos para Node-RED.
## Direcciones de grupo
|Propósito|Propiedad|Notas|
|--|--|--|
| Impulso | `Trigger GA` (`gaTrigger`) | El valor `1` inicia o prolonga el temporizador. Con "El valor 0 cancela" un `0` apaga la luz. |
| Salida | `Output GA` (`gaOutput`) | Actuador controlado durante el ciclo (DPT predeterminado 1.001). |
| Estado | `Status GA` (`gaStatus`) | Refleja el estado activo y el preaviso. |
| Override | `gaOverride` | Mantiene la luz encendida mientras sea `1` y pausa el temporizador. |
| Bloqueo | `gaBlock` | Evita nuevas activaciones y puede forzar el apagado. |
## Temporizador y preaviso
- **Duración del temporizador** define la duración base.
- **Nuevo impulso** permite reiniciar, extender o ignorar impulsos adicionales.
- **El valor 0 cancela el ciclo** termina el temporizador con motivo `manual-off` cuando la GA vuelve a `0`.
- **Cuando está bloqueado** decide si el bloqueo solo impide impulsos o fuerza el apagado.
- El preaviso puede conmutar la GA de estado o hacer parpadear la salida durante los milisegundos configurados.
## Eventos y salida
- Con *Emitir eventos* habilitado el nodo envía objetos con `event`, `remaining`, `active`, `override`, `blocked` (`trigger`, `extend`, `prewarn`, `timeout`, `manual-off`, `override`, `block`).
- También puedes fiarte de la GA de estado para las automatizaciones en KNX.
## Ejemplo en el flow
```javascript
// Iniciar el temporizador de escalera
msg.payload = true;
return msg;
```
```javascript
// Cancelar el ciclo (opción "El valor 0 cancela el ciclo")
msg.payload = false;
return msg;
```
## Consejos
- Usa el override para tareas de limpieza o mantenimiento.
- Vincula la GA de estado a un indicador físico o panel.
- Activa el parpadeo solo si el actuador soporta conmutaciones rápidas.
