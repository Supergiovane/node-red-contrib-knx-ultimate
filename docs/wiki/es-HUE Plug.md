🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Plug) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Plug) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Plug) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Plug) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Plug) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Plug)
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
# Enchufe / salida de tono
## Descripción general
El nodo de enchufe de Hue enlaza un enchufe inteligente Philips Hue (servicio `plug``) con direcciones de grupo KNX para que pueda controlar la alimentación y rastrear el estado directamente desde el bus.
- Admite **Control de encendido/apagado ** y**Comentarios de estado** .
- Mapeo opcional del tono `power_state` (en / en espera).
- Puede exponer los pines de entrada/salida de Node-Red para reenviar eventos de HUE a flujos o enviar cargas útiles de API avanzadas.
## Configuración
| Campo | Descripción |
|-|-|
|KNX GW |KNX Gateway utilizado para telegramas |
|Puente Hue |Puente de tono configurado |
|Nombre |Seleccione el enchufe de tono de la lista de autocompletar |
|Control |KNX GA para comandos de encendido/apagado (DPT booleano) |
|Estado |GA para la retroalimentación de encendido/apagado proveniente de Hue |
|Estado de poder |Hue opcional GA de reflejo `power_state` (boolean/text) |
|Leer el estado al inicio |Cuando está habilitado, el nodo emite el estado de enchufe actual en la implementación/conexión |
|Pins de E/S de nodo |Habilite los pasadores de entrada/salida de nodo-rojo.La entrada espera cargas útiles de API de tono (por ejemplo, `{en: {on: true}}`).Salir reenvía cada evento de Hue.|
## consejos de mapeo KNX
- Use un punto de datos booleano (por ejemplo, DPT 1.001) para el comando y el estado.
- Si expone `power_state`, asigna a un ga booleano (true =` on`, false = `en espera`).
- Para solicitudes de lectura (`groupValue_read`) El nodo devuelve el último valor de tono en caché.
## Integración de flujo
Cuando _node I/o Pins_ están habilitados:
- **Entrada:** Enviar cargas útiles de Hue V2 para realizar acciones avanzadas (por ejemplo, `msg.on = {on: true}`).
- **Salida:** Recibe un objeto de evento `{carga útil: boolean, on, power_state, rawevent}` cada vez que Hue informa un cambio.
## Referencia de API de Hue
El nodo usa `/recurse/plug/{id}` sobre https.Los cambios de estado se entregan a través de la transmisión de eventos HUE y se almacenan en caché para las respuestas de lectura de KNX.