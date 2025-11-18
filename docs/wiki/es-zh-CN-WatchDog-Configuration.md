---
layout: wiki
title: "zh-CN-WatchDog-Configuration"
lang: es
permalink: /wiki/es-zh-CN-WatchDog-Configuration
---
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
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width = "90%"> <br/>
> Ethernet + KNX TP: detección completa (admite enrutador/interfaz).Envíe lea al dispositivo físico y espere la respuesta;Se informará cualquier fallas en Ethernet o TP.Configure un estado **** Ga en ETS para un actuador que responda a la lectura. <br/>
<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" width = "90%"> <> <>
## Opciones avanzadas
| Propiedades | Descripción |
|-|-|
| Intervalo de reintento (en segundos) | Intervalo de detección en segundos. |
| Número de reintento antes de dar un error |Cuántas fallas consecutivas se informan. |
# Salida Watchdog Salida
Watchdog emite un mensaje cuando la detección interna encuentra una falla, o un nodo ultimatizado de KNX informa un error en el proceso. ** Problema de conexión de Watchdog** <a href = "/node-red-contrib-knx-ultimate/wiki/watchdog-configuration" target = "_ en blanco"> ver aquí para obtener detalles </a>

```javascript

msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
```

** Se produjo una excepción en uno de sus nodos Últimos KNX** 

```javascript

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
```

** Modificar la configuración de la puerta de enlace a través de SetGatewayConfig** 

```javascript

msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
```

** Conexión forzada/desconexión** 

```javascript

msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```

---

# Ingrese el mensaje (entrada)
## Inicio/parar Watchdog

```javascript

msg.start = true; return msg; // 启动
```

```javascript
msg.start = false; return msg; // 停止
```

## modificar la configuración de la puerta de enlace KNX/IP durante el tiempo de ejecución
Cambiar IP/Port/PhysicalAddress/Protocol, etc. a través de `msg.setgatewayconfig`; El nodo de configuración aplicará la reconexión.Nodo -rojo restaura a la configuración en el nodo de configuración después de reiniciar.Todos los parámetros son opcionales.

```javascript

msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```Cambiar

solo la IP:

```javascript

msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
```

** Desconectar y deshabilitar la reconexión automática** 

```javascript

msg.connectGateway = false; return msg;
```

** Conexión forzada y habilitar la reconexión automática** 

```javascript

msg.connectGateway = true; return msg;
```

## Ver
[Muestra de vigilancia](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
