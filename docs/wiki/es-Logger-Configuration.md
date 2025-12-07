---
layout: wiki
title: "Logger-Configuration"
lang: es
permalink: /wiki/es-Logger-Configuration
---
<

# Logger

 El nodo del registrador registra todos los telegramas y lo genera en un archivo compatible con XML de monitor de bus ETS. 

Puede guardar el archivo en el disco o enviarlo a un servidor FTP, por ejemplo.El archivo puede ser leído por su ETS, por ejemplo, para diagnóstico o para una repetición de los telegramas.

El nodo también puede contar telegramas por segundo (o cualquier intervalo que desee).

 <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target = "_ blank"> Los ejemplos están aquí. </a>

## AJUSTES

| Propiedad | Descripción |
|-|-|
|Puerta |La puerta de enlace KNX.|
|Tema |El tema del nodo.|
|Nombre de nodo |Nombre del nodo.|

## archivo de diagnóstico de bus compatible con ETS

| Propiedad | Descripción |
|-|-|
|Temporizador de inicio automático |Inicia el temporizador automáticamente en la implementación o en el inicio de Node‑RED.|
|Salir nuevo XML cada (en minutos) |Cada cuántos minutos el Logger emitirá el archivo XML compatible con ETS.|
|Número máximo de filas en xml (0 = sin límite) |Máximo de filas en el XML; las más antiguas se eliminan primero. 0 para sin límite.|
|Acción |Emitir solo el payload, o emitir el payload y guardar en archivo.|
|Ruta de archivo (absoluta o relativa) |Dónde guardar el XML cuando se elige guardar.|

## contador de telegrama de knx

| Propiedad | Descripción |
|-|-|
|Temporizador de inicio automático |Inicia el temporizador automáticamente en la implementación o en el inicio de Node‑RED.|
|Intervalo de conteo (en segundos) |Con qué frecuencia emite un MSG al flujo, que contiene el recuento de telegramas KNX. En segundos.|

---

# Salida del mensaje del registrador

**Pin 1: archivo de archivo compatible con monitor de bus XML ETS**

Puede usar un nodo de archivo para guardar la carga útil en el sistema de archivos, o puede enviarla, por ejemplo, a un servidor FTP.

```javascript

msg = {
        topic:"MyLogger" 
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    } 

```

 

**Pin 2: contador de telegrama de KNX**

Cada recuento, el nodo emitirá un telegrama como este:

```javascript

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

```

**Detener el temporizador** 

```javascript

// Start the timer
msg.etsstarttimer = false;
return msg;

```

**ENCONTRA INMEDIATAMENTE una carga útil con el archivo ETS** 

```javascript

// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;

```

## contador de telegrama de knx

**Temporizador de inicio** 

```javascript

// Start the timer
msg.telegramcounterstarttimer = true;
return msg;

```

**Detener el temporizador** 

```javascript

// Start the timer
msg.telegramcounterstarttimer = false;
return msg;

```

**Mensaje de conteo de telegrama de salida inmediatamente** 

```javascript

// Output payload. 
msg.telegramcounteroutputnow = true;
return msg;

```

## Ver también

- _samples_
- [Logger de muestra](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
