---
layout: wiki
title: "Matter-Device"
lang: es
permalink: /wiki/es-Matter-Device
---
# Dispositivo Matter (BETA)

> Este nodo está en **BETA**: funciona, pero algunos detalles pueden cambiar entre versiones.

## Descripción general

El nodo Matter Device hace de puente entre un **dispositivo Matter** y las **direcciones de grupo KNX**. El nodo opera a través del nodo de configuración *Controlador Matter*, que comisiona los dispositivos en su propia fabric Matter.

- **Controla** cualquier dispositivo Matter emparejado desde el bus KNX (on/off, regulación, persianas, termostatos, cerraduras, ...).
- **Sigue** cada atributo del dispositivo en direcciones de grupo KNX (estados, sensores, medición de potencia, batería...).
- Totalmente genérico: la lista de mapeos se construye a partir de los **endpoints/clústeres reales** que expone el dispositivo.

## Configuración

|Campo|Descripción|
|--|--|
| GW KNX | Gateway KNX usado para los telegramas |
| Ctrl Matter | El nodo de configuración Controlador Matter (donde se emparejan los dispositivos) |
| Dispositivo | Elige el dispositivo Matter emparejado desde el autocompletado |
| Mapeos | Una fila por cada mapeo dirección de grupo ↔ clúster Matter |
| Leer estado al inicio | Si está activo, el nodo emite los valores actuales en caché al hacer deploy/conectar |
| PINes de entrada/salida | Habilita los pines de Node-RED para el acceso Matter en bruto |

## Mapeos

La lista de destinos muestra las funciones soportadas con nombres comprensibles como *"Interruptor On/Off"* o *"Potencia instantánea (W)"*, filtradas según lo que el dispositivo realmente expone y con el valor actual entre corchetes.

Cada fila de mapeo tiene una **dirección**:

- **KNX → Matter (comando)**: un telegrama recibido en la dirección de grupo invoca un comando del clúster Matter o escribe un atributo. Ejemplo: GA `1/1/1` DPT 1.001 → `OnOff.on/off` (el valor booleano elige automáticamente on u off).
- **Matter → KNX (estado)**: cuando cambia el atributo Matter suscrito, su valor se convierte y se escribe en la dirección de grupo. Las peticiones `GroupValue_Read` se responden con el valor en caché.

Los clústeres más comunes se convierten automáticamente en valores aptos para KNX:

|Clúster|Conversión|
|--|--|
| OnOff | booleano (DPT 1.001) |
| LevelControl | 0-254 ↔ porcentaje (DPT 5.001) |
| WindowCovering | percent100ths ↔ porcentaje (DPT 5.001), subir/bajar (DPT 1.008) |
| ColorControl | mireds ↔ Kelvin (DPT 7.600) |
| Thermostat | centi-°C ↔ °C (DPT 9.001) |
| Temperatura/Humedad | centi-unidades ↔ unidades (DPT 9.001/9.007) |
| Iluminancia | escala logarítmica ↔ Lux (DPT 9.004) |
| PowerSource | medio-porcentaje ↔ porcentaje de batería (DPT 5.001) |
| Potencia/Energía eléctrica | mW ↔ W (DPT 14.056), mWh ↔ kWh (DPT 13.013) |

Los demás clústeres/atributos pasan sin conversión; el DPT elegido realiza la codificación KNX final.

## PINes del nodo

Si habilitas los PINes del nodo:

- **Entrada**: envía comandos en bruto: `msg.payload = { endpointId: 1, clusterId: 6, command: "toggle" }` o escrituras de atributos: `msg.payload = { endpointId: 1, clusterId: 8, attribute: "onLevel", value: 128 }`
- **Salida**: recibe cada cambio de atributo (`msg.matter` contiene el evento completo) y cada evento de clúster (pulsaciones de botones, etc.).
