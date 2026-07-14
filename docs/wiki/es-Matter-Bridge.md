---
layout: wiki
title: "Matter-Bridge"
lang: es
permalink: /wiki/es-Matter-Bridge
---
# Expose KNX to Matter (BETA)

> Este nodo está en **BETA**: funciona, pero algunos detalles pueden cambiar entre versiones.

## Descripción general

Cada nodo Expose KNX to Matter expone **un dispositivo KNX como dispositivo Matter**: los controladores emparejados (Alexa, Google Home, Apple Home...) lo ven, con el nombre que hayas elegido, listo para el control por app y por voz. Apúntalo a un nodo de configuración **Bridge Matter** (el bridge en sí, emparejado una sola vez - el QR de emparejamiento vive allí) y añade tantos nodos de dispositivo como quieras, en cualquier flow.

Es la dirección opuesta al nodo *Matter Device*: allí KNX controla un dispositivo Matter, aquí los controladores Matter controlan KNX.

## Configuración

|Campo|Descripción|
|--|--|
| Bridge Matter | El nodo de configuración Bridge Matter al que pertenece este dispositivo |
| GW KNX | Gateway KNX usado para los telegramas. **Opcional**: sin él, el dispositivo funciona en modo solo-flow mediante los PINes del nodo. Se selecciona automáticamente si el proyecto tiene un solo gateway |
| Nombre | Lo que Alexa y cía. muestran y usan para los comandos de voz |
| Tipo de dispositivo | El tipo de dispositivo Matter (ver abajo); determina qué campos de dirección de grupo aparecen |
| Leer estado al inicio | Envía un `GroupValue_Read` a las GA de estado al inicio, para poblar los atributos Matter |

## Tipos de dispositivo y direcciones de grupo

|Tipo|Direcciones de grupo|
|--|--|
| Luz On/Off, Enchufe | GA comando On/Off, GA estado On/Off (DPT 1.001) |
| Luz regulable | + GA comando/estado regulación % (DPT 5.001) |
| Luz RGB (color) | + GA comando/estado color RGB (DPT 232.600). El color Matter (hue/saturation o XY, de la rueda de color de la app) se convierte desde/hacia la terna RGB KNX |
| Luz blanco dinámico | + GA comando/estado temperatura de color en Kelvin (DPT 7.600) |
| Persiana / Cortina | Subir/Bajar (DPT 1.008), Stop (DPT 1.017), posición % comando/estado (DPT 5.001), inversión de posición opcional |
| Termostato (calefacción) | GA temperatura actual, GA comando/estado consigna (DPT 9.001) |
| Ventilador / VMC | GA comando/estado velocidad % (DPT 5.001) |
| Sensores (temperatura, humedad, luz, presencia, contacto) | Una GA de estado cada uno |
| Alarma humo/CO | GA estado alarma de humo + GA estado alarma CO opcional (DPT 1.005): notificaciones críticas en el teléfono |
| Detector de fugas de agua | GA estado fuga (DPT 1.005) |
| Sensor de calidad del aire (CO2) | GA estado CO2 en ppm (DPT 9.008); la clase de calidad del aire (buena/regular/moderada/mala...) se deriva automáticamente |
| Robot aspirador | **Solo-flow**: sin direcciones de grupo. Habilita los PINes del nodo: los comandos del asistente ("inicia la limpieza", pausa/reanudar/volver a la base) llegan a la salida como `rvcmode`/`rvccommand`; informa el estado con `msg.payload = { function: "rvcstate", value: "running"\|"docked"\|"charging"\|"paused"\|"error" }` y el modo con `function: "rvcmode", value: "cleaning"\|"idle"` |

- **GA de comando**: se escribe en el bus KNX cuando el asistente envía un comando.
- **GA de estado**: se lee del bus para mantener actualizados los atributos Matter (y las apps).

## Compatibilidad avanzada

Estas opciones solo aparecen cuando tienen sentido para el tipo seleccionado. Los dispositivos regulables pueden ignorar el brillo enviado justo después de `On`. Para persianas, **Intercambiar Abrir / Cerrar** invierte el comando KNX binario y la dirección porcentual. **Antirrebote del deslizador** agrupa objetivos intermedios rápidos antes de escribir en KNX: `0` usa ventanas adaptativas (400 ms para el primer comando y 150 ms para los siguientes); `1`–`5000` fuerza una ventana fija. La posición Matter también puede actualizarse de forma optimista y corregirse después mediante la GA de estado KNX.

## PINes del nodo

Si habilitas los PINes de entrada/salida del nodo:

- **Entrada**: actualiza el estado Matter desde el flow, sin pasar por el bus KNX: `msg.payload = { function: "onoff", value: true }` (`function` es una de `onoff`, `level`, `rgb`, `colortemp`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`, `fanspeed`, `smoke`, `co`, `leak`, `co2`, `rvcstate`, `rvcmode`). Útil para exponer a Alexa y cía. valores calculados en el flow (p.ej. un sensor virtual).
- **Salida**: cada comando recibido de un controlador Matter se reenvía al flow: `msg.topic` = nombre del dispositivo, `msg.payload` = valor, `msg.matter` = el comando en bruto. Un dispositivo sin GA de comando se convierte en un **dispositivo solo-flow**.

## Notas

- La identidad Matter del dispositivo está ligada a este nodo: si borras el nodo y creas uno nuevo, las apps ven un dispositivo completamente nuevo.
- Los nodos de dispositivo añadidos/renombrados/eliminados se detectan en pocos segundos, sin volver a emparejar el bridge.
