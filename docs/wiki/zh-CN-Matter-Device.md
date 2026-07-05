---
layout: wiki
title: "Matter-Device"
lang: zh-CN
permalink: /wiki/zh-CN-Matter-Device
---
# Matter 设备 (BETA)

> 此节点处于 **BETA** 阶段：可以正常工作，但细节可能在版本之间发生变化。

## 概述

Matter Device 节点在 **Matter 设备**和 **KNX 组地址**之间架起桥梁。该节点通过 *Matter 控制器*配置节点工作，后者将设备调试进自己的 Matter fabric。

- 从 KNX 总线**控制**任何已配对的 Matter 设备（开/关、调光、窗帘、温控器、门锁等）。
- 在 KNX 组地址上**跟踪**设备的每个属性（状态反馈、传感器、功率测量、电池等）。
- 完全通用：映射列表基于设备**真实暴露的端点/集群**构建。

## 配置

|字段|说明|
|--|--|
| KNX 网关 | 用于报文的 KNX 网关 |
| Matter 控制器 | Matter 控制器配置节点（在那里配对设备） |
| 设备 | 通过自动补全选择已配对的 Matter 设备 |
| 映射 | 每行一个组地址 ↔ Matter 集群映射 |
| 启动时读取状态 | 启用后，节点在部署/连接时发送当前缓存的值 |
| 节点输入/输出引脚 | 启用 Node-RED 引脚以进行原始 Matter 访问 |

## 映射

目标列表以易懂的名称显示支持的功能，例如*"开/关"*或*"瞬时功率 (W)"*，按设备实际暴露的功能过滤，并在方括号中显示当前值。

每行映射有一个**方向**：

- **KNX → Matter（命令）**：组地址上收到的报文调用 Matter 集群命令或写入属性。示例：GA `1/1/1` DPT 1.001 → `OnOff.on/off`（布尔值自动选择开或关）。
- **Matter → KNX（状态）**：订阅的 Matter 属性变化时，其值被转换并写入组地址。`GroupValue_Read` 请求以缓存值应答。

常见集群自动转换为适合 KNX 的值：

|集群|转换|
|--|--|
| OnOff | 布尔 (DPT 1.001) |
| LevelControl | 0-254 ↔ 百分比 (DPT 5.001) |
| WindowCovering | percent100ths ↔ 百分比 (DPT 5.001)，上/下 (DPT 1.008) |
| ColorControl | mireds ↔ 开尔文 (DPT 7.600) |
| Thermostat | 厘°C ↔ °C (DPT 9.001) |
| 温度/湿度 | 厘单位 ↔ 单位 (DPT 9.001/9.007) |
| 照度 | 对数刻度 ↔ Lux (DPT 9.004) |
| PowerSource | 半百分比 ↔ 电池百分比 (DPT 5.001) |
| 电功率/电能 | mW ↔ W (DPT 14.056)，mWh ↔ kWh (DPT 13.013) |

其他集群/属性原样传递；您选择的 DPT 执行最终的 KNX 编码。

## 节点引脚

如果启用节点引脚：

- **输入**：发送原始命令：`msg.payload = { endpointId: 1, clusterId: 6, command: "toggle" }` 或属性写入：`msg.payload = { endpointId: 1, clusterId: 8, attribute: "onLevel", value: 128 }`
- **输出**：接收每个属性变化（`msg.matter` 包含完整事件）和每个集群事件（按钮按下等）。
