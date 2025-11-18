---
layout: wiki
title: "zh-CN-KNXAutoResponder"
lang: es
permalink: /wiki/es-zh-CN-KNXAutoResponder
---
---
<p> Este nodo responderá a la solicitud de lectura del bus KNX.
El nodo registra todos los telegramas que se transfieren al bus KNX y almacenan los valores en la memoria.
Luego responde a la solicitud de lectura enviando dichos valores memorizados al bus en función de la solicitud.
Si la dirección del grupo que se lee aún no tiene valor, el nodo responderá con el valor predeterminado.
Este nodo responderá solo a la dirección de grupo especificada en el campo **Respuesta** JSON.
De manera predeterminada, hay un texto JSON de "respuesta" **Precompilado ** que simplemente puede cambiar/eliminar contenido.¡Asegúrese de que**no presione ** para usarlo!!!**Configuración**
| Propiedades | Descripción |
|-|-|
| Puerta de enlace | seleccione el portal KNX para usar |
| Respuesta | El nodo responderá a una solicitud de lectura de la dirección de grupo especificada en esta matriz JSON.El formato se especifica a continuación.|
<br/>
\*\*json format \*\*
JSON siempre es una variedad de objetos que contienen cada instrucción. Cada instrucción le dice al nodo qué hacer.
| Propiedades |Descripción |
|-|-|
| Nota | **Clave de nota opcional** para obtener recordatorios. No se usará en ningún lado.|
| Ga |Dirección grupal.También puede usar ".." monedas salvajes para grupos específicos de direcciones.".." solo se puede usar con el tercer nivel de GA, por ejemplo: \*\*1/1/0..257 **. Consulte la muestra a continuación.|
| Dpt |Punto de datos de dirección de grupo, formato "1.001".Si se ha importado el archivo CSV ETS,** Opcional \*\*. |
| Predeterminado |Cuando el valor de la dirección del componente no ha sido recordado por el nodo, se envía al bus en una respuesta de solicitud de lectura.|
**Comencemos con un comando**
El nodo de autorponder responderá a una solicitud de lectura en la dirección del grupo 2/7/1.Si aún no está en la memoria, responderá con _true _.
El archivo CSV ETS debe importarse, de lo contrario también debe agregar la tecla __"dpt": "1.001" \*\*.

```json

[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

**Instrucciones más completas**
El nodo de respuesta automática responderá a las solicitudes de lectura a partir del 3/1/1, incluido el 3/1/22.Si la memoria aún no tiene valor, responderá con _false _.
También hay una clave__ nota \*\*, que solo se usa como nota de recordatorio.No se usará en ningún lado.

```json

[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
```

**Comando conectado**
Del 2/2/5 al 2/2/21, el nodo de autoresponder responderá a una solicitud de lectura a la dirección del grupo.Si aún no hay valor en la memoria, responderá con un valor de 25.
El nodo automático también responderá a las solicitudes de lectura del componente 2/4/22.Si aún no hay valor en la memoria, usará el estado de cadena \*desconocido.\*responder.
Tenga en cuenta la **coma** entre los objetos JSON de cada directiva.

```json

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

<br/>
