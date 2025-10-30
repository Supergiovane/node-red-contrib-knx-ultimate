🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
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
# Logger (registro)
El nodo del registrador registra todos los mensajes y emite un archivo XML compatible con el monitor ETS Bus.
Puede guardarlo en disco con el nodo del archivo, o enviarlo a FTP, etc. Este archivo se puede usar en ETS para diagnosticar o reproducir mensajes.
Este nodo también puede contar el número de mensajes (por segundo o intervalo personalizado).<br/> <a href = "/node-red-contrib-knx-ultimate/wiki/logger-sample" target = "_ blank"> El ejemplo está aquí </a>
## configuración
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | KNX Gateway. |
| Tema | El tema del nodo. |
| Nombre | Nombre del nodo. |
## Archivos de diagnóstico de bus compatibles con ETS
|Propiedades | Descripción |
|-|-|
| Temporizador de inicio automático | Inicie automáticamente el temporizador cuando se despliegue o se inicie. |
|Salida nueva XML cada (en minutos) | ¿Cuántos minutos sale XML compatible con ETS? |
| Número máximo de filas en xml (0 = sin límite) |El número máximo de filas de XML en esta ventana de tiempo; 0 significa que no hay límite. |
## contador de mensajes KNX
| Propiedades |Descripción |
|-|-|
| Temporizador de inicio automático | Inicie automáticamente el temporizador cuando se despliegue o se inicie.|
| Intervalo de conteo (en segundos) | El intervalo para la salida cuenta del proceso en segundos.|
---
#Salida del nodo
**Pin 1: XML compatible con ETS**
Use el nodo de archivo para guardar `msg.payload` o enviarlo a FTP, etc.```javascript
msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
``` **Pin 2: Recuento de mensajes de KNX**
Salida por ciclo de conteo:```javascript
msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```---
# Ingrese el mensaje (entrada)
Control XML compatible con ETS
**Temporizador de inicio** ```javascript
msg.etsstarttimer = true; return msg;
``` **Detener el temporizador** ```javascript
msg.etsstarttimer = false; return msg;
``` **Salida XML ahora** ```javascript
// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```Control de contador de mensajes
**Temporizador de inicio** ```javascript
msg.telegramcounterstarttimer = true; return msg;
``` **Detener el temporizador** ```javascript
msg.telegramcounterstarttimer = false; return msg;
``` **Recuento de salida inmediatamente** ```javascript
msg.telegramcounteroutputnow = true; return msg;
```## Ver
- [Logger de muestra](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)