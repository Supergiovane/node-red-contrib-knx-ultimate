---
layout: wiki
title: "zh-CN-SceneController-Configuration"
lang: es
permalink: /wiki/es-zh-CN-SceneController-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)
---
# Controlador de escena
Este nodo es consistente con el controlador de la escena KNX: la escena se puede guardar y retirar.
## Configuración del nodo
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | Gateway Knx seleccionado.|
| Recuerdo de la escena | **DataPoint ** y**Valor de activación** . La dirección de grupo utilizada para recordar el escenario (como `0/0/1`).El nodo recuerda la escena cuando este GA recibe el mensaje.DPT es el tipo de recuperación GA;El valor de activación es el valor requerido para activar el retiro.Consejo: si se activa en el modo Dim, establezca el valor correcto del objeto de atenuación (ajuste de ascenso por `{Decr_incr: 1, datos: 5}` y ajuste de abajo por `{Decr_incr: 0, datos: 5}`).|
| Guardar escena | **DataPoint ** y**Valor de activación** . La dirección de grupo utilizada para guardar la escena (como `0/0/2`).Cuando un nodo recibe un mensaje, guarda el valor actual de todos los dispositivos en la escena (almacenamiento no volátil).DPT es el tipo para guardar GA; Valor de activación Los disparadores Guardar (Dim supra).|
| Nombre del nodo | Nombre del nodo (escribir "Recuerde: ... / Guardar: ...").|
| Tema | El tema del nodo. |
## Configuración de escenarios
Como un controlador de escena KNX real, agregue dispositivos a la escena; Cada fila representa un dispositivo.
Una vez que se recibe un nuevo valor del bus, el nodo registrará automáticamente el último valor del actuador en la escena.
| Propiedades | Descripción |
|-|-|
| Botón Agregar | Agregue una nueva fila. |
| Campo de fila |1) Dirección de grupo 2) punto de datos 3) Valor de escena predeterminado (se puede sobrescribir mediante la guardia de la escena).El nombre del dispositivo está a continuación.<br/> Insertar pausa: complete **espera ** en la primera columna y complete la última columna para la duración (milisegundos), como `2000`.<br/>**espera** también admite segundos/minuto/hora: `12s`,` 5m`, `1H`.|
| Eliminar | Elimine esta línea de dispositivo.|
## Salida del nodo```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```---
## Mensaje de entrada (entrada)
El nodo se basa principalmente en los mensajes KNX para recuperar/guardar la escena; También se puede controlar a través de mensajes.Los comandos del bus se pueden deshabilitar y solo se pueden aceptar mensajes de proceso.
**Escenario de recuerdo** ```javascript
msg.recallscene = true; return msg;
``` **Guardar escena** ```javascript
msg.savescene = true; return msg;
``` **Guarde el valor actual de un GA**
Aunque la escena rastrea automáticamente el valor del albacea, en algunos casos es necesario registrar el valor actual de otro GA (como el estado en lugar del comando) con un "valor de escena real".
Por ejemplo, el obturador del rodillo: el estado GA de altura absoluta refleja la posición exacta.Este estado GA se utiliza para actualizar el comando GA del ejecutor relevante en la escena.```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
``` **Desactivar Controlador de escena**
Deshabilite los comandos del bus KNX (aún acepte mensajes de proceso).Por ejemplo, es útil cuando no desea recordar/guardar una escena del botón de entidad por la noche.```javascript
msg.disabled = true; // false 重新启用
return msg;
```## Ver
[Controlador de escena de muestra](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
