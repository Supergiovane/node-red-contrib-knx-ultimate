---
layout: wiki
title: "KNX Multi Routing"
lang: de
permalink: /wiki/de-KNX%20Multi%20Routing
---
Dieser Node dient dazu, **mehrere KNX-Ultimate-Gateways** (mehrere `knxUltimate-config`) über Node-RED Verbindungen zu koppeln.

Er gibt für jedes Telegramm vom KNX-Bus des ausgewählten Gateways ein Objekt mit **RAW-Telegramm-Informationen** (APDU + cEMI-Hex + Adressen) aus.
Außerdem kann er die gleichen RAW-Objekte am Eingang annehmen und an das ausgewählte Gateway weiterleiten.

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

## Hinweise
- Beim Weiterleiten an ein anderes Gateway **ändert sich die Source-PA** (es wird die phys. Adresse des sendenden Gateways). Nutze `knx.source` und/oder `knxMultiRouting.gateway`, um Loops zu filtern.
- Die Option **„Drop messages already tagged for this gateway“** hilft, einfache Loops zu verhindern, wenn mehrere Router miteinander verbunden sind.
