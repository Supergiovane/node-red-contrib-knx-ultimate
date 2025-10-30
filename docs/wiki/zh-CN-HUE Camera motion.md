---
layout: wiki
title: "HUE Camera motion"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Camera%20motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Camera%20motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Camera%20motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Camera%20motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Camera%20motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Camera%20motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Camera%20motion)

Hue Camera Motion 节点监听 Philips Hue 摄像头的运动事件，并将检测到/未检测到的状态映射到 KNX。

在 GA 输入框（名称或组地址）中开始输入，即可关联 KNX GA；输入时会显示匹配的设备。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| HUE Bridge | 选择要使用的 HUE Bridge |
| HUE 传感器 | Hue 摄像头运动传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重新连接时读取当前值并发送到 KNX（默认：否） |

**映射**

|属性|说明|
|--|--|
| 运动 | 摄像头运动的 KNX 组地址（布尔值）。推荐 DPT：<b>1.001</b> |

### 输出

1. 标准输出
   : `msg.payload` (布尔值)：检测到运动时为 `true`，否则为 `false`

### 详细信息

`msg.payload` 保存 Hue 摄像头服务上次报告的运动状态。
