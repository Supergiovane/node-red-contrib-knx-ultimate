---
layout: wiki
title: "zh-CN-HUE Device software update"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Device%20software%20update/
---
---
<P> Este nodo monitorea el estado de actualización de software del dispositivo HUE y lo publica a KNX.</p>
Comience a escribir el nombre o la dirección de grupo del dispositivo KNX en el campo GA, y los dispositivos disponibles comienzan a mostrar
Estás escribiendo.
**General**
| Propiedades | Descripción |
|-|-|
| KNX GW | Seleccione el portal KNX para usar |
| Puente Hua | Seleccione el puente de tono para usar |
| Dispositivo de tono | Dispositivo HUE a ser monitoreado (Autocompleto) |
**Cartografía**
| Propiedades | Descripción |
|-|-|
| Estado | Dirección de grupo KNX para actualizaciones de software: _true_ disponible/preparación/instalación, de lo contrario _false_ |
| Leer el estado al inicio | Lea y publique en KNX durante el inicio/reconexión (predeterminado "sí") |
### Producción
1. Salida estándar
: carga útil (boolean): indicador de actualización.
: status (string): **no \ _Update, actualizar \ _pending, listo \ _to \ _install, instalación** .
