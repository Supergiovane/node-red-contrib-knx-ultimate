---
layout: wiki
title: "Matter Battery"
lang: es
permalink: /wiki/es-Matter%20Battery
---
# Sensor de batería Matter (BETA)

> Este nodo está en **BETA**: el comportamiento puede cambiar mientras se mejora la implementación Matter.

Este nodo conecta un endpoint de batería/alimentación Matter con KNX y, opcionalmente, con una salida Node-RED.

## Configuración

|Campo|Descripción|
|--|--|
| KNX GW | Gateway KNX usado para escribir y responder las direcciones de grupo configuradas. Puede quedar vacío si solo se necesita la salida Node-RED. |
| Matter controller | Nodo de configuración Matter Controller donde el dispositivo fue emparejado. |
| Sensor de batería Matter | endpoint de batería/alimentación Matter seleccionado entre los dispositivos emparejados. La lista se filtra a endpoints que exponen `PowerSource`. |
| GA batería | GA batería que recibe el valor convertido. DPT por defecto: `5.001`. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Node output | Muestra una salida Node-RED y emite cada actualización Matter. |

## Comportamiento

El nodo lee `PowerSource.batPercentRemaining`, lo convierte a nivel de batería en porcentaje, lo escribe en la GA KNX configurada y responde a lecturas KNX con el último valor conocido.
