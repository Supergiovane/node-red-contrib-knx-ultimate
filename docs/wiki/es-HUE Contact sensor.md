---
layout: wiki
title: "HUE Contact sensor"
lang: es
permalink: /wiki/es-HUE%20Contact%20sensor
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón naranja de migración convierte localmente todos los nodos HUE legacy; después abre un borrador de correo editable y la página de donación en una ventana nueva del navegador. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK.

Este nodo reenvía los eventos desde un sensor de contacto de tono y los asigna a las direcciones de grupo KNX. 

Comience a escribir en el campo GA, el nombre o la dirección de grupo de su dispositivo KNX, los dispositivos avaiables comienzan a aparecer mientras está escribiendo.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Hue Bridge |Seleccione la Hue Bridge que se utilizará |
|Sensor de contacto de tono |Sensor de contacto de Hue para ser utilizado (autocompletar mientras se escribe). |

|Propiedad |Descripción |
|-|-|
|Contacto |Cuando el contacto se abre/cierra, envíe el valor de KNX: _true_ en activo/abierto, de lo contrario _false_.|

### salidas

1. Salida estándar
: carga útil (boolean): la salida estándar del comando.

### Detalles

`msg.payload` lleva el evento de tono bruto (booleano/objeto).Úselo para una lógica personalizada si es necesario.
