---
layout: wiki
title: "KNX Multi Routing"
lang: es
permalink: /wiki/es-KNX%20Multi%20Routing
---
Este nodo se utiliza para **interconectar varios gateways KNX Ultimate** (varios `knxUltimate-config`) mediante cables de Node-RED.

En la salida emite un objeto con información **RAW del telegrama** (APDU + cEMI en hex + direcciones) para cada telegrama recibido del bus KNX del gateway seleccionado.
En la entrada puede recibir esos mismos objetos RAW y reenviarlos al bus KNX del gateway seleccionado.

## Modo servidor KNX/IP
Establece **Modo** en **Server KNX/IP** para iniciar un servidor KNXnet/IP tunneling (UDP) integrado. Los telegramas recibidos de los clientes se emiten en el mismo formato RAW.
El nodo también acepta objetos RAW en la entrada y los inyecta hacia los clientes tunneling conectados.

## Formato del mensaje de salida
`msg.payload` contiene:
- `knx.event`: `GroupValue_Write` / `GroupValue_Response` / `GroupValue_Read`
- `knx.source`: dirección física (p. ej. `1.1.10`)
- `knx.destination`: dirección de grupo (p. ej. `0/0/1`)
- `knx.apdu.data`: payload APDU como `Buffer` (solo para Write/Response)
- `knx.apdu.bitlength`: longitud en bits (`<=6` significa codificado en los bits bajos del APCI)
- `knx.cemi.hex`: cEMI completo en hex (estilo ETS)
- `knx.echoed`: `true` si el gateway lo ha “echoed”
- `knxMultiRouting.gateway`: metadatos del gateway (`id`, `name`, `physAddr`)

## Notas
- Al reenviar a otro gateway, la **dirección física de origen cambia** (pasa a ser la del gateway que envía). Usa `knx.source` y/o `knxMultiRouting.gateway` para filtrar bucles.
- La opción **“Drop messages already tagged for this gateway”** ayuda a prevenir bucles simples cuando conectas varios routers entre sí.
