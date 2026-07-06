---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: de
permalink: /wiki/de-IoT-Bridge-Configuration
---
{% raw %}
---

# MQTT Home Assistant - IoT

Der Bridge normalisiert KNX-Telegramme zu strukturierten Nachrichten für IoT-Transporte (MQTT, REST, Modbus) und nimmt Flow-Eingaben entgegen, um zurück in den KNX-Bus zu schreiben. Diese Seite fasst die Konfiguration und empfohlene Drittanbieter-Nodes zusammen.

<p align="center">
  <img src="/node-red-contrib-knx-ultimate/assets/home-assistant-logo.png" alt="Home Assistant" height="46">
  &nbsp;&nbsp;&nbsp;
  <img src="/node-red-contrib-knx-ultimate/assets/mqtt-logo.svg" alt="MQTT" height="38">
</p>

## Betriebsmodus

Der Node hat einen **Modus**-Schalter:

- **IoT-Bridge** (Standard) — das unten beschriebene Verhalten: eine Zuordnungsliste, die KNX-Telegramme in MQTT/REST/Modbus-Ausgabemeldungen umwandelt und umgekehrt.
- **MQTT / Home Assistant (nativ)** — der Node verbindet sich direkt mit einem MQTT-Broker und überbrückt KNX ↔ MQTT in beide Richtungen, mit Home-Assistant-MQTT-Discovery, sodass KNX automatisch in Home Assistant erscheint. Keine `mqtt in`/`mqtt out`-Verdrahtung nötig.

## Modus MQTT / Home Assistant

Voraussetzungen: ein MQTT-Broker, der sowohl von Node-RED als auch von Home Assistant erreichbar ist, mit aktivierter MQTT-Integration in HA. Alle Entitäten werden unter einem einzigen HA-Gerät mit dem Namen des Nodes gruppiert.

| Feld | Zweck |
| -- | -- |
| **KNX-Bus-Verbindung** | *Eigenständig* (Standard): der Knoten kommuniziert direkt mit dem KNX-Gateway und zeigt keine Ein-/Ausgangs-Pins. *Flow-Nachrichten*: der Knoten zeigt einen Eingangs- und einen Ausgangs-Pin — verbinden Sie den Ausgang eines KNXUltimate-Knotens im **Universal**-Modus mit dem Eingangs-Pin (KNX-Bus → MQTT) und den Ausgangs-Pin mit dem Eingang eines weiteren KNXUltimate-Knotens im **Universal**-Modus (MQTT → KNX-Bus). |
| **Broker-URL / Benutzername / Passwort** | Verbindung zum MQTT-Broker. |
| **Basis-Topic** | Wurzel der Status-/Befehls-Topics (Standard `knx-ultimate`). |
| **HA-Discovery veröffentlichen / Discovery-Präfix** | Aktiviert Home-Assistant-MQTT-Discovery und legt das Präfix fest (Standard `homeassistant`). |
| **Format des Entitätsnamens** | Wie die HA-Entitätsnamen aus dem ETS-Import gebildet werden, dessen Namen mit dem Gruppenpfad beginnen, z. B. `(Licht->Erdgeschoss) Wohnzimmer`. Optionen: *Wie aus ETS importiert* (Standard), *Name zuerst* (`Wohnzimmer (Licht->Erdgeschoss)`), *Nur der Name* (`Wohnzimmer`), *Name + Gruppenadresse* (`Wohnzimmer (0/1/2)`). |
| **Bereitzustellende Gruppenadressen** | Kontrollkästchenliste aller im Gateway importierten Adressen (ETS). Angehakte Adressen werden zu HA-Entitäten, automatisch nach dem DPT typisiert (switch, sensor, binary_sensor, number, text). Filter + Alle/Keine auswählen; standardmäßig alle ausgewählt. Jede Zeile hat zudem die Option **Nur lesen**: eine schreibgeschützte Adresse wird weiterhin an Home Assistant veröffentlicht (Status sichtbar), akzeptiert aber nie Befehle zurück auf den KNX-Bus (switch werden zu binary_sensor, number zu sensor). Die Schaltflächen *Nur lesen setzen* / *Nur lesen entfernen* wenden dies auf alle angezeigten Adressen an. |
| **Rollläden & Thermostate** | Zusammengesetzte Entitäten, die mehrere Adressen bündeln (siehe unten). |

### Rollläden & Thermostate

Rollläden und Thermostate fassen mehrere Gruppenadressen zu einer HA-Entität zusammen und können daher nicht aus einem einzelnen DPT abgeleitet werden - fügen Sie sie in der Liste hinzu:

- **Rollladen**: Auf/Ab-GA (1.008), optionale Stopp-GA (1.007), optionale Positions-GA Befehl/Status (5.001). *Position invertieren* bildet KNX (0% = offen) auf Home Assistant (100% = offen) ab.
- **Thermostat**: GA Ist-Temperatur (9.001), GA Sollwert Befehl/Status (9.001), optionale Ein/Aus-GA (1.001 → off/heat), plus Min-/Max-Temperatur und Schrittweite.

Die Datenpunkttypen werden aus dem ETS-Import gelesen, sofern vorhanden, andernfalls aus KNX-Standardwerten. Für zuverlässige Statuswerte sollten die von Rollläden/Thermostaten verwendeten Adressen im ETS-Import enthalten sein.

> **Native KNX-Integration vs. MQTT-Bridge.** Wenn Home Assistant bereits über seine eingebaute KNX-Integration mit KNX kommuniziert, werden Rollläden/Klima dort mit Gruppenadressen konfiguriert und diese MQTT-Bridge wird nicht benötigt. Verwenden Sie diesen Modus, wenn Node-RED den KNX-Bus besitzt und Home Assistant alles über MQTT sieht.

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
{% endraw %}
