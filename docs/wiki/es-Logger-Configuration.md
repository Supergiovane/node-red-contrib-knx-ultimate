---
layout: wiki
title: "Logger-Configuration"
lang: es
permalink: /wiki/es-Logger-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)

<

# Logger

 El nodo del registrador registra todos los telegramas y lo genera en un archivo compatible con XML de monitor de bus ETS. 

Puede guardar el archivo en el disco o enviarlo a un servidor FTP, por ejemplo.El archivo puede ser leído por su ETS, por ejemplo, para diagnóstico o para una repetición de los telegramas.

El nodo también puede contar telegramas por segundo (o cualquier intervalo que desee).

 <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/logger-sample" target = "_ blank"> Los ejemplos están aquí. </a>

## AJUSTES

| Propiedad | Descripción |
|-|-|
|Puerta de entrada |La puerta de enlace KNX.|
|Tema |El tema del nodo.|
|Nombre |Nombre del nodo.|

## archivo de diagnóstico de bus compatible con ETS

| Propiedad | Descripción |
|-|-|
|Temporizador de inicio automático |Inicia el temporizador automáticamente en la implementación o en el inicio de nodo-rojo.|
|Salida nueva XML cada (en minutos) |La hora, en minutos, que el registrador emitirá el archivo compatible con el monitor de bus XML XML.|
|Número máximo de filas en xml (0 = sin límite) |Inicia el temporizador automáticamente en la implementación o en el inicio de nodo-rojo.|
|Temporizador de inicio automático |Esto representa el número máximo de línea, que el archivo XML puede contener en el intervalo especificado anteriormente.Pon 0 para no limitar el número de filas en el archivo.|
|Número máximo de filas en xml (0 = sin límite) |Esto representa el número máximo de línea, que el archivo XML puede contener en el intervalo especificado anteriormente.Pon 0 para no limitar el número de filas en el archivo.|

## contador de telegrama de knx

| Propiedad | Descripción |
|-|-|
|Temporizador de inicio automático |Inicia el temporizador automáticamente en la implementación o en el inicio de nodo-rojo.|
|Intervalo de conteo (en segundos) |Con qué frecuencia emite un MSG al flujo, que contiene el recuento de telegramas KNX.En segundos.|

---

# Salida del mensaje del registrador

**Pin 1: archivo de archivo compatible con monitor de bus XML ETS**

Puede usar un nodo de archivo para guardar la carga útil en el sistema de archivos, o puede enviarla, por ejemplo, a un servidor FTP.```javascript

msg = {
        topic:"MyLogger" 
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    } 

```
 

**Pin 2: contador de telegrama de KNX**

Cada recuento, el nodo emitirá un telegrama como este:```javascript

msg = {
        topic:"",
        payload:10,
        countIntervalInSeconds:5,
        currentTime:"25/10/2021, 11:11:44"
    } 

```

---

# Mensaje de flujo de entrada

Puede controlar el registrador de alguna manera.

## Archivo de monitor de bus compatible con ETS XML

**Temporizador de inicio** 
```javascript

// Start the timer
msg.etsstarttimer = true;
return msg;

``` **Detener el temporizador** 
```javascript

// Start the timer
msg.etsstarttimer = false;
return msg;

``` **ENCONTRA INMEDIATAMENTE una carga útil con el archivo ETS** 
```javascript

// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;

```## contador de telegrama de knx

**Temporizador de inicio** 
```javascript

// Start the timer
msg.telegramcounterstarttimer = true;
return msg;

``` **Detener el temporizador** 
```javascript

// Start the timer
msg.telegramcounterstarttimer = false;
return msg;

``` **Mensaje de conteo de telegrama de salida inmediatamente** 
```javascript

// Output payload. 
msg.telegramcounteroutputnow = true;
return msg;

```## Ver también

- _samples_
- [Logger de muestra](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
