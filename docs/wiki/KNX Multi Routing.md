---
layout: wiki
title: "KNX Multi Routing"
lang: en
permalink: /wiki/KNX%20Multi%20Routing
---
This node is used to **bridge multiple KNX Ultimate gateways** (multiple `knxUltimate-config`) using Node-RED wires.

It outputs **RAW telegram information** (APDU + cEMI hex + addresses) for every telegram received from the KNX bus of the selected gateway.
It can also accept those RAW telegram objects on its input and forward them to the selected gateway.

## Server KNX/IP mode
Set **Mode** to **Server KNX/IP** to start an embedded KNXnet/IP tunneling server (UDP). Incoming client telegrams are emitted as the same RAW format used by MultiRouting.
The node also accepts RAW telegram objects on its input and injects them to the connected tunneling client(s).

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

## Notes
- When forwarded to another gateway, the **source physical address will change** (it becomes the sender gateway address). Use `knx.source` and/or `knxMultiRouting.gateway` to filter loops.
- The option **Drop messages already tagged for this gateway** helps prevent simple loops when you connect multiple routers together.
