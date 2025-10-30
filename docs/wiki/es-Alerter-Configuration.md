---
layout: wiki
title: "Alerter-Configuration"
lang: es
permalink: /wiki/es-Alerter-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)

# Configuración del nodo de Alerter

Con el nodo Alerter, puede indicar una pantalla o al nodo de nodo-Contrib-TTS-Ulude (retroalimentación de audio) Si los dispositivos seleccionados son alertados, es decir, tienen carga útil **Verdadero** .
El nodo emite mensajes a intervalos especificados (un mensaje a la vez) que contienen los detalles de cada dispositivo alertado.Por ejemplo, el nodo puede decirle cuántas y qué ventanas están abiertas.

El nodo recibe los valores de los dispositivos directamente desde el bus KNX.Además, puede enviar mensajes personalizados al nodo, no vinculado a los dispositivos KNX.

La página de ejemplo explica cómo usar el nodo.

- **Gateway**

> KNX Gateway seleccionada.También es posible no seleccionar ninguna puerta de enlace;En este caso, solo se considerarán mensajes entrantes al nodo.

- **Nombre**

> Nombre del nodo.

- **Tipo de inicio del ciclo de alerta**

> Aquí puede seleccionar el evento que se omitirá el inicio de enviar mensajes desde dispositivos alertados.

- **Intervalo entre cada MSG (en segundos)**

> Intervalo entre cada mensaje saliente desde el nodo.

## Dispositivos para monitorear

Aquí puede agregar dispositivos para monitorear.

Ingrese el nombre del dispositivo o su dirección de grupo.

- **Valor de lectura de cada dispositivo en Connection/Reconection**

> En conexión/reconexión, el nodo enviará una solicitud de 'leer' cada dispositivo que pertenece a la lista.

- **Agregar botón**

> Agregue una fila a la lista.

- **Filas del dispositivo ** > El primer campo es la dirección de grupo (pero también puede ingresar cualquier texto, que puede usar con mensajes entrantes, consulte la página de ejemplo), el segundo es el nombre del dispositivo**(máximo 14 caracteres)** , el tercero es el nombre largo del dispositivo.

- **Botón Eliminar**

> Elimina un dispositivo de la lista.

## Mensaje fuera del nodo

PIN1: el nodo emite un mensaje para cada dispositivo alertado, a intervalos seleccionables. 

PIN2: El nodo emite un mensaje único que contiene todos los dispositivos alertados. 

PIN3: El nodo emite un mensaje que contiene solo el último dispositivo alertado. 

**PIN1** ```javascript

msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}

``` **PIN2** ```javascript

msg = {
    "topic":"door, 0/0/11, 0/1/2, 0/0/9",
    "devicename":"Main Door, Applique soggiorno, Applique taverna, Luce studio",
    "longdevicename":"Main entry Door, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
    "count":4,
    "payload":true
    }

``` **PIN3** ```javascript

msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}

```Mensaje saliente cuando todos los dispositivos están en reposo

**PIN1, PIN2, PIN3** ```javascript

msg = {
    "topic":"",
    "count":0,
    "devicename":"",
    "longdevicename":"",
    "payload":false
}

```

## Mensaje en el nodo```javascript
msg.readstatus = true
```Lea el valor de cada dispositivo que pertenece a la lista.```javascript
msg.start = true
```Comienza el ciclo de envío de todos los dispositivos alertados.El ciclo termina con el último dispositivo alertado.Para repetir el ciclo, envíe este mensaje entrante nuevamente.

**Alerta de dispositivo personalizado** 

Para actualizar el valor verdadero/falso de un dispositivo personalizado, puede enviar este mensaje entrante```javascript

msg = {
    "topic":"door",
    "payload":true // Or false to reset the alert for this device
}

```

## MUESTRA

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/samplealerter"> Haga clic aquí para ver el ejemplo </a>
