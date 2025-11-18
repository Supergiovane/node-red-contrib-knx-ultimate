---
layout: wiki
title: "zh-CN-HUE Zigbee connectivity"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Zigbee%20connectivity
---
---
<p> Este nodo lee el estado de conexión Zigbee desde el dispositivo HUE y lo publica a KNX.</p>
Ingrese el nombre del dispositivo KNX o la dirección de grupo en el campo GA, y se asociará automáticamente cuando se ingrese.
**convencional**
| Propiedades | Descripción |
|-|-|
| KNX GW | KNX Gateway para el estado de liberación |
| Puente Hue | Puente de Hue para usar |
| Sensor de tono | Sensor/dispositivo de Hue que proporciona información de conexión Zigbee (autocompleto) |
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Estado | Mapee la dirección del grupo KNX de la conectividad Zigbee._true_ Cuando está conectado, de lo contrario _false_.|
| Leer el estado al inicio | Lea y publique para KNX durante el inicio/reconexión.Valor predeterminado: "Sí".|
### Producción
1. Salida estándar
: carga útil (boolean): estado de conexión.
### Detalles
`msg.payload` es verdadero/falso.\
`msg.status` es texto: **conectado, desconectado, conectividad \ _SISMO, unidireccional \ _Incoming** .
