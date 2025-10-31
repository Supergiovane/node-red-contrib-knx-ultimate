---
layout: wiki
title: "zh-CN-GlobalVariable"
lang: es
permalink: /wiki/es-zh-CN-GlobalVariable
---
---
<
# KNX Variables globales
Este nodo mapea la dirección de grupo recibida del bus a la variable de contexto global, \
Y permita escribir en el bus KNX a través de esta variable.
## Descripción general
- Agregue el nodo de contexto global al proceso y logerne; Este nombre se usa como el nombre base de la variable global.
- Leer usando el sufijo `_read` (como` myvar_read`).
- Escriba para usar el sufijo `_Write` (como 'myvar_write`).
- Las variables se pueden expusir como solo lectura o leer/escribir en configuración.
- Por razones de seguridad, modifique el nombre predeterminado.
Nota: Después de ejecutar la escritura, `<same> _Write` se borrará automáticamente para evitar la escritura repetida.
## configuración
| Propiedades | Descripción |
|-|-|
| Puerta de entrada | KNX Gateway.|
| Nombre variable | El nombre básico de la variable global.Se crean `<Name> _read` y` <Name> _Write`. No use el nombre predeterminado por razones de seguridad.|
| Exponer como variable global | Seleccione si y cómo exponer variables globales y cómo.Si no necesita escribir, se recomienda establecer en solo lectura.|
| Intervalo de escritura de bus | Encuesta `<Name> _Write` y escriba en el bus.|
## Objeto Msg en variable```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```## Uso rápido
### leer variables```javascript
const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });
const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```### Escribe en el autobús a través de variables```javascript
const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// 如果已导入 ETS，可省略 dpt，由系统据 payload 推断
toSend.push({ address: "0/0/11", payload: msg.payload });
global.set("KNXContextBanana_WRITE", toSend);
```## Ejemplo completo
<a href = "/node-red-contrib-knx-ultimate/wiki/sampleglobalcontextnode" target = "_ blank"> <i class="fa fa-info-circle"> </i> View Ejemplo </a>
