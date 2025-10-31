---
layout: wiki
title: "zh-CN-HUE Battery"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Battery
---
---
<p> Este nodo sincroniza el nivel de batería del dispositivo HUE para KNX y desencadena un evento cuando cambia el valor.</p>
Ingrese el nombre del dispositivo KNX o la dirección de grupo en el campo GA para completar automáticamente; Haga clic en el botón Actualizar junto al "Sensor Hue" para recargar la lista de dispositivos Hue.
**convencional**
| Propiedades | Descripción |
|-|-|
| KNX GW | KNX Gateway para liberar potencia (la configuración de mapeo KNX se mostrará solo después de la selección).|
| Puente Hue | Puente de Hue utilizado. |
| Sensor de tono |Dispositivo/sensor HUE que proporciona información de energía (admite la finalización automática y la actualización).|
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Batería | Dirección de grupo KNX del porcentaje de batería (0-100%), DPT recomendado: <b> 5.001 </b>. |
**Comportamiento**
|Propiedades | Descripción |
|-|-|
| Lea el estado en el inicio | Lea el poder actual durante la implementación/reconexión y publique a KNX.Valor predeterminado: "Sí".|
| Pin de salida del nodo | Mostrar u ocultar la salida de nodo-rojo.Cuando no se selecciona la puerta de enlace KNX, el pin de salida permanece habilitado para garantizar que el evento HUE aún pueda ingresar al proceso.|
> ℹ️ Cuando no se selecciona la puerta de enlace KNX, el campo de mapeo KNX se oculta automáticamente para facilitar el uso de nodos como fuentes de eventos rojos de nodo puro → nodo.
