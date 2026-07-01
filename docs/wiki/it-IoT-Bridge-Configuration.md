---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: it
permalink: /wiki/it-IoT-Bridge-Configuration
---
{% raw %}
---
# MQTT Home Assistant - IoT
Il bridge normalizza i telegrammi KNX in messaggi strutturati per trasporti IoT (MQTT, REST, Modbus) e accetta input dal flow per riscrivere sul bus. Qui trovi una guida rapida e i collegamenti consigliati ai nodi di trasporto di Node-RED.
<p align="center">
  <img src="/node-red-contrib-knx-ultimate/assets/home-assistant-logo.png" alt="Home Assistant" height="46">
  &nbsp;&nbsp;&nbsp;
  <img src="/node-red-contrib-knx-ultimate/assets/mqtt-logo.svg" alt="MQTT" height="38">
</p>

## Modalità di funzionamento
Il nodo ha un selettore **Modalità**:

- **Bridge IoT** (predefinito) — il comportamento descritto qui sotto: una lista di mappature che trasforma i telegrammi KNX in messaggi di output MQTT/REST/Modbus e viceversa.
- **MQTT / Home Assistant (nativo)** — il nodo si connette direttamente a un broker MQTT e fa da ponte KNX ↔ MQTT in entrambe le direzioni, pubblicando il discovery MQTT di Home Assistant così KNX compare automaticamente in Home Assistant. Non serve cablare nodi `mqtt in`/`mqtt out`.

## Modalità MQTT / Home Assistant
Requisiti: un broker MQTT raggiungibile sia da Node-RED che da Home Assistant, con l'integrazione MQTT attiva in HA. Tutte le entità sono raggruppate sotto un unico dispositivo HA con il nome del nodo.

| Campo | Scopo |
| -- | -- |
| **Connessione al bus KNX** | *Stand-alone* (predefinito): il nodo parla direttamente col gateway KNX e non mostra PIN di ingresso/uscita. *Messaggi di flow*: il nodo espone un PIN di ingresso e uno di uscita — collega l'uscita di un nodo KNXUltimate in modalità **Universale** al PIN di ingresso (bus KNX → MQTT) e il PIN di uscita all'ingresso di un altro nodo KNXUltimate in modalità **Universale** (MQTT → bus KNX). |
| **URL broker / Nome utente / Password** | Connessione al broker MQTT. |
| **Topic di base** | Radice dei topic di stato/comando (predefinito `knx-ultimate`). |
| **Pubblica discovery HA / Prefisso discovery** | Abilita il discovery MQTT di Home Assistant e ne imposta il prefisso (predefinito `homeassistant`). |
| **Indirizzi di gruppo da esporre** | Lista con checkbox di ogni indirizzo importato nel gateway (ETS). Gli indirizzi spuntati diventano entità HA, tipizzate automaticamente dal DPT (switch, sensor, binary_sensor, number, text). Filtro + Seleziona tutti / nessuno; tutti selezionati di default. Ogni riga ha inoltre l'opzione **Sola lettura**: un indirizzo in sola lettura viene comunque pubblicato su Home Assistant (stato visibile) ma non accetta mai comandi verso il bus KNX (gli switch diventano binary_sensor, i number diventano sensor). I pulsanti *Imposta sola lettura* / *Togli sola lettura* la applicano a tutti gli indirizzi mostrati. |
| **Tapparelle e Termostati** | Entità composite che aggregano più indirizzi (vedi sotto). |

### Tapparelle e Termostati
Tapparelle e termostati combinano più indirizzi di gruppo in un'unica entità HA, quindi non possono essere dedotti da un singolo DPT - aggiungili nella lista:

- **Tapparella**: GA su/giù (1.008), GA stop opzionale (1.007), GA posizione comando/stato opzionale (5.001). *Inverti posizione* mappa KNX (0% = aperto) su Home Assistant (100% = aperto).
- **Termostato**: GA temperatura attuale (9.001), GA setpoint comando/stato (9.001), GA on/off opzionale (1.001 → off/heat), più temperatura min/max e step.

I tipi di datapoint vengono letti dall'import ETS se disponibili, altrimenti dai default KNX. Per uno stato affidabile, gli indirizzi usati da tapparelle/termostati dovrebbero essere presenti nell'import ETS.

> **Integrazione KNX nativa vs bridge MQTT.** Se Home Assistant comunica già con KNX tramite la sua integrazione KNX nativa, tapparelle/clima si configurano lì con i group address e questo bridge MQTT non serve. Usa questa modalità quando è Node-RED a possedere il bus KNX e Home Assistant vede tutto via MQTT.

