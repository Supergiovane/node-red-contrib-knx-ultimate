---
layout: wiki
title: "HUE Light sensor"
lang: es
permalink: /wiki/es-HUE%20Light%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor)

Este nodo lee eventos de Lux de un sensor de luz de tono y los mapea a KNX. 

Emite la iluminancia ambiental (lux) cada vez que cambia.Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Sensor de tono |Sensor de luz Hue para usar (autocompletar mientras escribe). |
|Leer el estado al inicio |Lea el estado en el inicio y emita el evento al autobús KNX al inicio/reconexión.(Predeterminado "no") |

**Cartografía**

|Propiedad |Descripción |
|-|-|
|Lux |KNX GA que recibe el valor de Lux.|

### salidas

1. Salida estándar
: carga útil (número): valor de lux actual.

### Detalles

`msg.payload` lleva el valor numérico de lux.Úselo para una lógica personalizada si es necesario.
