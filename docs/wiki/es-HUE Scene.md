---
layout: wiki
title: "HUE Scene"
lang: es
permalink: /wiki/es-HUE%20Scene
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Scene) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Scene) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Scene) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Scene) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Scene) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Scene)

La escena **Hue** nodo expone escenas de tono a KNX y puede reenviar los eventos de tono bruto a un flujo de rojo de nodo.El campo de la escena admite autocompletar;Use el icono de actualización después de agregar escenas en el puente para que la lista se mantenga actualizada.

### pestañas de un vistazo

- **Mapeo** - Enlace las direcciones de grupo KNX a la escena del tono seleccionada.DPT 1.xxx realiza un retiro booleano, mientras que DPT 18.xxx envía un número de escena KNX.
- **Multi Scene** - Cree una lista de reglas que asocie los números de escena KNX con diferentes escenas de tono y elige si cada escena se recuerda como _Active_, _Dynamic \ _palette_ o _static_.
- **Comportamiento** - Alternar el pin de salida de nodo -rojo.Cuando no se configura la puerta de enlace KNX, el PIN permanece habilitado para que los eventos del puente aún alcancen el flujo.

### Configuración general

| Propiedad | Descripción |
|-|-|
|KNX GW |KNX Gateway que suministra el catálogo de direcciones utilizado para autocompletar.|
|Puente Hue |Puente de Hue que alberga las escenas.|
|Escena de tono |Escena para recuperar (Autocompletar; Refresh Button Recargue el catálogo del puente).|

Pestaña de mapeo ###

| Propiedad | Descripción |
|-|-|
|RECUERDO GA |Dirección del grupo KNX que recuerda la escena.Use DPT 1.xxx para el control booleano o DPT 18.xxx para transmitir un número de escena KNX.|
|DPT |DataPoint utilizado con el GA de recuperación (1.xxx o 18.001).|
|Nombre |Etiqueta amistosa para el retiro GA.|
|# |Aparece cuando se elige una escena KNX DPT;Seleccione el número de escena KNX para enviar.|
|Estado GA |GA booleano opcional que refleja si la escena está actualmente activa.|

### Pestaña de escena múltiple

| Propiedad | Descripción |
|-|-|
|RECUERDO GA |KNX GA (DPT 18.001) que selecciona escenas por número.|
|Selector de escenas |Lista editable que mapea los números de escena KNX a las escenas de Hue con el modo de recuperación deseado.Arrastres maneja entradas de reorden.|

> ℹ️ Los widgets específicos de KNX solo aparecen después de que se selecciona una puerta de enlace KNX.Las pestañas de mapeo permanecen ocultas hasta que se configuran tanto el puente como la puerta de enlace.
