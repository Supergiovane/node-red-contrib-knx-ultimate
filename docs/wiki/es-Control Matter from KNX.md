---
layout: wiki
title: "Control Matter from KNX"
lang: es
permalink: /wiki/es-Control%20Matter%20from%20KNX
---
# Control Matter from KNX (BETA)

> Este nodo está en **BETA**: el comportamiento puede cambiar mientras se mejora la implementación Matter.

Este nodo controla desde KNX un endpoint Matter ya emparejado. Selecciona el dispositivo Matter y el editor detecta sus capacidades, mostrando solo las asignaciones KNX coherentes con ese endpoint.

Sustituye a los nodos Matter separados no publicados y conserva toda la UI de luz cuando el endpoint seleccionado es una luz.

## Configuración

|Campo|Descripción|
|--|--|
| KNX GW | Gateway KNX usado para escribir y responder las direcciones de grupo configuradas. Puede quedar vacío si solo se necesita la salida Node-RED. |
| Matter controller | Nodo de configuración Matter Controller donde el dispositivo fue emparejado. |
| Dispositivo Matter | Endpoint Matter seleccionado entre los dispositivos emparejados. La UI se reconstruye a partir de sus capacidades reales. |
| Switch / Enchufe / Luz On-Off | Direcciones de grupo de comando y estado On/Off, normalmente DPT `1.001`. |
| Controles de luz | Para endpoints de luz se usa la UI de luz completa: DIM relativo (DPT `3.007`), brillo %, RGB/HSV, blanco ajustable, brillo/temperatura al encender, modo día/noche, nivel min/max y velocidad de regulación. Las secciones no soportadas quedan ocultas. |
| Sensores | Los endpoints de sensor muestran su GA de medida/estado solo cuando está soportado: temperatura, humedad, iluminancia, ocupación, contacto y batería. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Update local state from KNX write | Actualiza la caché local Matter/KNX cuando se escribe un telegrama en una GA KNX configurada. |
| Node Input/Output PINs | Muestra pines de entrada/salida Node-RED. La entrada acepta payloads booleanos y mensajes Matter en `msg.payload` o `msg.on.on`; la salida emite estados. |

## Comportamiento

El nodo mantiene una caché local con actualizaciones Matter y escrituras KNX, responde lecturas KNX desde esa caché y puede emitir/leer valores al inicio. Solo escucha las direcciones de grupo configuradas, por lo que ignora el tráfico KNX no relacionado.
