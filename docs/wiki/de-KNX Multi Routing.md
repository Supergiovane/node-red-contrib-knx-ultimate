---
layout: wiki
title: "KNX Multi Routing"
lang: de
permalink: /wiki/de-KNX%20Multi%20Routing
---
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-multi-routing-filter.svg" width="95%"><br/>

Dieser Node dient dazu, **mehrere KNX-Ultimate-Gateways** (mehrere `knxUltimate-config`) über Node-RED Verbindungen zu koppeln.

Er gibt für jedes Telegramm vom KNX-Bus des ausgewählten Gateways ein Objekt mit **RAW-Telegramm-Informationen** (APDU + cEMI-Hex + Adressen) aus.
Außerdem kann er die gleichen RAW-Objekte am Eingang annehmen und an das ausgewählte Gateway weiterleiten.

## Server KNX/IP Modus
Setze **Modus** auf **Server KNX/IP**, um einen eingebetteten KNXnet/IP-Tunneling-Server (UDP) zu starten. Eingehende Client-Telegramme werden im gleichen RAW-Format ausgegeben.
Der Node akzeptiert außerdem RAW-Telegramm-Objekte am Eingang und injiziert sie an die verbundenen Tunneling-Clients.

**Wichtig (Advertise host):** KNXnet/IP-Clients senden die Daten an die IP, die der Server in der CONNECT_RESPONSE ankündigt. Wenn der Client als *connected* angezeigt wird, der Server aber keine Telegramme empfängt, setze **Advertise host** auf die LAN-IP des Servers, die vom Client erreichbar ist (insbesondere bei Docker/VM oder Multi-Homing).

## Output-Nachrichtenformat
`msg.payload` enthält:
- `knx.event`: `GroupValue_Write` / `GroupValue_Response` / `GroupValue_Read`
- `knx.source`: physikalische Adresse (z. B. `1.1.10`)
- `knx.destination`: Gruppenadresse (z. B. `0/0/1`)
- `knx.apdu.data`: APDU-Payload als `Buffer` (nur bei Write/Response)
- `knx.apdu.bitlength`: Bitlänge (`<=6` bedeutet im APCI niedrig kodiert)
- `knx.cemi.hex`: vollständiges cEMI in Hex (ETS-ähnlich)
- `knx.echoed`: `true`, wenn vom Gateway „echoed“
- `knxMultiRouting.gateway`: Gateway-Metadaten (`id`, `name`, `physAddr`)

## Routing counter (hop count)
MultiRouting kann den KNX Routing Counter (Hop Count) aus `knx.cemi.hex` nutzen, um Telegramm-Loops zu verhindern.
- **Respect routing counter (drop if 0)**: Telegramme mit Routing Counter `0` werden nicht weitergeleitet.
- **Decrement routing counter when routing**: Der Node dekrementiert den Routing Counter beim Weiterleiten. Erreicht er `0`, wird das Telegramm verworfen.

Der aktuelle Wert steht in `knx.routingCounter` (und in `knx.cemi.hopCount`, wenn `knx.cemi` ein Objekt ist).

## Telegramme umschreiben
Wenn du `knx.source` / `knx.destination` im Flow umschreibst, musst du auch `knx.cemi.hex` konsistent halten. Empfehlung: setze **KNX Router Filter** zwischen MultiRouting-Nodes; er hält `knx.cemi.hex` beim Umschreiben automatisch konsistent.

## Hinweise
- Beim Weiterleiten an ein anderes Gateway **ändert sich die Source-PA** (es wird die phys. Adresse des sendenden Gateways). Nutze `knx.source` und/oder `knxMultiRouting.gateway`, um Loops zu filtern.
- Die Option **„Drop messages already tagged for this gateway“** hilft, einfache Loops zu verhindern, wenn mehrere Router miteinander verbunden sind.
