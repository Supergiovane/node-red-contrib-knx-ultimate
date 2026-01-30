---
layout: wiki
title: "-Sample---KNX-Multi-Routing"
lang: en
permalink: /wiki/-Sample---KNX-Multi-Routing
---
# KNX Multi Routing (sample)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/sample-knx-multi-routing.svg" width="95%"><br/>

This sample shows how to **bridge two or more KNX Ultimate gateways** by forwarding RAW telegram objects through Node-RED.

For the full node reference see:

- [KNX Multi Routing](/node-red-contrib-knx-ultimate/wiki/KNX%20Multi%20Routing)
- [KNX Router Filter](/node-red-contrib-knx-ultimate/wiki/KNX%20Router%20Filter) (optional but recommended)

## Bridge two gateways (A ↔ B) with Router Filter

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Edit the two `knxUltimate-config` nodes at the bottom of the flow (Gateway A and Gateway B).

```json
[
  {
    "id": "tab_knx_mr_sample",
    "type": "tab",
    "label": "KNX Multi Routing sample",
    "disabled": false,
    "info": ""
  },
  {
    "id": "cmt_knx_mr_1",
    "type": "comment",
    "z": "tab_knx_mr_sample",
    "name": "Bridge two KNX Ultimate gateways (A ↔ B) using RAW telegram objects + Router Filter.",
    "info": "",
    "x": 390,
    "y": 40,
    "wires": []
  },
  {
    "id": "mr_gateway_a",
    "type": "knxUltimateMultiRouting",
    "z": "tab_knx_mr_sample",
    "server": "cfg_knx_mr_a",
    "name": "Gateway A (out/in)",
    "outputtopic": "GW-A",
    "dropIfSameGateway": true,
    "x": 170,
    "y": 140,
    "wires": [
      [
        "rf_a_to_b"
      ]
    ]
  },
  {
    "id": "mr_gateway_b",
    "type": "knxUltimateMultiRouting",
    "z": "tab_knx_mr_sample",
    "server": "cfg_knx_mr_b",
    "name": "Gateway B (out/in)",
    "outputtopic": "GW-B",
    "dropIfSameGateway": true,
    "x": 930,
    "y": 140,
    "wires": [
      [
        "rf_b_to_a"
      ]
    ]
  },
  {
    "id": "rf_a_to_b",
    "type": "knxUltimateRouterFilter",
    "z": "tab_knx_mr_sample",
    "name": "A → B filter",
    "allowWrite": true,
    "allowResponse": true,
    "allowRead": true,
    "gaMode": "off",
    "gaPatterns": "",
    "srcMode": "off",
    "srcPatterns": "",
    "rewriteGA": true,
    "gaRewriteRules": "0/0/* => 2/0/*",
    "rewriteSource": false,
    "srcRewriteRules": "",
    "x": 390,
    "y": 140,
    "wires": [
      [
        "mr_gateway_b"
      ],
      [
        "dbg_mr_drop_a_to_b"
      ]
    ]
  },
  {
    "id": "rf_b_to_a",
    "type": "knxUltimateRouterFilter",
    "z": "tab_knx_mr_sample",
    "name": "B → A filter",
    "allowWrite": true,
    "allowResponse": true,
    "allowRead": true,
    "gaMode": "off",
    "gaPatterns": "",
    "srcMode": "off",
    "srcPatterns": "",
    "rewriteGA": false,
    "gaRewriteRules": "",
    "rewriteSource": false,
    "srcRewriteRules": "",
    "x": 710,
    "y": 140,
    "wires": [
      [
        "mr_gateway_a"
      ],
      [
        "dbg_mr_drop_b_to_a"
      ]
    ]
  },
  {
    "id": "dbg_mr_drop_a_to_b",
    "type": "debug",
    "z": "tab_knx_mr_sample",
    "name": "Dropped A→B",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload.knxRouterFilter",
    "targetType": "msg",
    "x": 410,
    "y": 200,
    "wires": []
  },
  {
    "id": "dbg_mr_drop_b_to_a",
    "type": "debug",
    "z": "tab_knx_mr_sample",
    "name": "Dropped B→A",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload.knxRouterFilter",
    "targetType": "msg",
    "x": 710,
    "y": 200,
    "wires": []
  },
  {
    "id": "cfg_knx_mr_a",
    "type": "knxUltimate-config",
    "z": "",
    "host": "224.0.23.12",
    "port": "3671",
    "physAddr": "15.15.201",
    "suppressACKRequest": false,
    "csv": "",
    "KNXEthInterface": "Auto",
    "KNXEthInterfaceManuallyInput": "",
    "autoReconnect": "yes"
  },
  {
    "id": "cfg_knx_mr_b",
    "type": "knxUltimate-config",
    "z": "",
    "host": "224.0.23.12",
    "port": "3671",
    "physAddr": "15.15.202",
    "suppressACKRequest": false,
    "csv": "",
    "KNXEthInterface": "Auto",
    "KNXEthInterfaceManuallyInput": "",
    "autoReconnect": "yes"
  }
]
```

