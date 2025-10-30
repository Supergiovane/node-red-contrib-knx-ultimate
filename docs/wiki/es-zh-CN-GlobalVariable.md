🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)
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
<
# KNX Variables globales
Este nodo mapea la dirección de grupo recibida del bus a la variable de contexto global, \
Y permita escribir en el bus KNX a través de esta variable.
## Descripción general
- Agregue el nodo de contexto global al proceso y logerne; Este nombre se usa como el nombre base de la variable global.
- Leer usando el sufijo `_read` (como` myvar_read`).
- Escriba para usar el sufijo `_Write` (como 'myvar_write`).
- Las variables se pueden expusir como solo lectura o leer/escribir en configuración.
- Por razones de seguridad, modifique el nombre predeterminado.
Nota: Después de ejecutar la escritura, `<same> _Write` se borrará automáticamente para evitar la escritura repetida.
## configuración
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | KNX Gateway.|
| Nombre variable | El nombre básico de la variable global.Se crean `<Name> _read` y` <Name> _Write`. No use el nombre predeterminado por razones de seguridad.|
| Exponer como variable global | Seleccione si y cómo exponer variables globales y cómo.Si no necesita escribir, se recomienda establecer en solo lectura.|
| Intervalo de escritura de bus | Encuesta `<Name> _Write` y escriba en el bus.|
## Objeto Msg en variable```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```## Uso rápido
### leer variables```javascript
const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });
const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```### Escribe en el autobús a través de variables```javascript
const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// 如果已导入 ETS，可省略 dpt，由系统据 payload 推断
toSend.push({ address: "0/0/11", payload: msg.payload });
global.set("KNXContextBanana_WRITE", toSend);
```## Ejemplo completo
<a href = "/node-red-contrib-knx-ultimate/wiki/sampleglobalcontextnode" target = "_ blank"> <i class="fa fa-info-circle"> </i> View Ejemplo </a>