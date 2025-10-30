---
layout: wiki
title: "HUE Contact sensor"
lang: es
permalink: /wiki/es-HUE%20Contact%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Contact%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Contact%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Contact%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Contact%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor)

Este nodo reenvía los eventos desde un sensor de contacto de tono y los asigna a las direcciones de grupo KNX. 

Comience a escribir en el campo GA, el nombre o la dirección de grupo de su dispositivo KNX, los dispositivos avaiables comienzan a aparecer mientras está escribiendo.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Sensor de tono |Sensor de contacto de Hue para ser utilizado (autocompletar mientras se escribe). |

|Propiedad |Descripción |
|-|-|
|Contacto |Cuando el contacto se abre/cierra, envíe el valor de KNX: _true_ en activo/abierto, de lo contrario _false_.|

### salidas

1. Salida estándar
: carga útil (boolean): la salida estándar del comando.

### Detalles

`msg.payload` lleva el evento de tono bruto (booleano/objeto).Úselo para una lógica personalizada si es necesario.
