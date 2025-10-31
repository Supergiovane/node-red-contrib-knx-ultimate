---
layout: wiki
title: "HUE Humidity sensor"
lang: es
permalink: /wiki/es-HUE%20Humidity%20sensor
---
Este nodo lee la humedad relativa (%) de un sensor de humedad de tono y lo asigna a KNX. 

Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Sensor de tono |Sensor de humedad de tono (autocompletado mientras se escribe) |
|Leer el estado al inicio |En Startup/Reconext, lea el valor actual y envíelo a KNX (predeterminado: no) |

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Humedad |KNX GA para la humedad relativa %.DPT recomendado: <b> 9.007 </b> |

### salidas

1. Salida estándar
: `msg.payload` (número): humedad relativa actual en %

### Detalles

`msg.payload` lleva el valor de humedad numérica (porcentaje).
