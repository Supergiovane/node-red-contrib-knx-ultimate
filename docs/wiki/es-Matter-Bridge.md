---
layout: wiki
title: "Matter-Bridge"
lang: es
permalink: /wiki/es-Matter-Bridge
---
# Matter Bridge (BETA)

> Este nodo está en **BETA**: funciona, pero algunos detalles pueden cambiar entre versiones.

## Descripción general

El nodo Matter Bridge expone las **direcciones de grupo KNX como dispositivos Matter**: Alexa, Google Home, Apple Home (o cualquier controlador Matter) emparejan este bridge **una sola vez** y ven todos tus dispositivos KNX configurados, con los nombres que hayas elegido, listos para el control por app y por voz.

Es la dirección opuesta al nodo *Matter Device*: allí KNX controla un dispositivo Matter, aquí los controladores Matter controlan KNX.

## Configuración

|Campo|Descripción|
|--|--|
| GW KNX | Gateway KNX usado para los telegramas. **Opcional**: sin gateway el bridge funciona en modo solo-flow — habilita los PINes del nodo y controla cada dispositivo con mensajes del flow |
| Nombre del bridge Matter | Cómo se llama el bridge en las apps Matter |
| Puerto | Puerto UDP del servidor Matter (por defecto 5540). Solo un nodo bridge por instancia de Node-RED. |
| Dispositivos | Los dispositivos KNX virtuales expuestos en Matter (ver abajo) |
| Leer las GA de estado al inicio | Envía un `GroupValue_Read` a cada GA de estado al inicio, para poblar los atributos Matter |

## Dispositivos

Cada fila es un dispositivo mostrado por Alexa y cía. Elige el **tipo**, dale el **nombre** que usará el asistente y rellena las direcciones de grupo (con autocompletado ETS):

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
| Robot aspirador | **Solo-flow**: sin direcciones de grupo. Habilita los PINes del nodo: los comandos del asistente ("inicia la limpieza", pausa/reanudar/volver a la base) llegan a la salida como `rvcmode`/`rvccommand`; informa el estado con `msg.payload = { device, function: "rvcstate", value: "running"\|"docked"\|"charging"\|"paused"\|"error" }` y el modo con `function: "rvcmode", value: "cleaning"\|"idle"`. Integra tu Roomba/Roborock con cualquier nodo de Node-RED y exponlo a Alexa/Apple |

- **GA de comando**: se escribe en el bus KNX cuando el asistente envía un comando.
- **GA de estado**: se lee del bus para mantener actualizados los atributos Matter (y las apps).

## Emparejamiento

1. Haz **deploy**, espera unos segundos y vuelve a abrir el nodo.
2. El panel de emparejamiento muestra el **código QR** y el **código manual**: escanéalo o escríbelo en Alexa / Google Home / Apple Home ("añadir dispositivo Matter").
3. Se pueden emparejar varios controladores con el mismo bridge (multi-fabric Matter).

El botón **Restablecer emparejamiento** elimina todos los controladores emparejados y reinicia el anuncio de emparejamiento.

## PINes del nodo

Si habilitas los PINes de entrada/salida del nodo:

- **Entrada**: actualiza el estado Matter de un dispositivo virtual desde el flow, sin pasar por el bus KNX: `msg.payload = { device: "Luz cocina", function: "onoff", value: true }` (`device` acepta el nombre o el id interno; `function` es una de `onoff`, `level`, `position`, `temperature`, `humidity`, `illuminance`, `occupancy`, `contact`, `currenttemp`, `setpoint`). Útil para exponer a Alexa y cía. valores calculados en el flow (p.ej. un sensor virtual).
- **Salida**: cada comando recibido de un controlador Matter se reenvía al flow: `msg.topic` = nombre del dispositivo, `msg.payload` = valor, `msg.matter` = el comando en bruto. Los dispositivos sin GA de comando se convierten en **dispositivos solo-flow**: el comando llega a tu flow y tú decides qué hacer con él.

## Notas

- El host de Node-RED debe tener **IPv6 link-local** habilitado (requisito estándar de Matter) y ser accesible desde el controlador en la red local.
- La identidad del bridge se guarda en `knxultimatestorage/matter` dentro del directorio de usuario de Node-RED: los re-deploys NO requieren un nuevo emparejamiento.
- Los cambios de nombre y los dispositivos añadidos se detectan automáticamente; si eliminas un dispositivo, desaparece de las apps.
