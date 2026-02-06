---
layout: wiki
title: "Device"
lang: es
permalink: /wiki/es-Device
---
## Configuración del nodo del dispositivo KNX-Ulimidad

 Este nodo le permite controlar una dirección de grupo KNX, este es el nodo más utilizado.

[<i class="fa fa-Code"> </i> Aquí encontrarás algunas muestras](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome)

**Configuración**

| Propiedad | Descripción |
|-|-|
| Puerta | Seleccione la puerta de enlace KNX para ser utilizada |
| Lista desplegable Tipo de GA | El tipo de dirección de grupo. **3 niveles** es el valor predeterminado, donde puede escribir la dirección de grupo de nivel _3 o el _group name_ (si ha cargado el archivo ETS), o **global**, para leer el GA al inicio desde una variable global, o **flujo** que hace lo mismo que el _global_, pero a nivel de flujo. Seleccione **$Env variable** para leer la dirección de grupo de una variable de entorno. Seleccione **Modo universal (escuche todas las direcciones de grupo)** para reaccionar a todas las direcciones de grupo. |
| ADR DE GRUPO. | La dirección de grupo KNX que desea controlar. Si ha importado el archivo de direcciones del grupo ETS, puede comenzar a escribir el nombre de su dispositivo. Puede dejarlo vacío si lo desea establecerlo con _MSG.SetConfig_ Mensaje de entrada. |
| Punto de datos | El punto de datos que pertenece a su nodo. |

### Botón de comando manual

El editor puede mostrar, para cada nodo, un pequeño botón que envía un comando KNX sin necesidad de un nodo Inject adicional.

| Propiedad | Descripción |
|--|--|
| Mostrar botón manual | Activa o desactiva la visualización del botón en el área de trabajo y en la lista de nodos. |
| Acción del botón | Define la operación al hacer clic. **Enviar KNX Read** emite un telegrama de lectura estándar. **Toggle boolean** está disponible para datapoint 1.x y alterna los valores _true_/_false_ en cada pulsación. **Escribir valor personalizado** envía el valor indicado (debe ser coherente con el datapoint configurado). |
| Estado inicial del toggle | (Solo para datapoint booleanos) Establece el valor inicial que utiliza la acción de alternancia. El estado se sincroniza automáticamente con los telegramas recibidos desde el BUS. |
| Valor personalizado | Payload utilizado por el modo “Escribir valor personalizado”. Se aceptan literales JSON como `42`, `true`, `"texto"` o `{ "red": 255 }`. |

El botón solo aparece cuando la opción está habilitada. En modo universal la acción de lectura está deshabilitada porque el nodo no dispone de una dirección de grupo fija.

## Pestaña Opciones avanzadas

| Propiedad | Descripción |
|-|-|
|| **Propiedades generales** |
| Nombre del nodo | Autoexplicando. |
| Tema | El tema de salida de MSG. Déjelo en blanco para tenerlo configurado en su dirección grupal. |
| Passthrough | Si se establece, puede pasar el MGS de entrada al MSG de salida. |
|| **Desde el pin de entrada del nodo hasta el bus KNX** |
| Tipo de telegrama | _Write_ para enviar el telegrama de escritura (por lo general, desea eso), de lo contrario, puede elegir el tipo de telegrama para reaccionar. |
| Filtro RBE | _Report por Change_ Filter. Si se establece, solo la entrada MSG (del flujo) que tiene diferentes valores cada vez, se enviará al bus KNX. Si tiene la intención de enviar cada vez el mismo valor, apáguelo. Si está habilitado, la indicación "RBE" se agregará al nombre del nodo. |
| Envío periódico del valor almacenado | Si está habilitado, el nodo envía al bus KNX el último valor almacenado a intervalos regulares (telegrama _write_). Esta opción omite intencionadamente el RBE de salida. |
| Intervalo de envío periódico | Intervalo en segundos del envío periódico. |
|| **Desde el bus KNX hasta el pin de ojera del nodo** |
| Leer el estado al inicio | Lea el estado de la dirección de grupo, cada vez que el nodo-rojo comienza y en cada reconexión a la puerta de enlace KNX. El nodo almacena todos los valores de la dirección de grupo en un archivo, por lo que puede elegir Wether para leer desde el archivo o del bus KNX. |
| Filtro RBE | _Report por Change_ Filter. Si se establece, solo la salida MSG (al bus KNX) que tiene valores diferentes cada vez, se enviará al flujo de la salida de MSG. Si tiene la intención de enviar cada vez el mismo valor, déjelo apagado. Si está habilitado, la indicación "RBE" se agregará al nombre del nodo. |
| Reaccionar para escribir telegramas | El nodo reaccionará (enviará un mensaje al flujo) cada vez que reciba un _Write_ Telegram desde el bus KNX. Por lo general, quieres eso. |
| Reaccionar a los telegramas de respuesta | El nodo reaccionará (enviará un mensaje al flujo) cada vez que reciba un _Response_ Telegram desde el bus KNX. Por lo general, quieres eso para escenarios particulares. |
| Reaccionar a leer telegramas | El nodo reaccionará (enviará un mensaje al flujo) cada vez que reciba un _read_ telegrama desde el bus KNX. Por lo general, desea eso si desea enviar un valor personalizado al bus KNX. |
| Multiplicar | Multiplica o divide el valor de carga útil. Funciona solo si el valor es un número. |
| Decimales | Redondo o manejar decimales de cualquier manera. Funciona solo si el valor es un número. |
| Negativos | Maneja los valores negativos. Funciona solo si el valor es un número. |

