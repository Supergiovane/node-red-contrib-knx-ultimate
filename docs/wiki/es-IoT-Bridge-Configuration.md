---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: es
permalink: /wiki/es-IoT-Bridge-Configuration
---
---
# Puente KNX ↔ IoT
El puente normaliza los telegramas KNX en mensajes estructurados listos para transportes IoT (MQTT, REST, Modbus) y acepta entradas del flow para escribir de vuelta en el bus KNX. Esta guía resume la configuración y cómo enlazarla con nodos de terceros.
## Resumen de campos
| Campo | Propósito | Notas |
| -- | -- | -- |
| **Label** | Nombre amigable | Aparece en el estado y en `msg.bridge.label`. |
| **GA / DPT** | Dirección de grupo y datapoint | Configúralos manualmente o usando el autocompletado ETS. |
| **Dirección** | KNX→IoT, IoT→KNX, Bidireccional | Determina qué salidas se utilizan. |
| **Tipo de canal** | MQTT / REST / Modbus | Cambia el significado de `Target`. |
| **Target** | Topic, URL base o registro | Vacío = usa `outputtopic` del nodo. |
| **Template** | Formato de cadena | Placeholders `{{value}}`, `{{ga}}`, `{{type}}`, `{{target}}`, `{{label}}`, `{{isoTimestamp}}`. |
| **Escala / Offset** | Conversión numérica | Se aplica en KNX→IoT; el sentido inverso se usa para IoT→KNX. |
| **Timeout / Reintentos** | Hints de reintento | Los nodos posteriores pueden usarlos para controlar reenvíos. |
## Transportes habituales
### Broker MQTT
- **Publicar**: conecta la salida 1 al nodo core `mqtt out`. El bridge ya rellena `msg.topic` y `msg.payload`.
- **Suscribirse**: conecta un nodo `mqtt in` a la entrada del bridge para convertir mensajes MQTT en escrituras KNX. El pin 2 devuelve un ack.
### API REST
- Envía la salida 1 al nodo core `http request` (o contrib como [`node-red-contrib-http-request`](https://flows.nodered.org/node/node-red-contrib-http-request)).
- El bridge copia `bridge.method` a `msg.method` y el template al payload, ideal para webhooks JSON.
### Registros Modbus
- Úsalo con [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus) (`modbus-flex-write`, `modbus-write`).
- El `Target` marca el registro; `msg.payload` contiene el valor ya transformado.
## Flujos de ejemplo
### Estado KNX → MQTT
```json
[
  {
    "id": "bridge1",
    "type": "knxUltimateIoTBridge",
    "z": "flow1",
    "server": "gateway1",
    "name": "Bridge luces",
    "emitOnChangeOnly": true,
    "readOnDeploy": true,
    "acceptFlowInput": true,
    "mappings": [
      {
        "id": "map-luz",
        "enabled": true,
        "label": "Luz salón",
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
    "name": "MQTT estado",
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
    "name": "Ack KNX",
    "active": true,
    "tosidebar": true,
    "complete": "true",
    "x": 520,
    "y": 180,
    "wires": []
  }
]
```
### Comando MQTT → KNX
```json
[
  {
    "id": "mqttIn",
    "type": "mqtt in",
    "name": "MQTT comando",
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
Combina ambos fragmentos para tener ida y vuelta KNX ↔ MQTT con confirmaciones.
### Snapshot REST
```json
{
  "id": "bridge-rest",
  "type": "knxUltimateIoTBridge",
  "name": "Bridge contador",
  "mappings": [
    {
      "label": "Potencia activa",
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
Dirige la salida 1 a `http request` y usa la respuesta junto con `bridge.retry` para decidir reintentos.
### Escritura Modbus
1. Configura `Target = 40010`, `Tipo = Modbus`, `Dirección = Bidireccional`.
2. Conecta la salida 1 a `modbus-flex-write` y asigna `msg.payload` al valor del nodo Modbus.
3. Usa el ack para confirmar cuándo KNX se sincroniza tras la actualización del registro.
## Consejos
- Deja `Target` vacío si quieres reutilizar `outputtopic` para varios mapeos.
- `emitOnChangeOnly` reduce el ruido de sensores; desactívalo si necesitas todos los telegramas.
- El pin 2 replica el payload IoT original y facilita el debug de escalados.
- Para float Modbus específicos, añade un `function` que prepare el formato (16/32 bits, orden de bytes, etc.).
¡Feliz bridge!
