---
layout: wiki
title: "HUE Light"
lang: es
permalink: /wiki/es-HUE%20Light
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Light) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Light) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Light) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Light) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Light) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light)

Este nodo controla las luces de Hue Philips (single o agrupada) y mapea sus comandos/estados a KNX. 

**General**

| Propiedad | Descripción |
|-|-|
| KNX GW | Seleccione la puerta de enlace KNX para ser utilizada |
| Puente Hue | Seleccione el puente de tono que se utilizará |
| Nombre | Luz de tono o luz agrupada para usar (autocompletar mientras escribe). |

**Localizar dispositivo**

El botón `Locate` (icono de reproducción) inicia una sesión de identificación Hue para el recurso seleccionado. Mientras la sesión está activa, el botón muestra el icono de parada y el bridge hace parpadear la luz — o todas las luces del grupo — cada segundo. Pulsa de nuevo el botón para detenerla al instante; en caso contrario finalizará automáticamente tras 10 minutos.

**Opciones**

Aquí puede vincular las direcciones del grupo KNX con los comandos/estados de tono disponibles. 

Comenzar a escribir en el campo GA (nombre o dirección de grupo); Aparecen sugerencias mientras escribe.

**Cambiar**

| Propiedad | Descripción |
|-|-|
| Control | Este GA se usa para encender/apagar la luz del tono a través de un valor booleano KNX verdadero/falso |
| Estado | Enlace esto a la dirección de grupo de estado del interruptor de la luz |

**Oscuro**

| Propiedad | Descripción |
|-|-|
| Control Dim | Relativo tenue de la luz del tono. Puede establecer la velocidad de atenuación en la pestaña **Comportamiento** . |
| Control % | Cambia el brillo de la luz del tono absoluto (0-100%) |
| Estado % | Enlace esto al estado de brillo de la luz Dirección de grupo KNX |
| Velocidad dim (MS) | Velocidad de atenuación en milisegundos. Se aplica tanto al brillo de la luz como a los puntos de datos de color blanco sintonizable. Calculado sobre el rango 0% → 100%. |
| Min Dim brillo | El brillo mínimo que la lámpara puede alcanzar. Por ejemplo, si está atenuando la luz hacia abajo, la luz dejará de atenuar en el %de brillo especificado. |
| Brillo dim en el máximo | El brillo máximo que la lámpara puede alcanzar. Por ejemplo, si está atenuando la iluminación, la luz dejará de atenuar en el %de brillo especificado. |

**blanco sintonizable**

| Propiedad | Descripción |
|-|-|
| Control Dim | Cambie la temperatura blanca usando DPT 3.007 atenuación. La velocidad se establece en la pestaña **comportamiento** . |
| Control % | Cambie la temperatura blanca usando DPT 5.001. 0 = completo cálido, 100 = frío completo. |
| Estado %| Estado de temperatura GA. DPT 5.001 Valor absoluto: 0 = completo cálido, 100 = frío completo. |
| Control Kelvin | **DPT 7.600: ** Temperatura establecida en Kelvin usando el rango KNX 2000-6535 (convertido en Hue Mirek). 
**DPT 9.002:** Temperatura establecida usando el rango de Hue 2000-6535 K (la ambiente comienza a 2200 K). Las conversiones pueden introducir pequeñas desviaciones. |
| Estado Kelvin | **DPT 7.600: ** Lea la temperatura en Kelvin usando el rango KNX 2000-6535 (convertido desde el tono). 
**DPT 9.002:** Temperatura de lectura usando el rango de Hue 2000-6535 K (la ambiente comienza en 2200 K). Las conversiones pueden introducir pequeñas desviaciones. |
| Invertir la dirección tenue | Invierte la dirección tenue. |

**RGB/HSV**

| Propiedad | Descripción |
|-|-|
| **Sección RGB** ||
| Control rgb | Cambie de color usando el triplete RGB (R, G, B). Se maneja la corrección de gama. Enviar un color enciende la luz y establece color/brillo (perceptual). Enviar R, G, B = 0 apaga la luz. |
| Estado RGB | Dirección de grupo de estado de color de la luz. DataPoint aceptado es RGB Triplet (R, G, B) |
| **Sección HSV** ||
| Color H Dim | Ciclo a través de HSV Hue usando DPT 3.007 Dimming. La velocidad se establece en la pestaña **comportamiento** . |
| Estado H %| Estado del círculo cromático HSV. |
| Control s dim | Cambia la saturación de color de la luz, utilizando DPT 3.007 atenuado. Puede establecer la velocidad de atenuación en la pestaña **_ comportamiento _** |
| Estado s %| La dirección de grupo de estado de saturación de color de luz. |
| Velocidad dim (MS) | La velocidad de atenuación, en milisegundos, de escala de abajo hacia arriba. |

