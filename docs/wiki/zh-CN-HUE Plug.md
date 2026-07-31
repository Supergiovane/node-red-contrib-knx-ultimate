---
layout: wiki
title: "HUE Plug"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Plug
---
> **已弃用：**此专用 HUE 节点仍可用于现有流程。新项目请使用 **HUE Controller**。该节点会在节点面板和画布上标记为 `(deprecated)`，颜色比 HUE Controller 更浅，编辑器顶部也会显示迁移提示。 此编辑器中的橙色迁移按钮会打开与 HUE Controller 相同的完整流程转换器。

# Hue 插座 / Plug

## 概述

Hue Plug 节点将飞利浦 Hue 智能插座映射到 KNX 组地址，实现：

- 总线上的开/关控制；
- 来自 Hue 平台的状态反馈；
- 可选的 `power_state`（on/standby）监控。

## 配置

|字段|说明|
|--|--|
| KNX 网关 | 使用的 KNX 网关 |
| Hue Bridge | 使用的 Hue Bridge |
| 名称 | 要控制的 Hue 插座（自动提示） |
| 控制 | 发送开/关的 KNX 组地址（布尔 DPT） |
| 状态 | Hue 报告的开/关状态接收地址 |
| 电源状态 | 映射 Hue `power_state` 的可选组地址 |
| 启动时读取状态 | 部署时立即发送当前状态 |
| 引脚 | 启用 Node-RED 输入/输出引脚，用于高级控制或事件转发 |

## KNX 建议

- 控制与状态建议使用 DPT 1.xxx。
- `power_state` 可映射为布尔值（true=on, false=standby），或使用文本类 DPT 显示原始字符串。
- 接收到 KNX 读取 (`GroupValue_Read`) 时，节点返回缓存的 Hue 状态。

## Flow 集成

当启用引脚时：

- **输入** ：发送 Hue v2 载荷（如 `{ on: { on: true } }`）。
- **输出** ：在每次 Hue 事件时输出 `{ payload, on, power_state, rawEvent }`。

## Hue API

节点调用 `/resource/plug/{id}`。Hue 事件流用于捕获状态变化并同步到 KNX。
