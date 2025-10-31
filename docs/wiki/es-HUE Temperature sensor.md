---
layout: wiki
title: "HUE Temperature sensor"
lang: es
permalink: /wiki/es-HUE%20Temperature%20sensor
---
Este nodo lee la temperatura (° C) de un sensor de temperatura del tono y lo asigna a KNX. 

Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Sensor de tono |Sensor de temperatura del tono (autocompletado mientras se escribe) |
|Leer el estado al inicio |En Startup/Reconext, lea el valor actual y envíelo a KNX (predeterminado: no) |

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Temperatura |KNX GA para la temperatura en Celsius.DPT recomendado: <b> 9.001 </b> |

### salidas

1. Salida estándar
: `msg.payload` (número): temperatura actual en ° C

### Detalles

`msg.payload` lleva el valor de temperatura numérica.
