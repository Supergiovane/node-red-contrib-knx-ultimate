---
layout: wiki
title: "KNX Multi Routing"
lang: en
permalink: /wiki/KNX%20Multi%20Routing
---
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-multi-routing-filter.svg" width="95%"><br/>

This node is used to **bridge multiple KNX Ultimate gateways** (multiple `knxUltimate-config`) using Node-RED wires.

It outputs **RAW telegram information** (APDU + cEMI hex + addresses) for every telegram received from the KNX bus of the selected gateway.
It can also accept those RAW telegram objects on its input and forward them to the selected gateway.

## Server KNX/IP mode
Set **Mode** to **Server KNX/IP** to start an embedded KNXnet/IP tunneling server (UDP). Incoming client telegrams are emitted as the same RAW format used by MultiRouting.
The node also accepts RAW telegram objects on its input and injects them to the connected tunneling client(s).

**Important (Advertise host):** KNXnet/IP clients will send data to the IP advertised by the server in the CONNECT_RESPONSE. If the client shows *connected* but the server receives no telegrams, set **Advertise host** to the server LAN IP reachable by the client (especially when running Node-RED in Docker/VM or on a multi-homed host).

## Output message format
`msg.payload` contains:
- `knx.event`: `GroupValue_Write` / `GroupValue_Response` / `GroupValue_Read`
- `knx.source`: physical address (e.g. `1.1.10`)
- `knx.destination`: group address (e.g. `0/0/1`)
- `knx.apdu.data`: raw APDU payload as `Buffer` (only for Write/Response)
- `knx.apdu.bitlength`: payload bit length (`<=6` means encoded in APCI low bits)
- `knx.cemi.hex`: full cEMI hex (ETS-like)
- `knx.echoed`: `true` if echoed by the gateway
- `knxMultiRouting.gateway`: gateway meta (`id`, `name`, `physAddr`)

## Routing counter (hop count)
MultiRouting can use the KNX routing counter (hop count) found in `knx.cemi.hex` to prevent telegram loops.
- **Respect routing counter (drop if 0)**: telegrams with routing counter `0` are not forwarded.
- **Decrement routing counter when routing**: the node decrements the routing counter while forwarding. If it reaches `0`, the telegram is dropped.

The current value is exposed as `knx.routingCounter` (and as `knx.cemi.hopCount` when `knx.cemi` is an object).

## Rewriting telegrams
If you rewrite `knx.source` / `knx.destination` in your flow, you must also keep `knx.cemi.hex` coherent. Recommended: place **KNX Router Filter** between MultiRouting nodes: it will keep `knx.cemi.hex` in sync when rewriting.

## Notes
- When forwarded to another gateway, the **source physical address will change** (it becomes the sender gateway address). Use `knx.source` and/or `knxMultiRouting.gateway` to filter loops.
- The option **Drop messages already tagged for this gateway** helps prevent simple loops when you connect multiple routers together.
