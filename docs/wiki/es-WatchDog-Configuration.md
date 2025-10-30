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
<p> Verifica la conexión a la puerta de enlace o a un dispositivo KNX específico </p>
# Watchdog
**¿Qué hace?**
1. Verifica la comunicación/conexión de la curación de KNX Bus enviando un telegrama a intervalos regulares, observando una respuesta y envía un MSG al flujo si se rompe una conexión a KNX Bus.Dos niveles de verificación, ver más abajo.
2. Cambia programáticamente los parámetros del nodo de configuración, por lo tanto, la conexión a su enrutador/interfaz KNX/IP (por ejemplo, si tiene 2 enrutadores KNX/IP y desea cambiar entre los dos para la copia de seguridad de la conexión).
3. Fuerza la conexión/desconexión de la puerta de enlace desde/hacia el bus KNX.
## Comprobaciones de nivel de par de pares Ethernet y KNX Twisted
El perro guardián tiene dos niveles de verificación.
El primero, verifica solo la conexión entre KNX-Ultimate y la interfaz KNX/IP.
El segundo, verifica toda la ruta, desde el nodo de puerta de enlace ultimatizado KNX a Ethernet, luego hasta KNX TP Media y viceversa;Esto implica el uso de un dispositivo físico, respondiendo a las solicitudes de lectura.
El nodo WatchDog es un nodo poderoso para errores de señalización y problemas de conexión.<Br />
Puede enviar un correo electrónico al instalador KNX responsable de su edificio, o puede cambiar automáticamente a un enrutador/interfaz IP KNX/IP de copia de seguridad en su instalación.
## AJUSTES
|Propiedad |Descripción |
|----------------------------- |--------------------------------------------------------------------------------------------------- |
|Puerta de entrada |Gateway Knx seleccionado.|
|Dirección de grupo para monitorear |El nodo enviará un telegrama a esta dirección y monitorea el mensaje que fluye a través del bus KNX.El punto de datos debe ser dpt 1.x (boolean). |
|Nombre |Nombre del nodo |
|Auto Iniciar el temporizador de vigilancia |El temporizador Watchdog comienza automáticamente en implementación o en el inicio de nodo-rojo.|
|Verificación Nivel |Ver a continuación |
**COMPROBAR NIVEL ** > _**Ethernet** _: \*checkks la conexión entre la puerta de enlace de ultimate KNX en modo unicast y su interfaz IP KNX. <Br />
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogethernetlevel.png"
width = "90%"> <Br />
> _ **Ethernet y KNX TP** _: Complete Check.Funciona con enrutadores KNX/IP e interfaces KNX/IP (así como
Conjunto de direcciones), verifica la conexión entre KNX-Ulimate y este dispositivo Físico KNX, emitiendo una solicitud de lectura y esperando un telegrama de respuesta desde este dispositivo.Se notificará cualquier error en la troncal Ethernet o en el tronco de par de pares KNX.Para configurar este nivel de verificación, debe reservar una dirección de grupo y agregarla a una salida de "estado" de su actuador KNX.Por ejemplo, si tiene un actuador de luz, tiene seguramente una salida de "estado de luz" que puede **responder ** a una solicitud de lectura****.
Acerca de esta imagen, en ETS, asigne una salida de este actuador GIRA KNX a un estado de luz****(por ejemplo 12/0/0).Cada vez que el nodo Watchdog solicite el estado, el actuador GIRA KNX responderá.El perro guardián entonces sabe que tu KNX
La conexión de par de pares retorcidos está en funcionamiento.
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogethernetknxtplevel.png"
width = "90%"> <Br />
## Opciones avanzadas
|Propiedad |Descripción |
|-------- |----------- |
|Intervalo de reintento (en segundos) |El nodo envía un telegrama al autobús KNX en este interva de tiempo, en segundos.|
|Número de reintento antes de dar un error | Después de que el telegrama se haya enviado por esta cantidad de veces, sin ninguna respuesta del bus KNX, el nodo arroja un error.|
# Salida de mensajes del Watchdog
El nodo Watchdog sale un mensaje cada vez que recibe un error de uno de su nodo ultimal KNX en sus flujos, o cuando el vigilante interno intercepta un error de comunicación de bus KNX. <Br /> ** En caso de problema de autoexpresión de vigilancia** <a href = "/node-red-contrib-knx-ultimate/wiki/watchdog-configuration"
Target = "_ en blanco"> Consulte aquí. </a>```javascript
msg = {
type:"BUSError"
checkPerformed: "Ethernet" for basic check, or "Eth+KNX" for full check.
nodeid: "23HJ.2355" // (The node ID causing the error, so you can find it using node-red "search" funtion)
payload: true
description: // (whatever error description)
}
```<Br /> ** En caso de que uno de sus nodos ultimados KNX esté en problemas** ```javascript
msg = {
type:"NodeError"
checkPerformed: "Self KNX-Ultimate node reporting a red color status"
nodeid: "23HJ.2355" // (The node ID causing the error, so you can find it using node-red "search" funtion)
payload: true
description: // (KNX-Ultimate node reports his error here)
completeError:{
nodeid: "23HJ.2355" // (The node ID causing the error, so you can find it using node-red "search" funtion)
topic: "0/1/1" // (or the custom topic you set in the knx-ultimate node)
devicename: "Kitchen Light"
GA: "0/1/1"
}
}
```<Br /> ** En caso de una nueva configuración de puerta de enlace, se llama a través de SetGatewayConfig** ```javascript
msg = {
type:"setGatewayConfig"
checkPerformed: "The Watchdog node changed the gateway configuration."
nodeid: "23HJ.2355" // (The node ID issuing the setGatewayConfig, so you can find it using node-red "search" funtion)
payload: true
description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1
BindLocalInterface:Auto"
completeError:""
}
```<Br /> ** Conexión forzada/desconexión** ```javascript
msg = {
type:"connectGateway"
checkPerformed: "The Watchdog issued a connection/disconnection to the gateway."
nodeid: "23HJ.2355" // (The node ID issuing the connection/disconnection request, so you can find it using node-red
"search" funtion)
payload: true // true if you requested the connection, false if you requested the disconnection
description: "Connection"
completeError:""
}
```<Br />
---
# Mensaje de flujo de entrada
El nodo Watchdog acepta la entrada del flujo y transmite la salida del flujo.A continuación, una explicación del formato del mensaje se enviará o se transmitirá desde el nodo.
## comienza y detiene el perro guardián
Para iniciar y detener el Watchdog, puede pasar esto como mensaje al nodo <Br /> ** Comienza Watchdog** <Br />```javascript
// Start the WatchDog
msg.start = true;
return msg;
``` ** Detente de vigilancia** <Br />```javascript
// Start the WatchDog
msg.start = false;
return msg;
```## Cambie la configuración de enrutador KNX/IP/interfaz en la mosca
Con ** msg.setgatewayconfig** , puede cambiar el IP, el puerto, la dirección física, el protocolo, etc.
El nodo de configuración cambiará la configuración y se volverá a conectar con nuevos parámetros. <Br />
Tenga cuidado, si reinicia el nodo-rojo, la nueva configuración se vuelve a la configuración especificada en el nodo de configuración. <Br /> ** Todos los parámetros son opcionales** <Br />```javascript
// IP: IP of your KNX/IP Router or Interface
// Port: Port of your KNX/IP Router or Interface
// PhysicalAddress: Physical address your KNX/IP Router or Interface (this is not a Group Address, this is a physical address indicating the physical device in your KNX installation)
// BindToEthernetInterface: "Auto" (for automatic detection) or the ethernet interface name, for example "en0".
// Protocol: "TunnelUDP" or "TunnelTCP" or "Multicast"
// importCSV: the ETS exported CSV or ESF. Please see the text format in the Gateway Config Wiki Page and in the youtube
video.
// All these parameters are optional
msg.setGatewayConfig={IP:"224.0.23.12",Port:3671,PhysicalAddress:"15.15.1",BindToEthernetInterface:"Auto",
Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"};`}
return msg;
```Todas las propiedades son opcionales.Por ejemplo, para cambiar solo la IP:```javascript
// IP: IP of your KNX/IP Router or Interface
msg.setGatewayConfig={IP:"224.0.23.12"};
return msg;
``` ** La desconexión de Force Gateway y la desactivación de los intentos de reconexión automática** <Br />```javascript
// Force the gateway's disconnection from the BUS and stop the reconnection's attempts.
msg.connectGateway = false;
return msg;
``` ** Conexión de Force Gateway y habilite los intentos de reconexión automática** <Br />```javascript
// Force the gateway's connection to the BUS and activate the reconnection's attempts.
msg.connectGateway = true;
return msg;
```## Ver también
[Muestra de vigilancia](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)