---
layout: wiki
title: "zh-CN-HUE Motion"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HUE%20Motion
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Motion) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Motion) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Motion) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Motion) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Motion) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion)
---

<p>该节点订阅 Hue 运动传感器的事件，并将其同步到 KNX 以及 Node-RED 流程。</p>

在 GA 字段输入 KNX 设备名称或组地址即可自动补全；"Hue 传感器”旁的刷新按钮可重新加载 Hue 设备列表。

**常规**
|属性|说明|
| - | - |
|KNX GW |接收运动状态的 KNX 网关（选择后才显示 KNX 设置）|
|Hue Bridge|使用的 Hue 网桥|
| Hue 传感器 | 要使用的 Hue 运动传感器（支持自动补全与刷新）|

**映射**
|属性|说明|
|--|--|
| 运动 | 对应的 KNX 组地址；检测到运动时发送 `true`，恢复空闲时发送 `false`（推荐 DPT：<b>1.001</b>）|

**行为**
|属性|说明|
|--|--|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出；未选择 KNX 网关时会保持启用，确保 Hue 事件仍能进入流程 |

> ℹ️ 未选择 KNX 网关时，KNX 字段会自动隐藏，可将节点用作纯 Hue → Node-RED 监听器。

### 输出

1. 标准输出 — `msg.payload` (boolean)
: 侦测到运动为 `true`，运动结束为 `false`。
