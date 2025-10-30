---
layout: wiki
title: "HUE Battery"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Battery
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Battery) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Battery) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Battery) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Battery) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Battery) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery)

该节点会将 Hue 设备的电池电量同步到 KNX，并在数值变化时触发事件。

在 GA 字段输入 KNX 设备名称或组地址即可自动补全；点击"Hue 传感器”旁的刷新按钮可重新加载 Hue 设备列表。

**常规**

|属性|说明|
|--|--|
| KNX GW | 发布电量的 KNX 网关（选择后才会显示 KNX 映射设置）。|
| Hue Bridge | 使用的 Hue 网桥。|
| Hue 传感器 | 提供电量信息的 Hue 设备/传感器（支持自动补全与刷新）。|

**映射**

|属性|说明|
|--|--|
| 电量 | 电池百分比的 KNX 组地址（0-100%），推荐 DPT：<b>5.001</b>。|

**行为**

|属性|说明|
|--|--|
| 启动时读取状态 | 部署/重连时读取当前电量并发布到 KNX。默认值："是”。|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出。当未选择 KNX 网关时，输出引脚会保持启用，确保 Hue 事件仍能进入流程。|

> ℹ️ 未选择 KNX 网关时，KNX 映射字段会自动隐藏，便于将节点作为纯 Hue → Node-RED 事件源使用。
