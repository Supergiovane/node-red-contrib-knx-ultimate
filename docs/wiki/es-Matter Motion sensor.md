---
layout: wiki
title: "Matter Motion sensor"
lang: es
permalink: /wiki/es-Matter%20Motion%20sensor
---
# Sensor de movimiento Matter (BETA)

> Este nodo está en **BETA**: el comportamiento puede cambiar mientras se mejora la implementación Matter.

Este nodo conecta un endpoint de movimiento Matter con KNX y, opcionalmente, con una salida Node-RED.

## Configuración

|Campo|Descripción|
|--|--|
| KNX GW | Gateway KNX usado para escribir y responder las direcciones de grupo configuradas. Puede quedar vacío si solo se necesita la salida Node-RED. |
| Matter controller | Nodo de configuración Matter Controller donde el dispositivo fue emparejado. |
| Sensor de movimiento Matter | endpoint de movimiento Matter seleccionado entre los dispositivos emparejados. La lista se filtra a endpoints que exponen `OccupancySensing`. |
| GA movimiento | GA movimiento que recibe el valor convertido. DPT por defecto: `1.001`. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Node output | Muestra una salida Node-RED y emite cada actualización Matter. |

## Comportamiento

El nodo lee `OccupancySensing.occupancy`, lo convierte a estado booleano de ocupación/movimiento, lo escribe en la GA KNX configurada y responde a lecturas KNX con el último valor conocido.
