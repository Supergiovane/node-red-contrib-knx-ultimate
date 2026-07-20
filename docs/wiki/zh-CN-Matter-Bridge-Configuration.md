---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-Matter-Bridge-Configuration
---
# Matter 桥接器 (BETA)

> 此节点处于 **BETA** 阶段：可以正常工作，但细节可能在版本之间发生变化。

## 概述

此配置节点就是 **Matter 桥接器本身**：它运行 Matter 服务器，Alexa、Google Home、Apple Home（或任何 Matter 控制器）只需配对**一次**。流程中的每个 **Matter Bridge device** 节点都指向这里，并在 App 中显示为桥接器的一个设备。

Matter Bridge 设备编辑器将**映射**和**高级选项**作为左侧垂直选项卡排列，与 Matter Controller 保持一致。

## 配置

|字段|说明|
|--|--|
| 名称 | 此配置节点在 Node-RED 中的名称 |
| Matter 桥接器名称 | 桥接器本身在 Matter App 中显示的名称。**留空则使用此节点的名称。** |
| 端口 | Matter 服务器的 UDP 端口（默认 5540）。每个桥接器需要独立的端口，因此可以运行**多个独立的桥接器** |

## 配对

1. **部署**，等待几秒，然后重新打开此节点。
2. 配对面板显示**二维码**和**手动配对码**：在 Alexa / Google Home / Apple Home 中扫描或输入（"添加 Matter 设备"）。
3. 多个控制器可以与同一个桥接器配对（Matter 多 fabric）。

二维码隐藏后如需添加其他控制器，请从一个已配对的控制器开启配对模式，然后在新控制器中添加 Matter 设备。仅在需要移除所有现有控制器并重新开始时使用**重置配对**。

**重置配对**按钮会移除所有已配对的控制器并重新开始配对广播。

## 身份与存储

桥接器身份与此配置节点绑定，保存在 Node-RED 用户目录的 `knxultimatestorage/matter` 中：重新部署（即使更改端口或名称）**不**需要重新配对。只有删除此配置节点并新建一个才会改变身份——此时请从 Matter App 中移除旧桥接器并重新配对。

使用 **导出** 下载此网桥实例的完整备份，其中包含 Fabric、私有凭据、会话和配对数据。**请像密码一样保护此文件。** 导入会替换此实例的存储并短暂重启网桥。网桥备份不能导入控制器。

## 说明

- Node-RED 主机必须启用 **IPv6 link-local**（Matter 标准要求），并且控制器可在本地网络访问到它。
- 添加/重命名/移除的设备节点会在几秒内被已配对的控制器识别，无需重新配对。
- **名称：** Alexa 和 Google Home 会采用你在此设置的名称（桥接器名称和设备节点名称）。**Apple Home 会忽略它们，并要求你在配置过程中手动为每个配件命名**——这是 Apple 的限制，而非桥接器的问题。
