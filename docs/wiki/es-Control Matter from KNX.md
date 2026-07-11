---
layout: wiki
title: "Control Matter from KNX"
lang: es
permalink: /wiki/es-Control%20Matter%20from%20KNX
---
# Luz/enchufe Matter (BETA)

> Este nodo está en **BETA**: el comportamiento puede cambiar mientras se mejora la implementación Matter.

Este nodo controla una luz o enchufe Matter y asigna las capacidades Matter soportadas a direcciones de grupo KNX.

## Configuración

|Campo|Descripción|
|--|--|
| KNX GW | Gateway KNX usado para escribir y responder las direcciones de grupo configuradas. Puede quedar vacío si solo se necesita la salida Node-RED. |
| Matter controller | Nodo de configuración Matter Controller donde el dispositivo fue emparejado. |
| Luz/enchufe Matter | Luz o enchufe Matter seleccionado entre los dispositivos emparejados. La UI oculta regulación, color o blanco ajustable cuando el endpoint elegido no expone esas capacidades. |
| Switch | Direcciones de grupo de comando y estado On/Off, normalmente DPT `1.001`. |
| Dim | Los comandos y estados de brillo solo están disponibles para endpoints con `LevelControl`; los porcentajes usan DPT `5.001`. |
| Tunable White | Los controles de temperatura de color solo están disponibles si el endpoint expone la capacidad Matter requerida. |
| RGB/HSV | Los controles RGB/HSV solo están disponibles para endpoints con capacidades de color Matter. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Node Input/Output PINs | Muestra pines de entrada/salida Node-RED. La entrada acepta payloads booleanos y mensajes Matter en `msg.payload` o `msg.on.on`; la salida emite estados. |

## Comportamiento

El nodo mantiene una caché local con actualizaciones Matter y escrituras KNX, responde lecturas KNX desde esa caché y puede emitir/leer valores al inicio.
