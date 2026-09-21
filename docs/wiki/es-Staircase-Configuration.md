---
layout: wiki
title: "Staircase-Configuration"
lang: es
permalink: /wiki/es-Staircase-Configuration
---
## Actualizar a KNX Ultimate 8

La versión 7 añade un pequeño botón **Actualizar a v8** en la parte superior de cada editor de nodo. Crea una copia de los flujos, instala los paquetes HUE/Matter necesarios, convierte los nodos compatibles, realiza un Deploy completo, verifica los flujos guardados e instala la versión 8. Reinicia después el servicio Node-RED cuando se indique; recargar solo el navegador no es suficiente. Los nodos antiguos KNX AI detienen la operación automática.

[Leer la guía completa de actualización](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Este nodo dedicado sigue siendo compatible con los flujos existentes. Para los nuevos flujos usa [KNX Utility](/node-red-contrib-knx-ultimate/wiki/es-KNX-Utility) y selecciona **Staircase**. Su editor convierte todas las utilidades antiguas compatibles en todos los flujos y subflujos, con una sola operación Deshacer y Deploy manual.

---
# Temporizador de escalera
El nodo **KNX Staircase** reproduce el comportamiento de un temporizador de escalera. Cuando la GA de impulso recibe un `1` la luz se enciende, se inicia la cuenta atrás y, si está configurado, se avisa antes de apagar. También admite override manual, bloqueo y emisión de eventos para Node-RED.
## Direcciones de grupo

|Propósito|Propiedad|Notas|
|--|--|--|
| Impulso | `Trigger GA` (`gaTrigger`) | El valor `1` inicia o prolonga el temporizador. Con "El valor 0 cancela" un `0` apaga la luz. |
| Salida | `Output GA` (`gaOutput`) | Actuador controlado durante el ciclo (DPT predeterminado 1.001). |
| Estado | `Status GA` (`gaStatus`) | Refleja el estado activo y el preaviso. |
| Override | `gaOverride` | Mantiene la luz encendida mientras sea `1` y pausa el temporizador. |
| Bloqueo | `gaBlock` | Evita nuevas activaciones y puede forzar el apagado. |

## Temporizador y preaviso
- **Duración del temporizador** define la duración base.
- **Nuevo impulso** permite reiniciar, extender o ignorar impulsos adicionales.
- **El valor 0 cancela el ciclo** termina el temporizador con motivo `manual-off` cuando la GA vuelve a `0`.
- **Cuando está bloqueado** decide si el bloqueo solo impide impulsos o fuerza el apagado.
- El preaviso puede conmutar la GA de estado o hacer parpadear la salida durante los milisegundos configurados.
## Eventos y salida
- Con *Emitir eventos* habilitado el nodo envía objetos con `event`, `remaining`, `active`, `override`, `blocked` (`trigger`, `extend`, `prewarn`, `timeout`, `manual-off`, `override`, `block`).
- También puedes fiarte de la GA de estado para las automatizaciones en KNX.
## Ejemplo en el flow
```javascript

// Iniciar el temporizador de escalera
msg.payload = true;
return msg;
```

```javascript
// Cancelar el ciclo (opción "El valor 0 cancela el ciclo")
msg.payload = false;
return msg;
```

## Consejos
- Usa el override para tareas de limpieza o mantenimiento.
- Vincula la GA de estado a un indicador físico o panel.
- Activa el parpadeo solo si el actuador soporta conmutaciones rápidas.
