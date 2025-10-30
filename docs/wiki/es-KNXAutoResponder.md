---
layout: wiki
title: "KNXAutoResponder"
lang: es
permalink: /wiki/es-KNXAutoResponder
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)

Este nodo responderá a las solicitudes de lectura del bus KNX.

El nodo registra todos los telegramas transmitidos al bus KNX y almacenan los valores en la memoria. \
Luego responde a las solicitudes de lectura enviando dicho valor memorizado de regreso al bus como solicitud. \
Si la dirección del grupo que se lee aún no tiene valor, el nodo responderá con un valor predeterminado. \
El nodo responderá solo a las direcciones de grupo especificadas en el campo **Responder a** JSON. \
De manera predeterminada, hay una muestra previa * ***"Responder al texto JSON, donde simplemente puede cambiar/eliminar las cosas.¡Asegúrese de que** no lo use como es **!** Configuración**| Propiedad | Descripción |

|-|-|
|Puerta de entrada |Seleccione la puerta de enlace KNX para ser utilizada |
|Responder a |El nodo responderá a las solicitudes de lectura provenientes de las direcciones grupales especificadas en esta matriz JSON.El formato se especifica a continuación.|

 ** Formato JSON ** El JSON es**siempre** una matriz de objeto, que contiene cada directiva.Cada directiva, le dice al nodo qué hacer.

| Propiedad | Descripción |
|-|-|
|nota | ** Clave de nota opcional** , para recordatorios.No se usará en ningún lado.|
|GA |La dirección grupal.También puede usar los ".." Wildchars, para la especidad de una gama de direcciones grupales.El ".." solo se puede usar con el nivel del tercer GA, Ej: ** 1/1/0..257** .Vea las muestras a continuación.|
|DPT |El punto de datos de la dirección del grupo, en el formato "1.001".Es ** opcional** Si se ha importado el archivo CSV ETS.|
|predeterminado |El valor enviado al bus en respuesta a una solicitud de lectura, cuando el valor de la dirección del grupo aún no ha sido memorizado por el nodo.| ** Comencemos con una directiva** El nodo de autoresponder responderá a las solicitudes de lectura para la dirección del grupo 2/7/1.Si aún no hay valor en la memoria, responderá con _true _. \ |
El archivo CSV ETS debe haberse importado, de lo contrario debe agregar la clave ** "DPT": "1.001" ** **.```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` ** Directiva un poco más completa** El nodo de autoresponder responderá a las solicitudes de lectura para la dirección del grupo a partir del 3/1/1 al 3/1/22 incluida.Si aún no hay valor en la memoria, responderá con _false _. \
También hay una clave ** Nota** , simplemente como una nota de recordatorio.No se usará en ningún lado.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` ** Directivas concatenantes** El nodo de autoresponder responderá a las solicitudes de lectura para la dirección del grupo a partir del 2/2/5 al 2/2/21 incluida.Si aún no hay valor en la memoria, responderá con un valor de 25. \
El nodo de autoresponder también responderá a las solicitudes de lectura para la dirección del grupo 2/4/22.Si aún no hay valor en la memoria, responderá con el estado de cadena _unknown! _. \
Tenga en cuenta la ** coma** entre el objeto JSON de cada directiva.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```
