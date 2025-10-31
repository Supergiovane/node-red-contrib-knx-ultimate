---
layout: wiki
title: "zh-CN-HUE Button"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Button
---
---
El nodo del botón <P> Hue mapea el evento del botón Hue para KNX usando el botón <código>.button_report.event </code> y proporciona el mismo evento en la salida del proceso.</p>
Escriba el cuadro de entrada GA (nombre o dirección de grupo) para asociar el KNX GA;El dispositivo coincidente se mostrará al ingresar.
**convencional**
| Propiedades | Descripción |
|-|-|
| KNX Gateway | Seleccione la puerta de enlace KNX para usar |
| Puente Hue | Seleccione el puente Hue para usar |
| Botón de tono | Botón Hue para usar (completo automáticamente cuando se ingresa) |
**cambiar**
| Propiedades | Descripción |
|-|-|
| Interruptor | GA activado por <code> Short \ _Release </code> (comunicado de prensa corto). |
| Estado GA |Comentarios opcionales GA Cuando el "valor de conmutación por evento" está habilitado para mantener sincronizado el estado interno.|
**Dimmultiplex**
| Propiedades | Descripción |
|-|-|
| Atenuación | <code> long \ _press </code>/<code> repite </code> La GA utilizada para atenuar durante el evento (generalmente DPT 3.007). |
**Comportamiento**
| Propiedades |Descripción |
|-|-|
| Valores de cambio para cada evento | Cuando está habilitado, cambie automáticamente entre <código> True/False </code> y la dirección de atenuación.|
| Carga de interruptor |Carga fija enviada a KNX/Proceso cuando la conmutación está deshabilitada.|
| Carga de atenuación | La dirección de atenuación fija enviada a KNX/Flow cuando la conmutación está deshabilitada. |
### Producción
1. Salida estándar
: `msg.payload` es un objeto booleano o atenuación;`msg.event` es una cadena de eventos de tono (por ejemplo` short_release`, `repetir`).
### Detalles
`msg.event` corresponde a` button.button_report.event`, y el evento de tono original está contenido en `msg.rawevent`.El uso de un estado opcional GA permite que el estado de conmutación interno sea consistente con dispositivos externos como interruptores de pared.
