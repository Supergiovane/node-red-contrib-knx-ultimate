---
layout: wiki
title: "Matter Light sensor"
lang: es
permalink: /wiki/es-Matter%20Light%20sensor
---
# Sensor de luz Matter (BETA)

> Este nodo está en **BETA**: el comportamiento puede cambiar mientras se mejora la implementación Matter.

Este nodo conecta un endpoint de iluminancia Matter con KNX y, opcionalmente, con una salida Node-RED.

## Configuración

|Campo|Descripción|
|--|--|
| KNX GW | Gateway KNX usado para escribir y responder las direcciones de grupo configuradas. Puede quedar vacío si solo se necesita la salida Node-RED. |
| Matter controller | Nodo de configuración Matter Controller donde el dispositivo fue emparejado. |
| Sensor de luz Matter | endpoint de iluminancia Matter seleccionado entre los dispositivos emparejados. La lista se filtra a endpoints que exponen `IlluminanceMeasurement`. |
| GA lux | GA lux que recibe el valor convertido. DPT por defecto: `9.004`. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Node output | Muestra una salida Node-RED y emite cada actualización Matter. |

## Comportamiento

El nodo lee `IlluminanceMeasurement.measuredValue`, lo convierte a iluminancia en lux, lo escribe en la GA KNX configurada y responde a lecturas KNX con el último valor conocido.
