---
layout: wiki
title: "HUE Contact sensor"
lang: es
permalink: /wiki/es-HUE%20Contact%20sensor
---
## Actualizar a KNX Ultimate 8

La versión 7 añade un pequeño botón **Actualizar a v8** en la parte superior de cada editor de nodo. Crea una copia de los flujos, instala los paquetes HUE/Matter necesarios, convierte los nodos compatibles, realiza un Deploy completo, verifica los flujos guardados e instala la versión 8. Reinicia después el servicio Node-RED cuando se indique; recargar solo el navegador no es suficiente. Los nodos antiguos KNX AI detienen la operación automática.

[Leer la guía completa de actualización](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Upgrade-to-v8)

> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón de migración naranja de alto contraste con texto blanco convierte localmente todos los nodos HUE legacy; después solo abre un borrador de correo editable. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK y ofrece un botón de apoyo opcional; la página de donación solo se abre al pulsarlo. Antes de empezar, [mira el vídeo explicativo en YouTube](https://youtu.be/f0Evf2QFI7c).

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
