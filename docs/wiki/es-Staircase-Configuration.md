---
layout: wiki
title: "Staircase-Configuration"
lang: es
permalink: /wiki/es-Staircase-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Staircase-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Staircase-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Staircase-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Staircase-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Staircase-Configuration)
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
