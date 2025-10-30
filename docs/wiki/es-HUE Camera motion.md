---
layout: wiki
title: "HUE Camera motion"
lang: es
permalink: /wiki/es-HUE%20Camera%20motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Camera%20motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Camera%20motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Camera%20motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Camera%20motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Camera%20motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Camera%20motion)

El nodo de movimiento de la cámara Hue escucha a Philips Hue Camera Motion Services y refleja el estado detectado/no detectado a KNX. 

Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Sensor de tono |Sensor de movimiento de la cámara de tono (autocompletar mientras se escribe) |
|Leer el estado al inicio |En Startup/Reconnect, lea el valor actual y envíelo a KNX (predeterminado: no) |

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Movimiento |KNX GA para el movimiento de la cámara (booleano).DPT recomendado: <b> 1.001 </b> |

### salidas

1. Salida estándar
: `msg.payload` (boolean):` true` cuando se detecta el movimiento;de lo contrario `falso '

### Detalles

`msg.payload` conlleva el último estado de movimiento informado por el servicio de cámara Hue.
