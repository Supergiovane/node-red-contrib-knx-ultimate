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
# Logger
<p> El nodo del registrador registra todos los telegramas y lo genera en un archivo compatible con XML de monitor de bus ETS. </p>
<br/>
Puede guardar el archivo en el disco o enviarlo a un servidor FTP, por ejemplo.El archivo puede ser leído por su ETS, por ejemplo, para diagnóstico o para una repetición de los telegramas.
<br/>
El nodo también puede contar telegramas por segundo (o cualquier intervalo que desee).
<br/> <a href = "/node-red-contrib-knx-ultimate/wiki/logger-sample" target = "_ blank"> Los ejemplos están aquí. </a>
<br/>
## AJUSTES
| Propiedad | Descripción |
|-|-|
|Puerta de entrada |La puerta de enlace KNX.|
|Tema |El tema del nodo.|
|Nombre |Nombre del nodo.|
## archivo de diagnóstico de bus compatible con ETS
| Propiedad | Descripción |
|-|-|
|Temporizador de inicio automático |Inicia el temporizador automáticamente en la implementación o en el inicio de nodo-rojo.|
|Salida nueva XML cada (en minutos) |La hora, en minutos, que el registrador emitirá el archivo compatible con el monitor de bus XML XML.|
|Número máximo de filas en xml (0 = sin límite) |Inicia el temporizador automáticamente en la implementación o en el inicio de nodo-rojo.|
|Temporizador de inicio automático |Esto representa el número máximo de línea, que el archivo XML puede contener en el intervalo especificado anteriormente.Pon 0 para no limitar el número de filas en el archivo.|
|Número máximo de filas en xml (0 = sin límite) |Esto representa el número máximo de línea, que el archivo XML puede contener en el intervalo especificado anteriormente.Pon 0 para no limitar el número de filas en el archivo.|
<br/>
## contador de telegrama de knx
| Propiedad | Descripción |
|-|-|
|Temporizador de inicio automático |Inicia el temporizador automáticamente en la implementación o en el inicio de nodo-rojo.|
|Intervalo de conteo (en segundos) |Con qué frecuencia emite un MSG al flujo, que contiene el recuento de telegramas KNX.En segundos.|
<br/>
---
# Salida del mensaje del registrador
**Pin 1: archivo de archivo compatible con monitor de bus XML ETS**
Puede usar un nodo de archivo para guardar la carga útil en el sistema de archivos, o puede enviarla, por ejemplo, a un servidor FTP.```javascript
msg = {
        topic:"MyLogger"
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    }
```<br/> <br/>
**Pin 2: contador de telegrama de KNX**
Cada recuento, el nodo emitirá un telegrama como este:```javascript
msg = {
        topic:"",
        payload:10,
        countIntervalInSeconds:5,
        currentTime:"25/10/2021, 11:11:44"
    }
```<br/>
---
# Mensaje de flujo de entrada
Puede controlar el registrador de alguna manera.
## Archivo de monitor de bus compatible con ETS XML
**Temporizador de inicio** <br/>```javascript
// Start the timer
msg.etsstarttimer = true;
return msg;
``` **Detener el temporizador** <br/>```javascript
// Start the timer
msg.etsstarttimer = false;
return msg;
``` **ENCONTRA INMEDIATAMENTE una carga útil con el archivo ETS** <br/>```javascript
// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;
```## contador de telegrama de knx
**Temporizador de inicio** <br/>```javascript
// Start the timer
msg.telegramcounterstarttimer = true;
return msg;
``` **Detener el temporizador** <br/>```javascript
// Start the timer
msg.telegramcounterstarttimer = false;
return msg;
``` **Mensaje de conteo de telegrama de salida inmediatamente** <br/>```javascript
// Output payload.
msg.telegramcounteroutputnow = true;
return msg;
```## Ver también
- _samples_
- [Logger de muestra](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)