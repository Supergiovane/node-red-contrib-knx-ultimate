---
layout: wiki
title: "HUE Battery"
lang: es
permalink: /wiki/es-HUE%20Battery
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Battery) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Battery) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Battery) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Battery) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery)

Este nodo expone el nivel de batería de un dispositivo HUE a KNX y plantea un evento cada vez que cambia el valor. 

Comience a escribir el nombre del dispositivo KNX o la dirección de grupo en el campo GA;Las entradas coincidentes aparecen mientras escribe.Use el icono de actualización junto al sensor de Hue </Q> para recargar la lista desde el puente HUE después de agregar nuevos dispositivos.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |KNX Gateway solía publicar el nivel de la batería (requerido antes de que aparezcan los campos de mapeo KNX).|
|Puente Hue |Puente Hue que aloja el dispositivo.|
|Sensor de tono |Dispositivo/sensor de tono que proporciona el nivel de la batería (admite autocompletar y actualizar).|

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Nivel |KNX GA para el porcentaje de batería (0-100%).DPT recomendado: <b> 5.001 </b>.|

**Comportamiento**

| Propiedad | Descripción |
|-|-|
|Leer el estado al inicio |En implementar/reconectar, lea el valor actual de la batería y publíquelo en KNX.Valor predeterminado: "Sí".|
|Pin de salida del nodo |Mostrar u ocultar la salida de nodo-rojo.Cuando no se selecciona la puerta de enlace KNX, la salida permanece habilitada, por lo que los eventos de tono continúan alcanzando el flujo.|

> ℹ️ KNX Mapping Widgets permanece oculto hasta que se selecciona una puerta de enlace KNX.Esto mantiene el editor ordenado cuando el nodo se usa solo para reenviar los eventos de Hue en Node-Red.
