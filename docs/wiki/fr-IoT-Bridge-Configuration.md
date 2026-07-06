---
layout: wiki
title: "IoT-Bridge-Configuration"
lang: fr
permalink: /wiki/fr-IoT-Bridge-Configuration
---
{% raw %}
---
# MQTT Home Assistant - IoT
La passerelle normalise les télégrammes KNX en messages structurés prêts pour les transports IoT (MQTT, REST, Modbus) et accepte des entrées du flow pour écrire de nouveau sur le bus KNX. Ce guide résume la configuration et les nœuds tiers recommandés.
<p align="center">
  <img src="/node-red-contrib-knx-ultimate/assets/home-assistant-logo.png" alt="Home Assistant" height="46">
  &nbsp;&nbsp;&nbsp;
  <img src="/node-red-contrib-knx-ultimate/assets/mqtt-logo.svg" alt="MQTT" height="38">
</p>

## Mode de fonctionnement
Le nœud dispose d'un sélecteur **Mode** :

- **Passerelle IoT** (par défaut) — le comportement décrit ci-dessous : une liste de correspondances qui transforme les télégrammes KNX en messages de sortie MQTT/REST/Modbus et inversement.
- **MQTT / Home Assistant (natif)** — le nœud se connecte directement à un broker MQTT et fait le pont KNX ↔ MQTT dans les deux sens, en publiant la découverte MQTT de Home Assistant pour que KNX apparaisse automatiquement dans Home Assistant. Aucun câblage `mqtt in`/`mqtt out` nécessaire.

## Mode MQTT / Home Assistant
Prérequis : un broker MQTT accessible à la fois par Node-RED et Home Assistant, avec l'intégration MQTT activée dans HA. Toutes les entités sont regroupées sous un seul appareil HA portant le nom du nœud.

| Champ | Rôle |
| -- | -- |
| **Connexion au bus KNX** | *Autonome* (par défaut) : le nœud communique directement avec la passerelle KNX et n'affiche pas de broches d'entrée/sortie. *Messages de flux* : le nœud expose une broche d'entrée et une de sortie — reliez la sortie d'un nœud KNXUltimate en mode **Universel** à la broche d'entrée (bus KNX → MQTT) et la broche de sortie à l'entrée d'un autre nœud KNXUltimate en mode **Universel** (MQTT → bus KNX). |
| **URL du broker / Nom d'utilisateur / Mot de passe** | Connexion au broker MQTT. |
| **Topic de base** | Racine des topics d'état/commande (par défaut `knx-ultimate`). |
| **Publier la découverte HA / Préfixe de découverte** | Active la découverte MQTT de Home Assistant et définit son préfixe (par défaut `homeassistant`). |
| **Format du nom d'entité** | Comment les noms des entités HA sont construits à partir de l'import ETS, dont les noms commencent par le chemin des groupes, p. ex. `(Lumières->Rez-de-chaussée) Salon`. Options : *Tel qu'importé d'ETS* (par défaut), *Nom d'abord* (`Salon (Lumières->Rez-de-chaussée)`), *Nom seul* (`Salon`), *Nom + adresse de groupe* (`Salon (0/1/2)`). |
| **Adresses de groupe à exposer** | Liste à cases de chaque adresse importée dans la passerelle (ETS). Les adresses cochées deviennent des entités HA, typées automatiquement d'après le DPT (switch, sensor, binary_sensor, number, text). Filtre + Tout sélectionner / désélectionner ; toutes sélectionnées par défaut. Chaque ligne dispose aussi de l'option **Lecture seule** : une adresse en lecture seule est toujours publiée vers Home Assistant (état visible) mais n'accepte jamais de commandes vers le bus KNX (les switch deviennent des binary_sensor et les number des sensor). Les boutons *Activer lecture seule* / *Retirer lecture seule* l'appliquent à toutes les adresses affichées. |
| **Volets et thermostats** | Entités composites qui regroupent plusieurs adresses (voir ci-dessous). |

### Volets et thermostats
Les volets et thermostats combinent plusieurs adresses de groupe en une seule entité HA, ils ne peuvent donc pas être déduits d'un seul DPT - ajoutez-les dans la liste :

- **Volet** : GA montée/descente (1.008), GA stop optionnelle (1.007), GA position commande/état optionnelle (5.001). *Inverser la position* fait correspondre KNX (0% = ouvert) à Home Assistant (100% = ouvert).
- **Thermostat** : GA température actuelle (9.001), GA consigne commande/état (9.001), GA marche/arrêt optionnelle (1.001 → off/heat), plus températures min/max et pas.

Les types de points de données sont lus depuis l'import ETS lorsqu'ils sont disponibles, sinon depuis les valeurs KNX par défaut. Pour un retour d'état fiable, les adresses utilisées par les volets/thermostats doivent être présentes dans l'import ETS.

> **Intégration KNX native vs passerelle MQTT.** Si Home Assistant communique déjà avec KNX via son intégration KNX intégrée, les volets/climat s'y configurent avec les adresses de groupe et cette passerelle MQTT n'est pas nécessaire. Utilisez ce mode lorsque Node-RED possède le bus KNX et que Home Assistant voit tout via MQTT.

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
{% endraw %}
