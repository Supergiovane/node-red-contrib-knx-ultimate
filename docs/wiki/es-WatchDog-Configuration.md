---
layout: wiki
title: "WatchDog-Configuration"
lang: es
permalink: /wiki/es-WatchDog-Configuration
---
Verifica la conexión a la puerta de enlace o a un dispositivo KNX específico 

# Watchdog

**¿Qué hace?**

1. Verifica la comunicación/conexión de la curación de KNX Bus enviando un telegrama a intervalos regulares, observando una respuesta y envía un MSG al flujo si se rompe una conexión a KNX Bus.Dos niveles de verificación, ver más abajo.
2. Cambia programáticamente los parámetros del nodo de configuración, por lo tanto, la conexión a su enrutador/interfaz KNX/IP (por ejemplo, si tiene 2 enrutadores KNX/IP y desea cambiar entre los dos para la copia de seguridad de la conexión).
3. Fuerza la conexión/desconexión de la puerta de enlace desde/hacia el bus KNX.

## Comprobaciones de nivel de par de pares Ethernet y KNX Twisted

El perro guardián tiene dos niveles de verificación.

El primero, verifica solo la conexión entre KNX-Ultimate y la interfaz KNX/IP.

El segundo, verifica toda la ruta, desde el nodo de puerta de enlace ultimatizado KNX a Ethernet, luego hasta KNX TP Media y viceversa;Esto implica el uso de un dispositivo físico, respondiendo a las solicitudes de lectura.

El nodo WatchDog es un nodo poderoso para errores de señalización y problemas de conexión.

Puede enviar un correo electrónico al instalador KNX responsable de su edificio, o puede cambiar automáticamente a un enrutador/interfaz IP KNX/IP de copia de seguridad en su instalación.

## AJUSTES

|Propiedad |Descripción |
|----------------------------- |--------------------------------------------------------------------------------------------------- |
|Puerta |Gateway Knx seleccionado.|
|Dirección de grupo para monitorear |El nodo enviará un telegrama a esta dirección y monitorea el mensaje que fluye a través del bus KNX.El punto de datos debe ser dpt 1.x (boolean). |
|Nombre de nodo |Nombre del nodo |
|Auto Iniciar el temporizador de vigilancia |El temporizador Watchdog comienza automáticamente en implementación o en el inicio de Node-RED.|
|Verificar el nivel (consulte el wiki) |Ver a continuación |

**COMPROBAR NIVEL ** > _**Ethernet** _: \*checkks la conexión entre la puerta de enlace de ultimate KNX en modo unicast y su interfaz IP KNX. 

<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png"
width = "90%"> 

> _ **Ethernet y KNX TP** _: Complete Check.Funciona con enrutadores KNX/IP e interfaces KNX/IP (así como

Conjunto de direcciones), verifica la conexión entre KNX-Ulimate y este dispositivo Físico KNX, emitiendo una solicitud de lectura y esperando un telegrama de respuesta desde este dispositivo.Se notificará cualquier error en la troncal Ethernet o en el tronco de par de pares KNX.Para configurar este nivel de verificación, debe reservar una dirección de grupo y agregarla a una salida de "estado" de su actuador KNX.Por ejemplo, si tiene un actuador de luz, tiene seguramente una salida de "estado de luz" que puede **responder ** a una solicitud de lectura****.

Acerca de esta imagen, en ETS, asigne una salida de este actuador GIRA KNX a un estado de luz****(por ejemplo 12/0/0).Cada vez que el nodo Watchdog solicite el estado, el actuador GIRA KNX responderá.El perro guardián entonces sabe que tu KNX

La conexión de par de pares retorcidos está en funcionamiento.

<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png"
width = "90%"> 

## Opciones avanzadas

|Propiedad |Descripción |
|-------- |----------- |
|Vuelva a intentar el intervalo (en segundos) |El nodo envía un telegrama al autobús KNX en este interva de tiempo, en segundos.|
|Número de reintento antes de dar un error | Después de que el telegrama se haya enviado por esta cantidad de veces, sin ninguna respuesta del bus KNX, el nodo arroja un error.|

# Salida de mensajes del Watchdog

El nodo Watchdog sale un mensaje cada vez que recibe un error de uno de su nodo ultimal KNX en sus flujos, o cuando el vigilante interno intercepta un error de comunicación de bus KNX. 
 ** En caso de problema de autoexpresión de vigilancia** <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration"
Target = "_ en blanco"> Consulte aquí. </a>

```javascript

msg = {
type:"BUSError"
checkPerformed: "Ethernet" for basic check, or "Eth+KNX" for full check.
nodeid: "23HJ.2355" // (The node ID causing the error, so you can find it using node-red "search" funtion)
payload: true
description: // (whatever error description)
}

```

 ** En caso de que uno de sus nodos ultimados KNX esté en problemas**

```javascript

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

```

 ** En caso de una nueva configuración de puerta de enlace, se llama a través de SetGatewayConfig**

```javascript

msg = {
type:"setGatewayConfig"
checkPerformed: "The Watchdog node changed the gateway configuration."
nodeid: "23HJ.2355" // (The node ID issuing the setGatewayConfig, so you can find it using node-red "search" funtion)
payload: true
description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1
BindLocalInterface:Auto"
completeError:""
}

```

 ** Conexión forzada/desconexión**

```javascript

msg = {
type:"connectGateway"
checkPerformed: "The Watchdog issued a connection/disconnection to the gateway."
nodeid: "23HJ.2355" // (The node ID issuing the connection/disconnection request, so you can find it using node-red
"search" funtion)
payload: true // true if you requested the connection, false if you requested the disconnection
description: "Connection"
completeError:""
}

```

---

# Mensaje de flujo de entrada

El nodo Watchdog acepta la entrada del flujo y transmite la salida del flujo.A continuación, una explicación del formato del mensaje se enviará o se transmitirá desde el nodo.

## comienza y detiene el perro guardián

Para iniciar y detener el Watchdog, puede pasar esto como mensaje al nodo 
 ** Comienza Watchdog** 

```javascript

// Start the WatchDog
msg.start = true;
return msg;

```

** Detente de vigilancia** 

```javascript

// Start the WatchDog
msg.start = false;
return msg;

```

## Cambie la configuración de enrutador KNX/IP/interfaz en la mosca

Con ** msg.setgatewayconfig** , puede cambiar el IP, el puerto, la dirección física, el protocolo, etc.

El nodo de configuración cambiará la configuración y se volverá a conectar con nuevos parámetros. 

Tenga cuidado, si reinicia el nodo-rojo, la nueva configuración se vuelve a la configuración especificada en el nodo de configuración. 
 ** Todos los parámetros son opcionales** 

```javascript

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

```Todas

las propiedades son opcionales.Por ejemplo, para cambiar solo la IP:

```javascript

// IP: IP of your KNX/IP Router or Interface
msg.setGatewayConfig={IP:"224.0.23.12"};
return msg;

```

** La desconexión de Force Gateway y la desactivación de los intentos de reconexión automática** 

```javascript

// Force the gateway's disconnection from the BUS and stop the reconnection's attempts.
msg.connectGateway = false;
return msg;

```

** Conexión de Force Gateway y habilite los intentos de reconexión automática** 

```javascript

// Force the gateway's connection to the BUS and activate the reconnection's attempts.
msg.connectGateway = true;
return msg;

```

## Ver también

[Muestra de vigilancia](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
