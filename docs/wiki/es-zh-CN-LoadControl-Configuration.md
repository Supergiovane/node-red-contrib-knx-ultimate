---
layout: wiki
title: "zh-CN-LoadControl-Configuration"
lang: es
permalink: /wiki/es-zh-CN-LoadControl-Configuration
---
---
# Nodo de control de carga KNX
<p> Usando el nodo de control de carga, puede administrar automáticamente la desconexión de la carga (lavadora, horno, etc.) cuando el consumo actual excede un cierto umbral.
El dispositivo se apaga de manera inteligente, verificando el posible consumo del dispositivo para determinar si está apagado con otros dispositivos.<br/>
El nodo puede reactivar automáticamente la carga.<br/>
Este nodo apaga un dispositivo (o dispositivos) a la vez según el pedido que elija. <br/>
**General**
| Propiedades | Descripción |
|-|-|
| Gateway | Knx Portal.También es posible no seleccionar ninguna puerta de enlace.En este caso, solo se considerarán los mensajes ingresados ​​en el nodo. |
|Vigilancia WH | La dirección grupal representa el consumo total de su edificio.|
| Límite WH | Umbral máximo que el medidor puede soportar.Cuando se excede este umbral, el nodo comienza a cerrar el dispositivo. |
| Retrasado (s) (s) |Indica en segundos, lo que indica que el nodo evaluará la frecuencia de consumo y apagará cada dispositivo. |
| Retraso en (s) |indica en segundos, lo que indica que el nodo evalúa la frecuencia consumida y enciende cada dispositivo que está cerrado.|
<br/>
**Control de carga**
Aquí puede agregar el dispositivo para apagar en caso de sobrecarga.<br/>
Seleccione el dispositivo para apagar.Ingrese el nombre del dispositivo o su dirección de grupo.<br/>
Ingrese cualquier dirección de grupo que indique lo consumido por el dispositivo seleccionado en la primera línea. **Este es un parámetro opcional** . Si el dispositivo consume más de una cierta cantidad de vatios, significa que está en uso.Si se consume menos, el dispositivo se considerará "no utilizado" y el dispositivo se apagará de inmediato. <br/>
Si \*Autorecovery \* está habilitado, el dispositivo se reactivará automáticamente cuando expire el retraso de reinicio.
## Ingresar
| Propiedades | Descripción |
|-|-|
| `msg.readstatus = true` | Force el bus KNX de cada dispositivo en la lista a leer el valor._ **El nodo en sí ha realizado todas las operaciones** _, pero si es necesario, puede usar este comando para forzar un relevo del valor actual en Watt.| | |
| `msg.enable = true` | Habilitar el control de carga. |
| `msg.disable = true` |deshabilitar el control de carga. |
| `msg.reset = true` | Restablecer el estado del nodo y reabrir todos los dispositivos. |
| `msg.shedding` | cadena.__ "" """"umbendo- "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" Use este mensaje para forzar el temporizador de caída a comenzar/parar, ignorando la dirección de grupo \*\* Monitor WH \*\*. |
## Producción
1. Salida estándar
: Carga de pago (cadena | objeto): salida estándar del comando.
## detalle

```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}
```

# Muestra
\ <a href = "/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Haga clic aquí por ejemplo </a>
<br/>
