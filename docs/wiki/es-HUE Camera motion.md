---
layout: wiki
title: "HUE Camera motion"
lang: es
permalink: /wiki/es-HUE%20Camera%20motion
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón de migración naranja de alto contraste con texto blanco convierte localmente todos los nodos HUE legacy; después solo abre un borrador de correo editable. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK y ofrece un botón de apoyo opcional; la página de donación solo se abre al pulsarlo. Antes de empezar, [mira el vídeo explicativo en YouTube](https://youtu.be/f0Evf2QFI7c).

El nodo de movimiento de la cámara Hue escucha a Philips Hue Camera Motion Services y refleja el estado detectado/no detectado a KNX. 

Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Hue Bridge |Seleccione la Hue Bridge que se utilizará |
|Movimiento de la cámara de tono |Sensor de movimiento de la cámara de tono (autocompletar mientras se escribe) |
|Leer el estado al inicio |En Startup/Reconnect, lea el valor actual y envíelo a KNX (predeterminado: no) |

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Movimiento |KNX GA para el movimiento de la cámara (booleano).DPT recomendado: <b> 1.001 </b> |

### salidas

1. Salida estándar
: `msg.payload` (boolean):` true` cuando se detecta el movimiento;de lo contrario `falso '

### Detalles

`msg.payload` conlleva el último estado de movimiento informado por el servicio de cámara Hue.
