🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)
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
# Watchdog (Watchdog)
Se utiliza para detectar el estado de conexión con una puerta de enlace o un dispositivo KNX específico y realizar operaciones automatizadas en caso de falla.
**Función**
1. Envíe mensajes periódicamente y espere una respuesta. Si la conexión del bus es anormal, envíe mensajes al proceso.Hay dos niveles de detección disponibles (ver más abajo).
2. Modifique los parámetros de la puerta de enlace del nodo de configuración (config-node) a través del mensaje para realizar la conmutación del enrutador/interfaz KNX/IP (como la conmutación de soporte maestro).
3. Forzar establecimiento/desconexión del autobús KNX.
## Detección de la capa de pares Ethernet y KNX Twisted
Watchdog proporciona pruebas de dos niveles:
- Nivel de Ethernet: solo detecte la conectividad entre KNX -Ulimate y la interfaz KNX/IP (unicast).
- Ethernet + KNX -TP: marque todo el enlace (Ethernet → TP).Se requiere un dispositivo físico que responda a las solicitudes de lectura.
Adecuado para alarmas de falla de error/conexión (notificaciones por correo electrónico, conmutación automática de puerta de enlace de respaldo, etc.).
## Configuración (Configuración)
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | Gateway Knx seleccionado.|
|Dirección de grupo para monitorear | Dirección de grupo utilizada para enviar y monitorear;DPT debe ser 1.x (booleano). |
|Nombre | Nombre del nodo. |
| Auto Iniciar el temporizador de vigilancia | Inicie automáticamente el temporizador de implementación/inicio.|
| Verificación Nivel | Ver arriba. |
**COMPROBAR NIVEL**
> Ethernet: detectar conexiones entre KNX -Ulimate (unicast) y la interfaz KNX/IP. <br/>
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogethernetlevel.png" width = "90%"> <br/>
> Ethernet + KNX TP: detección completa (admite enrutador/interfaz).Envíe lea al dispositivo físico y espere la respuesta;Se informará cualquier fallas en Ethernet o TP.Configure un estado **** Ga en ETS para un actuador que responda a la lectura. <br/>
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogethernetknxtplevel.png" width = "90%"> <> <>
## Opciones avanzadas
| Propiedades | Descripción |
|-|-|
| Intervalo de reintento (en segundos) | Intervalo de detección en segundos. |
| Número de reintento antes de dar un error |Cuántas fallas consecutivas se informan. |
# Salida Watchdog Salida
Watchdog emite un mensaje cuando la detección interna encuentra una falla, o un nodo ultimatizado de KNX informa un error en el proceso. ** Problema de conexión de Watchdog** <a href = "/node-red-contrib-knx-ultimate/wiki/watchdog-configuration" target = "_ en blanco"> ver aquí para obtener detalles </a>```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
``` ** Se produjo una excepción en uno de sus nodos Últimos KNX** ```javascript
msg = {
  type: "NodeError",
  checkPerformed: "Self KNX-Ultimate node reporting a red color status",
  nodeid: "23HJ.2355",
  payload: true,
  description: "...",
  completeError: {
    nodeid: "23HJ.2355",
    topic: "0/1/1",
    devicename: "Kitchen Light",
    GA: "0/1/1"
  }
}
``` ** Modificar la configuración de la puerta de enlace a través de SetGatewayConfig** ```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
``` ** Conexión forzada/desconexión** ```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```---
# Ingrese el mensaje (entrada)
## Inicio/parar Watchdog```javascript
msg.start = true; return msg; // 启动
```
```javascript
msg.start = false; return msg; // 停止
```## modificar la configuración de la puerta de enlace KNX/IP durante el tiempo de ejecución
Cambiar IP/Port/PhysicalAddress/Protocol, etc. a través de `msg.setgatewayconfig`; El nodo de configuración aplicará la reconexión.Nodo -rojo restaura a la configuración en el nodo de configuración después de reiniciar.Todos los parámetros son opcionales.```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Cambiar solo la IP:```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
``` ** Desconectar y deshabilitar la reconexión automática** ```javascript
msg.connectGateway = false; return msg;
``` ** Conexión forzada y habilitar la reconexión automática** ```javascript
msg.connectGateway = true; return msg;
```## Ver
[Muestra de vigilancia](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)