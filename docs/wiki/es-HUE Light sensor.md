---
layout: wiki
title: "HUE Light sensor"
lang: es
permalink: /wiki/es-HUE%20Light%20sensor
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón de migración naranja de alto contraste con texto blanco convierte localmente todos los nodos HUE legacy; después solo abre un borrador de correo editable. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK y ofrece un botón de apoyo opcional; la página de donación solo se abre al pulsarlo. Antes de empezar, [mira el vídeo explicativo en YouTube](https://youtu.be/f0Evf2QFI7c).

Este nodo lee eventos de Lux de un sensor de luz de tono y los mapea a KNX. 

Emite la iluminancia ambiental (lux) cada vez que cambia.Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Hue Bridge |Seleccione la Hue Bridge que se utilizará |
|Sensor de luz de tono |Sensor de luz Hue para usar (autocompletar mientras escribe). |
|Leer el estado al inicio |Lea el estado en el inicio y emita el evento al autobús KNX al inicio/reconexión.(Predeterminado "no") |

**Cartografía**

|Propiedad |Descripción |
|-|-|
|Lux |KNX GA que recibe el valor de Lux.|

### salidas

1. Salida estándar
: carga útil (número): valor de lux actual.

### Detalles

`msg.payload` lleva el valor numérico de lux.Úselo para una lógica personalizada si es necesario.
