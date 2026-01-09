---
layout: wiki
title: "-Sample---Staircase"
lang: en
permalink: /wiki/-Sample---Staircase
---
# KNX Staircase (sample)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/sample-staircase.svg" width="95%"><br/>

This sample shows how to use the **KNX Staircase** node as a stairwell timer (trigger → light ON → countdown → OFF), with optional override and block inputs.

For the full node reference see: [Staircase configuration](/node-red-contrib-knx-ultimate/wiki/Staircase-Configuration)

## Timer + override/block simulation

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust Group Addresses, DPTs and KNX gateway settings according to your setup.

```json
[
  {
    "id": "a0a0a0a0a0a0a0a0",
    "type": "tab",
    "label": "KNX Staircase sample",
    "disabled": false,
    "info": ""
  },
  {
    "id": "b0b0b0b0b0b0b0b0",
    "type": "comment",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Use TRIGGER/CANCEL to test the timer. Use Override/Block injects to simulate GA inputs.",
    "info": "",
    "x": 370,
    "y": 60,
    "wires": []
  },
  {
    "id": "c0c0c0c0c0c0c0c0",
    "type": "inject",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "TRIGGER",
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
    "y": 140,
    "wires": [
      [
        "d0d0d0d0d0d0d0d0"
      ]
    ]
  },
  {
    "id": "c1c1c1c1c1c1c1c1",
    "type": "inject",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "CANCEL",
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
    "y": 180,
    "wires": [
      [
        "d0d0d0d0d0d0d0d0"
      ]
    ]
  },
  {
    "id": "d0d0d0d0d0d0d0d0",
    "type": "knxUltimateStaircase",
    "z": "a0a0a0a0a0a0a0a0",
    "server": "08090a0b0c0d0e0f",
    "name": "Staircase timer",
    "outputtopic": "staircase",
    "gaTrigger": "4/0/0",
    "nameTrigger": "Trigger",
    "dptTrigger": "1.001",
    "gaOutput": "4/0/1",
    "nameOutput": "Light command",
    "dptOutput": "1.001",
    "gaStatus": "4/0/2",
    "nameStatus": "Status",
    "dptStatus": "1.001",
    "gaOverride": "4/0/3",
    "nameOverride": "Override",
    "dptOverride": "1.001",
    "gaBlock": "4/0/4",
    "nameBlock": "Block",
    "dptBlock": "1.001",
    "timerSeconds": 20,
    "extendMode": "restart",
    "triggerOffCancels": "yes",
    "preWarnEnable": true,
    "preWarnSeconds": 5,
    "preWarnMode": "status",
    "preWarnFlashMs": 400,
    "blockAction": "off",
    "emitEvents": true,
    "x": 370,
    "y": 160,
    "wires": [
      [
        "e0e0e0e0e0e0e0e0"
      ]
    ]
  },
  {
    "id": "e0e0e0e0e0e0e0e0",
    "type": "debug",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Staircase events",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "true",
    "targetType": "full",
    "x": 590,
    "y": 160,
    "wires": []
  },
  {
    "id": "f0f0f0f0f0f0f0f0",
    "type": "comment",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Simulate GA inputs (override/block) via knxUltimate writes.",
    "info": "",
    "x": 330,
    "y": 300,
    "wires": []
  },
  {
    "id": "0101010101010101",
    "type": "inject",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Override ON",
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
    "y": 360,
    "wires": [
      [
        "0202020202020202"
      ]
    ]
  },
  {
    "id": "0303030303030303",
    "type": "inject",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Override OFF",
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
    "y": 400,
    "wires": [
      [
        "0202020202020202"
      ]
    ]
  },
  {
    "id": "0202020202020202",
    "type": "knxUltimate",
    "z": "a0a0a0a0a0a0a0a0",
    "server": "08090a0b0c0d0e0f",
    "topic": "4/0/3",
    "outputtopic": "",
    "dpt": "1.001",
    "initialread": false,
    "notifyreadrequest": false,
    "notifyresponse": false,
    "notifywrite": true,
    "notifyreadrequestalsorespondtobus": false,
    "notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized": "0",
    "listenallga": false,
    "name": "GA Override",
    "outputtype": "write",
    "outputRBE": false,
    "inputRBE": false,
    "formatmultiplyvalue": "1",
    "formatnegativevalue": "leave",
    "formatdecimalsvalue": "999",
    "passthrough": "no",
    "x": 350,
    "y": 380,
    "wires": [
      []
    ]
  },
  {
    "id": "0404040404040404",
    "type": "inject",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Block ON",
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
    "y": 460,
    "wires": [
      [
        "0505050505050505"
      ]
    ]
  },
  {
    "id": "0606060606060606",
    "type": "inject",
    "z": "a0a0a0a0a0a0a0a0",
    "name": "Block OFF",
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
    "y": 500,
    "wires": [
      [
        "0505050505050505"
      ]
    ]
  },
  {
    "id": "0505050505050505",
    "type": "knxUltimate",
    "z": "a0a0a0a0a0a0a0a0",
    "server": "08090a0b0c0d0e0f",
    "topic": "4/0/4",
    "outputtopic": "",
    "dpt": "1.001",
    "initialread": false,
    "notifyreadrequest": false,
    "notifyresponse": false,
    "notifywrite": true,
    "notifyreadrequestalsorespondtobus": false,
    "notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized": "0",
    "listenallga": false,
    "name": "GA Block",
    "outputtype": "write",
    "outputRBE": false,
    "inputRBE": false,
    "formatmultiplyvalue": "1",
    "formatnegativevalue": "leave",
    "formatdecimalsvalue": "999",
    "passthrough": "no",
    "x": 350,
    "y": 480,
    "wires": [
      []
    ]
  },
  {
    "id": "08090a0b0c0d0e0f",
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
