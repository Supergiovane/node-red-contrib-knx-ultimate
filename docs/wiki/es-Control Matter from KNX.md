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
| Cerradura | Una GA de comando DPT `1.xxx` invoca `lockDoor` con `true` y `unlockDoor` con `false`; una GA de estado separada recibe solo estados Bloqueada/Desbloqueada inequívocos. Si el endpoint lo exige, el PIN remoto se guarda en el campo de credencial. Los comandos no anunciados se rechazan. |
| Otros endpoints | Window Covering, Thermostat, Fan y Switch usan perfiles dedicados seleccionados por sus capacidades; los eventos Switch, como pulsación inicial, larga y múltiple, se emiten por la salida flow opcional. Enchufes, actuadores On/Off, sensores, batería, potencia y energía usan el fallback mapeado genérico. La pestaña **Mapeos** contiene únicamente las funciones anunciadas. |
| Controles de luz | Para endpoints de luz se usa la UI de luz completa: DIM relativo (DPT `3.007`), brillo %, RGB/HSV, blanco ajustable, brillo/temperatura al encender, modo día/noche, nivel min/max y velocidad de regulación. Las secciones no soportadas quedan ocultas. |
| Sensores | Los endpoints de sensor muestran su GA de medida/estado solo cuando está soportado: temperatura, humedad, iluminancia, ocupación, contacto y batería. |
| Read at startup | Publica el valor Matter en caché al desplegar/iniciar o cuando el dispositivo se reconecta. |
| Update local state from KNX write | Actualiza la caché local Matter/KNX cuando se escribe un telegrama en una GA KNX configurada. |
| Node Input/Output PINs | Muestra pines de entrada/salida Node-RED y la sección **Entrada del flow** justo debajo de este campo. Las luces muestran sus mensajes de estado compatibles en el nivel superior; los demás endpoints muestran el formato simple `{function,value}` y los selectores Matter avanzados. |

## Mensajes de entrada del flow

Activa **Node Input/Output PINs** para mostrar la sección **Entrada del flow** justo debajo del selector. Para una luz, muestra ejemplos copiables de las propiedades compatibles en el nivel superior, como `msg.on`, `msg.dimming`, `msg.color_temperature` y `msg.color`. Para los demás endpoints, se genera desde la estructura anunciada y muestra el Endpoint ID, todos los atributos legibles/escribibles y todos los comandos aceptados. Sigue disponible sin gateway KNX.

Usa `msg.payload = {function:"position",value:35}` para escribir con unidades comprensibles. Omite `value` para leer un estado, por ejemplo `{function:"temperature"}`; el resultado se emite en `msg.payload` y los detalles raw en `msg.matter`. Según el endpoint, las funciones incluyen `onoff`, `level`, `position`, `open`, `close`, `stop`, consignas, ventilador y sensores. Una cerradura acepta `{function:"lock",value:true|false}`.

Los flows existentes siguen siendo compatibles. Los mensajes avanzados continúan usando `msg.clusterId` con `msg.command`/`msg.args`, o `msg.attribute` y el `msg.value` opcional. El Node ID y el Endpoint ID ya están seleccionados.

## Comportamiento

El nodo mantiene una caché local con actualizaciones Matter y escrituras KNX, responde lecturas KNX desde esa caché y puede emitir/leer valores al inicio. Solo escucha las direcciones de grupo configuradas, por lo que ignora el tráfico KNX no relacionado.

Los comandos se ejecutan en una cola ordenada independiente para cada dispositivo emparejado. Por tanto, un dispositivo sin conexión, agotado por tiempo de espera o eliminado no puede retrasar otros dispositivos Matter que utilicen la misma dirección de grupo KNX. Un nodo que aún referencia un dispositivo eliminado rechaza el comando inmediatamente y muestra **Device no longer commissioned** en rojo; selecciona un dispositivo Matter válido o elimina el nodo Controller huérfano.

El error de dispositivo no disponible queda enclavado: los siguientes comandos KNX y flow se ignoran y no pueden sobrescribir el estado rojo. El nodo se reanuda automáticamente en cuanto ese dispositivo Matter informa `connected`; abrir el editor del nodo también libera el bloqueo para permitir un reintento manual.
