---
layout: wiki
title: "zh-CN-Logger-Sample"
lang: it
permalink: /wiki/it-zh-CN-Logger-Sample
---
---
# Campione di registratore
\ <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/logger.png" width = "90%">>
**Copia questo codice e incollalo nel tuo stream**
<Psumo> <summary> Visualizza codice </summary>
> Regola il nodo in base alle impostazioni e imposta il percorso sul nodo file \*\*.

```javascript

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
```

\ </Dettagli>
