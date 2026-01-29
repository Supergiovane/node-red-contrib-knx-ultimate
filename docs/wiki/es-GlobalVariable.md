---
layout: wiki
title: "GlobalVariable"
lang: es
permalink: /wiki/es-GlobalVariable
---
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

```javascript

[{"id":"ababb834.9073","type":"knxUltimateGlobalContext","z":"5ed79f4a958a1f20","server":"b60c0d73.1c02b","name":"KNXContextBanana","exposeAsVariable":"exposeAsVariableREADWRITE","writeExecutionInterval":"1000","x":230,"y":200,"wires":[]},{"id":"2954e7ea.f53988","type":"function","z":"5ed79f4a958a1f20","name":"Write to the KNXContextBanana variable","func":"// This function writes some values to the KNX bus\nlet GroupAddresses = [];\nGroupAddresses.push ({address: \"0/0/10\", dpt:\"1.001\", payload:true});\nGroupAddresses.push({ address: \"0/0/11\", dpt: \"1.001\", payload: true });\nGroupAddresses.push({ address: \"0/0/12\", dpt: \"1.001\", payload: false });\n\n// You can also avoid setting datapoint.\n// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload\nGroupAddresses.push ({address: \"0/0/14\", payload:false});\nGroupAddresses.push({ address: \"0/0/15\", payload: 50 });\n\n// Remember: add the string \"_WRITE\" after the node name to write to the bus\nglobal.set(\"KNXContextBanana_WRITE\",GroupAddresses);\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":480,"y":300,"wires":[]},{"id":"bd4380e3.8c1ea","type":"inject","z":"5ed79f4a958a1f20","name":"Call the function","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":220,"y":300,"wires":[["2954e7ea.f53988"]]},{"id":"269bf86a.34e9f8","type":"comment","z":"5ed79f4a958a1f20","name":"Exposing the Group Addresses to the global context variable","info":"","x":360,"y":160,"wires":[]},{"id":"f9a6ff93.086a","type":"function","z":"5ed79f4a958a1f20","name":"Read the KNXContextBanana variable","func":"// This function reads the variable\n// Remember: add the string \"_READ\" after the node name to read the variable\nlet GroupAddresses = global.get(\"KNXContextBanana_READ\") || [];\n\n// Outputs the array, as example\nnode.send({payload:GroupAddresses});\n\n// Get the Group Address object, having address 0/0/10\nlet Ga = GroupAddresses.find(a => a.address === \"0/0/10\");\n\n// Outputs the object, as example\nnode.send({ Found: Ga });\n\n// Do some testing and output some stuffs.\nif (Ga.payload === true) return {payload : \"FOUND AND TRUE\"};\nif (Ga.payload === false) return {payload : \"FOUND AND FALSE\"};\n\n","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":410,"y":420,"wires":[["f4109aa5.270e08"]]},{"id":"64c9e0f0.b13178","type":"inject","z":"5ed79f4a958a1f20","name":"Read","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":190,"y":420,"wires":[["f9a6ff93.086a"]]},{"id":"f4109aa5.270e08","type":"debug","z":"5ed79f4a958a1f20","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":630,"y":420,"wires":[]},{"id":"bf16d5a9.073b6","type":"comment","z":"5ed79f4a958a1f20","name":"Check global variable and do some stuffs","info":"","x":300,"y":380,"wires":[]},{"id":"85c342f08c9c4705","type":"comment","z":"5ed79f4a958a1f20","name":"This function writes some values to the bus","info":"","x":310,"y":260,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"fake","loglevel":"error","name":"Multicast","localEchoInTunneling":true,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":"","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":""}]

```

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
