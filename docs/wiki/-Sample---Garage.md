---
layout: wiki
title: "-Sample---Garage"
lang: en
permalink: /wiki/-Sample---Garage
---
# KNX Garage (sample)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/sample-garage.svg" width="95%"><br/>

This sample shows how to drive the **KNX Garage** node from the flow (open/close/toggle) and how to simulate safety inputs (photocell) and overrides (disable/hold-open) using regular **knxUltimate** nodes.

For the full node reference see: [Garage configuration](/node-red-contrib-knx-ultimate/wiki/Garage-Configuration)

## Basic control + safety simulation

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust Group Addresses, DPTs and KNX gateway settings according to your setup.

```json
[
  {
    "id": "b2c9c84f6cf2d2a2",
    "type": "tab",
    "label": "KNX Garage sample",
    "disabled": false,
    "info": ""
  },
  {
    "id": "8b9a7c6d5e4f3a21",
    "type": "comment",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Edit the GA/DPT values in the KNX Garage node. Use the inject nodes to test open/close/toggle.",
    "info": "",
    "x": 390,
    "y": 60,
    "wires": []
  },
  {
    "id": "c4f5a6b7c8d9e0f1",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "OPEN",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "open",
    "payloadType": "str",
    "x": 120,
    "y": 140,
    "wires": [
      [
        "54d1f7c0a3b9a98d"
      ]
    ]
  },
  {
    "id": "d0e1f2a3b4c5d6e7",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "CLOSE",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "close",
    "payloadType": "str",
    "x": 120,
    "y": 180,
    "wires": [
      [
        "54d1f7c0a3b9a98d"
      ]
    ]
  },
  {
    "id": "e7f6d5c4b3a2f1e0",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "TOGGLE",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "toggle",
    "payloadType": "str",
    "x": 120,
    "y": 220,
    "wires": [
      [
        "54d1f7c0a3b9a98d"
      ]
    ]
  },
  {
    "id": "54d1f7c0a3b9a98d",
    "type": "knxUltimateGarage",
    "z": "b2c9c84f6cf2d2a2",
    "server": "0f0e0d0c0b0a0908",
    "name": "Garage door",
    "outputtopic": "garage",
    "gaCommand": "3/0/0",
    "nameCommand": "Door command",
    "dptCommand": "1.001",
    "gaImpulse": "3/0/1",
    "nameImpulse": "Door impulse",
    "dptImpulse": "1.017",
    "gaHoldOpen": "3/0/2",
    "nameHoldOpen": "Hold open",
    "dptHoldOpen": "1.001",
    "gaDisable": "3/0/3",
    "nameDisable": "Disable",
    "dptDisable": "1.001",
    "gaPhotocell": "3/0/4",
    "namePhotocell": "Photocell",
    "dptPhotocell": "1.001",
    "gaMoving": "3/0/5",
    "nameMoving": "Moving",
    "dptMoving": "1.001",
    "gaObstruction": "3/0/6",
    "nameObstruction": "Obstruction",
    "dptObstruction": "1.001",
    "autoCloseEnable": true,
    "autoCloseSeconds": 30,
    "emitEvents": true,
    "x": 350,
    "y": 180,
    "wires": [
      [
        "a9b8c7d6e5f4a3b2"
      ]
    ]
  },
  {
    "id": "a9b8c7d6e5f4a3b2",
    "type": "debug",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Garage events",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "true",
    "targetType": "full",
    "x": 560,
    "y": 180,
    "wires": []
  },
  {
    "id": "2a3b4c5d6e7f8091",
    "type": "comment",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Simulate inputs (writes to the configured GA). Use these only for testing.",
    "info": "",
    "x": 330,
    "y": 320,
    "wires": []
  },
  {
    "id": "1122334455667788",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Hold-open ON",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "true",
    "payloadType": "bool",
    "x": 130,
    "y": 380,
    "wires": [
      [
        "76a8c9d0e1f2a3b4"
      ]
    ]
  },
  {
    "id": "99aabbccddeeff00",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Hold-open OFF",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "false",
    "payloadType": "bool",
    "x": 130,
    "y": 420,
    "wires": [
      [
        "76a8c9d0e1f2a3b4"
      ]
    ]
  },
  {
    "id": "76a8c9d0e1f2a3b4",
    "type": "knxUltimate",
    "z": "b2c9c84f6cf2d2a2",
    "server": "0f0e0d0c0b0a0908",
    "topic": "3/0/2",
    "outputtopic": "",
    "dpt": "1.001",
    "initialread": false,
    "notifyreadrequest": false,
    "notifyresponse": false,
    "notifywrite": true,
    "notifyreadrequestalsorespondtobus": false,
    "notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized": "0",
    "listenallga": false,
    "name": "GA Hold-open",
    "outputtype": "write",
    "outputRBE": false,
    "inputRBE": false,
    "formatmultiplyvalue": "1",
    "formatnegativevalue": "leave",
    "formatdecimalsvalue": "999",
    "passthrough": "no",
    "x": 360,
    "y": 400,
    "wires": [
      []
    ]
  },
  {
    "id": "a1a2a3a4a5a6a7a8",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Disable ON",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "true",
    "payloadType": "bool",
    "x": 120,
    "y": 480,
    "wires": [
      [
        "b1b2b3b4b5b6b7b8"
      ]
    ]
  },
  {
    "id": "c1c2c3c4c5c6c7c8",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Disable OFF",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "false",
    "payloadType": "bool",
    "x": 120,
    "y": 520,
    "wires": [
      [
        "b1b2b3b4b5b6b7b8"
      ]
    ]
  },
  {
    "id": "b1b2b3b4b5b6b7b8",
    "type": "knxUltimate",
    "z": "b2c9c84f6cf2d2a2",
    "server": "0f0e0d0c0b0a0908",
    "topic": "3/0/3",
    "outputtopic": "",
    "dpt": "1.001",
    "initialread": false,
    "notifyreadrequest": false,
    "notifyresponse": false,
    "notifywrite": true,
    "notifyreadrequestalsorespondtobus": false,
    "notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized": "0",
    "listenallga": false,
    "name": "GA Disable",
    "outputtype": "write",
    "outputRBE": false,
    "inputRBE": false,
    "formatmultiplyvalue": "1",
    "formatnegativevalue": "leave",
    "formatdecimalsvalue": "999",
    "passthrough": "no",
    "x": 350,
    "y": 500,
    "wires": [
      []
    ]
  },
  {
    "id": "d1d2d3d4d5d6d7d8",
    "type": "inject",
    "z": "b2c9c84f6cf2d2a2",
    "name": "Photocell TRIP",
    "props": [
      { "p": "payload" }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "true",
    "payloadType": "bool",
    "x": 140,
    "y": 600,
    "wires": [
      [
        "e1e2e3e4e5e6e7e8"
      ]
    ]
  },
  {
    "id": "e1e2e3e4e5e6e7e8",
    "type": "knxUltimate",
    "z": "b2c9c84f6cf2d2a2",
    "server": "0f0e0d0c0b0a0908",
    "topic": "3/0/4",
    "outputtopic": "",
    "dpt": "1.001",
    "initialread": false,
    "notifyreadrequest": false,
    "notifyresponse": false,
    "notifywrite": true,
    "notifyreadrequestalsorespondtobus": false,
    "notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized": "0",
    "listenallga": false,
    "name": "GA Photocell",
    "outputtype": "write",
    "outputRBE": false,
    "inputRBE": false,
    "formatmultiplyvalue": "1",
    "formatnegativevalue": "leave",
    "formatdecimalsvalue": "999",
    "passthrough": "no",
    "x": 360,
    "y": 600,
    "wires": [
      []
    ]
  },
  {
    "id": "0f0e0d0c0b0a0908",
    "type": "knxUltimate-config",
    "host": "224.0.23.12",
    "port": 3671,
    "physAddr": "15.15.22",
    "hostProtocol": "Auto",
    "suppressACKRequest": false,
    "csv": "",
    "KNXEthInterface": "Auto",
    "KNXEthInterfaceManuallyInput": "",
    "stopETSImportIfNoDatapoint": "fake",
    "loglevel": "error",
    "name": "KNX Gateway",
    "delaybetweentelegrams": 25,
    "ignoreTelegramsWithRepeatedFlag": false,
    "keyringFileXML": "",
    "knxSecureSelected": false,
    "secureCredentialsMode": "keyring",
    "tunnelIASelection": "Auto",
    "tunnelIA": "",
    "tunnelInterfaceIndividualAddress": "",
    "tunnelUserPassword": "",
    "tunnelUserId": "",
    "autoReconnect": "yes",
    "statusUpdateThrottle": "0",
    "statusDateTimeFormat": "legacy",
    "statusDateTimeCustom": ""
  }
]
```

</details>
