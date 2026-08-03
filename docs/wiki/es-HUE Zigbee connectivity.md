---
layout: wiki
title: "HUE Zigbee connectivity"
lang: es
permalink: /wiki/es-HUE%20Zigbee%20connectivity
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón de migración naranja de alto contraste con texto blanco convierte localmente todos los nodos HUE legacy; después solo abre un borrador de correo editable. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK y ofrece un botón de apoyo opcional; la página de donación solo se abre al pulsarlo. Antes de empezar, [mira el vídeo explicativo en YouTube](https://youtu.be/f0Evf2QFI7c).

Este nodo recupera el estado de conectividad Zigbee de un dispositivo de tono y lo expone a KNX. 

Comience a escribir el nombre del dispositivo KNX o la dirección de grupo en el campo GA;Aparecen sugerencias mientras escribe.

**General**

| Propiedad | Descripción |
|-|-|
|KNX GW |KNX Gateway solía publicar el estado.|
|Hue Bridge |Hue Bridge para la consulta.|
|Conectividad de tono zigbee |Sensor/dispositivo de tono que proporciona la información de conectividad Zigbee.Autocompletar mientras se escribe.|

**Cartografía**

| Propiedad | Descripción |
|-|-|
|Estado |Dirección de grupo KNX que refleja la conectividad Zigbee.Se convierte en _true_ cuando está conectado, de lo contrario _false_.|
|Leer el estado al inicio |Lee el estado actual en el editor inicial/reconexión y emite a KNX.Valor predeterminado: "Sí".|

### salidas

1. Salida estándar
: carga útil (boolean): estado de conectividad.

### Detalles

`msg.payload` lleva el estado booleano (verdadero/falso). \
`msg.status` contiene un estado textual: uno de **conectado, desconectado, conectividad \ _SISMO, unidireccional \ _Incoming** .