## Función Tab Knx

Puede usar JavaScript para modificar el comportamiento del MSG de entrada que proviene del flujo y el telegrama de salida enviado al bus KNX.
El editor de código integrado proporciona objetos y funciones útiles para recuperar el valor de todas las direcciones de grupo, tanto con el archivo ETS importado como sin (especificar el punto de datos). \
El script se llama cada vez que el nodo recibe un mensaje del flujo o un telegrama del bus KNX.
Si está habilitado, la indicación "F (x)" se agregará al nombre del nodo.

| Propiedad | Descripción |
|-|-|
| Buscar ga | Es un ayudante solo disponible si se ha importado el archivo ETS. Comience a escribir y seleccione la dirección de grupo que desea agregar al código. Luego copie el campo completo y péguelo en la función GetGavalue. 
 **getGavalue ('0/0/1 Table Nord Lamp')** |

### Lista de objetos y funciones comunes que puede usar en el código

| Objeto o función | Descripción |
|-|-|
| msg (objeto) | El objeto MSG actual recibido por el nodo. |
| getGavalue (String ga, string opcional dpt) | Obtenga el valor de GA especificado, por ejemplo **'1/0/1'** o **'1/0/1 Luz mesilla'** (el texto tras un espacio se ignora). Con el archivo ETS importado, también puede copiar y pegar la GA desde el campo **Búsqueda GA**. **DPT** es opcional con ETS; si no, debe indicarlo (por ejemplo `'1.001'`). |
| setgavalue (cadena ga, cualquier valor, cadena opcional dpt) | Establezca el valor de GA especificado, por ejemplo **'1/0/1'** o **'1/0/1 Luz mesilla'** (el texto tras un espacio se ignora). Con el archivo ETS importado, también puede copiar y pegar la GA desde el campo **Búsqueda GA**. El valor es obligatorio; **dpt** es opcional con ETS. |
| yo (cualquier valor) | Establezca el valor del nodo de Currend y envía el valor al bus KNX también. Por ejemplo, _Self (False) _. PRECAUCIÓN Uso de ** Función ** ** En la _From KNX Bus hasta el código PIN_ de salida del nodo, porque el código se ejecutará cada vez que se reciba un telegrama KNX, por lo que usted tiene bucles de recurrencia. |
| alternar (nada) | Alterne el valor del nodo de Currend y envía el valor al bus KNX también. Por ejemplo, _Toggle () _. PRECAUCIÓN Uso de la función ** Toggle** En el código _From KNX BUS al Código PIN_ de salida del nodo, porque el código se ejecutará cada vez que se reciba un Telegrama KNX, por lo que usted tiene bucles de recurrencia. |
| nodo (objeto) | El objeto nodo. |
| Rojo (objeto rojo nodo) | El objeto rojo del nodo-rojo. |
| return (msg) | Obligatorio `return msg;`, si desea emitir el mensaje. De lo contrario, usando `return;` no emitirá ningún mensaje. |

### desde el bus KNX al pin de salida del nodo

