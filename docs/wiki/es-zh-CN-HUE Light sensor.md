---
layout: wiki
title: "zh-CN-HUE Light sensor"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Light%20sensor/
---
---
<p> Este nodo lee un evento Lux del sensor de luz Hue y lo publica a KNX.</p>
El valor de Lux se emite cada vez que cambia la luz ambiental.Ingrese el nombre del dispositivo KNX o la dirección de grupo (autocompletar) en el campo GA para la asociación.
**General**
| Propiedades | Descripción |
|-|-|
| KNX GW | Seleccione el portal KNX para usar |
| Puente Hua | Seleccione el puente de tono para usar |
| Sensor de tono | Sensor de luz Hue para usar (finalización automática) |
| Lea el estado del inicio | Lea el estado al inicio y transmita los eventos al bus KNX en Startup/Reconex.(Predeterminado "no") |
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Lux | Dirección de grupo KNX que recibe valores de lux |
### Producción
1. Salida estándar
: carga útil (número): valor de lux actual
### detalle
`msg.payload` es un lux numérico.
