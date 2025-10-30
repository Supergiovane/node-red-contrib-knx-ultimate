🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)
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
# Controlador de escena
Este nodo es consistente con el controlador de la escena KNX: la escena se puede guardar y retirar.
## Configuración del nodo
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | Gateway Knx seleccionado.|
| Recuerdo de la escena | **DataPoint ** y**Valor de activación** . La dirección de grupo utilizada para recordar el escenario (como `0/0/1`).El nodo recuerda la escena cuando este GA recibe el mensaje.DPT es el tipo de recuperación GA;El valor de activación es el valor requerido para activar el retiro.Consejo: si se activa en el modo Dim, establezca el valor correcto del objeto de atenuación (ajuste de ascenso por `{Decr_incr: 1, datos: 5}` y ajuste de abajo por `{Decr_incr: 0, datos: 5}`).|
| Guardar escena | **DataPoint ** y**Valor de activación** . La dirección de grupo utilizada para guardar la escena (como `0/0/2`).Cuando un nodo recibe un mensaje, guarda el valor actual de todos los dispositivos en la escena (almacenamiento no volátil).DPT es el tipo para guardar GA; Valor de activación Los disparadores Guardar (Dim supra).|
| Nombre del nodo | Nombre del nodo (escribir "Recuerde: ... / Guardar: ...").|
| Tema | El tema del nodo. |
## Configuración de escenarios
Como un controlador de escena KNX real, agregue dispositivos a la escena; Cada fila representa un dispositivo.
Una vez que se recibe un nuevo valor del bus, el nodo registrará automáticamente el último valor del actuador en la escena.
| Propiedades | Descripción |
|-|-|
| Botón Agregar | Agregue una nueva fila. |
| Campo de fila |1) Dirección de grupo 2) punto de datos 3) Valor de escena predeterminado (se puede sobrescribir mediante la guardia de la escena).El nombre del dispositivo está a continuación.<br/> Insertar pausa: complete **espera ** en la primera columna y complete la última columna para la duración (milisegundos), como `2000`.<br/>**espera** también admite segundos/minuto/hora: `12s`,` 5m`, `1H`.|
| Eliminar | Elimine esta línea de dispositivo.|
## Salida del nodo```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```---
## Mensaje de entrada (entrada)
El nodo se basa principalmente en los mensajes KNX para recuperar/guardar la escena; También se puede controlar a través de mensajes.Los comandos del bus se pueden deshabilitar y solo se pueden aceptar mensajes de proceso.
**Escenario de recuerdo** ```javascript
msg.recallscene = true; return msg;
``` **Guardar escena** ```javascript
msg.savescene = true; return msg;
``` **Guarde el valor actual de un GA**
Aunque la escena rastrea automáticamente el valor del albacea, en algunos casos es necesario registrar el valor actual de otro GA (como el estado en lugar del comando) con un "valor de escena real".
Por ejemplo, el obturador del rodillo: el estado GA de altura absoluta refleja la posición exacta.Este estado GA se utiliza para actualizar el comando GA del ejecutor relevante en la escena.```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
``` **Desactivar Controlador de escena**
Deshabilite los comandos del bus KNX (aún acepte mensajes de proceso).Por ejemplo, es útil cuando no desea recordar/guardar una escena del botón de entidad por la noche.```javascript
msg.disabled = true; // false 重新启用
return msg;
```## Ver
[Controlador de escena de muestra](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)