En esta muestra, enviaremos el mensaje de entrada al bus KNX solo si otro GA tiene un valor opuesto. \
Encenderemos la luz solo si su estado GA está apagado y viceversa.

```javascript

const statusGA = getGAValue('0/0/09','1.001');
if (msg.payload !== statusGA){ // "!==" means "not equal"
    return msg;
}else{
    // Both values are identical, so i don't send the msg.
    return;
}
```

Aquí, si alguien enciende la luz, encendemos otra luz 0/1/8 y después de 2 segundos apagamos la lámpara conectada al nodo.

```javascript

if (msg.payload){ 
    setGAValue('0/1/8',true)
    setTimeout(function() {
        self(off);
    }, 2000);
}
return msg;
```

### Desde el bus KNX hasta el pasador de ooles de nodo

En esta muestra, emitiremos el objeto MSG al flujo, agregando el valor de otro GA a la salida Msg. \
El mensaje de salida al flujo también tendrá la temperatura externa en la propiedad `msg.externaltemperatura '

```javascript

// The current msg contains the internal temperature in the "msg.payload" property, but we want to emit the external temperature as well.
msg.externalTemperature = getGAValue('0/0/10'); // In case the ETS file is missing, you must specify the dpt as well: getGAValue('0/0/10','9.001')
return msg;
```

En esta otra muestra, no emitiremos un MSG al flujo, en el caso de MSG.PayLoad y otro valor de GA son falsos.

```javascript

if (msg.payload === false && getGAValue('0/0/11','1.001') === false){
    // Both false, don't emit the msg to the flow.
    return;
}else{
    // Ok, emit it.
    return msg;
}
```

## Muestra de carga útil de pestañas

| Propiedad | Descripción |
|-|-|
| Muestra | Esto le dará una pista sobre qué escribir en un nodo de función externa, si desea controlar el nodo a través de un nodo de función de nodo-rojo. |

### entradas

- **destination (string)**: la dirección del grupo de destino, por ejemplo `1/1/0` (solo se permiten 3 niveles)
- **payload (any)**: la carga útil a enviar (por ejemplo `true` / `false` / número / string / objeto)
- **event (string)**: `GroupValue_Write` / `GroupValue_Response` / `Update_NoWrite` (`Update_NoWrite` actualiza el valor interno y no envía al BUS)
- **readstatus (boolean)**: emite una solicitud de lectura al bus (use siempre `true`: `msg.readstatus = true`)
- **dpt (string)**: por ejemplo `1.001` (datapoint)
- **writeraw (buffer)** + **bitlenght (int)**: envío RAW al BUS (ver ejemplo)
- **resetRBE (boolean)**: restablece filtros RBE internos (`msg.resetRBE = true`)
- **setConfig (json)**: cambia programáticamente GA y DPT (ver detalles)

### Detalles

`msg.setConfig`: es posible cambiar programáticamente la configuración del nodo ultimate KNX, enviando el objeto Msg.SetConfig al nodo.
La nueva configuración se retendrá hasta el próximo msg.setConfig o hasta que reinicie/redploy.
Todas las propiedades (_setGroupAddress_ y _setdpt_) ** son obligatorias** .. \
Úselo así, en un nodo Funccton: ** Establezca tanto GA como DPT** 

```javascript

// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to **auto** , the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "1.001"
};
msg.setConfig = config;
return msg;
```

** Establezca GA y lea el punto de datos del archivo ETS** 

```javascript

// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to "auto", the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "auto"
};
msg.setConfig = config;
return msg;
```

### salidas

1. Salida estándar: `payload` (string|number|object) en el Pin 1
2. Errores: `error` (object) en el Pin 2 (mensaje de error detallado)

### Detalles

`msg.payload` se utiliza como la carga útil de la dirección del grupo (el valor de la dirección del grupo).
Este es, en cambio, un ejemplo del objeto MSG completo.

```javascript

