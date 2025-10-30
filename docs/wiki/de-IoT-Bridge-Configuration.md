---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: de
permalink: /wiki/de-IoT-Bridge-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-IoT-Bridge-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-IoT-Bridge-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-IoT-Bridge-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)

---

# KNX ↔ IoT Bridge

Der Bridge normalisiert KNX-Telegramme zu strukturierten Nachrichten für IoT-Transporte (MQTT, REST, Modbus) und nimmt Flow-Eingaben entgegen, um zurück in den KNX-Bus zu schreiben. Diese Seite fasst die Konfiguration und empfohlene Drittanbieter-Nodes zusammen.

## Feldübersicht

| Feld | Zweck | Hinweise |
| -- | -- | -- |
| **Label** | Anzeigename | Erscheint im Status und in `msg.bridge.label`. |
| **GA / DPT** | Gruppenadresse und Datapoint | Manuell oder über ETS-Autovervollständigung setzen. |
| **Richtung** | KNX→IoT, IoT→KNX, Bidirektional | Steuert, welche Ausgänge genutzt werden. |
| **Kanaltyp** | MQTT / REST / Modbus | Bestimmt die Bedeutung von `Target`. |
| **Target** | Topic, Basis-URL oder Register | Leer = Verwendung von `outputtopic`. |
| **Template** | String-Format | Platzhalter `{{value}}`, `{{ga}}`, `{{type}}`, `{{target}}`, `{{label}}`, `{{isoTimestamp}}`. |
| **Skalierung / Offset** | Numerische Umrechnung | Wird in KNX→IoT angewandt; IoT→KNX nutzt die inverse Rechnung. |
| **Timeout / Wiederholungen** | Retry-Hinweise | Können von nachfolgenden Nodes zur Steuerung von Wiederholungen genutzt werden. |

## Typische Transporte

### MQTT-Broker

- **Publizieren**: Ausgang 1 an den Core-Node `mqtt out` anschließen. `msg.topic` und `msg.payload` sind bereits gesetzt.
- **Abonnieren**: Ein `mqtt in`-Node am Eingang wandelt MQTT-Nachrichten in KNX-Schreibvorgänge um. Ausgang 2 liefert eine Bestätigung.

### REST-API

- Ausgang 1 in den Core-Node `http request` (oder contrib wie [`node-red-contrib-http-request`](https://flows.nodered.org/node/node-red-contrib-http-request)) führen.
- Der Bridge kopiert `bridge.method` nach `msg.method` und den Template-Output nach `msg.payload`, ideal für Webhooks.

### Modbus-Register

- Mit [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus) kombinieren (`modbus-flex-write`, `modbus-write`).
- `Target` entspricht dem Register; `msg.payload` liefert den skalierten Wert.

## Beispiel-Flows

### Status KNX → MQTT

```json
[
  {
    "id": "bridge1",
    "type": "knxUltimateIoTBridge",
    "z": "flow1",
    "server": "gateway1",
    "name": "Licht-Bridge",
    "emitOnChangeOnly": true,
    "readOnDeploy": true,
    "acceptFlowInput": true,
    "mappings": [
      {
        "id": "map-licht",
        "enabled": true,
        "label": "Wohnzimmerlicht",
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
    "name": "MQTT Status",
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
    "name": "KNX Ack",
    "active": true,
    "tosidebar": true,
    "complete": "true",
    "x": 520,
    "y": 180,
    "wires": []
  }
]
```

### MQTT-Befehl → KNX

```json
[
  {
    "id": "mqttIn",
    "type": "mqtt in",
    "name": "MQTT Befehl",
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

Kombinieren Sie beide Ausschnitte, um einen KNX ↔ MQTT Roundtrip mit Bestätigung zu erhalten.

### REST-Snapshot

```json
{
  "id": "bridge-rest",
  "type": "knxUltimateIoTBridge",
  "name": "Leistungs-Bridge",
  "mappings": [
    {
      "label": "Wirklast gesamt",
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

Leiten Sie Ausgang 1 in `http request` und nutzen Sie die Antwort samt `bridge.retry` für Wiederholstrategien.

### Modbus-Schreibvorgang

1. Setzen Sie `Target = 40010`, `Typ = Modbus`, `Richtung = Bidirectional`.
2. Verbinden Sie Ausgang 1 mit `modbus-flex-write` und übergeben Sie `msg.payload` an den Werte-Eingang.
3. Verwenden Sie das Ack, um KNX-Synchronisation nach Registeränderungen zu überwachen.

## Tipps

- Lassen Sie `Target` leer, wenn mehrere Zuordnungen dasselbe `outputtopic` nutzen sollen.
- `emitOnChangeOnly` reduziert Sensordatenrauschen; deaktivieren Sie es bei Bedarf.
- Ausgang 2 spiegelt immer den ursprünglichen IoT-Payload mit `bridge`-Metadaten wider – hilfreich zum Debuggen der Skalierung.
- Für spezielle Modbus-Fließkommaformate kann ein `function`-Node das gewünschte Byte-Layout erzeugen.

Viel Erfolg beim Bridging!

