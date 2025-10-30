---
layout: wiki
title: "HUE Zigbee connectivity"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Zigbee%20connectivity
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Zigbee%20connectivity) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Zigbee%20connectivity) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Zigbee%20connectivity) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Zigbee%20connectivity) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Zigbee%20connectivity) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)

该节点从 HUE 设备读取 Zigbee 连接状态，并发布到 KNX。

在 GA 字段输入 KNX 设备名或组地址，输入时会自动联想。

**常规**

|属性|说明|
|--|--|
| KNX GW | 用于发布状态的 KNX 网关 |
| HUE Bridge | 要使用的 HUE Bridge |
| HUE Sensor | 提供 Zigbee 连接信息的 HUE 传感器/设备（自动补全） |

**映射**

|属性|说明|
|--|--|
| 状态 | 映射 Zigbee 连接性的 KNX 组地址。连接时为 _true_，否则 _false_。|
| 启动时读取状态 | 在启动/重连时读取并发布至 KNX。默认："是”。|

### 输出

1. 标准输出
   : payload (boolean)：连接状态。

### 详情

`msg.payload` 为 true/false。\
`msg.status` 为文本： **connected, disconnected, connectivity\_issue, unidirectional\_incoming** 。
