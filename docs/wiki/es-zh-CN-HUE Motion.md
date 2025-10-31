---
layout: wiki
title: "zh-CN-HUE Motion"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Motion
---
---
<p> Este nodo se suscribe a los eventos del sensor de movimiento del tono y los sincroniza con el proceso KNX y del nodo-rojo.</p>
Ingrese el nombre del dispositivo KNX o la dirección de grupo en el campo GA para completar automáticamente; El botón Actualizar al lado del "Sensor de Hue" puede volver a cargar la lista de dispositivos Hue.
**convencional**
| Propiedades | Descripción |
|-|-|
| KNX GW | KNX Gateway que recibe el estado del movimiento (las configuraciones de KNX se muestran solo después de la selección) |
| Puente de Hue | Utilizado por Hue Bridge |
| Sensor de tono | Sensor de movimiento de Hue para usar (admite la finalización automática y la actualización) |
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Movimiento | Dirección de grupo KNX correspondiente; Enviar `True` cuando se detecta el movimiento y envíe` falso 'cuando se restaura inactiva (DPT recomendado: <b> 1.001 </b>) |
**Comportamiento**
| Propiedades | Descripción |
|-|-|
| Pin de salida del nodo | Mostrar u ocultar la salida de rojo nodo; permanece habilitado cuando KNX Gateway no se selecciona para garantizar que los eventos de Hue aún puedan ingresar al proceso |
> ℹ️ Cuando no se selecciona la puerta de enlace KNX, el campo KNX se oculta automáticamente y el nodo se puede usar como un oyente de rojo rojo de nodo puro.
### Producción
1. Salida estándar - `msg.payload` (boolean)
: El movimiento se detecta como `Verdadero` y el final del movimiento es 'falso'.
