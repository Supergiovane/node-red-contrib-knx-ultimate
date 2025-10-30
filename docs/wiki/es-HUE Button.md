---
layout: wiki
title: "HUE Button"
lang: es
permalink: /wiki/es-HUE%20Button
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Button) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Button) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Button) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Button) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Button) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Button)

Los mapas del nodo del botón Hue Eventos del botón Hue a las direcciones de grupo KNX y exponen los mismos eventos en su salida de flujo a través de <code> Botton.button_report.event </code>. 

Comience a escribir en el campo GA (nombre o dirección de grupo) para vincular el KNX GA;Los dispositivos aparecen mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |Seleccione la puerta de enlace KNX para ser utilizada |
|Puente Hue |Seleccione el puente de tono que se utilizará |
|Botón de tono |Botón Hue para ser utilizado (automáticamente mientras escribe) |

**Cambiar**

| Propiedad | Descripción |
|-|-|
|Interruptor |GA activado por <code> Short \ _Release </code> (Press/versión rápida).|
|Estado GA |Comentarios opcionales GA Cuando <em> Toggle Values ​​</em> está habilitado para mantener el estado interno de alternancia alineado con otros actuadores.|

**Oscuro**

| Propiedad | Descripción |
|-|-|
|Atenúa |GA utilizado durante <code> long \ _press </code>/<code> repetir </code> eventos para atenuar (típicamente DPT 3.007).|

**Comportamiento**

| Propiedad | Descripción |
|-|-|
|Valores de al revés |Si está habilitado, el nodo alterna entre <código> True/False </code> y ACT/Down Dimmting Life cargas.|
|Cambiar carga útil |La carga útil enviada a KNX/Flow cuando los valores de alternar están deshabilitados.|
|Dim carga útil |La dirección enviada a KNX/Flow cuando los valores de alternar están deshabilitados.|

### salidas

1. Salida estándar
: `msg.payload` lleva el booleano (o objeto DIM) enviado a KNX;`msg.event` es la cadena de eventos de Hue (por ejemplo,` short_release`, `repetir`).

### Detalles

`msg.event` espejos` button.button_report.event`.El evento de tono original está expuesto en `msg.rawevent`.Use el estado opcional GA para mantener el estado de alternar en sincronización con interruptores de pared u otros controladores.