msg = {
    topic: "0/1/2" // (Contains the node's topic, for example "MyTopic". If the node's topic is not set, contains the Group Address, for example "0/1/2")
    payload: false 
    previouspayload: true // Previous node payload value.
    payloadmeasureunit: "%" // Payload's measure unit.
    payloadsubtypevalue: "Start" // Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm
    devicename: "Dinning table lamp" // If the node is in **universal mode** , it contains the full path (main, middle,name) of the group address name, otherwise, the node name.
    gainfo: { // Contains the details about the group address name and number. This object is only present if the node is set in **universal mode ** and with the**ETS file ** been imported. If something wrong, it contains the string**unknown** .
        maingroupname:"Light actuators"
        middlegroupname:"First flow lights"
        ganame:"Table Light"
        maingroupnumber:"1"
        middlegroupnumber:"1"
        ganumber:"0"
    },
    echoed:true, // True if the msg is coming from the input PIN, otherwise false if the msg is coming form the KNX BUS.
    knx: { // This is a representation of the KNX BUS telegram, coming from BUS
        event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
        dpt: "1.001"
        dptdesc: "Humidity" // Payload's measure unit description
        source: "15.15.22"
        destination: "0/1/2" // Contains the Group Address
        rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
            0: 0x0 // (This is the RAW undecoded value)
    }
}
```

 ** Muestra de carga útil** | Propiedad | Descripción |

|-|-|
| Muestra | Esto le dará una pista sobre qué escribir en un nodo de función externa, si desea controlar el nodo a través de un nodo de función de nodo-rojo. |

### entradas

- **destination (string)**: la dirección del grupo de destino, por ejemplo `1/1/0` (solo 3 niveles)
- **payload (any)**: la carga útil que se enviará (por ejemplo `true`/`false`/objeto)
- **event (string)**: `GroupValue_Write` / `GroupValue_Response` / `Update_NoWrite`
- **readstatus (boolean)**: solicitud de lectura al bus (`msg.readstatus = true`)
- **dpt (string)**: por ejemplo `1.001`
- **writeraw (buffer)** + **bitlenght (int)**: envío RAW (ver ejemplo)
- **resetRBE (boolean)**: restablece los filtros RBE (`msg.resetRBE = true`)
- **setConfig (json)**: cambia GA y DPT (ver detalles)

### Detalles

`msg.setConfig`: es posible cambiar programáticamente la configuración del nodo ultimate KNX, enviando el objeto Msg.SetConfig al nodo.
La nueva configuración se retendrá hasta el próximo msg.setConfig o hasta que reinicie/redploy.
Todas las propiedades (_setGroupAddress_ y _setdpt_) ** son obligatorias** .. \
Úselo así, en un nodo Funccton: ** Establezca tanto GA como DPT** 

```javascript

// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to **auto** , the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "1.001"
};
msg.setConfig = config;
return msg;
```

** Establezca GA y lea el punto de datos del archivo ETS** 

```javascript

// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to "auto", the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "auto"
};
msg.setConfig = config;
return msg;
```

### salidas

1. Salida estándar
   : `payload` (string|number|object) en el Pin 1

2. Errores
   : `error` (object) en el Pin 2 (mensaje de error detallado)

### Detalles

`msg.payload` se utiliza como la carga útil de la dirección del grupo (el valor de la dirección del grupo).
Este es, en cambio, un ejemplo del objeto MSG completo.

```javascript

msg = {
    topic: "0/1/2" // (Contains the node's topic, for example "MyTopic". If the node's topic is not set, contains the Group Address, for example "0/1/2")
    payload: false 
    previouspayload: true // Previous node payload value.
    payloadmeasureunit: "%" // Payload's measure unit.
    payloadsubtypevalue: "Start" // Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm
    devicename: "Dinning table lamp" // If the node is in universal mode, it contains the full path (main, middle,name) of the group address name, otherwise, the node name.
    gainfo: { // Contains the details about the group address name and number. This object is only present if the node is set in universal mode and with the ETS file been imported. If something wrong, it contains the string "unknown".
        maingroupname:"Light actuators"
        middlegroupname:"First flow lights"
        ganame:"Table Light"
        maingroupnumber:"1"
        middlegroupnumber:"1"
        ganumber:"0"
    }
    knx: { // This is a representation of the KNX BUS telegram, coming from BUS
        event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
        dpt: "1.001"
        dptdesc: "Humidity" // Payload's measure unit description
        source: "15.15.22"
        destination: "0/1/2" // Contains the Group Address
        rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
            0: 0x0 // (This is the RAW undecoded value)
    }
}
```

## Salida del mensaje del nodo establecido como "Modo universal (escuche todas las direcciones de grupo)"

Aquí tiene 2 opciones: Importar archivo CVS ETS o no. 

Importar su archivo ETS es el método sugerido <b> Aboslute </b>. Si importa su archivo ETS, el nodo hará la decodificación de DataPoint automáticamente y también le dará el nombre del dispositivo. 

Si no importa el ETS, el nodo emitirá el telegrama sin procesar e intenta decodificarlo también. 

```javascript

