---
layout: wiki
title: "HUE Humidity sensor"
lang: es
permalink: /wiki/es-HUE%20Humidity%20sensor
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón de migración naranja de alto contraste con texto blanco convierte localmente todos los nodos HUE legacy; después solo abre un borrador de correo editable. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK y ofrece un botón de apoyo opcional; la página de donación solo se abre al pulsarlo. Antes de empezar, [mira el vídeo explicativo en YouTube](https://youtu.be/f0Evf2QFI7c).

Este nodo lee la humedad relativa (%) de un sensor de humedad de tono y lo asigna a KNX. 

Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Hue Bridge |Seleccione la Hue Bridge que se utilizará |
|Sensor de tono |Sensor de humedad de tono (autocompletado mientras se escribe) |
|Leer el estado al inicio |En Startup/Reconext, lea el valor actual y envíelo a KNX (predeterminado: no) |

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Humedad |KNX GA para la humedad relativa %.DPT recomendado: <b> 9.007 </b> |

### salidas

1. Salida estándar
: `msg.payload` (número): humedad relativa actual en %

### Detalles

`msg.payload` lleva el valor de humedad numérica (porcentaje).
