---
layout: wiki
title: "Garage-Configuration"
lang: es
permalink: /wiki/es-Garage-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Garage-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Garage-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Garage-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Garage-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Garage-Configuration)
---
# Puerta de garaje
El nodo **KNX Garage** controla un portón motorizado con GA dedicadas a mandos booleanos o impulsos, integra fotocélula y estado de obstrucción, permite mantener abierto o deshabilitar la lógica y dispone de cierre automático.
## Direcciones de grupo
|Propósito|Propiedad|Notas|
|--|--|--|
| Mando directo | `Command GA` (`gaCommand`) | GA booleana: `true` abre, `false` cierra (DPT 1.001). |
| Impulso toggle | `Impulse GA` (`gaImpulse`) | El flanco activo conmuta el portón (DPT 1.017). Se usa también si no hay mando directo. |
| Movimiento | `gaMoving` | Impulso opcional cada vez que el nodo ordena movimiento. |
| Obstrucción | `gaObstruction` | Refleja el estado de obstrucción para otros equipos KNX. |
| Mantener abierto | `gaHoldOpen` | Cancela el cierre automático mientras permanezca a true. |
| Deshabilitar | `gaDisable` | Bloquea cualquier orden emitida por el nodo (modo mantenimiento). |
| Fotocélula | `gaPhotocell` | Debe activarse cuando la fotocélula detecta un obstáculo; el nodo reabre y marca obstrucción. |
## Cierre automático
- Activa el temporizador de cierre para enviar la orden tras el retraso configurado.
- Mantener abierto o deshabilitar anulan el contador mientras estén activos.
- Al expirar se ejecuta `auto-close` y se envía el mando de cierre (o impulso).
## Seguridad
- Una fotocélula a true durante la bajada reabre inmediatamente la puerta y actualiza la obstrucción.
- Las escrituras externas sobre la GA de obstrucción mantienen sincronizado el estado interno con paneles y alarmas.
- Los impulsos de movimiento pueden alimentar ventilación, iluminación o lógicas de alarma.
## Integración con los flujos
- `msg.payload` acepta `true`, `false`, `'open'`, `'close'`, `'toggle'` para controlar la puerta desde Node-RED.
- Con *Emitir eventos* el nodo envía objetos con `event`, `state`, `disabled`, `holdOpen`, `obstruction`.
## Ejemplo en el flow
```javascript
// Abrir el portón
msg.payload = 'open'; // también acepta true
return msg;
```
```javascript
// Cerrar el portón
msg.payload = 'close'; // también acepta false
return msg;
```
```javascript
// Conmutar el estado del portón
msg.payload = 'toggle';
return msg;
```
