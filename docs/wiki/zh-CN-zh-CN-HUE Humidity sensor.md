---
layout: wiki
title: "zh-CN-HUE Humidity sensor"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HUE%20Humidity%20sensor
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Humidity%20sensor) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Humidity%20sensor) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Humidity%20sensor) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Humidity%20sensor) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Humidity%20sensor) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Humidity%20sensor)
---

<p>该节点从 HUE 湿度传感器读取相对湿度 (%) 并映射到 KNX。</p>

在 GA 字段中开始输入（名称或组地址）以关联 KNX GA；输入时会显示匹配的设备。

**常规**
|属性|说明|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| HUE Bridge | 选择要使用的 HUE Bridge |
| HUE 传感器 | HUE 湿度传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重新连接时读取当前值并发送到 KNX（默认：否） |

**映射**
|属性|说明|
|--|--|
| 湿度 | 相对湿度%的 KNX GA。推荐 DPT：<b>9.007</b> |

### 输出

1. 标准输出
: `msg.payload`（数字）：当前相对湿度 (%)

### 详情

`msg.payload` 携带湿度的数值（百分比）。