## Riepilogo mappatura

| Campo | Scopo | Note |
| -- | -- | -- |
| **Label** | Nome descrittivo | Appare nello status e in `msg.bridge.label`. |
| **GA / DPT** | Indirizzo di gruppo e datapoint | Puoi usare l'autocomplete ETS o inserirli a mano. |
| **Direzione** | KNX→IoT, IoT→KNX, Bidirezionale | Determina quali pin sono attivi. |
| **Tipo canale** | MQTT / REST / Modbus | Cambia il significato di `Target`. |
| **Target** | Topic, URL base o registro | Vuoto = usa `outputtopic` del nodo. |
| **Template** | Formattazione stringa | Segnaposto `{{value}}`, `{{ga}}`, `{{type}}`, `{{target}}`, `{{label}}`, `{{isoTimestamp}}`. |
| **Scala / Offset** | Conversione numerica | Applicata KNX→IoT; in IoT→KNX viene invertita. |
| **Timeout / Tentativi** | Suggerimenti pass-through | Servono ai nodi a valle per gestire ritentativi/timeouts. |

## Trasporti tipici
### MQTT broker
- **Pubblicazione**: collega l'uscita 1 al nodo core `mqtt out`. Il bridge imposta `msg.topic` e `msg.payload` già pronti per il broker.
- **Sottoscrizione**: collega un nodo `mqtt in` all'ingresso del bridge. I payload sono convertiti secondo il DPT e scritti su KNX; l'ack sul pin 2 conferma la scrittura.
### REST API
- Invita l'uscita 1 nel nodo core `http request` (o contrib come [`node-red-contrib-http-request`](https://flows.nodered.org/node/node-red-contrib-http-request)).
- Il bridge propaga `bridge.method` in `msg.method` e il template in `msg.payload`, così puoi inviare JSON o form-data.
### Registri Modbus
- Abbinalo a [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus) (`modbus-flex-write`, `modbus-write`).
- Usa `Target` come indirizzo/registro Modbus. L'uscita 1 porta il valore in `msg.payload` e i metadati in `msg.bridge`.
## Flow di esempio
### Stato KNX → MQTT
```json

[
  {
    "id": "bridge1",
    "type": "knxUltimateIoTBridge",
    "z": "flow1",
    "server": "gateway1",
    "name": "Bridge luci",
    "emitOnChangeOnly": true,
    "readOnDeploy": true,
    "acceptFlowInput": true,
    "mappings": [
      {
        "id": "map-luce",
        "enabled": true,
        "label": "Luce soggiorno",
        "ga": "1/1/10",
        "dpt": "1.001",
        "direction": "bidirectional",
        "iotType": "mqtt",
        "target": "knx/light/soggiorno",
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
    "name": "MQTT stato",
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
    "topic": "knx/light/soggiorno/set",
    "qos": "1",
    "datatype": "auto",
    "broker": "mqttBroker",
    "x": 140,
    "y": 200,
    "wires": [["bridge1"]]
  }
]
```

Unisci i due snippet nello stesso flow per ottenere il round-trip KNX ↔ MQTT con ack.
### Payload REST
```json

{
  "id": "bridge-rest",
  "type": "knxUltimateIoTBridge",
  "name": "Bridge contatore",
  "mappings": [
    {
      "label": "Potenza attiva",
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

Instrada l'uscita 1 verso `http request` e usa la risposta per log o retry basati su `bridge.retry`.
### Scrittura Modbus
1. Mappa con `Target = 40010`, `Tipo = Modbus`, `Direzione = Bidirezionale`.
2. Collega l'uscita 1 a `modbus-flex-write` di `node-red-contrib-modbus`, assegnando `msg.payload` al campo `value` del nodo Modbus.
3. L'ack informa quando KNX è stato aggiornato dopo un comando proveniente dal registro.
## Suggerimenti finali
- Se lasci `Target` vuoto puoi reindirizzare più mappature sullo stesso topic/endpoint tramite `outputtopic`.
- `emitOnChangeOnly` limita il rumore dei sensori; disattivalo se serve ogni telegramma.
- L'uscita 2 replica sempre il payload arrivato dal mondo IoT con i metadati `bridge`: utile per il debug di scaling.
- Per registri Modbus floating usa un `function` per comporre il formato richiesto dal dispositivo (16/32 bit).
Buon bridging!
{% endraw %}