msg = {
    topic: "0/1/2" // (Contains the Group Address of the incoming telegram)
    payload: false // (Automatically decoded telegram. If you've <b>not imported the ETS file</b>, the node will try to decode the telegram <b>but you can obtain an erroneus value</b>)
    payloadmeasureunit: "%" // (payload's measure unit)
    payloadsubtypevalue: "Start" // (Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm.)
    devicename: "(First Floor->Dinning Room) Dinning table lamp" // (the node will output the complete path of your house, including the device name, or the node's name in case you've <b>not imported the ETS file</b> )) 
    knx: 
        event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
        dpt: "1.001" // (If you've <b>not imported the ETS file</b>, this represents the datapoint used to try to decode the telegram)
        dptdesc: "Humidity" // (payload's measure unit description)
        source: "15.15.22"
        destination: "0/1/2" // (Contains the Group Address of the incoming telegram, same as topic)
        rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
            0: 0x0 // (This is the RAW undecoded value)
    }}
 
```

## Mensaje de salida en dispositivo virtual

Aquí encontrará una muestra de [dispositivo virtual](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device)

```javascript

{
   topic: '5/0/1',
   payload: true,
   devicename: 'Light Status',
   event: 'Update_NoWrite',
   eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
   previouspayload: true
 }
 
```

---

# Mensaje de flujo de entrada

## Control de dispositivos KNX

El nodo acepta MSG del flujo que se enviará al bus KNX y envía MSG al flujo tan pronto como el mensaje KNX llega desde el bus. 

Suponiendo que proporcionó una dirección de grupo y un punto de datos al nodo, ya sea manualmente o con campos de población automática seleccionando su dispositivo desde la lista del dispositivo después de importar el archivo ETS. 

También puede anular uno o más parámetros establecidos en la ventana de configuración KNX-Uultimate. 

Todas las propiedades a continuación son opcionales, excepto por la carga útil. 
 ** Msg.Destination** 

Por ejemplo, "0/0/1". Establezca la dirección de grupo de 3 niveles que desea actualizar. ** msg.payload** 

Por ejemplo, verdadero/falso/21/"Hola". Establezca la carga útil que desea enviar al autobús KNX. ** msg.event** 

"GroupValue \ _Write": escribe el telegrama al autobús KNX. 

"GroupValue \ _Response": envía un telegrama de respuesta al bus KNX. 

"Actualizar \ _nowrite": envía nada al bus KNX, solo actualiza el valor interno del nodo Ulimado KNX. Esto es útil si solo desea almacenar el valor en el nodo y leerlo más tarde con una solicitud de lectura. 

PRECAUCIÓN: en el caso de _msg.event = "update \ _nowrite" _ Todos los nodos con la misma dirección de grupo emitirán al flujo un mensaje como este:

```javascript

{
  topic: '5/0/1',
  payload: true,
  devicename: 'Light Status',
  event: 'Update_NoWrite',
  eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
  previouspayload: true
}

```

Si desea emitir un comando "Leer", use "ReadStatus" en su lugar (ver más abajo). 
 ** msg.readstatus = true** 

Emita un comando de "leer" al bus. ** msg.dpt** 

Por ejemplo "1.001". Establece el punto de datos <b> </b>. (Puede escribirlo en estos formatos: 9, "9", "9.001" o "DPT9.001") ** msg.writeraw ** 
**msg.bitlenght** 

Escribe datos sin procesar en el bus KNX. Consulte a continuación un ejemplo. 
 ** msg.resetrbe** 
 pase msg.resetrbe = true a un nodo de dispositivo, para restablecer tanto el filtro de entrada como de salida RBE en ese nodo particular. 

## Cambiar programáticamente la configuración del nodo a través de MSG

Es posible cambiar programáticamente la configuración del nodo Ulimado KNX, enviando msg.setConfig Object al nodo. 

[Consulte aquí la página de muestra.](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig)

# Rápido como

Puede más muestras [aquí](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome) ** Encienda una lámpara** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

** ABSOLUTO Dim una lámpara** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = 30; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

** Enviar texto a una pantalla** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = "Output Tem. 35°C"; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

** Lea el estado de la lavadora** 

```javascript

