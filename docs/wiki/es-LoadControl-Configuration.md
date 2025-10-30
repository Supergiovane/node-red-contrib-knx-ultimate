🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)
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
# Nodo de control de carga KNX
<p> Con el nodo de control de carga puede administrar automáticamente la desconexión de las cargas (lavadora, horno, etc.) cuando el consumo de corriente excede un cierto umbral.
Los dispositivos se desactivan de manera inteligente, verificando el posible consumo del dispositivo para determinar si apagarlo con otros.<br/>
El nodo puede reactivar automáticamente las cargas.<br/>
El nodo apaga un dispositivo (o múltiples dispositivos) a la vez, según el orden que ha seleccionado. <BR/>
**General**
| Propiedad | Descripción |
|-|-|
|Puerta de entrada |KNX Gateway.También es posible no seleccionar ninguna puerta de enlace;En este caso, solo se considerarán mensajes entrantes al nodo.|
|Monitor WH |Dirección grupal que representa el consumo total de su edificio.|
|Límite WH |Umbral máximo que su medidor de electricidad puede soportar.Cuando se excede este umbral, el nodo comienza a apagar los dispositivos.|
|Retraso apagado (s) |Expresado en segundos, indica con qué frecuencia el nodo evaluará el consumo y apagará cada dispositivo.|
|Interruptor de retraso (s) (s) |Expresado en segundos, indica con qué frecuencia el nodo evaluará el consumo y encenderá cada dispositivo que se apagó.|
<br/>
**Control de carga**
Aquí puede agregar dispositivos para apagar en caso de sobrecarga.<br/>
Elija el dispositivo para apagar.Ingrese el nombre del dispositivo o su dirección de grupo.<br/>
Ingrese cualquier dirección de grupo que indique el consumo del dispositivo elegido en la primera línea. **Este es un parámetro opcional** .Si el dispositivo consume más de un cierto número de vatios, significa que está en uso.Si consume menos, el dispositivo se considerará "no en uso" y tanto esto como el siguiente se desactivarán a la vez. <br/>
Si _Automatic Recovery_ está habilitado, el dispositivo se reactiva automáticamente cuando expira el "retraso de reinicio".
## entradas
| Propiedad | Descripción |
|-|-|
|`msg.readstatus = true` |Forzar la lectura de los valores del bus KNX de cada dispositivo en la lista._ **El nodo ya hace todo por sí mismo** _, pero si es necesario, es posible usar este comando para forzar una releer de los valores actuales en Watt. |
|`msg.enable = true` |Habilitar el control de carga. |
|`msg.disable = true` |Deshabilite el control de carga. |
|`msg.reset = true` |Restablecer los estados de nodo y encender todos los dispositivos. |
|`msg.shedding` |Cadena._shed_ para iniciar la secuencia de desprendimiento de formato, _Unshed_ para comenzar a invertir el desprendimiento.Use este MSG para obligar al temporizador de desprendimiento a comenzar/detener, ignorando la dirección de grupo **Monitor WH ** .Establezca _auto_ para habilitar nuevamente el monitor**WH** Monitoreo de la dirección del grupo.|
## salidas
1. Salida estándar
: Payload (String | Object): la salida estándar del comando.
## Detalles```javascript
msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}
```# Muestra
<a href = "/node-red-contrib-knx-ultimate/wiki/sampleloadcontrol"> Haga clic aquí para ver el ejemplo </a>
<br/>