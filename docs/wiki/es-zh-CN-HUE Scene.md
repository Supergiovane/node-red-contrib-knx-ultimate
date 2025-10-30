---
layout: wiki
title: "zh-CN-HUE Scene"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Scene
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Scene) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Scene) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Scene) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Scene) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Scene) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Scene)
---
La **Hue Scene** Node publica la escena del tono a KNX y puede enviar los eventos originales de Hue al proceso de nodo-rojo. Los campos de escena admiten la finalización automática;Después de agregar nuevas escenas al puente, haga clic en el icono de actualización para actualizar la lista.
### Descripción general de la pestaña
- **Mapeo** - Asocie la dirección del grupo KNX con la escena del tono seleccionada.DPT 1.xxx se usa para el control booleano, y DPT 18.xxx se usa para enviar números de escena KNX.
- **Múltiples escenarios** - Cree una lista de reglas, asigne diferentes números de escena KNX a escenas de Hue y seleccione el método de llamadas de _Active_ / _Dynamic \ _palette_ / _static_.
- **Comportamiento** - Controla si se muestra el pin de salida de nodo -rojo.Cuando la puerta de enlace KNX no está configurada, el PIN permanece habilitado para que el evento del puente continúe ingresando al proceso.
### Configuración general
| Propiedades | Descripción |
|-|-|
| KNX GW | Una puerta de enlace KNX que proporciona directorio de direcciones de finalización automática.|
| Puente Hue | Hue Bridge que alberga la escena. |
| Escena de tono |La escena a llamar (se admite el botón de actualización; el botón de actualización recuperará la lista).|
Pestaña de mapeo ###
| Propiedades | Descripción |
|-|-|
| RECUERDO GA | Llame a la dirección del grupo KNX de la escena.Use DPT 1.xxx para enviar un valor booleano, o use DPT 18.xxx para enviar un número de escena KNX.|
| DPT | El tipo de punto de datos utilizado con un GA de recuperación (1.xxx o 18.001).|
| Nombre | Nombre de la instrucción para recordar GA.|
| # | Se muestra cuando se selecciona el DPT de la escena KNX, se usa para seleccionar el número de escena para enviar.|
| Estado GA | GA booleano opcional a los comentarios si la escena está activa.|
### Pestaña Multi-Scene
| Propiedades | Descripción |
|-|-|
| RECUERDO GA | Use el GA de DPT 18.001 para seleccionar una escena por número de escena KNX. |
| Lista de escenas |Lista editable para corresponder al número de escena KNX en la escena del tono y su modo de llamada.Arrastre las barras para reordenar.|
> ℹ️ Los controles relacionados con KNX se mostrarán solo después de seleccionar la puerta de enlace KNX; La pestaña de mapeo permanecerá oculta hasta que se configuren tanto el puente de tono como la puerta de enlace KNX.
