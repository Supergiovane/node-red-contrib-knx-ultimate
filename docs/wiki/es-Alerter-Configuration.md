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
# Configuración del nodo de Alerter
Con el nodo Alerter, puede indicar una pantalla o al nodo de nodo-Contrib-TTS-Ulude (retroalimentación de audio) Si los dispositivos seleccionados son alertados, es decir, tienen carga útil **Verdadero** .
El nodo emite mensajes a intervalos especificados (un mensaje a la vez) que contienen los detalles de cada dispositivo alertado.Por ejemplo, el nodo puede decirle cuántas y qué ventanas están abiertas.<br/>
El nodo recibe los valores de los dispositivos directamente desde el bus KNX.Además, puede enviar mensajes personalizados al nodo, no vinculado a los dispositivos KNX.<br/>
La página de ejemplo explica cómo usar el nodo.<br/>
- **Gateway**
> KNX Gateway seleccionada.También es posible no seleccionar ninguna puerta de enlace;En este caso, solo se considerarán mensajes entrantes al nodo.
- **Nombre**
> Nombre del nodo.
- **Tipo de inicio del ciclo de alerta**
> Aquí puede seleccionar el evento que se omitirá el inicio de enviar mensajes desde dispositivos alertados.
- **Intervalo entre cada MSG (en segundos)**
> Intervalo entre cada mensaje saliente desde el nodo.
## Dispositivos para monitorear
Aquí puede agregar dispositivos para monitorear.<br/>
Ingrese el nombre del dispositivo o su dirección de grupo.<br/>
- **Valor de lectura de cada dispositivo en Connection/Reconection**
> En conexión/reconexión, el nodo enviará una solicitud de 'leer' cada dispositivo que pertenece a la lista.
- **Agregar botón**
> Agregue una fila a la lista.
- **Filas del dispositivo ** > El primer campo es la dirección de grupo (pero también puede ingresar cualquier texto, que puede usar con mensajes entrantes, consulte la página de ejemplo), el segundo es el nombre del dispositivo**(máximo 14 caracteres)** , el tercero es el nombre largo del dispositivo.
- **Botón Eliminar**
> Elimina un dispositivo de la lista.
<br/>
<br/>
## Mensaje fuera del nodo
PIN1: el nodo emite un mensaje para cada dispositivo alertado, a intervalos seleccionables. <br/>
PIN2: El nodo emite un mensaje único que contiene todos los dispositivos alertados. <br/>
PIN3: El nodo emite un mensaje que contiene solo el último dispositivo alertado. <br/>
**PIN1** ```javascript
msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}
``` **PIN2** ```javascript
msg = {
    "topic":"door, 0/0/11, 0/1/2, 0/0/9",
    "devicename":"Main Door, Applique soggiorno, Applique taverna, Luce studio",
    "longdevicename":"Main entry Door, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
    "count":4,
    "payload":true
    }
``` **PIN3** ```javascript
msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}
```Mensaje saliente cuando todos los dispositivos están en reposo
**PIN1, PIN2, PIN3** ```javascript
msg = {
    "topic":"",
    "count":0,
    "devicename":"",
    "longdevicename":"",
    "payload":false
}
```<br/>
<br/>
## Mensaje en el nodo```javascript
msg.readstatus = true
```Lea el valor de cada dispositivo que pertenece a la lista.```javascript
msg.start = true
```Comienza el ciclo de envío de todos los dispositivos alertados.El ciclo termina con el último dispositivo alertado.Para repetir el ciclo, envíe este mensaje entrante nuevamente.
<br/>
**Alerta de dispositivo personalizado** <br/>
Para actualizar el valor verdadero/falso de un dispositivo personalizado, puede enviar este mensaje entrante```javascript
msg = {
    "topic":"door",
    "payload":true // Or false to reset the alert for this device
}
```<br/>
## MUESTRA
<a href = "/node-red-contrib-knx-ultimate/wiki/samplealerter"> Haga clic aquí para ver el ejemplo </a>
<br/>
<br/>
<br/>