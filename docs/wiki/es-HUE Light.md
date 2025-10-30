🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Light) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Light) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Light) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Light) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
---
<p> Este nodo controla las luces de Hue Philips (single o agrupada) y mapea sus comandos/estados a KNX. </p>
**General**
| Propiedad | Descripción |
|-|-|
| KNX GW | Seleccione la puerta de enlace KNX para ser utilizada |
| Puente Hue | Seleccione el puente de tono que se utilizará |
| Nombre | Luz de tono o luz agrupada para usar (autocompletar mientras escribe). |
<br/>
**Localizar dispositivo**
El botón `Locate` (icono de reproducción) inicia una sesión de identificación Hue para el recurso seleccionado. Mientras la sesión está activa, el botón muestra el icono de parada y el bridge hace parpadear la luz — o todas las luces del grupo — cada segundo. Pulsa de nuevo el botón para detenerla al instante; en caso contrario finalizará automáticamente tras 10 minutos.
<br/>
**Opciones**
Aquí puede vincular las direcciones del grupo KNX con los comandos/estados de tono disponibles. <br/>
Comenzar a escribir en el campo GA (nombre o dirección de grupo); Aparecen sugerencias mientras escribe.
**Cambiar**
| Propiedad | Descripción |
|-|-|
| Control | Este GA se usa para encender/apagar la luz del tono a través de un valor booleano KNX verdadero/falso |
| Estado | Enlace esto a la dirección de grupo de estado del interruptor de la luz |
<br/>
**Oscuro**
| Propiedad | Descripción |
|-|-|
| Control Dim | Relativo tenue de la luz del tono. Puede establecer la velocidad de atenuación en la pestaña **Comportamiento** . |
| Control % | Cambia el brillo de la luz del tono absoluto (0-100%) |
| Estado % | Enlace esto al estado de brillo de la luz Dirección de grupo KNX |
| Velocidad dim (MS) | Velocidad de atenuación en milisegundos. Se aplica tanto al brillo de la luz como a los puntos de datos de color blanco sintonizable. Calculado sobre el rango 0% → 100%. |
| Min Dim brillo | El brillo mínimo que la lámpara puede alcanzar. Por ejemplo, si está atenuando la luz hacia abajo, la luz dejará de atenuar en el %de brillo especificado. |
| Brillo dim en el máximo | El brillo máximo que la lámpara puede alcanzar. Por ejemplo, si está atenuando la iluminación, la luz dejará de atenuar en el %de brillo especificado. |
<br/>
**blanco sintonizable**
| Propiedad | Descripción |
|-|-|
| Control Dim | Cambie la temperatura blanca usando DPT 3.007 atenuación. La velocidad se establece en la pestaña **comportamiento** . |
| Control % | Cambie la temperatura blanca usando DPT 5.001. 0 = completo cálido, 100 = frío completo. |
| Estado %| Estado de temperatura GA. DPT 5.001 Valor absoluto: 0 = completo cálido, 100 = frío completo. |
| Control Kelvin | **DPT 7.600: ** Temperatura establecida en Kelvin usando el rango KNX 2000-6535 (convertido en Hue Mirek). <br/>**DPT 9.002:** Temperatura establecida usando el rango de Hue 2000-6535 K (la ambiente comienza a 2200 K). Las conversiones pueden introducir pequeñas desviaciones. |
| Estado Kelvin | **DPT 7.600: ** Lea la temperatura en Kelvin usando el rango KNX 2000-6535 (convertido desde el tono). <br/>**DPT 9.002:** Temperatura de lectura usando el rango de Hue 2000-6535 K (la ambiente comienza en 2200 K). Las conversiones pueden introducir pequeñas desviaciones. |
| Invertir la dirección tenue | Invierte la dirección tenue. |
<br/>
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
<br/>
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
<br/>
**Comportamiento**
| Propiedad | Descripción |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------- |
| Leer el estado al inicio | Lea el estado de la luz del tono en la inicio de nodo-rojo o el despliegue completo de Node-Red, y envíe ese estado al bus KNX |
| Estado de brillo KNX | Actualiza el estado de la dirección del grupo de brillo KNX, siempre que la lámpara de tono se encienda/apague. Las opciones son **cuando la luz del tono está apagada, envíe 0%. Cuando se enciende, restaure el valor anterior (comportamiento de KNX predeterminado) ** y**dejar como es (comportamiento de tono predeterminado) ** . Si tiene KNX Dimmer con estado de brillo, como MDT, la opción sugerida es _**cuando la luz del tono está apagada, envíe 0%. Cuando se enciende, restaure el valor anterior (comportamiento predeterminado KNX)** _ |
| Encender el comportamiento | Establece el comportamiento de sus luces cuando se enciende. Puede elegir entre diferentes comportamientos. <br/> **Seleccione Color: ** La luz se encenderá con el color de su elección. Para cambiar el color, simplemente haga clic en el selector de color (debajo del control de color_select). <br/>**Seleccione la temperatura y el brillo: ** La luz se encenderá con la temperatura (Kelvin) y el brillo (0-100) de su elección. <br/>**Ninguna:** La luz retendrá su último estado. En caso de que haya habilitado la iluminación nocturna, después de finalizar la noche, la lámpara reanudará el estado de color/temperatura/brillo establecido durante el día. |
| Iluminación nocturna | Permite establecer un color/brillo de luz particular por la noche. Las opciones son las mismas que el día. Puede seleccionar una temperatura/brillo o color. Una temperatura acogedora de 2700 Kelvin, con un brillo del 10% o 20%, es una buena opción para la luz nocturna del baño. |
| Día/noche | Seleccione la dirección de grupo utilizada para establecer el comportamiento diurno/nocturno. El valor de la dirección de grupo es _true_ if Daytime, _false_ si nocturno. |
| Invertir valor día/noche | Invierta los valores de la dirección de grupo _day/noche_. El valor predeterminado está **sin control** . |
| Leer el estado al inicio | Lea el estado en el inicio y emita el evento al autobús KNX al inicio/reconexión. (Predeterminado "no") |
| Forzar el modo diurno | Puede forzar el modo diurno cambiando manualmente la luz como se describe aquí: **Cambie al modo de día apagando rápidamente la lighia y luego (solo esta luz) ** hace lo que describe y actúa solo en esta luz.**Cambie al modo diurno apagando rápidamente la lighia y luego (aplique todos los nodos de luz)** Actúa a todos los nodos de luz, configurando la dirección del grupo diurno/nocturno en el modo de día. |
| Pins de entrada/salida de nodo | Ocultar o mostrar los pines de entrada/salida. Los pines de entrada/salida permiten que el nodo acepte la entrada MSG del flujo y envíe la salida MSG al flujo. La entrada MSG debe seguir los estándares de HUE API v.2. Este es un mensaje de ejemplo, que enciende la luz: <code> msg.on = {"on": true} </code>. Consulte la [página oficial de la API de Hue](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put) |
### Nota
La función de atenuación funciona en el modo **KNX `Start` y`stop` ** . Para comenzar a atenuar, envíe solo un telegrama de "inicio" KNX. Para dejar de atenuar, envíe un telegrama de "parar" KNX.**Recuerde que** , cuando configura las propiedades de su pared Swiches.
<br/>
