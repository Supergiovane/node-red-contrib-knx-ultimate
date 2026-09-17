---
layout: wiki
title: "DateTime-Configuration"
lang: es
permalink: /wiki/es-DateTime-Configuration
translation_key: "DateTime-Configuration"
---

> En la versión 8 usa **KNX Utility** y selecciona **DateTime**. Los ajustes siguientes describen esa función. El antiguo nodo separado ya no está incluido.
>
> [KNX Utility]({{ '/wiki/es-KNX-Utility' | relative_url }}) · [Actualizar desde la versión 7]({{ '/wiki/es-Migration-8' | relative_url }})


# Configuración Fecha/Hora

El nodo **KNX DateTime** escribe la fecha/hora actual en una o varias direcciones de grupo KNX.

Soporta:
- **DPT 19.001** (Fecha/Hora) – recomendado
- **DPT 11.001** (Fecha) – opcional
- **DPT 10.001** (Hora) – opcional

## Direcciones de grupo

|Propósito|Propiedad|DPT|
|--|--|--|
| Fecha/Hora | `GA Fecha/Hora` (`gaDateTime`) | `19.001` |
| Fecha | `GA Fecha` (`gaDate`) | `11.001` |
| Hora | `GA Hora` (`gaTime`) | `10.001` |

## Cuándo envía

- Al desplegar/iniciar (opcional, con retardo)
- Envío periódico (opcional, segundos/minutos)
- Con cada entrada (siempre)
- Botón en el editor (enviar ahora)

## Payload de entrada

Si `msg.payload` está vacío, el nodo envía la fecha/hora actual del sistema.

Soportado:
- `Date` (`new Date()`)
- timestamp (ms)
- string aceptado por `new Date("...")`
- `"now"`

## Salida del nodo

Se emite un mensaje por cada envío:
- `msg.payload`: la `Date` enviada
- `msg.sent`: array de `{ ga, dpt, name }`
- `msg.reason`: `input`, `startup`, `periodic` o `button`

## Auto-relleno (ETS)

Al añadir un nodo nuevo, puede seleccionar automáticamente el primer gateway KNX con importación ETS y rellenar GAs coherentes.

