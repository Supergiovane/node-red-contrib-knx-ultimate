---
layout: wiki
title: "HUE Motion"
lang: es
permalink: /wiki/es-HUE%20Motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion)

Este nodo escucha un sensor de movimiento de tono y refleja los eventos para KNX y/o su flujo de nodo-rojo. 

Comience a escribir el nombre del dispositivo KNX o la dirección de grupo en el campo GA;Aparecen sugerencias mientras escribe.Presione el botón Actualizar junto a "Sensor Hue" para volver a cargar la lista de dispositivos desde el puente si agrega nuevos sensores.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |KNX Gateway que recibe las actualizaciones de movimiento (requeridas antes de que aparezcan los campos de mapeo KNX).|
|Puente Hue |Puente de Hue para la consulta.|
|Sensor de tono |Sensor de movimiento de Hue (admite autocompletar y actualizar).|

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Movimiento |KNX GA que recibe `verdadero` cuando se detecta el movimiento y` falso 'cuando el área está clara.DPT recomendado: <b> 1.001 </b>.|

**Comportamiento**

| Propiedad | Descripción |
|-|-|
|Pin de salida del nodo |Mostrar u ocultar la salida de nodo-rojo.Cuando no se selecciona la puerta de enlace KNX, el pin de salida permanece habilitado para que los eventos de movimiento de tono aún alcancen su flujo.|

> ℹ️ Los widgets KNX permanecen ocultos hasta que seleccione una puerta de enlace KNX, lo que facilita el uso del nodo puramente como un oyente rojo de nodo.

### Producción

1. Salida estándar - `msg.payload` (boolean)
: `True` on Motion,` False` cuando termina el movimiento.
