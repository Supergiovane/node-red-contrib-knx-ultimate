---
layout: wiki
title: "zh-CN-Logger-Sample"
lang: de
permalink: /wiki/de-zh-CN-Logger-Sample
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Sample) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Sample) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Sample) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Sample) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Sample)
---

# Recorder -Probe

\ <img src = "https://raw.githubuSercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/logger.png" width = "90%">

**Kopieren Sie diesen Code und fügen Sie ihn in Ihren Stream ein**

<details> <summary> Code anzeigen </summary>

> Passen Sie den Knoten entsprechend Ihren Einstellungen an und setzen Sie den Pfad zum Dateiknoten \*\*.```javascript

[
    {
        "id": "b8e9e444.0af1f",
        "type": "knxUltimateLogger",
        "z": "9b496263.064388",
        "server": "55dbcdcf.4aacdc",
        "topic": "Logger",
        "intervalCreateETSXML": "15",
        "name": "",
        "autoStartTimerCreateETSXML": true,
        "maxRowsInETSXML": "0",
        "x": 340,
        "y": 200,
        "wires": [
            [
                "d46f6877.010698"
            ]
        ]
    },
    {
        "id": "d46f6877.010698",
        "type": "file",
        "z": "9b496263.064388",
        "name": "",
        "filename": "",
        "appendNewline": true,
        "createDir": false,
        "overwriteFile": "true",
        "encoding": "none",
        "x": 530,
        "y": 200,
        "wires": [
            []
        ]
    },
    {
        "id": "55dbcdcf.4aacdc",
        "type": "knxUltimate-config",
        "z": "",
        "host": "224.0.23.12",
        "port": "3671",
        "physAddr": "15.15.22",
        "suppressACKRequest": false,
        "csv": "",
        "KNXEthInterface": "en9",
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

```\ </Detail>
