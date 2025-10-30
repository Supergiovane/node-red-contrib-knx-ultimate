---
layout: wiki
title: "HUE Contact sensor"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Contact%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Contact%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Contact%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Contact%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Contact%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Contact%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor)

该节点将 HUE 接触传感器事件映射到 KNX 组地址。

开始输入GA字段，KNX设备的名称或组地址，可用设备在输入时开始显示。

**一般的**

|属性|描述|
| - | - |
|KNX GW |选择要使用的KNX门户|
|色相桥|选择要使用的色调桥|
| HUE Sensor | 要使用的 HUE 接触传感器（自动补全） |

|属性|描述|
|-------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 联系 | 传感器开/合时：发送 KNX 值 _true_（激活/打开），否则 _false_ |

### 输出

1. 标准输出
   ：有效载荷（布尔值）：命令的标准输出。

### 细节

`msg.payload` 为 HUE 事件（布尔/对象），可用于自定义逻辑。
