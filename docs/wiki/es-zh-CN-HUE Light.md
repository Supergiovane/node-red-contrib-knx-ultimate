---
layout: wiki
title: "zh-CN-HUE Light"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Light
---
---
<p> Este nodo le permite controlar las luces de tono de Philips y las luces agrupadas, y también enviar el estado de esta luz al bus KNX.</p>
**General**
| Propiedades | Descripción |
|-|-|
| KNX GW | Seleccione el portal KNX para usar |
| Puente Hua | Seleccione el puente de tono para usar |
| Nombre | Lámpara de tono o luz agrupada por Hue.Las luces y los grupos que están disponibles cuando escriben comienzan a aparecer. |
<br/>
**Opciones**
Aquí puede seleccionar la dirección KNX que desea vincular a las luces/estado de tono disponibles.<br/>
Comience a ingresar el campo GA, el nombre o la dirección de grupo del dispositivo KNX, y el dispositivo disponible comienza a mostrar al ingresar.
**cambiar**
| Propiedades | Descripción |
|-|-|
| Control | Este GA se usa para encender/apagar la luz de tono por el valor booleano de KNX de True/False |
| Estado | Enlace a la dirección de grupo de estado Switch de la luz |
<br/>
**oscuro**
| Propiedades | Descripción |
|-|-|
| Control Dim | Atenuación relativamente oscura.Puede establecer la velocidad de atenuación en la pestaña \*\* _Behavior_ **.|
| Control %| Cambia el brillo del tono absoluto (0-100 %) |
| Estado %| Vincularlo al estado de brillo de la luz KNX Group Dirección |
| Velocidad oscura (MS) | Pequeña velocidad en milisegundos.Esto funciona para ** Light ** , y también para**Puntos de datos programados de White \*\*ajustable.Se calcula de 0% a 100%.|
| El último brillo tenue | El brillo más bajo que la luz puede lograr.Por ejemplo, si desea bajar la luz, la luz deja de atenuar en el %de brillo especificado.|
| Brillo tenue máximo | Brillo máximo que la lámpara puede lograr.Por ejemplo, si desea ajustar la luz, la luz dejará de atenuar en el % especificado del brillo.|
<br/>
**Blanco ajustable**
| Propiedades | Descripción |
|-|-|
| Control Dim | Use DPT 3.007 atenuación para cambiar la temperatura blanca de la lámpara de tono.Puede establecer la velocidad de atenuación en la pestaña \*\* _Behavior_ \*\*. |
| Control % | Use DPT 5.001 para cambiar la temperatura de color blanco; 0 es cálido, 100 es frío |
| Estado % | Dirección de grupo de estado de temperatura de color de luz blanca (DPT 5.001; 0 = cálido, 100 = frío) |
| Control Kelvin | **DPT 7.600: ** Establecido por KNX Range 2000-6535 K (convertir a Hue Mirek).<br/>**DPT 9.002:** Establecido por Hue Range 2000-6535 K (el ambiente comienza desde 2200 K).La conversión puede conducir a ligeras desviaciones |
| Estado Kelvin | **DPT 7.600: ** Lea Kelvin (KNX 2000-6535, conversión).<br/>**DPT 9.002:** Leer el rango de tono 2000-6535 K; La conversión puede tener ligeras desviaciones |
| Revertir la dirección tenue | Invierta la dirección tenue.|
<br/>
\*\*Rgb/hsv \*\*
| Propiedades | Descripción |
|-|-|
| **Parte RGB** ||
| Control rgb | Use RGB Triples (R, G, B) para cambiar el color, incluida la corrección de gama de color. Enviar color se iluminará y establecerá color/brillo;R, G, B = 0 Apague la luz |
| Estado RGB | Dirección de grupo de estado de color de luz.Los puntos de datos aceptados son trillizos RGB (R, G, B) |
| **Parte de HSV** ||
| Color H Dimming | Bucle en el bucle HSV Hue usando DPT 3.007; Velocidad en **Comportamiento** Configuración |
| Estado H%| Estado del círculo de color HSV. |
| Control s atenuado |Use DPT 3.007 para cambiar la saturación; Velocidad en **Comportamiento** Configuración |
| Estado S% | Dirección de grupo estatal saturado de luz. |
| Velocidad oscura (MS) |Velocidad en miniatura desde el fondo hasta la escala más alta en milisegundos.|
Consejo: Para la "V" (brillo) del HSV, utilice los controles estándar de la pestaña **Dim** .
<br/>
**Efecto**
_Non-Hue Efectos básicos_
| Propiedades | Descripción |
|-|-|
| Blink | _true_ flashea la luz, _false_ deja de flashear. Interruptores alternativos, adecuados para indicaciones.Admite todas las luces de tono.|
|Color Loop | _true_ inicia el bucle, _false_ detiene el bucle.Cambie el color al azar a intervalos fijos, solo para luces de tono que admiten la luz de color.El efecto comienza unos 10 segundos después de emitir el comando.|
_Hue Effect nativo_
En la tabla **Hue Native Effects** , asigne el valor de KNX a los efectos respaldados por el accesorio (por ejemplo, `vela ',` chimenea`, `prism`).Cada línea asocia un valor KNX (booleano, numérico o texto, dependiendo del punto de datos seleccionado) con un efecto devuelto por el puente.Esto lo hará:
- Enviar valores de KNX asignados para activar el efecto correspondiente;
- (Opcional) Configure una dirección de grupo de estado: Cuando el puente de Hue informa el cambio de efecto, el nodo vuelve a escribir el valor del mapa;Si no se encuentra ningún mapa, se envía el nombre del efecto original (se requiere la clase de texto DPT, por ejemplo 16.xxx).
<br/>
**Comportamiento**
| Propiedades | Descripción |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- --------------------------------------------------------------------------------------------------- |
| Lea el estado al inicio | Lea el estado de luz del tono en el inicio de nodo-rojo o la implementación completa de nodo-rojo y luego envíe ese estado al bus KNX |
| Estado de brillo KNX | Cada vez que se enciende/apagan la luz de tono, se actualiza el estado de la dirección del grupo de brillo KNX. La opción es **Enviar 0% cuando el tono está apagado. Cuando se enciende el tono, restaure los valores anteriores (comportamiento de KNX predeterminado) y ** * como es (comportamiento de tono predeterminado)**. Si tiene un atenuador KNX con estado de brillo, como MDT, la opción recomendada es \*\*\*, y cuando la luz del tono está apagada, envíe 0%. Cuando el tono se enciende, restaure el valor anterior (comportamiento predeterminado KNX) \*\*\*|
| Comportamiento abierto | Cuando está encendido, establece el comportamiento de la luz. Puedes elegir entre diferentes comportamientos. <br/> \*\*Seleccionar color: \*\*La luz se encenderá utilizando el color que seleccionó.Para cambiar el color, simplemente haga clic en el selector de color (hecho en "Seleccione la belleza". <br/> \*\*Seleccione la temperatura y el brillo: ** La temperatura (Kelvin) y el brillo (0-100) que seleccionó encenderá la luz. <br/> Ninguno:** Ninguno: Si habilita la iluminación nocturna, después de la noche, la luz volverá a la estadística de color/temperatura/brillo establecida durante el día. |
| Iluminación nocturna | Permite que los colores/brillo luminosos específicos se establecen por la noche. Las opciones son las mismas que durante el día. Puede elegir temperatura/brillo o color. La temperatura cómoda es de 2700 Kelvin y el brillo es del 10% o 20%, lo que lo convierte en una buena opción para las luces nocturnas del baño. |
| Día/noche | Seleccione la dirección de grupo para establecer el comportamiento de día/noche. El valor de la dirección de grupo es \ _true \ _if Daytime, \ _false \ _if Nighttime. |
| Doble el día/valor nocturno | Invertir el valor del día/noche \ _ Dirección del grupo.Valor predeterminado** no seleccionado. |
| Lea el estado del inicio |Lea el estado al inicio y transmita los eventos al bus KNX en Startup/Reconex.(Predeterminado "no") |
|Modo nocturno de portada |Puede sobrescribir el modo de noche cambiando manualmente las luces descritas aquí: \*\*al modo de día apagando rápidamente la lighia y luego (solo esta luz) (solo esta luz) \*\*HAGA LA ACCIÓN DESCRIBA Y SOLO FUNCIONA EN ESTA LA LUZ para cambiar al modo de día.\*\*Cambia al modo diario cerrando rápidamente la lighia y luego enciende (aplicando todos los nodos de luz).|
| PIN de entrada/salida de nodo | Ocultar o mostrar el pin de entrada/salida.El pin de entrada/salida permite que el nodo acepte la entrada de tráfico y envíe la salida de MSG al tráfico.El MSG de entrada debe cumplir con el estándar HUE API v.2.Aquí hay un mensaje de muestra que enciende la luz: <code> msg.on = {"on": true} </code>.Ver \ [Página de API de Hue oficial](§URL0§) |
### Notas
La función de atenuación funciona en \*\*KNX MODE \ `Start \` \ `'' '' y ST OFF ' **.Para comenzar a atenuar, solo envíe un telegrama KNX "Inicio".Para dejar de atenuar, envíe un telegrama de "parar" KNX.Por favor** Recuerde \*\*, cuando configure la pared, recuerde.
<br/>
<br/>
