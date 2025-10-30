🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)
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
<p> Este nodo responderá a las solicitudes de lectura del bus KNX.
El nodo registra todos los telegramas transmitidos al bus KNX y almacenan los valores en la memoria. \
Luego responde a las solicitudes de lectura enviando dicho valor memorizado de regreso al bus como solicitud. \
Si la dirección del grupo que se lee aún no tiene valor, el nodo responderá con un valor predeterminado. \
El nodo responderá solo a las direcciones de grupo especificadas en el campo **Responder a** JSON. \
De manera predeterminada, hay una muestra previa * ***"Responder al texto JSON, donde simplemente puede cambiar/eliminar las cosas.¡Asegúrese de que** no lo use como es **!** Configuración**| Propiedad | Descripción |
|-|-|
|Puerta de entrada |Seleccione la puerta de enlace KNX para ser utilizada |
|Responder a |El nodo responderá a las solicitudes de lectura provenientes de las direcciones grupales especificadas en esta matriz JSON.El formato se especifica a continuación.|
<br/> ** Formato JSON ** El JSON es**siempre** una matriz de objeto, que contiene cada directiva.Cada directiva, le dice al nodo qué hacer.
| Propiedad | Descripción |
|-|-|
|nota | ** Clave de nota opcional** , para recordatorios.No se usará en ningún lado.|
|GA |La dirección grupal.También puede usar los ".." Wildchars, para la especidad de una gama de direcciones grupales.El ".." solo se puede usar con el nivel del tercer GA, Ej: ** 1/1/0..257** .Vea las muestras a continuación.|
|DPT |El punto de datos de la dirección del grupo, en el formato "1.001".Es ** opcional** Si se ha importado el archivo CSV ETS.|
|predeterminado |El valor enviado al bus en respuesta a una solicitud de lectura, cuando el valor de la dirección del grupo aún no ha sido memorizado por el nodo.| ** Comencemos con una directiva** El nodo de autoresponder responderá a las solicitudes de lectura para la dirección del grupo 2/7/1.Si aún no hay valor en la memoria, responderá con _true _. \ |
El archivo CSV ETS debe haberse importado, de lo contrario debe agregar la clave ** "DPT": "1.001" ** **.```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` ** Directiva un poco más completa** El nodo de autoresponder responderá a las solicitudes de lectura para la dirección del grupo a partir del 3/1/1 al 3/1/22 incluida.Si aún no hay valor en la memoria, responderá con _false _. \
También hay una clave ** Nota** , simplemente como una nota de recordatorio.No se usará en ningún lado.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` ** Directivas concatenantes** El nodo de autoresponder responderá a las solicitudes de lectura para la dirección del grupo a partir del 2/2/5 al 2/2/21 incluida.Si aún no hay valor en la memoria, responderá con un valor de 25. \
El nodo de autoresponder también responderá a las solicitudes de lectura para la dirección del grupo 2/4/22.Si aún no hay valor en la memoria, responderá con el estado de cadena _unknown! _. \
Tenga en cuenta la ** coma** entre el objeto JSON de cada directiva.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```<br/>