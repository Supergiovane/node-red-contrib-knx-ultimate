---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: en
permalink: /wiki/IoT-Bridge-Configuration
---
{% raw %}
---
# MQTT Home Assistant - IoT
The bridge normalises KNX telegrams into structured messages that can be consumed by IoT transports (MQTT, REST, Modbus) and accepts flow inputs to write back to the KNX bus. It mirrors the runtime logic of the Node-RED editor help and shows how to hook the node to third-party connectors.
<p align="center">
  <img src="/node-red-contrib-knx-ultimate/assets/home-assistant-logo.png" alt="Home Assistant" height="46">
  &nbsp;&nbsp;&nbsp;
  <img src="/node-red-contrib-knx-ultimate/assets/mqtt-logo.svg" alt="MQTT" height="38">
</p>

## Operating mode
The node has a **Mode** selector:

- **IoT bridge** (default) — the behaviour described below: a list of mappings that turn KNX telegrams into MQTT/REST/Modbus output messages and back.
- **MQTT / Home Assistant (native)** — the node connects directly to an MQTT broker and bridges KNX ↔ MQTT both ways, publishing Home Assistant MQTT Discovery so KNX appears automatically in Home Assistant. No `mqtt in`/`mqtt out` wiring is needed.

## MQTT / Home Assistant mode
Requirements: an MQTT broker reachable by both Node-RED and Home Assistant, with the MQTT integration enabled in HA. All entities are grouped under a single HA device named after the node.

| Field | Purpose |
| -- | -- |
| **KNX bus connection** | *Stand-alone* (default): the node talks to the KNX gateway directly and shows no input/output pins. *Flow messages*: the node exposes an input pin and an output pin — wire the output of a KNXUltimate node in **Universal** mode to the input (KNX bus → MQTT) and the output pin to the input of another KNXUltimate node in **Universal** mode (MQTT → KNX bus). |
| **Broker URL / Username / Password** | MQTT broker connection. |
| **Base topic** | Root of the state/command topics (default `knx-ultimate`). |
| **Publish HA discovery / Discovery prefix** | Enable Home Assistant MQTT Discovery and set its prefix (default `homeassistant`). |
| **Entity name format** | How the HA entity names are built from the ETS import, whose names start with the group-address path, e.g. `(Lights->Ground floor) Living room`. Options: *As imported from ETS* (default), *Name first* (`Living room (Lights->Ground floor)`), *Name only* (`Living room`), *Name + group address* (`Living room (0/1/2)`). |
| **Group addresses to expose** | Checkbox list of every address imported in the gateway (ETS). Ticked addresses become HA entities, typed automatically from the DPT (switch, sensor, binary_sensor, number, text). Filter + Select all / none; all selected by default. Each row also has a **Read only** toggle: a read-only address is still published to Home Assistant (state visible) but never accepts commands back to the KNX bus (switches become binary_sensors, numbers become sensors). The *Set read only* / *Clear read only* buttons apply it to all currently shown addresses. |
| **Covers & Thermostats** | Composite entities that aggregate several addresses (see below). |

### Covers & Thermostats
Covers and thermostats combine several group addresses into one HA entity, so they can't be derived from a single DPT - add them in the list:

- **Cover**: Up/Down GA (1.008), optional Stop GA (1.007), optional Set/Status position GA (5.001). *Invert position* maps KNX (0% = open) to Home Assistant (100% = open).
- **Thermostat**: current temperature GA (9.001), setpoint set/status GA (9.001), optional On/Off GA (1.001 → off/heat), plus min/max temperature and step.

Datapoint types are read from the ETS import when available, otherwise from KNX defaults. For reliable status, the addresses used by covers/thermostats should be present in the ETS import.

> **Native KNX integration vs MQTT bridge.** If Home Assistant already talks to KNX through its built-in KNX integration, covers/climate are configured there with group addresses and this MQTT bridge is not needed. Use this mode when Node-RED owns the KNX bus and Home Assistant sees everything over MQTT.

## Mapping recap

| Field | Purpose | Notes |
| -- | -- | -- |
| **Label** | Friendly name | Used in the status text and `msg.bridge.label`. |
| **GA / DPT** | KNX group address and datapoint | Set via ETS CSV autocomplete or manually. |
| **Direction** | KNX→IoT, IoT→KNX, Bidirectional | Determines which pins are active. |
| **Channel type** | MQTT / REST / Modbus | Changes the meaning of `Target`. |
| **Target** | Topic, base URL or zero-based Modbus address | Modbus requires a protocol address from 0 to 65535, not a 4xxxx reference. |
| **Modbus format / Unit ID / Area / Data type** | Flex or legacy message contract and register definition | New mappings should use Flex; a missing format remains legacy for compatibility. |
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

The IoT Bridge is a message adapter for [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus). It does not create a TCP/serial client and does not poll devices; install a package version compatible with your Node-RED runtime and configure those parts in the external Modbus nodes.

| Area | Read FC | Write FC | Direction |
| -- | -- | -- | -- |
| Coil | 1 | 5 | KNX ↔ Modbus |
| Discrete input | 2 | — | Modbus → KNX only |
| Holding register | 3 | 6 | KNX ↔ Modbus |
| Input register | 4 | — | Modbus → KNX only |

For new rows choose **Flex Write compatible**, set **Unit ID**, **Area** and **Data type**, and enter the zero-based protocol address in **Target**. A KNX value sent to a coil produces FC5; a value sent to a holding register produces FC6. Output 1 is directly compatible with `modbus-flex-write`:

```js
msg.payload = {
  value: 215,
  fc: 6,
  unitid: 1,
  address: 9,
  quantity: 1
}
```

To bring data back, connect the data output of `modbus-flex-getter` or `modbus-read` to the bridge input. Flex Getter provides the request (`fc`, `unitid`, `address`, `quantity`) in `msg.modbusRequest`; Modbus Read preserves it in `msg.input.payload`. The returned values array may be in `msg.payload` or `msg.values`. The bridge supports both message shapes. Enable **Keep Msg Properties** on Flex Getter. One read response may cover several configured addresses, and the bridge selects the correct array element for each matching row.

Only one bit or one 16-bit register is supported per mapping: `bool`, `uint16` or `int16`. Multiword values, 32-bit/float decoding and byte/word-order conversion are outside this adapter. Scale and offset use `raw = KNX × scale + offset`; Modbus → KNX applies the inverse. **Read KNX values on deploy** does not poll Modbus.

Mappings without `modbusMessageFormat` keep the legacy scalar output with top-level `msg.address` and `msg.modbusFunction`, so saved flows are not silently migrated.

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
1. Mapping: `Target = 9`, `Channel type = Modbus`, `Format = Flex Write compatible`, `Unit ID = 1`, `Area = Holding register`, `Data type = uint16`.
2. Wire bridge output 1 directly to `modbus-flex-write`; no Function node is required.
3. Wire a `modbus-read` or `modbus-flex-getter` response to the bridge input for Modbus → KNX.
4. Import `examples/IoT Bridge - Modbus Flex Adapter.json` for a manual, non-polling starter flow.
## Tips & troubleshooting
- Leave `Target` empty only for MQTT/REST mappings that should inherit the node `outputtopic`; Modbus Flex needs an address.
- `emitOnChangeOnly` is useful for High frequency sensors; disable it when you need every telegram (e.g., counters).
- Output 2 acknowledges the value actually dispatched to KNX; it is not a physical Modbus write/read confirmation.
- A manual reference such as `40010` commonly maps to address `9`, but always verify the device documentation.
Happy bridging!
{% endraw %}
