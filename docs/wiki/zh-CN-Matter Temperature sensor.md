---
layout: wiki
title: "Matter Temperature sensor"
lang: zh-CN
permalink: /wiki/zh-CN-Matter%20Temperature%20sensor
---
# Matter 温度传感器 (BETA)

> 此节点为 **BETA**：Matter 实现继续完善时，行为可能会变化。

此节点把 温度端点 连接到 KNX，也可以连接到 Node-RED 输出。

## 配置

|字段|说明|
|--|--|
| KNX GW | 用于写入并响应已配置组地址的 KNX 网关。如果只需要 Node-RED 输出，可以留空。 |
| Matter controller | 设备已在其中配网的 Matter Controller 配置节点。 |
| Matter 温度传感器 | 从已配网设备中选择的 温度端点。列表会过滤为暴露 `TemperatureMeasurement` 的端点。 |
| 温度组地址 | 温度组地址，接收转换后的值。默认 DPT：`9.001`。 |
| Read at startup | 在部署/启动或设备重新连接时发布缓存的 Matter 值。 |
| Node output | 显示 Node-RED 输出端口，并发送每一次 Matter 更新。 |

## 行为

节点读取 `TemperatureMeasurement.measuredValue`，转换为摄氏温度，写入配置的 KNX 组地址，并用最后已知值响应 KNX 读取请求。
