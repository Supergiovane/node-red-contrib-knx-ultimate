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

## Tips
- Keep **Drop messages already tagged for this gateway** enabled on each routing node to prevent simple loops.
- Add GA/source filtering and rewrite rules inside **KNX Router Filter**.