// Example of a function that sends a read status message to the KNX-Ultimate
// Issues a read request to the KNX bus. You'll expect a 'response' from the bus. You need to select the **React to response telegrams** option.
// The node will react to the KNX Response telegram coming from the BUS.
msg.readstatus = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

** Enviar valor bruto al bus** 

Para enviar un valor de búfer en bruto al bus KNX, use el _ ** escritorw ** _ y _**bitLenght** _ Propiedades de la entrada de MSG. 

En este caso, se ignorará el _datapoint_ que establece en la ventana de la propiedad. 

Softe un nodo de función frente a KNX-Ulimate y pegue su código:

```javascript

// If you encode the values by yourself, you can write raw buffers with writeraw.
// The bitlenght is necessary for datapoint types where the bitlenght does not equal the buffers bytelenght * 8. This is the case for dpt 1 (bitlength 1), 2 (bitlenght 2) and 3 (bitlenght 4).
// Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
msg.writeraw = Buffer.from('01', 'hex'); // Put '00' instead of '01' to switch off the light.
msg.bitlenght = 1;
return msg;

// Temperature sample (uncomment below and comment above)
// Write raw buffer to a groupaddress with dpt 9 (e.g temperature 18.4 °C = Buffer<0730>) without bitlength
// msg.writeraw = Buffer.from('0730', 'hex');
// msg.bitlenght = 1;
// return msg;

```

** Actualice el valor del nodo sin enviarlo al bus** 

```javascript

msg.event = "Update_NoWrite";
msg.payload = true;
return msg;

```

## Control de dispositivos KNX con el nodo establecido en "Modo universal (escuche todas las direcciones de grupo)"

Aquí tiene 2 opciones: Importar archivo CVS ETS o no. 

Importar su archivo ETS es el método sugerido <b> Aboslute </b>. Si importa su archivo ETS, solo necesita establecer la carga útil para transmitir. El nodo hará la codificación de punto de datos automáticamente. 

Si no importa el CSV ETS, también debe pasar el tipo de punto de datos al nodo. 
 ** Apague una lámpara <u> con el archivo </u> ETS importado** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.event = "GroupValue_Write";
msg.destination = "0/0/1"; // Set the destination 
msg.payload = false; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

** Apague una lámpara <u> sin </u> archivo ETS importado** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.event = "GroupValue_Write";
msg.destination = "0/0/1"; // Set the destination 
msg.dpt = "1.001"; 
msg.payload = false; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

** Lea el estado de todos los dispositivos KNX <u> con el archivo </u> ETS importado** 

No puede emitir una solicitud de lectura a todos los grupos si no importa su archivo ETS, porque el nodo no puede saber en los dispositivos para enviar la solicitud de lectura.

```javascript

// Example of a function that sends a read status message to the KNX-Ultimate
// Issues a read request to the KNX bus. You'll expect a 'response' from the bus. You need to select the **React to response telegrams** option.
// The node will react to the KNX Response telegram coming from the BUS.
msg.readstatus = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

## Ver también

- [Configuración de la puerta de enlace](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Gateway-configuration)
- [Protección de referencia circular y protección contra inundaciones](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections)
- _samples_
  - [muestras](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome)

    <table style = "font-size: 12px">
        <tr>
        <th colspan = "2" style = "font-size: 14px"> Coloros de estado del nodo Explicación </th>
        </tr>
        <tr>
        <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"> </ img> </td>
        <TD> reaccionar para escribir telegramas </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"> </img> </td>
            <TD> Protección de referencia circular. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target = "_ en blanco"> ver esta página. </a> </td>
        </tr>
        <tr>
        <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"> </img> </td>
        <TD> Reaccionar a los telegramas de respuesta. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"> </ img> </td>
            <TD> Auto envía el valor del nodo como respuesta al bus. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target = "_ blank"> ver dispositivo virtual. </a> </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"> </img> </td>
            <TD> Reaccionar a leer telegramas. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"> </img> </td>
            <TD> RBE Filtro: no se han enviado telegramas. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"> </img> </td>
            <TD> Error o desconectado. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"> </img> </td>
            <td> Nodo discapacitado debido a una referencia circulare. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target = "_ en blanco"> ver esta página. </a> </td>
        </tr>
    </table>
