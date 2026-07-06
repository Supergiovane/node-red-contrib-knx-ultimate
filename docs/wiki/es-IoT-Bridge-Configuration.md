---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: es
permalink: /wiki/es-IoT-Bridge-Configuration
---
{% raw %}
---
# MQTT Home Assistant - IoT
El puente normaliza los telegramas KNX en mensajes estructurados listos para transportes IoT (MQTT, REST, Modbus) y acepta entradas del flow para escribir de vuelta en el bus KNX. Esta guía resume la configuración y cómo enlazarla con nodos de terceros.
<p align="center">
  <img src="/node-red-contrib-knx-ultimate/assets/home-assistant-logo.png" alt="Home Assistant" height="46">
  &nbsp;&nbsp;&nbsp;
  <img src="/node-red-contrib-knx-ultimate/assets/mqtt-logo.svg" alt="MQTT" height="38">
</p>

## Modo de funcionamiento
El nodo tiene un selector **Modo**:

- **Bridge IoT** (predeterminado) — el comportamiento descrito abajo: una lista de mapeos que convierte los telegramas KNX en mensajes de salida MQTT/REST/Modbus y viceversa.
- **MQTT / Home Assistant (nativo)** — el nodo se conecta directamente a un broker MQTT y hace de puente KNX ↔ MQTT en ambos sentidos, publicando el descubrimiento MQTT de Home Assistant para que KNX aparezca automáticamente en Home Assistant. No hace falta cablear nodos `mqtt in`/`mqtt out`.

## Modo MQTT / Home Assistant
Requisitos: un broker MQTT accesible tanto por Node-RED como por Home Assistant, con la integración MQTT activada en HA. Todas las entidades se agrupan bajo un único dispositivo HA con el nombre del nodo.

| Campo | Propósito |
| -- | -- |
| **Conexión al bus KNX** | *Autónomo* (predeterminado): el nodo habla directamente con la pasarela KNX y no muestra pines de entrada/salida. *Mensajes de flujo*: el nodo expone un pin de entrada y uno de salida — conecta la salida de un nodo KNXUltimate en modo **Universal** al pin de entrada (bus KNX → MQTT) y el pin de salida a la entrada de otro nodo KNXUltimate en modo **Universal** (MQTT → bus KNX). |
| **URL del broker / Usuario / Contraseña** | Conexión al broker MQTT. |
| **Topic base** | Raíz de los topics de estado/comando (predeterminado `knx-ultimate`). |
| **Publicar descubrimiento HA / Prefijo de descubrimiento** | Activa el descubrimiento MQTT de Home Assistant y define su prefijo (predeterminado `homeassistant`). |
| **Formato del nombre de entidad** | Cómo se construyen los nombres de las entidades de HA a partir de la importación ETS, cuyos nombres empiezan por la ruta de grupos, p. ej. `(Luces->Planta baja) Salón`. Opciones: *Como se importó de ETS* (predeterminado), *Nombre primero* (`Salón (Luces->Planta baja)`), *Solo el nombre* (`Salón`), *Nombre + dirección de grupo* (`Salón (0/1/2)`). |
| **Direcciones de grupo a exponer** | Lista con casillas de cada dirección importada en la pasarela (ETS). Las direcciones marcadas se convierten en entidades HA, tipadas automáticamente a partir del DPT (switch, sensor, binary_sensor, number, text). Filtro + Seleccionar todo / nada; todas seleccionadas por defecto. Cada fila tiene además la opción **Solo lectura**: una dirección de solo lectura se sigue publicando en Home Assistant (estado visible) pero nunca acepta comandos de vuelta al bus KNX (los switch pasan a binary_sensor y los number a sensor). Los botones *Marcar solo lectura* / *Quitar solo lectura* la aplican a todas las direcciones mostradas. |
| **Persianas y termostatos** | Entidades compuestas que agrupan varias direcciones (ver abajo). |

### Persianas y termostatos
Las persianas y termostatos combinan varias direcciones de grupo en una sola entidad HA, por lo que no pueden deducirse de un único DPT - añádelos en la lista:

- **Persiana**: GA subir/bajar (1.008), GA stop opcional (1.007), GA posición comando/estado opcional (5.001). *Invertir posición* asigna KNX (0% = abierto) a Home Assistant (100% = abierto).
- **Termostato**: GA temperatura actual (9.001), GA consigna comando/estado (9.001), GA on/off opcional (1.001 → off/heat), además de temperatura mín/máx y paso.

Los tipos de datapoint se leen de la importación ETS cuando están disponibles; en caso contrario, de los valores KNX por defecto. Para un estado fiable, las direcciones usadas por persianas/termostatos deberían estar presentes en la importación ETS.

> **Integración KNX nativa vs puente MQTT.** Si Home Assistant ya se comunica con KNX mediante su integración KNX integrada, las persianas/clima se configuran allí con las direcciones de grupo y este puente MQTT no es necesario. Usa este modo cuando Node-RED posee el bus KNX y Home Assistant lo ve todo a través de MQTT.

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
{% endraw %}
