---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: fr
permalink: /wiki/fr-IoT-Bridge-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-IoT-Bridge-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-IoT-Bridge-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-IoT-Bridge-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)
---
# Passerelle KNX ↔ IoT
La passerelle normalise les télégrammes KNX en messages structurés prêts pour les transports IoT (MQTT, REST, Modbus) et accepte des entrées du flow pour écrire de nouveau sur le bus KNX. Ce guide résume la configuration et les nœuds tiers recommandés.
## Récapitulatif des champs
| Champ | But | Remarques |
| -- | -- | -- |
| **Label** | Nom lisible | Affiché dans le statut et `msg.bridge.label`. |
| **GA / DPT** | Adresse de groupe et datapoint | Renseignez-les manuellement ou via l’autocomplétion ETS. |
| **Direction** | KNX→IoT, IoT→KNX, Bidirectionnel | Détermine les sorties utilisées. |
| **Type de canal** | MQTT / REST / Modbus | Modifie la signification de `Target`. |
| **Target** | Topic, URL de base ou registre | Vide = utilisation de `outputtopic`. |
| **Template** | Format de chaîne | Placeholders `{{value}}`, `{{ga}}`, `{{type}}`, `{{target}}`, `{{label}}`, `{{isoTimestamp}}`. |
| **Échelle / Décalage** | Conversion numérique | Appliquée KNX→IoT ; inversée IoT→KNX. |
| **Timeout / Tentatives** | Indices de retry | Les nœuds aval peuvent s’y fier pour gérer les relances. |
## Transports courants
### Broker MQTT
- **Publication** : reliez la sortie 1 au nœud core `mqtt out`. Le bridge fournit déjà `msg.topic` et `msg.payload`.
- **Souscription** : connectez un `mqtt in` à l’entrée pour convertir les messages MQTT en écritures KNX. La sortie 2 fournit un accusé.
### API REST
- Acheminer la sortie 1 vers le nœud core `http request` (ou contrib comme [`node-red-contrib-http-request`](https://flows.nodered.org/node/node-red-contrib-http-request)).
- Le bridge copie `bridge.method` dans `msg.method` et le template dans le payload pour pousser du JSON vers vos webhooks.
### Registres Modbus
- Associez la passerelle à [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus) (`modbus-flex-write`, `modbus-write`).
- `Target` représente le registre ; `msg.payload` contient la valeur transformée.
## Exemples de flows
### Statut KNX → MQTT
```json
[
  {
    "id": "bridge1",
    "type": "knxUltimateIoTBridge",
    "z": "flow1",
    "server": "gateway1",
    "name": "Passerelle lumière",
    "emitOnChangeOnly": true,
    "readOnDeploy": true,
    "acceptFlowInput": true,
    "mappings": [
      {
        "id": "map-lumiere",
        "enabled": true,
        "label": "Lumière salon",
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
    "name": "MQTT statut",
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
### Commande MQTT → KNX
```json
[
  {
    "id": "mqttIn",
    "type": "mqtt in",
    "name": "MQTT commande",
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
Combinez les deux extraits pour obtenir un aller-retour KNX ↔ MQTT avec accusés.
### Snapshot REST
```json
{
  "id": "bridge-rest",
  "type": "knxUltimateIoTBridge",
  "name": "Passerelle compteur",
  "mappings": [
    {
      "label": "Puissance active",
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
Dirigez la sortie 1 vers `http request` et exploitez la réponse, ainsi que `bridge.retry`, pour orchestrer vos relances.
### Écriture Modbus
1. Définissez `Target = 40010`, `Type = Modbus`, `Direction = Bidirectionnel`.
2. Connectez la sortie 1 à `modbus-flex-write` et alimentez son champ valeur avec `msg.payload`.
3. Utilisez l’accusé pour confirmer la synchronisation KNX après une mise à jour du registre.
## Conseils
- Laissez `Target` vide si plusieurs mappages doivent partager `outputtopic`.
- `emitOnChangeOnly` limite le bruit des capteurs ; désactivez-le si chaque télégramme compte.
- La sortie 2 renvoie toujours le payload IoT original avec les métadonnées `bridge`, pratique pour diagnostiquer la mise à l’échelle.
- Pour des flottants Modbus spécifiques, insérez un `function` afin de générer le format requis (16/32 bits, ordre des octets, etc.).
Bonne passerelle !
