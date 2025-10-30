🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Garage-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Garage-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Garage-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Garage-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Garage-Configuration)
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
# Puerta de garaje
El nodo **KNX Garage** controla un portón motorizado con GA dedicadas a mandos booleanos o impulsos, integra fotocélula y estado de obstrucción, permite mantener abierto o deshabilitar la lógica y dispone de cierre automático.
## Direcciones de grupo
|Propósito|Propiedad|Notas|
|--|--|--|
| Mando directo | `Command GA` (`gaCommand`) | GA booleana: `true` abre, `false` cierra (DPT 1.001). |
| Impulso toggle | `Impulse GA` (`gaImpulse`) | El flanco activo conmuta el portón (DPT 1.017). Se usa también si no hay mando directo. |
| Movimiento | `gaMoving` | Impulso opcional cada vez que el nodo ordena movimiento. |
| Obstrucción | `gaObstruction` | Refleja el estado de obstrucción para otros equipos KNX. |
| Mantener abierto | `gaHoldOpen` | Cancela el cierre automático mientras permanezca a true. |
| Deshabilitar | `gaDisable` | Bloquea cualquier orden emitida por el nodo (modo mantenimiento). |
| Fotocélula | `gaPhotocell` | Debe activarse cuando la fotocélula detecta un obstáculo; el nodo reabre y marca obstrucción. |
## Cierre automático
- Activa el temporizador de cierre para enviar la orden tras el retraso configurado.
- Mantener abierto o deshabilitar anulan el contador mientras estén activos.
- Al expirar se ejecuta `auto-close` y se envía el mando de cierre (o impulso).
## Seguridad
- Una fotocélula a true durante la bajada reabre inmediatamente la puerta y actualiza la obstrucción.
- Las escrituras externas sobre la GA de obstrucción mantienen sincronizado el estado interno con paneles y alarmas.
- Los impulsos de movimiento pueden alimentar ventilación, iluminación o lógicas de alarma.
## Integración con los flujos
- `msg.payload` acepta `true`, `false`, `'open'`, `'close'`, `'toggle'` para controlar la puerta desde Node-RED.
- Con *Emitir eventos* el nodo envía objetos con `event`, `state`, `disabled`, `holdOpen`, `obstruction`.
## Ejemplo en el flow
```javascript
// Abrir el portón
msg.payload = 'open'; // también acepta true
return msg;
```
```javascript
// Cerrar el portón
msg.payload = 'close'; // también acepta false
return msg;
```
```javascript
// Conmutar el estado del portón
msg.payload = 'toggle';
return msg;
```
