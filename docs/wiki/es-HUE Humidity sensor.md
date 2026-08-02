---
layout: wiki
title: "HUE Humidity sensor"
lang: es
permalink: /wiki/es-HUE%20Humidity%20sensor
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón naranja de migración convierte localmente todos los nodos HUE legacy; después abre un borrador de correo editable y la página de donación en una ventana nueva del navegador. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK.

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
