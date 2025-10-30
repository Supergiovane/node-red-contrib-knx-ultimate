---
layout: wiki
title: "zh-CN-HUE Contact sensor"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Contact%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Contact%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Contact%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Contact%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Contact%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor)
---
<P> Este nodo asigna el evento del sensor de contacto de tono a la dirección del grupo KNX.</p>
Comience a ingresar el campo GA, el nombre o la dirección de grupo del dispositivo KNX, y el dispositivo disponible comienza a mostrar al ingresar.
**General**
| Propiedades | Descripción |
|-|-|
| KNX GW | Seleccione el portal KNX para usar |
| Puente Hua | Seleccione el puente de tono para usar |
| Sensor de tono | Sensor de contacto de Hue para usar (finalización automática) |
| Propiedades | Descripción |
| ----------------------------------------------------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------- |
| Contacto | Cuando el sensor está encendido/apagado: envíe el valor KNX _true_ (activar/on), de lo contrario _false_ |
### Producción
1. Salida estándar
: Carga útil (Bolean): salida estándar del comando.
### detalle
`msg.payload` es un evento de tono (booleano/objeto) que puede usarse para la lógica personalizada.
