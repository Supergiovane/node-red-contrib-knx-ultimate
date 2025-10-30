🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)
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
# Configuración del nodo de Alerter
Use el nodo Alerter para solicitar si el dispositivo seleccionado está en un estado de alarma en el monitor o a través del nodo nodo-red-confun-tts-ultimate (transmisión de voz), es decir, la `carga útil` es **verdadera** .
Este nodo genera mensajes que contienen los detalles del dispositivo de alarma actual a un intervalo de tiempo configurable (uno a la vez).Por ejemplo, puede decirle "cuántas ventanas están abiertas".<br/>
El nodo lee directamente el valor del dispositivo del bus KNX.Además, también puede enviar alertas personalizadas a los nodos, independientemente de los dispositivos KNX.<br/>
La página de ejemplo muestra cómo se usa en el proceso.<br/>
- **Gateway (puerta de enlace)**
> Seleccione la puerta de enlace KNX para usar. Tampoco puede seleccionar la puerta de enlace;Solo los mensajes que ingresan al nodo se procesan en este momento.
- **Nombre (nombre)**
> Nombre del nodo.
- **Cómo comenzar a la alarma de la alarma**
> Seleccione el evento que desencadena el envío inicial del mensaje de alarma.
- **Intervalo de cada mensaje (segundos)**
> El intervalo de tiempo entre dos mensajes de salida consecutivos.
## Equipo que necesita monitoreo
Agregue los dispositivos que deben ser monitoreados aquí.<br/>
Complete la dirección de grupo del dispositivo o especifique una etiqueta para el dispositivo.<br/>
- **Lea el valor de cada dispositivo al conectar/volver a conectar**
> Al comenzar o reconectarse, el nodo envía una solicitud de lectura para cada dispositivo en la lista.
- **Agregar botón**
> Agregue una fila a la lista.
- **Línea de equipo ** > La primera columna es la dirección de grupo (también puede completar cualquier texto para usar con mensajes de entrada; consulte la página de ejemplo).La segunda columna es la abreviatura del dispositivo (**hasta 14 caracteres** ).La tercera columna es el nombre completo del dispositivo.
- **Botón Eliminar**
> Elimine el dispositivo de la lista.
<br/>
<br/>
## El mensaje de salida del nodo
PIN1: cada dispositivo de alarma genera un mensaje de acuerdo con el intervalo establecido.<br/>
PIN2: emitir un mensaje resumido que contiene todos los dispositivos en el estado de alarma.<br/>
PIN3: Solo se emite el último dispositivo que ingresó al estado de alarma.<br/>
**PIN1** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
``` **PIN2** ```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "入户门, 客厅壁灯, 地下室壁灯, 书房灯",
  longdevicename: "主入户门, 客厅左侧壁灯, 地下室右侧壁灯, 书房顶灯",
  count: 4,
  payload: true
}
``` **PIN3** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```Salida Cuando todos los dispositivos están estacionarios (sin alarmas):
**PIN1, PIN2, PIN3** ```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```<br/>
<br/>
## Mensaje de entrada para nodo```javascript
msg.readstatus = true
```Lee el valor actual de cada dispositivo en la lista.```javascript
msg.start = true
```Inicie una encuesta que "atraviese todos los dispositivos y salidas de alarma a su vez".El encuesta finaliza después de la última salida del dispositivo; Si vuelve a sondear, envíe el mensaje de entrada nuevamente.
<br/>
**Alarma de dispositivo personalizado** <br/>
Para actualizar el estado de un dispositivo personalizado (verdadero/falso), envíe el siguiente mensaje de entrada:```javascript
msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```<br/>
## Ejemplo
<a href = "/node-red-contrib-knx-ultimate/wiki/samplealerter"> Haga clic aquí para ver el ejemplo </a>
<br/>
<br/>
<br/>