---
layout: wiki
title: "zh-CN-HUE Tapdial"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Tapdial
---
---
**Hue Tap dial** El nodo mapea el servicio de rotación del dial TAP a KNX y envía el evento de Hue original al proceso de nodo-rojo.Después de combinar un nuevo dispositivo, haga clic en el icono de actualización junto al campo del dispositivo.
### Pestaña
- **Mapeo** - Seleccione la dirección del grupo KNX y el DPT correspondiente al evento de rotación, admitiendo DPT 3.007, 5.001, 232.600.
- **Comportamiento** - Controla si se muestra el pin de salida de nodo -rojo.Cuando la puerta de enlace KNX no está configurada, el PIN permanece habilitado para que los eventos continúen ingresando al proceso.
### Configuración general
| Propiedades | Descripción |
|-|-|
| KNX GW | KNX Gateway para la finalización automática de GA.|
| Puente Hue | Hue Bridge proporciona el puente Hue Tap Dial. |
| Dial de toque de tono |Dispositivo de la perilla (admite la finalización automática; el botón de actualización para volver a realizar la lista).|
Pestaña de mapeo ###
| Propiedades | Descripción |
|-|-|
| Ga giratoria | Dirección de grupo KNX que recibe eventos de rotación (admite DPT 3.007, 5.001, 232.600). |
| Nombre | Descripción Nombre de GA. |
### Producción
|#|Puerto | carga útil |
|-|-|-|-|
|1 | Salida estándar | `Msg.payload` (Object) Evento de tono original generado por Tap Dial. |
> ℹ️ Los controles relacionados con KNX se mostrarán solo después de seleccionar la puerta de enlace KNX;La pestaña de mapeo permanecerá oculta hasta que se configuren tanto el puente de tono como la puerta de enlace KNX.