Para controlar el HSV "V" (brillo), use los controles estándar en la pestaña **Dim** .

**Efectos**

_Non-Hue Efectos básicos_

| Propiedad | Descripción |
|-|-|
| Parpadeo | _true_ parpadear la luz, _false_ deja de parpadear. Parpadea la luz encendida y apagada. Útil para la señalización. Funciona con todas las luces de tono. |
| Ciclo de color | _true_ ciclo de inicio, _false_ ciclo de detención. Cambia aleatoriamente el color de la luz del tono a intervalo regular. Funciona con todas las luces de tono que tienen capacidades de color. El efecto de color comenzará 10 segundos después del conjunto. |

_Extos efectos nativos_

Use la tabla **Hue Native Effects** para asignar sus valores de KNX a los efectos respaldados por la luz seleccionada (por ejemplo, `vela`,` chimenea`, `prism`). Cada fila vincula un valor KNX (booleano, numérico o textual, dependiendo del punto de datos que elija) con un efecto de tono. En el lado de KNX puedes:

- Envíe el valor asignado para activar ese efecto;
- Opcionalmente, proporcione una dirección de grupo de estado: el nodo emite el valor asignado cada vez que el puente HUE informa un cambio de efecto; Si no existe mapeo, se envía el nombre del efecto sin procesar (requiere un DPT textual como 16.xxx).

**Comportamiento**

| Propiedad | Descripción |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------- |
| Leer el estado al inicio | Lea el estado de la luz del tono en la inicio de nodo-rojo o el despliegue completo de Node-Red, y envíe ese estado al bus KNX |
| Estado de brillo KNX | Actualiza el estado de la dirección del grupo de brillo KNX, siempre que la lámpara de tono se encienda/apague. Las opciones son **cuando la luz del tono está apagada, envíe 0%. Cuando se enciende, restaure el valor anterior (comportamiento de KNX predeterminado) ** y**dejar como es (comportamiento de tono predeterminado) ** . Si tiene KNX Dimmer con estado de brillo, como MDT, la opción sugerida es _**cuando la luz del tono está apagada, envíe 0%. Cuando se enciende, restaure el valor anterior (comportamiento predeterminado KNX)** _ |
| Encender el comportamiento | Establece el comportamiento de sus luces cuando se enciende. Puede elegir entre diferentes comportamientos. 
 **Seleccione Color: ** La luz se encenderá con el color de su elección. Para cambiar el color, simplemente haga clic en el selector de color (debajo del control de color_select). 
**Seleccione la temperatura y el brillo: ** La luz se encenderá con la temperatura (Kelvin) y el brillo (0-100) de su elección. 
**Ninguna:** La luz retendrá su último estado. En caso de que haya habilitado la iluminación nocturna, después de finalizar la noche, la lámpara reanudará el estado de color/temperatura/brillo establecido durante el día. |
| Iluminación nocturna | Permite establecer un color/brillo de luz particular por la noche. Las opciones son las mismas que el día. Puede seleccionar una temperatura/brillo o color. Una temperatura acogedora de 2700 Kelvin, con un brillo del 10% o 20%, es una buena opción para la luz nocturna del baño. |
| Día/noche | Seleccione la dirección de grupo utilizada para establecer el comportamiento diurno/nocturno. El valor de la dirección de grupo es _true_ if Daytime, _false_ si nocturno. |
| Invertir valor día/noche | Invierta los valores de la dirección de grupo _day/noche_. El valor predeterminado está **sin control** . |
| Leer el estado al inicio | Lea el estado en el inicio y emita el evento al autobús KNX al inicio/reconexión. (Predeterminado "no") |
| Forzar el modo diurno | Puede forzar el modo diurno cambiando manualmente la luz como se describe aquí: **Cambie al modo de día apagando rápidamente la lighia y luego (solo esta luz) ** hace lo que describe y actúa solo en esta luz.**Cambie al modo diurno apagando rápidamente la lighia y luego (aplique todos los nodos de luz)** Actúa a todos los nodos de luz, configurando la dirección del grupo diurno/nocturno en el modo de día. |
| Pins de entrada/salida de nodo | Ocultar o mostrar los pines de entrada/salida. Los pines de entrada/salida permiten que el nodo acepte la entrada MSG del flujo y envíe la salida MSG al flujo. La entrada MSG debe seguir los estándares de HUE API v.2. Este es un mensaje de ejemplo, que enciende la luz: <code> msg.on = {"on": true} </code>. Consulte la [página oficial de la API de Hue](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put) |

### Nota

La función de atenuación funciona en el modo **KNX `Start` y`stop` ** . Para comenzar a atenuar, envíe solo un telegrama de "inicio" KNX. Para dejar de atenuar, envíe un telegrama de "parar" KNX.**Recuerde que** , cuando configura las propiedades de su pared Swiches.
