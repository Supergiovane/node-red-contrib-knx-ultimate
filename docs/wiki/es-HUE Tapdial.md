---
layout: wiki
title: "HUE Tapdial"
lang: es
permalink: /wiki/es-HUE%20Tapdial/
---
El nodo **TAP TAP** mapea el servicio rotativo del dial de toque de tono a KNX y reenvía los eventos de tono bruto a su flujo.Use el icono de actualización junto al campo del dispositivo después de combinar un nuevo dial en el puente.

Pestañas ###

- **Mapeo** - Seleccione KNX GA y DPT utilizados para los eventos de rotación.Puntos de datos compatibles: DPT 3.007 (DIM relativo), DPT 5.001 (nivel absoluto 0‑100%) y DPT 232.600 (control de color del proveedor).
- **Comportamiento** - Mostrar u ocultar el pin de salida de nodo -rojo.Cuando no se configura la puerta de enlace KNX, la salida se mantiene habilitada para que los eventos de tono aún alcancen el flujo.

### Configuración general

| Propiedad | Descripción |
|-|-|
|KNX GW |KNX Gateway utilizada para GA Autocomplete.|
|Puente Hue |Hue Bridge aloja el dial de grifo.|
|Dial de toque de tono |Dispositivo rotativo para controlar (automáticamente; el botón de actualización vuelve a cargar la lista).|

Pestaña de mapeo ###

| Propiedad | Descripción |
|-|-|
|Rotar GA |KNX GA recibe eventos de rotación (admite DPT 3.007, 5.001, 232.600).|
|Nombre |Etiqueta amistosa para la GA.|

### salidas

|#| Puerto | carga útil |
|-|-|-|
| 1 | Salida estándar | `msg.payload` (objeto) Evento de tono sin procesar emitido por el dial de toque. |

> ℹ️ Los widgets específicos de KNX aparecen solo después de seleccionar una puerta de enlace KNX;La pestaña de mapeo permanece oculta hasta que se configuran tanto el puente como la puerta de enlace.
