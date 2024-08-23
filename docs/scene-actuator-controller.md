# Scene actuator controller

## CONTROLLING A SCENE ACTUATOR

The node is able to control a scene actuator already present and configured in your KNX installation, having group addres with Datapoint 18.001.\
This has not to be mistaken with the **SCENE CONTROLLER** node.\
If you're searching for **SCENE CONTROLLER** node, [click here.](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)\


![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/scenecontrollerdpt18.png)\


**Copy this code and paste it into your flow**

<details>

<summary>View code</summary>

Adjust the nodes according to your setup

```javascript

[
    {
        "id": "35d7d4f5.61a1e4",
        "type": "knxUltimate",
        "z": "764badf.d348654",
        "server": "dee0436c.30e19",
        "topic": "0/1/23",
        "outputtopic": "",
        "dpt": "18.001",
        "initialread": false,
        "notifyreadrequest": false,
        "notifyresponse": false,
        "notifywrite": true,
        "notifyreadrequestalsorespondtobus": false,
        "notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized": "0",
        "listenallga": false,
        "name": "MDT Dinning Room  Scene Controller ",
        "outputtype": "write",
        "outputRBE": false,
        "inputRBE": false,
        "formatmultiplyvalue": 1,
        "formatnegativevalue": "leave",
        "formatdecimalsvalue": 999,
        "passthrough": "no",
        "x": 390,
        "y": 140,
        "wires": [
            [
                "703116e5.31d"
            ]
        ]
    },
    {
        "id": "4dbfd5b4.de9a8c",
        "type": "inject",
        "z": "764badf.d348654",
        "name": "Recall scene n.2",
        "topic": "",
        "payload": "{\"save_recall\":0, \"scenenumber\":2}",
        "payloadType": "json",
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 120,
        "y": 120,
        "wires": [
            [
                "35d7d4f5.61a1e4"
            ]
        ]
    },
    {
        "id": "703116e5.31d",
        "type": "debug",
        "z": "764badf.d348654",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "x": 630,
        "y": 140,
        "wires": []
    },
    {
        "id": "b7ac41b3.634ad",
        "type": "inject",
        "z": "764badf.d348654",
        "name": "Save scene n.2",
        "topic": "",
        "payload": "{\"save_recall\":1, \"scenenumber\":2}",
        "payloadType": "json",
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "x": 120,
        "y": 160,
        "wires": [
            [
                "35d7d4f5.61a1e4"
            ]
        ]
    },
    {
        "id": "d58f9e9.7c0e56",
        "type": "comment",
        "z": "764badf.d348654",
        "name": "Recall and save scene",
        "info": "To save and recall scene, use payload:{\"save_recall\":0, \"scenenumber\":2}\n\nsave_recall = 0 recalls the scene\nsave_recall = 1 saves the scene\n\nscenenumber is the number of the scene to be recalled or saved",
        "x": 120,
        "y": 80,
        "wires": []
    },
    {
        "id": "dee0436c.30e19",
        "type": "knxUltimate-config",
        "z": "",
        "host": "224.0.23.12",
        "port": "3671",
        "physAddr": "15.15.22",
        "suppressACKRequest": false,
        "csv": "",
        "KNXEthInterface": "Auto",
        "KNXEthInterfaceManuallyInput": "",
        "statusDisplayLastUpdate": true,
        "statusDisplayDeviceNameWhenALL": true,
        "statusDisplayDataPoint": false,
        "stopETSImportIfNoDatapoint": "stop",
        "loglevel": "error",
        "name": "Gateway",
        "localEchoInTunneling": true
    }
]

```

</details>

\
\
\


**Function node to recall or save a scene from/to a scene actuator**

```javascript

// To save and recall scene, use payload:{save_recall:0, scenenumber:2}
// save_recall = 0 recalls the scene
// save_recall = 1 saves the scene
// scenenumber is the number of the scene to be recalled or saved
return {payload:{save_recall:0, scenenumber:2}};

```