</details>

## KNX/IP tunneling server (standalone) - Server KNX/IP mode

This sample starts a **KNXnet/IP tunneling server (UDP)** using `knxUltimateMultiRouting` in **Server KNX/IP** mode.

You can also import it directly from the repository examples:
- `examples/KNX Multi Routing - KNXIP Server.json`

<details><summary>View code</summary>

```json
[
  {
    "id": "tab_knx_mr_srv_sample",
    "type": "tab",
    "label": "KNX/IP Server (MultiRouting)",
    "disabled": false,
    "info": ""
  },
  {
    "id": "cmt_knx_mr_srv_1",
    "type": "comment",
    "z": "tab_knx_mr_srv_sample",
    "name": "Use knxUltimateMultiRouting as a standalone KNXnet/IP Tunneling Server (UDP).",
    "info": "1) Deploy.\n2) Configure your KNX/IP tunneling client to connect to this Node-RED host on tunnelListenPort (default 3671).\n3) Watch the RAW telegrams in the Debug node.\n\nTo test the INPUT side: after at least one telegram is received, click the inject node \"Replay last\" to inject the last received telegram back to connected tunneling client(s).",
    "x": 430,
    "y": 40,
    "wires": []
  },
  {
    "id": "mr_tunnel_server",
    "type": "knxUltimateMultiRouting",
    "z": "tab_knx_mr_srv_sample",
    "mode": "server",
    "server": "",
    "name": "KNX/IP Tunneling Server",
    "outputtopic": "",
    "dropIfSameGateway": true,
    "tunnelListenHost": "0.0.0.0",
    "tunnelListenPort": "3671",
    "tunnelAdvertiseHost": "",
    "tunnelAssignedIndividualAddress": "15.15.255",
    "tunnelGatewayId": "knxip-server",
    "tunnelMaxSessions": "1",
    "x": 240,
    "y": 160,
    "wires": [
      [
        "fn_cache_last",
        "dbg_tunnel_raw"
      ]
    ]
  },
  {
    "id": "dbg_tunnel_raw",
    "type": "debug",
    "z": "tab_knx_mr_srv_sample",
    "name": "RAW from tunneling client",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload.knx",
    "targetType": "msg",
    "x": 520,
    "y": 160,
    "wires": []
  },
  {
    "id": "fn_cache_last",
    "type": "function",
    "z": "tab_knx_mr_srv_sample",
    "name": "Cache last telegram",
    "func": "try {\n    if (msg && msg.payload && msg.payload.knx) {\n        flow.set('last_knx_raw', msg.payload.knx);\n    }\n} catch (e) {}\nreturn null;",
    "outputs": 0,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 500,
    "y": 220,
    "wires": []
  },
  {
    "id": "inj_replay_last",
    "type": "inject",
    "z": "tab_knx_mr_srv_sample",
    "name": "Replay last",
    "props": [
      {
        "p": "payload"
      }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 170,
    "y": 300,
    "wires": [
      [
        "fn_replay_last"
      ]
    ]
  },
  {
    "id": "fn_replay_last",
    "type": "function",
    "z": "tab_knx_mr_srv_sample",
    "name": "Build replay msg",
    "func": "const last = flow.get('last_knx_raw');\nif (!last) {\n    node.warn('No cached telegram yet. Generate one from a tunneling client first.');\n    return null;\n}\n\n// IMPORTANT:\n// - Server mode expects msg.payload.knx.cemi.hex (or msg.payload.knx.cemi) to be present.\n// - Do NOT attach knxMultiRouting.gateway.id here, otherwise dropIfSameGateway may discard it.\nreturn {\n    topic: last.destination || '',\n    payload: {\n        knx: last\n    }\n};",
    "outputs": 1,
    "noerr": 0,
    "initialize": "",
    "finalize": "",
    "libs": [],
    "x": 360,
    "y": 300,
    "wires": [
      [
        "mr_tunnel_server",
        "dbg_replay"
      ]
    ]
  },
  {
    "id": "dbg_replay",
    "type": "debug",
    "z": "tab_knx_mr_srv_sample",
    "name": "Replay msg",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "true",
    "targetType": "full",
    "x": 520,
    "y": 300,
    "wires": []
  }
]
```

</details>

## Tips
- Keep **Drop messages already tagged for this gateway** enabled on each routing node to prevent simple loops.
- Add GA/source filtering and rewrite rules inside **KNX Router Filter**.
