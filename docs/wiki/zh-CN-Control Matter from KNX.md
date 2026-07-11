---
layout: wiki
title: "Control Matter from KNX"
lang: zh-CN
permalink: /wiki/zh-CN-Control%20Matter%20from%20KNX
---
# 从 KNX 控制 Matter (BETA)

> 此节点为 **BETA**：Matter 实现继续完善时，行为可能会变化。

此节点用于从 KNX 控制已经配对的 Matter endpoint。选择 Matter 设备后，编辑器会检测它的能力，并只显示与该 endpoint 匹配的 KNX 映射。

它替代未发布的多个专用 Matter 控制节点；当选择的 endpoint 是灯时，仍保留完整的灯光 UI。

## 配置

|字段|说明|
|--|--|
| KNX GW | 用于写入并响应已配置组地址的 KNX 网关。如果只需要 Node-RED 输出，可以留空。 |
| Matter controller | 设备已在其中配网的 Matter Controller 配置节点。 |
| Matter device | 从已配对设备中选择的 Matter endpoint。UI 会根据真实能力重新构建。 |
| Switch / 插座 / 灯 On-Off | On/Off 命令和状态组地址，通常使用 DPT `1.001`。 |
| 灯光控制 | 对灯光 endpoint 使用完整灯光 UI：相对调光（DPT `3.007`）、亮度百分比、RGB/HSV、色温、开灯亮度/温度、日/夜模式、最小/最大调光等级和调光速度。不支持的部分会隐藏。 |
| 传感器 | 传感器 endpoint 只在支持时显示对应测量/状态 GA：温度、湿度、照度、占用、接触和电池。 |
| Read at startup | 在部署/启动或设备重新连接时发布缓存的 Matter 值。 |
| Update local state from KNX write | 当配置的 KNX GA 收到写入 telegram 时，更新本地 Matter/KNX 缓存。 |
| Node Input/Output PINs | 显示 Node-RED 输入/输出端口。输入接受布尔 payload，以及 `msg.payload` 或 `msg.on.on` 中的 Matter 风格消息；输出发送状态更新。 |

## 行为

节点根据 Matter 更新和 KNX 写入维护本地缓存，用该缓存响应 KNX 读取请求，并可在启动时读取/发送值。节点只监听已配置的组地址，因此会忽略无关的 KNX 流量。
