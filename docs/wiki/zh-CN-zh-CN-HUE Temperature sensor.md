---
layout: wiki
title: "zh-CN-HUE Temperature sensor"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HUE%20Temperature%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Temperature%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Temperature%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Temperature%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Temperature%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Temperature%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor)
---

<p>此节点读取 HUE 温度传感器的温度（°C），并将其映射到 KNX。</p>

在 GA 字段（名称或组地址）中输入以关联 KNX GA；输入时会显示设备建议。

**一般的**
|属性|描述|
|--|--|
| KNX GW | 选择要使用的 KNX 网关 |
| HUE Bridge | 选择要使用的 HUE Bridge |
| HUE 传感器 | HUE 温度传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重连时读取当前值并发送到 KNX（默认：否） |

**映射**
|属性|描述|
|--|--|
| 温度 | 温度（°C）的 KNX GA。推荐 DPT：<b>9.001</b> |

### 输出

1. 标准输出
: `msg.payload`（number）：当前温度（°C）

### 详情

`msg.payload` 包含数值型温度。
