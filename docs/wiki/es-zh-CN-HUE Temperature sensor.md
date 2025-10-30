---
layout: wiki
title: "zh-CN-HUE Temperature sensor"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)
---
<p> Este nodo lee la temperatura (° C) del sensor de temperatura del tono y lo asigna a KNX.</p>
Ingrese en el campo GA (nombre o dirección de grupo) para asociar el KNX GA;Las sugerencias de dispositivos se muestran cuando se ingresan.
**General**
| Propiedades | Descripción |
|-|-|
| KNX GW | Seleccione la puerta de enlace KNX para usar |
| Puente Hue | Seleccione el puente Hue para usar |
| Sensor de tono | Sensor de temperatura del tono (completo automáticamente cuando se ingresa) |
| Leer el estado al inicio | Lea el valor actual durante el inicio/reconexión y envíe a KNX (predeterminado: no) |
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Temperatura | Temperatura (° C) KNX GA. DPT recomendado: <b> 9.001 </b> |
### Producción
1. Salida estándar
: `msg.payload` (número): temperatura actual (° C)
### Detalles
`msg.payload` contiene temperatura numérica.
