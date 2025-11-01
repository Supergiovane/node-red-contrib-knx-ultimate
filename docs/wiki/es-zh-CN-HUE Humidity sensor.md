---
layout: wiki
title: "zh-CN-HUE Humidity sensor"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Humidity%20sensor/
---
---
<p> Este nodo lee la humedad relativa (%) del sensor de humedad del tono y los mapas a KNX.</p>
Comience a ingresar (nombre o dirección de grupo) en el campo GA para asociar el KNX GA;El dispositivo coincidente se muestra cuando se ingresa.
**convencional**
| Propiedades | Descripción |
|-|-|
| KNX Gateway | Seleccione la puerta de enlace KNX para usar |
| Puente Hue | Seleccione el puente Hue para usar |
| Sensor de tono | Sensor de humedad Hue (completo automáticamente cuando se ingresa) |
| Leer el estado al inicio | Lea el valor actual al inicio/reconexión y envíe a KNX (predeterminado: no) |
**Cartografía**
| Propiedades | Descripción |
|-|-|
|Humedad | KNX GA con humedad relativa %. DPT recomendado: <b> 9.007 </b> |
### Producción
1. Salida estándar
: `msg.payload` (número): humedad relativa actual (%)
### Detalles
`msg.payload` El valor (porcentaje) de la humedad.
