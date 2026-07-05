---
layout: wiki
title: "Matter-Bridge"
lang: zh-CN
permalink: /wiki/zh-CN-Matter-Bridge
---
# Matter Bridge (BETA)

> 此节点处于 **BETA** 阶段：可以正常工作，但细节可能在版本之间发生变化。

## 概述

Matter Bridge 节点将 **KNX 组地址作为 Matter 设备**公开：Alexa、Google Home、Apple Home（或任何 Matter 控制器）只需配对此桥接器**一次**，即可看到您配置的所有 KNX 设备（使用您输入的名称），随时可通过 App 和语音控制。

这与 *Matter Device* 节点方向相反：那里是 KNX 控制 Matter 设备，这里是 Matter 控制器控制 KNX。

## 配置

|字段|说明|
|--|--|
| KNX 网关 | 用于报文的 KNX 网关。**可选**：没有网关时桥接器以纯 Flow 模式工作——启用节点引脚并用 Flow 消息驱动每个设备 |
| Matter 桥接器名称 | 桥接器本身在 Matter App 中显示的名称 |
| 端口 | Matter 服务器的 UDP 端口（默认 5540）。每个 Node-RED 实例只能有一个桥接器节点。 |
| 设备 | 在 Matter 上公开的 KNX 虚拟设备（见下文） |
| 启动时读取状态组地址 | 启动时向每个状态 GA 发送 `GroupValue_Read`，以填充 Matter 属性 |

## 设备

每一行都是 Alexa 等显示的一个设备。选择**类型**，输入助手将使用的**名称**，然后填写组地址（带 ETS 自动补全）：

|类型|组地址|
|--|--|
| 开关灯、插座 | 开/关命令 GA、开/关状态 GA (DPT 1.001) |
| 调光灯 | + 调光 % 命令/状态 GA (DPT 5.001) |
| RGB 彩色灯 | + RGB 颜色命令/状态 GA (DPT 232.600)。Matter 颜色（hue/saturation 或 XY，来自 App 的色轮）与 KNX RGB 三元组相互转换 |
| 色温灯 | + 色温命令/状态 GA，开尔文 (DPT 7.600) |
| 窗帘/卷帘 | 上/下 (DPT 1.008)、停止 (DPT 1.017)、位置 % 命令/状态 (DPT 5.001)、可选位置反转 |
| 温控器（采暖） | 当前温度 GA、设定点命令/状态 GA (DPT 9.001) |
| 风扇/新风 | 速度 % 命令/状态 GA (DPT 5.001) |
| 传感器（温度、湿度、光照、人体、门磁） | 各一个状态 GA |
| 烟雾/CO 报警器 | 烟雾报警状态 GA + 可选 CO 报警状态 GA (DPT 1.005)：手机上的紧急通知 |
| 漏水探测器 | 漏水状态 GA (DPT 1.005) |
| 空气质量传感器 (CO2) | CO2 状态 GA，ppm (DPT 9.008)；空气质量等级（好/一般/中等/差...）自动推导 |
| 扫地机器人 | **仅 Flow**：无组地址。启用节点引脚：助手的命令（"开始清扫"、暂停/继续/回充）作为 `rvcmode`/`rvccommand` 到达输出；用 `msg.payload = { device, function: "rvcstate", value: "running"\|"docked"\|"charging"\|"paused"\|"error" }` 报告状态，用 `function: "rvcmode", value: "cleaning"\|"idle"` 报告模式。用任何 Node-RED 节点集成您的 Roomba/Roborock 并公开给 Alexa/Apple |

- **命令 GA**：助手发送命令时写入 KNX 总线。
- **状态 GA**：从总线读取，保持 Matter 属性（和 App）更新。

## 配对

1. **部署**，等待几秒，然后重新打开节点。
2. 配对面板显示**二维码**和**手动配对码**：在 Alexa / Google Home / Apple Home 中扫描或输入（"添加 Matter 设备"）。
3. 多个控制器可以与同一个桥接器配对（Matter 多 fabric）。

**重置配对**按钮会移除所有已配对的控制器并重新开始配对广播。

## 节点引脚

如果启用节点的输入/输出引脚：

- **输入**：从 Flow 更新虚拟设备的 Matter 状态，无需经过 KNX 总线：`msg.payload = { device: "厨房灯", function: "onoff", value: true }`（`device` 接受名称或内部 id；`function` 为 `onoff`、`level`、`position`、`temperature`、`humidity`、`illuminance`、`occupancy`、`contact`、`currenttemp`、`setpoint` 之一）。适合把 Flow 中计算的值（如虚拟传感器）公开给 Alexa 等。
- **输出**：从 Matter 控制器收到的每个命令都转发到 Flow：`msg.topic` = 设备名称，`msg.payload` = 值，`msg.matter` = 原始命令。没有命令 GA 的设备成为**纯 Flow 设备**：命令到达您的 Flow，由您决定如何处理。

## 说明

- Node-RED 主机必须启用 **IPv6 link-local**（Matter 标准要求），并且控制器可在本地网络访问到它。
- 桥接器身份保存在 Node-RED 用户目录的 `knxultimatestorage/matter` 中：重新部署**不**需要重新配对。
- 设备重命名和新增会被控制器自动识别；移除的设备会从 App 中消失。
