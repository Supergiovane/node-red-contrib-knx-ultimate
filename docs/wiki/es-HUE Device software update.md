---
layout: wiki
title: "HUE Device software update"
lang: es
permalink: /wiki/es-HUE%20Device%20software%20update
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Device%20software%20update) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Device%20software%20update) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Device%20software%20update) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Device%20software%20update) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Device%20software%20update) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update)

Este nodo monitorea si un dispositivo de Hue seleccionado tiene una actualización de software disponible y publica el estado a KNX. 

Comience a escribir el nombre o la dirección de grupo de su dispositivo KNX en el campo GA, los dispositivos avaiables comienzan a aparecer mientras
Estás escribiendo.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Dispositivo de tono |Dispositivo de Hue para monitorear las actualizaciones de software (autocompletar mientras escribe). |

**Cartografía**

|Propiedad |Descripción |
|-|-|
|Estado |KNX GA refleja el estado de actualización._true_ Si una actualización está disponible/lista/está instalada, de lo contrario _false_.|
|Leer el estado al inicio |Lea el estado actual al inicio/reconexión y emita a KNX (predeterminado "sí").|

### salidas

1. Salida estándar
: carga útil (boolean): indicador de actualización.
: status (string): uno de **no \ _Update, actualizar \ _pending, listo \ _to \ _install, instalación** .
