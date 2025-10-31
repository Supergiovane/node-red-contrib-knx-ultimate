---
layout: wiki
title: "zh-CN-HUE Camera motion"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Camera%20motion
---
---
<P> El nodo de movimiento de la cámara Hue escucha eventos de movimiento de la cámara Philips Hue y los mapas detectados/estados no detectados a KNX.</p>
Comience a ingresar en el cuadro de entrada GA (nombre o dirección de grupo) para asociar el KNX GA;El dispositivo coincidente se mostrará cuando se ingrese.
**convencional**
| Propiedades | Descripción |
|-|-|
| KNX Gateway | Seleccione la puerta de enlace KNX para usar |
| Puente Hue | Seleccione el puente Hue para usar |
| Sensor de tono | Sensor de movimiento de la cámara Hue (complete automáticamente cuando se ingresa) |
| Leer el estado al inicio | Lea el valor actual al inicio/reconexión y envíe a KNX (predeterminado: no) |
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Movimiento |Dirección de grupo KNX (booleano) para el movimiento de la cámara. DPT recomendado: <b> 1.001 </b> |
### Producción
1. Salida estándar
: `msg.payload` (boolean):` true 'cuando se detecta el movimiento, de lo contrario' falso`
### Detalles
`msg.payload` Guardar el último estado de movimiento informado del servicio de cámara HUE.</script>
