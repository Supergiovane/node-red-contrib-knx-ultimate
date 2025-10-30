---
layout: wiki
title: "HUE Zigbee connectivity"
lang: es
permalink: /wiki/es-HUE%20Zigbee%20connectivity
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Zigbee%20connectivity) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Zigbee%20connectivity) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Zigbee%20connectivity) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Zigbee%20connectivity) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)

Este nodo recupera el estado de conectividad Zigbee de un dispositivo de tono y lo expone a KNX. 

Comience a escribir el nombre del dispositivo KNX o la dirección de grupo en el campo GA;Aparecen sugerencias mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |KNX Gateway solía publicar el estado.|
|Puente Hue |Puente de Hue para la consulta.|
|Sensor de tono |Sensor/dispositivo de tono que proporciona la información de conectividad Zigbee.Autocompletar mientras se escribe.|

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Estado |Dirección de grupo KNX que refleja la conectividad Zigbee.Se convierte en _true_ cuando está conectado, de lo contrario _false_.|
|Leer el estado al inicio |Lee el estado actual en el editor inicial/reconexión y emite a KNX.Valor predeterminado: "Sí".|

### salidas

1. Salida estándar
: carga útil (boolean): estado de conectividad.

### Detalles

`msg.payload` lleva el estado booleano (verdadero/falso). \
`msg.status` contiene un estado textual: uno de **conectado, desconectado, conectividad \ _SISMO, unidireccional \ _Incoming** .
