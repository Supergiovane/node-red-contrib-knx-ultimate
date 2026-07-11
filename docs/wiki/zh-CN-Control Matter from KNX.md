---
layout: wiki
title: "Control Matter from KNX"
lang: zh-CN
permalink: /wiki/zh-CN-Control%20Matter%20from%20KNX
---
# Matter 灯/插座 (BETA)

> 此节点为 **BETA**：Matter 实现继续完善时，行为可能会变化。

此节点控制 Matter 灯或插座，并把支持的 Matter 能力映射到 KNX 组地址。

## 配置

|字段|说明|
|--|--|
| KNX GW | 用于写入并响应已配置组地址的 KNX 网关。如果只需要 Node-RED 输出，可以留空。 |
| Matter controller | 设备已在其中配网的 Matter Controller 配置节点。 |
| Matter 灯/插座 | 从已配网设备中选择 Matter 灯或插座。当所选端点不支持调光、颜色或色温能力时，界面会隐藏对应部分。 |
| Switch | On/Off 命令和状态组地址，通常使用 DPT `1.001`。 |
| Dim | 亮度命令和状态只在端点暴露 `LevelControl` 时可用；百分比值使用 DPT `5.001`。 |
| Tunable White | 色温控制只在端点暴露所需 Matter 色温能力时可用。 |
| RGB/HSV | RGB/HSV 控制只在端点暴露 Matter 颜色能力时可用。 |
| Read at startup | 在部署/启动或设备重新连接时发布缓存的 Matter 值。 |
| Node Input/Output PINs | 显示 Node-RED 输入/输出端口。输入接受布尔 payload，以及 `msg.payload` 或 `msg.on.on` 中的 Matter 风格消息；输出发送状态更新。 |

## 行为

节点根据 Matter 更新和 KNX 写入维护本地缓存，用该缓存响应 KNX 读取请求，并可在启动时读取/发送值。
