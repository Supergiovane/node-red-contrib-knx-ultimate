---
layout: wiki
title: "GlobalVariable"
lang: es
permalink: /wiki/es-GlobalVariable
translation_key: "GlobalVariable"
---

> En la versión 8 usa **KNX Utility** y selecciona **Global Context**. Los ajustes siguientes describen esa función. El antiguo nodo separado ya no está incluido.
>
> [KNX Utility]({{ '/wiki/es-KNX-Utility' | relative_url }}) · [Actualizar desde la versión 7]({{ '/wiki/es-Migration-8' | relative_url }})


<

# KNX Global Variable

Este nodo expone la dirección del grupo recibida del bus, a una variable global **** 

¡Puede escribir en el bus KNX simplemente actualice la variable global! 

## Descripción general

Pon un nodo de contexto global en el flujo, luego dale un nombre. 

El nombre que le da al nodo se convertirá en el nombre de la variable de contexto global. 

Eso es todo. Por razones de seguridad, ** Cambie el nombre de nodo predeterminado** 

Puede acceder a la variable global agregando el sufijo \ _read al nombre del nodo. 

Puede habilitar/deshabilitar la variable de contexto global, o habilitar Readonly o leer/escribir en la ventana de configuración. 

Puede emitir un comando de escritura de bus KNX, simplemente modifica el nombre de la variable global con sufijo \ _write. _ ** Después de que se han ejecutado los comandos, la variable global con sufijo \ _Write se vacía automáticamente, no para repetir infinitamente los comandos. ** _ 

## Ajustes

| Propiedad | Descripción |
|-|-|
| Puerta | La puerta de enlace KNX. |
| Nombre de la variable (sin espacios, solo chars [A-Z]) | Nombre del contexto global. Se crearán 2 variables con este nombre, una con sufijo \ _Read (para direcciones de grupo de lectura) y la otra con sufijo _write (para direcciones de grupo de escritura). Por ejemplo, si el nombre de la variable es "KnxGlobalContext", se crean las 2 variables KNXGLOBALContext \ _read y KnxGlobalContext \ _Write. Dado que la variable global es visible desde todos los nodos (incluso los no ultimatizos de KNX), por razones de seguridad, establece un nombre que no sea el predeterminado. Haga clic en el enlace de muestra en la parte inferior de la página. |
| Exponer como variable global | Elija si y cómo desea exponer la variable global. Si no tiene la intención de escribir en el autobús KNX, por seguridad, deje "solo leer". |
| Intervalo de escritura de autobús | El nodo verifica la variable con el sufijo \ _Write a intervalos regulares para escribir en el bus KNX. Elija el intervalo que prefiera. |

## Propiedades de MSG

```javascript

// Properties of the variable, both in reading and in writing
{
    address : "0/0/1",
    dpt: "1.001", 
    payload: true,
    devicename:"Dinning Room->Table Light"
}

```

# Uso

## Muestra de nodo de contexto global

Este nodo expone la dirección del grupo recibida del bus, a una variable global****

¡Puede escribir en el bus KNX simplemente actualice la variable global! 

## Descripción general

Pon un nodo de contexto global en el flujo, luego dale un nombre. 

El nombre que le da al nodo se convertirá en el nombre de la variable de contexto global. 

Eso es todo. Por razones de seguridad, ** Cambie el nombre de nodo predeterminado** 

Puede acceder a la variable global agregando el sufijo \ _read al nombre del nodo. 

Puede habilitar/deshabilitar la variable de contexto global, o habilitar Readonly o leer/escribir en la ventana de configuración. 

Puede emitir un comando de escritura de bus KNX, simplemente modifica el nombre de la variable global con sufijo \ _write. _ ** Después de que se han ejecutado los comandos, la variable global con sufijo \ _Write se vacía automáticamente, no para repetir infinitamente los comandos.** _ 

<img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/globalcontextnode.png" width = "90%"> 

### Ver código

> Ajuste los nodos de acuerdo con su configuración

[Descargar JSON]({{ '/examples/Global%20Context%20-%20Expose%20KNX%20Values.json' | relative_url }})

## Obtenga el valor de la variable

```javascript

// This function reads the variable
// Remember: add the string "_READ" after the node name to read the variable
let GroupAddresses = global.get("KNXContextBanana_READ") || [];

// Outputs the array, as example
node.send({payload:GroupAddresses});

// Get the Group Address object, having address 0/0/10
let Ga = GroupAddresses.find(a => a.address === "0/0/10");

// Outputs the object, as example
node.send({ Found: Ga });

// Do some testing and output some stuffs.
if (Ga.payload === true) return {payload : "FOUND AND TRUE"};
if (Ga.payload === false) return {payload : "FOUND AND FALSE"};

```

## Enviar telegrama KNX a través de la variable global

```javascript

// This function writes the value to the KNX bus
let GroupAddressesSend = [];
GroupAddressesSend.push({address: "0/0/10", dpt:"1.001", payload:msg.payload});

// You can also avoid setting datapoint.
// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload
GroupAddressesSend.push({address: "0/0/11", payload:msg.payload});

// Remember: add the string "_WRITE" after the node name to write to the bus
global.set("KNXContextBanana_WRITE",GroupAddressesSend);

```

# MUESTRA

<a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" target = "_ blank"> <i class="fa fa-info-circle"> </i> ver esta muestra </a>
