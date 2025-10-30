---
layout: wiki
title: "LoadControl-Configuration"
lang: es
permalink: /wiki/es-LoadControl-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)

# Nodo de control de carga KNX

 Con el nodo de control de carga puede administrar automáticamente la desconexión de las cargas (lavadora, horno, etc.) cuando el consumo de corriente excede un cierto umbral.

Los dispositivos se desactivan de manera inteligente, verificando el posible consumo del dispositivo para determinar si apagarlo con otros.

El nodo puede reactivar automáticamente las cargas.

El nodo apaga un dispositivo (o múltiples dispositivos) a la vez, según el orden que ha seleccionado. 

**General**

| Propiedad | Descripción |
|-|-|
|Puerta de entrada |KNX Gateway.También es posible no seleccionar ninguna puerta de enlace;En este caso, solo se considerarán mensajes entrantes al nodo.|
|Monitor WH |Dirección grupal que representa el consumo total de su edificio.|
|Límite WH |Umbral máximo que su medidor de electricidad puede soportar.Cuando se excede este umbral, el nodo comienza a apagar los dispositivos.|
|Retraso apagado (s) |Expresado en segundos, indica con qué frecuencia el nodo evaluará el consumo y apagará cada dispositivo.|
|Interruptor de retraso (s) (s) |Expresado en segundos, indica con qué frecuencia el nodo evaluará el consumo y encenderá cada dispositivo que se apagó.|

**Control de carga**

Aquí puede agregar dispositivos para apagar en caso de sobrecarga.

Elija el dispositivo para apagar.Ingrese el nombre del dispositivo o su dirección de grupo.

Ingrese cualquier dirección de grupo que indique el consumo del dispositivo elegido en la primera línea. **Este es un parámetro opcional** .Si el dispositivo consume más de un cierto número de vatios, significa que está en uso.Si consume menos, el dispositivo se considerará "no en uso" y tanto esto como el siguiente se desactivarán a la vez. 

Si _Automatic Recovery_ está habilitado, el dispositivo se reactiva automáticamente cuando expira el "retraso de reinicio".

## entradas

| Propiedad | Descripción |
|-|-|
|`msg.readstatus = true` |Forzar la lectura de los valores del bus KNX de cada dispositivo en la lista._ **El nodo ya hace todo por sí mismo** _, pero si es necesario, es posible usar este comando para forzar una releer de los valores actuales en Watt. |
|`msg.enable = true` |Habilitar el control de carga. |
|`msg.disable = true` |Deshabilite el control de carga. |
|`msg.reset = true` |Restablecer los estados de nodo y encender todos los dispositivos. |
|`msg.shedding` |Cadena._shed_ para iniciar la secuencia de desprendimiento de formato, _Unshed_ para comenzar a invertir el desprendimiento.Use este MSG para obligar al temporizador de desprendimiento a comenzar/detener, ignorando la dirección de grupo **Monitor WH ** .Establezca _auto_ para habilitar nuevamente el monitor**WH** Monitoreo de la dirección del grupo.|

## salidas

1. Salida estándar
: Payload (String | Object): la salida estándar del comando.

## Detalles```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```# Muestra

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Haga clic aquí para ver el ejemplo </a>
