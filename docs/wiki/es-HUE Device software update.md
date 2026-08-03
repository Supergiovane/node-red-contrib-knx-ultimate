---
layout: wiki
title: "HUE Device software update"
lang: es
permalink: /wiki/es-HUE%20Device%20software%20update
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón de migración naranja de alto contraste con texto blanco convierte localmente todos los nodos HUE legacy; después solo abre un borrador de correo editable. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK y ofrece un botón de apoyo opcional; la página de donación solo se abre al pulsarlo. Antes de empezar, [mira el vídeo explicativo en YouTube](https://youtu.be/f0Evf2QFI7c).

Este nodo monitorea si un dispositivo de Hue seleccionado tiene una actualización de software disponible y publica el estado a KNX. 

Comience a escribir el nombre o la dirección de grupo de su dispositivo KNX en el campo GA, los dispositivos avaiables comienzan a aparecer mientras
Estás escribiendo.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Hue Bridge |Seleccione la Hue Bridge que se utilizará |
|Dispositivo para tonos |Dispositivo de Hue para monitorear las actualizaciones de software (autocompletar mientras escribe). |

**Cartografía**

|Propiedad |Descripción |
|-|-|
|Estado |KNX GA refleja el estado de actualización._true_ Si una actualización está disponible/lista/está instalada, de lo contrario _false_.|
|Leer el estado al inicio |Lea el estado actual al inicio/reconexión y emita a KNX (predeterminado "sí").|

### salidas

1. Salida estándar
: carga útil (boolean): indicador de actualización.
: status (string): uno de **no \ _Update, actualizar \ _pending, listo \ _to \ _install, instalación** .
