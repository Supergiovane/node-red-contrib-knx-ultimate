---
layout: wiki
title: "Matter Contact sensor"
lang: es
permalink: /wiki/es-Matter%20Contact%20sensor
---
# Sensor de contacto Matter (BETA)

> Este nodo está en **BETA**: el comportamiento puede cambiar mientras se mejora la implementación Matter.

Este nodo conecta un endpoint de contacto Matter con KNX y, opcionalmente, con una salida Node-RED.

## Configuración

|Campo|Descripción|
|--|--|
| KNX GW | Gateway KNX usado para escribir y responder las direcciones de grupo configuradas. Puede quedar vacío si solo se necesita la salida Node-RED. |
| Matter controller | Nodo de configuración Matter Controller donde el dispositivo fue emparejado. |
| Sensor de contacto Matter | endpoint de contacto Matter seleccionado entre los dispositivos emparejados. La lista se filtra a endpoints que exponen `BooleanState`. |
| GA contacto | GA contacto que recibe el valor convertido. DPT por defecto: `1.019`. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Node output | Muestra una salida Node-RED y emite cada actualización Matter. |

## Comportamiento

El nodo lee `BooleanState.stateValue`, lo convierte a estado booleano del contacto, lo escribe en la GA KNX configurada y responde a lecturas KNX con el último valor conocido.
