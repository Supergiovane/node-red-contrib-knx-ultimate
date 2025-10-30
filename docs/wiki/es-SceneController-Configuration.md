---
layout: wiki
title: "SceneController-Configuration"
lang: es
permalink: /wiki/es-SceneController-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)

El nodo de control de la escena se comporta exactamente como un dispositivo KNX de controlador de escena.Es capaz de guardar y recordar una escena. 

# Configuración del nodo del controlador de escena

|Propiedad |Descripción |
|------------ |---------------------------------------------------------------------------------------------------- |
|Puerta de entrada |Gateway Knx seleccionado.|
|Recuerdo de la escena | **DataPoint ** y**Valor de activación ** .Dirección grupal para el retiro de escena.Ejemplo 0/0/1.El controlador de la escena reaccionará a los telegramas provenientes de esta dirección grupal, para recordar la escena.El punto de datos es el tipo de punto de datos (DPT) de la dirección de grupo _Scene Recall_.El valor de activación es el valor que debe revivirse, para activar el retiro de la escena.**Recuerde ** : para activar una escena o guardar una escena a través de un comando DIM, colocar en el recuerdo de la escena o guardar la escena**Valor de activación** , el objeto correcto para la atenuación ({Dec \ _incr: 1, datos: 5} para un aumento tenue, {regoder \ _incr: 0, datos: 5} para disminución tenue) |
|Guardar escena | **DataPoint ** y**Valor de activación ** .Dirección grupal para guardar una escena.Ejemplo 0/0/2.El controlador de la escena reaccionará a los telegramas provenientes de esta dirección de grupo, guardando todos los valores actuales de todos los dispositivos en la escena, que se pueden recuperar más adelante.Cada vez que presione, o presione durante mucho tiempo un botón KNX real en su edificio, el controlador de la escena leerá los valores de todos los dispositivos en la escena y lo guardará en un almacenamiento no volátil.El punto de datos es el tipo de punto de datos (DPT) de la dirección de grupo _scene save_.El valor de activación es el valor que debe revivirse, para activar el ahorro de la escena.**Recuerde ** : para activar una escena o guardar una escena a través de un comando DIM, colocar en el recuerdo de la escena o guardar la escena**Valor de activación** , el objeto correcto para la atenuación ({Dec \ _incr: 1, datos: 5} para un aumento tenue, {regoder \ _incr: 0, datos: 5} para disminución tenue) |
|Nombre del nodo |Nombre del nodo, en el formato "Recordar: Nombre del dispositivo utilizado para recuperar la escena / Guardar: Nombre del dispositivo para guardar la escena".Pero puedes establecer el nombre que quieras.|
|Tema |Tema del nodo.|

## Configuración de la escena

Debe agregar dispositivos a la escena, como un dispositivo KNX de controlador de escena real estándar.Esta es una lista, cada fila representa un dispositivo.

_ **El nodo de la escena guarda automáticamente los valores actualizados de todos los actuadores que pertenecen a la escena, cada vez que recibe un nuevo valor del bus.** _

|Propiedad |Descripción |
|------------- |---------------------------------------------------------------------------------------------------- |
|Botón Agregar |Agregue una fila a la lista.|
|Campo de la fila |El primer campo es la dirección de grupo, el segundo es el punto de datos, tercero es el valor predeterminado para este dispositivo en la escena (la función _scene save_ puede anular esto).A continuación, se encuentra el nombre del dispositivo. 
 Para insertar un _Pause_, escriba **espera ** en el primer campo y un número en el último campo, que representa el tiempo (en milisegundos) de la pausa, por ejemplo**2000 ** 
 
 El comando**espera ** acepta también valores que indican segundos o horas. 
 a un valor en segundo lugar, add**ssule, por ejemplo, los valores de los numéricos, por ejemplo, por ejemplo, por ejemplo, los valores de los numéricos.( ** 12s**) 
 Para establecer un valor en minutos, agregue ** m**después del valor numérico, por ejemplo ( ** 5m**) 
 Para establecer un valor en horas, agregue ** h**después del valor numérico, por ejemplo ( ** 1H** ) |
|Botón eliminar |Elimine un dispositivo de la lista.|

# Salida de mensajes desde el nodo del controlador de escena```javascript

msg = {
    topic: "Scene Controller" <i>(Contains the node's topic, for example "MyTopic").</i>
    recallscene: <i>(<b>true</b> if a scene has been recalled, otherwise <b>false</b>).</i> 
    savescene: <i>(<b>true</b> if a scene has been saved, otherwise <b>false</b>).</i> 
    savevalue: <i>(<b>true</b> if a group address value belonging to an actuator in the scene, has been manually saved by a msg input, otherwise <b>false</b>).</i> 
    disabled: <i>(<b>true</b> if the scene controller has been disabled via input message msg.disabled = true, otherwise <b>false</b>).</i> 
}

```---

# Mensaje de flujo de entrada

El nodo del controlador de la escena reacciona principalmente a los telegramas KNX y confía en eso para recordar y guardar escenas.

Sin embargo, puede recordar y guardar escenas enviando un mensaje al nodo.El controlador de la escena se puede deshabilitar para inhibir los comandos que provienen del autobús KNX. ** Recuerde una escena** ```javascript

// Example of a function that recall the scene
msg.recallscene = true; 
return msg;

``` ** Guardar una escena** ```javascript

// Example of a function that saves the scene
msg.savescene = true; 
return msg;

``` ** Guardar el valor actual de una dirección de grupo ** _**El nodo de la escena ya guarda los valores actualizados de todos los actuadores que pertenecen a la escena.** _

A veces es útil poder guardar el valor actual de una dirección de grupo que es diferente de la que ingresó en la escena, como el valor real del actuador de la escena.

Por ejemplo, un actuador de obturador generalmente tiene una dirección de grupo de comando y una de estado.

El nodo guarda la escena tomando valores de dirección de grupo de comando, que pueden no estar alineados con el valor de estado real.

Sin embargo, puede trabajar en torno a esto actualizando manualmente el valor de la dirección del grupo de comando, tomándolo desde la dirección del grupo de estado.

Piense en esto: si tiene un actuador ciego, tiene una dirección grupal para el movimiento, una dirección grupal para el paso, una dirección de grupo para la altura absoluta, etc. la única dirección grupal que conoce la posición exacta de la ciega, es la dirección de grupo ** Valor de altura absoluta** .

Con esta dirección de grupo de estado, puede actualizar las direcciones del grupo de comando de los actuadores ciegos que pertenecen a la escena.Consulte la muestra en el wiki.```javascript

// Example of a function that saves the status of a blind actuator, belongind to the scene.
msg.savevalue = true; 
msg.topic = "0/1/1";
msg.payload = 70;
return msg;

``` ** Desactivar Controlador de escena**

Puede deshabilitar el controlador de la escena (deshabilita la recepción del telegrama del bus KNX, pero el nodo aún acepta el mensaje de entrada del flujo en su lugar).En algún momento es aconsejable para deshabilitar el retiro y el salvamento de una escena, por ejemplo, cuando es de noche y llamas, desde un botón de empuje KNX, una "escena de TV" que levanta o baja una ciega, la escena no se recordará ni salvará.En cambio, puede habilitar otra escena, solo por la noche, por ejemplo, para atenuar una serie de luces.```javascript

// Example of disabling the scene controller. The commands coming from KNX BUS will be disabled. The node still accept the input msg from the flow instead!
msg.disabled = true; // Otherwise "msg.disabled = false" to re-enable the node.
return msg;

```## Ver también

[Controlador de escena de muestra](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
