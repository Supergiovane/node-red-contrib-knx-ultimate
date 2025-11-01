---
layout: wiki
title: "HUE Plug"
lang: es
permalink: /wiki/es-HUE%20Plug/
---
# Enchufe / salida de tono

## Descripción general

El nodo de enchufe de Hue enlaza un enchufe inteligente Philips Hue (servicio `plug``) con direcciones de grupo KNX para que pueda controlar la alimentación y rastrear el estado directamente desde el bus.

- Admite **Control de encendido/apagado ** y**Comentarios de estado** .
- Mapeo opcional del tono `power_state` (en / en espera).
- Puede exponer los pines de entrada/salida de Node-Red para reenviar eventos de HUE a flujos o enviar cargas útiles de API avanzadas.

## Configuración

| Campo | Descripción |
|-|-|
|KNX GW |KNX Gateway utilizado para telegramas |
|Puente Hue |Puente de tono configurado |
|Nombre |Seleccione el enchufe de tono de la lista de autocompletar |
|Control |KNX GA para comandos de encendido/apagado (DPT booleano) |
|Estado |GA para la retroalimentación de encendido/apagado proveniente de Hue |
|Estado de poder |Hue opcional GA de reflejo `power_state` (boolean/text) |
|Leer el estado al inicio |Cuando está habilitado, el nodo emite el estado de enchufe actual en la implementación/conexión |
|Pins de E/S de nodo |Habilite los pasadores de entrada/salida de nodo-rojo.La entrada espera cargas útiles de API de tono (por ejemplo, `{en: {on: true}}`).Salir reenvía cada evento de Hue.|

## consejos de mapeo KNX

- Use un punto de datos booleano (por ejemplo, DPT 1.001) para el comando y el estado.
- Si expone `power_state`, asigna a un ga booleano (true =` on`, false = `en espera`).
- Para solicitudes de lectura (`groupValue_read`) El nodo devuelve el último valor de tono en caché.

## Integración de flujo

Cuando _node I/o Pins_ están habilitados:

- **Entrada:** Enviar cargas útiles de Hue V2 para realizar acciones avanzadas (por ejemplo, `msg.on = {on: true}`).
- **Salida:** Recibe un objeto de evento `{carga útil: boolean, on, power_state, rawevent}` cada vez que Hue informa un cambio.

## Referencia de API de Hue

El nodo usa `/recurse/plug/{id}` sobre https.Los cambios de estado se entregan a través de la transmisión de eventos HUE y se almacenan en caché para las respuestas de lectura de KNX.
