---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: en
permalink: /wiki/IoT-Bridge-Configuration/
---
---
# KNX ↔ IoT Bridge
The bridge normalises KNX telegrams into structured messages that can be consumed by IoT transports (MQTT, REST, Modbus) and accepts flow inputs to write back to the KNX bus. It mirrors the runtime logic of the Node-RED editor help and shows how to hook the node to third-party connectors.
## Mapping recap
| Field | Purpose | Notes |
| -- | -- | -- |
| **Label** | Friendly name | Used in the status text and `msg.bridge.label`. |
| **GA / DPT** | KNX group address and datapoint | Set via ETS CSV autocomplete or manually. |
| **Direction** | KNX→IoT, IoT→KNX, Bidirectional | Determines which pins are active. |
| **Channel type** | MQTT / REST / Modbus | Changes the meaning of `Target`. |
| **Target** | Topic, base URL or register address | Leave empty to fall back to the node `outputtopic`. |
| **Template** | String payload formatter | Use placeholders `{{value}}`, `{{ga}}`, `{{type}}`, `{{target}}`, `{{label}}`, `{{isoTimestamp}}`. |
| **Scale / Offset** | Numeric conversion | Applied KNX→IoT; inverse is used IoT→KNX. |
| **Timeout / Retry** | Pass-through hints | Convey the desired retry/window to downstream nodes. |
## Typical transports
### MQTT broker
- **Publishing**: wire output 1 to the core `mqtt out` node. The bridge sets `msg.topic` and `msg.payload` so you can publish directly.
- **Subscribing**: connect a core `mqtt in` node to the bridge input. Payloads are converted according to the mapping and written to KNX. The ack on output 2 confirms the write.
### REST API
- Bridge output 1 into the core `http request` node (or contrib nodes such as [`node-red-contrib-http-request`](https://flows.nodered.org/node/node-red-contrib-http-request)).
- The bridge copies `bridge.method` to `msg.method` and the formatted template to `msg.payload` so you can push JSON payloads or form data to webhooks.
### Modbus registers
- Pair the bridge with [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus) `modbus-flex-write` or `modbus-write` nodes.
- Use the mapping `Target` as the Modbus address/identifier. Output 1 exposes the processed value under `msg.payload` and the metadata in `msg.bridge`.
## Example flows
### KNX → MQTT status topic
```json

[
  {
    "id": "bridge1",
    "type": "knxUltimateIoTBridge",
    "z": "flow1",
    "server": "gateway1",
    "name": "Light bridge",
    "emitOnChangeOnly": true,
    "readOnDeploy": true,
    "acceptFlowInput": true,
    "mappings": [
      {
        "id": "map-light",
        "enabled": true,
        "label": "Living light",
        "ga": "1/1/10",
        "dpt": "1.001",
        "direction": "bidirectional",
        "iotType": "mqtt",
        "target": "knx/light/living",
        "method": "POST",
        "modbusFunction": "writeHoldingRegister",
        "scale": 1,
        "offset": 0,
        "template": "{{value}}",
        "property": "",
        "timeout": 0,
        "retry": 0
      }
    ],
    "wires": [["mqttOut"],["debugAck"]]
  },
  {
    "id": "mqttOut",
    "type": "mqtt out",
    "name": "MQTT status",
    "topic": "",
    "qos": "0",
    "retain": "false",
    "broker": "mqttBroker",
    "x": 520,
    "y": 120,
    "wires": []
  },
  {
    "id": "debugAck",
    "type": "debug",
    "name": "KNX ack",
    "active": true,
    "tosidebar": true,
    "complete": "true",
    "x": 520,
    "y": 180,
    "wires": []
  }
]
```

### MQTT command → KNX feedback
```json

[
  {
    "id": "mqttIn",
    "type": "mqtt in",
    "name": "MQTT command",
    "topic": "knx/light/living/set",
    "qos": "1",
    "datatype": "auto",
    "broker": "mqttBroker",
    "x": 140,
    "y": 200,
    "wires": [["bridge1"]]
  }
]
```

Combine both snippets in the same flow to round-trip KNX ↔ MQTT with acknowledgements.
### REST snapshot payload
```json

{
  "id": "bridge-rest",
  "type": "knxUltimateIoTBridge",
  "name": "Power meter bridge",
  "mappings": [
    {
      "label": "Total active power",
      "ga": "2/1/20",
      "dpt": "9.024",
      "direction": "knx-to-iot",
      "iotType": "rest",
      "target": "https://example/api/knx/power",
      "method": "POST",
      "template": "{\"value\":{{value}},\"ga\":\"{{ga}}\",\"ts\":\"{{isoTimestamp}}\"}"
    }
  ]
}
```

Pipe output 1 into an `http request` node pointing at the same URL. Use the response to log success or retry via the bridge metadata (`bridge.retry`).
### Modbus register write
1. Mapping: `Target = 40010`, `Channel type = Modbus`, `Direction = Bidirectional`.
2. Place a `modbus-flex-write` node from `node-red-contrib-modbus` after output 1 and forward `msg.payload` into its `value` property.
3. Use the ack output to confirm KNX writes when an automation updates the Modbus register first.
## Tips & troubleshooting
- Leaves `Target` empty to inherit the node `outputtopic` if you plan to drive multiple mappings into the same MQTT/REST entry point.
- `emitOnChangeOnly` is useful for High frequency sensors; disable it when you need every telegram (e.g., counters).
- Output 2 always mirrors the original `msg.payload` received from the IoT side under `bridge` metadata—log it to diagnose scaling issues.
- For Modbus floats, pair the bridge with a `function` node to convert to the register format required by your specific device (e.g., 16-bit vs 32-bit).
Happy bridging!
