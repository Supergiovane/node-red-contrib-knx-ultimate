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
| 门锁 | DPT `1.xxx` 命令组地址以 `true` 调用 `lockDoor`、以 `false` 调用 `unlockDoor`；独立状态组地址仅接收明确的已上锁/已解锁状态。如端点要求，远程操作 PIN 保存在凭据字段中。端点未声明的命令会被拒绝。 |
| 其他端点 | Window Covering、Thermostat、Fan 和 Switch 端点使用按能力选择的专用配置；Switch 的初始、长按和多按事件通过可选 flow 输出发送。插座、开关执行器、传感器、电池、功率和电能使用通用映射回退。**映射** 选项卡仅包含端点实际声明的功能；组地址留空即可禁用。 |
| 灯光控制 | 对灯光 endpoint 使用完整灯光 UI：相对调光（DPT `3.007`）、亮度百分比、RGB/HSV、色温、开灯亮度/温度、日/夜模式、最小/最大调光等级和调光速度。不支持的部分会隐藏。 |
| 传感器 | 传感器 endpoint 只在支持时显示对应测量/状态 GA：温度、湿度、照度、占用、接触和电池。 |
| Read at startup | 在部署/启动或设备重新连接时发布缓存的 Matter 值。 |
| Update local state from KNX write | 当配置的 KNX GA 收到写入 telegram 时，更新本地 Matter/KNX 缓存。 |
| Node Input/Output PINs | 显示 Node-RED 输入/输出端口。对于映射端点，Matter 选择器直接放在 `msg` 中：`msg.clusterId` 与 `msg.attribute` 读取属性，并在 `msg.payload` 中输出值；`msg.requestFromRemote = true` 强制从设备读取。添加 `msg.value` 可写入属性，或使用 `msg.clusterId`、`msg.command` 和 `msg.args` 调用命令。数值属性 ID `0` 有效。Door Lock 接受布尔 `msg.payload`（`true` 上锁，`false` 解锁）。重新打开编辑器时会保留此选择。 |

## 行为

节点根据 Matter 更新和 KNX 写入维护本地缓存，用该缓存响应 KNX 读取请求，并可在启动时读取/发送值。节点只监听已配置的组地址，因此会忽略无关的 KNX 流量。
