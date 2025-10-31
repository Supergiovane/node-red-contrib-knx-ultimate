---
layout: wiki
title: "zh-CN-Alerter-Configuration"
lang: es
permalink: /wiki/es-zh-CN-Alerter-Configuration
---
---
<
# Configuración del nodo de Alerter
Use el nodo Alerter para solicitar si el dispositivo seleccionado está en un estado de alarma en el monitor o a través del nodo nodo-red-confun-tts-ultimate (transmisión de voz), es decir, la `carga útil` es **verdadera** .
Este nodo genera mensajes que contienen los detalles del dispositivo de alarma actual a un intervalo de tiempo configurable (uno a la vez).Por ejemplo, puede decirle "cuántas ventanas están abiertas".<br/>
El nodo lee directamente el valor del dispositivo del bus KNX.Además, también puede enviar alertas personalizadas a los nodos, independientemente de los dispositivos KNX.<br/>
La página de ejemplo muestra cómo se usa en el proceso.<br/>
- **Gateway (puerta de enlace)**
> Seleccione la puerta de enlace KNX para usar. Tampoco puede seleccionar la puerta de enlace;Solo los mensajes que ingresan al nodo se procesan en este momento.
- **Nombre (nombre)**
> Nombre del nodo.
- **Cómo comenzar a la alarma de la alarma**
> Seleccione el evento que desencadena el envío inicial del mensaje de alarma.
- **Intervalo de cada mensaje (segundos)**
> El intervalo de tiempo entre dos mensajes de salida consecutivos.
## Equipo que necesita monitoreo
Agregue los dispositivos que deben ser monitoreados aquí.<br/>
Complete la dirección de grupo del dispositivo o especifique una etiqueta para el dispositivo.<br/>
- **Lea el valor de cada dispositivo al conectar/volver a conectar**
> Al comenzar o reconectarse, el nodo envía una solicitud de lectura para cada dispositivo en la lista.
- **Agregar botón**
> Agregue una fila a la lista.
- **Línea de equipo ** > La primera columna es la dirección de grupo (también puede completar cualquier texto para usar con mensajes de entrada; consulte la página de ejemplo).La segunda columna es la abreviatura del dispositivo (**hasta 14 caracteres** ).La tercera columna es el nombre completo del dispositivo.
- **Botón Eliminar**
> Elimine el dispositivo de la lista.
<br/>
<br/>
## El mensaje de salida del nodo
PIN1: cada dispositivo de alarma genera un mensaje de acuerdo con el intervalo establecido.<br/>
PIN2: emitir un mensaje resumido que contiene todos los dispositivos en el estado de alarma.<br/>
PIN3: Solo se emite el último dispositivo que ingresó al estado de alarma.<br/>
**PIN1** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
``` **PIN2** ```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "入户门, 客厅壁灯, 地下室壁灯, 书房灯",
  longdevicename: "主入户门, 客厅左侧壁灯, 地下室右侧壁灯, 书房顶灯",
  count: 4,
  payload: true
}
``` **PIN3** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```Salida Cuando todos los dispositivos están estacionarios (sin alarmas):
**PIN1, PIN2, PIN3** ```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```<br/>
<br/>
## Mensaje de entrada para nodo```javascript
msg.readstatus = true
```Lee el valor actual de cada dispositivo en la lista.```javascript
msg.start = true
```Inicie una encuesta que "atraviese todos los dispositivos y salidas de alarma a su vez".El encuesta finaliza después de la última salida del dispositivo; Si vuelve a sondear, envíe el mensaje de entrada nuevamente.
<br/>
**Alarma de dispositivo personalizado** <br/>
Para actualizar el estado de un dispositivo personalizado (verdadero/falso), envíe el siguiente mensaje de entrada:```javascript
msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```<br/>
## Ejemplo
<a href = "/node-red-contrib-knx-ultimate/wiki/samplealerter"> Haga clic aquí para ver el ejemplo </a>
<br/>
<br/>
<br/>
