---
layout: wiki
title: "zh-CN-Logger-Configuration"
lang: es
permalink: /wiki/es-zh-CN-Logger-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
---
<
# Logger (registro)
El nodo del registrador registra todos los mensajes y emite un archivo XML compatible con el monitor ETS Bus.
Puede guardarlo en disco con el nodo del archivo, o enviarlo a FTP, etc. Este archivo se puede usar en ETS para diagnosticar o reproducir mensajes.
Este nodo también puede contar el número de mensajes (por segundo o intervalo personalizado).<br/> <a href = "/node-red-contrib-knx-ultimate/wiki/logger-sample" target = "_ blank"> El ejemplo está aquí </a>
## configuración
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | KNX Gateway. |
| Tema | El tema del nodo. |
| Nombre | Nombre del nodo. |
## Archivos de diagnóstico de bus compatibles con ETS
|Propiedades | Descripción |
|-|-|
| Temporizador de inicio automático | Inicie automáticamente el temporizador cuando se despliegue o se inicie. |
|Salida nueva XML cada (en minutos) | ¿Cuántos minutos sale XML compatible con ETS? |
| Número máximo de filas en xml (0 = sin límite) |El número máximo de filas de XML en esta ventana de tiempo; 0 significa que no hay límite. |
## contador de mensajes KNX
| Propiedades |Descripción |
|-|-|
| Temporizador de inicio automático | Inicie automáticamente el temporizador cuando se despliegue o se inicie.|
| Intervalo de conteo (en segundos) | El intervalo para la salida cuenta del proceso en segundos.|
---
#Salida del nodo
**Pin 1: XML compatible con ETS**
Use el nodo de archivo para guardar `msg.payload` o enviarlo a FTP, etc.```javascript
msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
``` **Pin 2: Recuento de mensajes de KNX**
Salida por ciclo de conteo:```javascript
msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```---
# Ingrese el mensaje (entrada)
Control XML compatible con ETS
**Temporizador de inicio** ```javascript
msg.etsstarttimer = true; return msg;
``` **Detener el temporizador** ```javascript
msg.etsstarttimer = false; return msg;
``` **Salida XML ahora** ```javascript
// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```Control de contador de mensajes
**Temporizador de inicio** ```javascript
msg.telegramcounterstarttimer = true; return msg;
``` **Detener el temporizador** ```javascript
msg.telegramcounterstarttimer = false; return msg;
``` **Recuento de salida inmediatamente** ```javascript
msg.telegramcounteroutputnow = true; return msg;
```## Ver
- [Logger de muestra](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
