🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-IoT-Bridge-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-IoT-Bridge-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-IoT-Bridge-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
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
