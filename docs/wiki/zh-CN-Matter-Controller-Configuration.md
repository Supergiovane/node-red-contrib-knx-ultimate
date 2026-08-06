---
layout: wiki
title: "Matter-Controller-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-Matter-Controller-Configuration
---
# Matter 控制器

<div data-matter-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#241047 0%,#5531a7 55%,#8b5cf6 100%);box-shadow:0 14px 30px rgba(36,16,71,0.25);color:#faf7ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#e3d7ff;">Matter Fabric · 配网 · KNX</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">您的 Matter Fabric，由您掌控。</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#faf7ff;">通过 IP 网络配网设备，并将端点提供给 KNX 与 Node-RED。在一个配置节点中完成配对、监控、备份和移除。</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">本地 Fabric</strong><span style="font-size:0.76rem;color:#eee7ff;">私有凭据</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">二维码 + 手动</strong><span style="font-size:0.76rem;color:#eee7ff;">配对码</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">导出 / 导入</strong><span style="font-size:0.76rem;color:#eee7ff;">受保护的备份</span></div>
  </div>
</div>

## 一个控制器覆盖完整生命周期

| 领域 | 功能范围 |
|---|---|
| **配网** | Matter QR Payload、摄像头或图片扫描、手动代码，以及通过 WiFi、以太网或 Thread 的多 Fabric 配对。 |
| **设备管理** | 已配对设备清单、连接状态、安全移除和每台设备独立的命令队列。 |
| **KNX 与 Node-RED** | 端点映射、通用模式、动态命令和通用电池监视器。 |
| **可靠性与存储** | 持久化 Fabric、实例备份/恢复、不可用设备门控和自动恢复。 |

## 四步开始

1. 添加 Matter Controller 并先**部署**。
2. 重新打开，用 Matter QR Payload 或手动配对码配网一台设备。
3. 添加 **Control Matter from KNX**，选择设备及其配置。
4. 映射 KNX 组地址，或启用 Node-RED 引脚，然后部署。

> **提示：**优先使用 `MT:...` QR Payload：它包含完整判别器，而 11 位手动代码只包含短判别器。

## 技术概述

此配置节点是一个完整的 **Matter 控制器**：它创建自己的 Matter *fabric* 并将您的 Matter 设备配对（调试）进来。配对后的设备可供 **Matter Device** 节点使用，将它们映射到 KNX 组地址。

控制器通过 **IP 网络**（WiFi、以太网或经边界路由器的 Thread）与设备通信。不支持蓝牙配对：设备必须已经可以通过网络访问。

## 配对设备

1. 先**部署**此配置节点（控制器必须已运行）。
2. 重新打开节点并输入**配对码**：11 位手动配对码（例如 `3497-011-2332`）或二维码内容（`MT:....`）。
3. 对于手动输入的配对码，请点击**配对**。通过**摄像头**或**图片**读取二维码后会自动开始配对。调试过程最多可能需要一分钟。

无需手动输入二维码 payload：点击**摄像头**可实时扫描，点击**图片**可从本地照片读取。支持浅色背景上的标准深色二维码以及深色背景上的反白二维码。解码完全在浏览器中进行；读取到有效的 Matter 二维码后，编辑器会填写配对码并立即自动开始配对。如需设置可选设备名称，请在扫描前填写。手动输入的配对码仍需点击**配对**才会开始。实时使用摄像头要求通过 HTTPS 或从 `localhost` 打开编辑器；若条件不满足，编辑器会说明此限制，而图片加载功能仍然可用。

配对期间，阻塞式面板会覆盖编辑器并阻止进一步点击，直到操作成功完成或失败。进度条跟随 matter.js 的实际阶段，并以英文显示当前操作。当设备公开产品身份时，面板还会显示产品名称、Vendor ID 和 Product ID。

如果设备是全新的且仅支持蓝牙配对，请先用厂商 App 或其他 Matter 控制器（Alexa、Google Home、Apple Home）配对，然后使用其**"与其他中枢共享/配对"**功能为 KNX-Ultimate 生成新的配对码。这样设备可以同时加入多个 fabric。

优先使用二维码 payload（`MT:...`），因为它包含完整的鉴别码。手动配对码只包含短鉴别码；当多个相同型号同时处于配对模式时，可能会选错设备。请一次只配对一个设备。

## 通用模式

在 **Control Matter from KNX** 中选择 **通用模式** 可监视所有设备。KNX 网关为可选，仅用于电池监视器的报警/文本组地址。

**通用电池监视器** 会扫描所有已配对 node 和 endpoint 的 Power Source，输出初始快照并缓存完整的标准化电池状态。它可仅输出低于阈值的电池或每次更新。发送 `{payload:{action:"getAllBatteries"}}` 可获取缓存清单；原始 Matter 元数据位于 `msg.matter`。

输入需要 `nodeId`、`endpointId`、`clusterId`，以及 `command` 或 `attribute`（顶层或 `msg.matter` 下）：

- 开启：`{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- 读取：`{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- 写入：`{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## 存储

Fabric 凭据和已配对设备保存在 Node-RED 用户目录下的 `knxultimatestorage/matter` 文件夹中。删除该文件夹将移除所有配对。

使用 **导出** 下载此控制器实例的完整备份，其中包含 Fabric、私有凭据、会话和已配网设备数据。**请像密码一样保护此文件。** 导入会替换此实例当前的 Matter 存储并短暂重启控制器。控制器备份不能导入网桥。

## 移除设备

使用已配对设备列表中的垃圾桶按钮。控制器会尝试正确地解除设备调试；如果设备无法访问，仍会从 fabric 中移除（之后可能需要对设备进行恢复出厂设置）。

该列表为当前存储在此控制器 Matter fabric 中的每个节点显示一行。Node ID 在同一 fabric 内是唯一的；由同一个已调试 bridge 暴露的 endpoint 不会作为独立设备列出。状态列会显示各节点处于已连接、已断开、正在重新连接或等待发现状态。

控制器会为每个已配对设备分别保持命令顺序。缓慢、离线或已移除的设备不会阻塞发送给其他设备的命令。仍引用已移除 Node ID 的 Controller 设备节点会立即拒绝新命令，并显示 **Device no longer commissioned**。

设备不可用时，其 Controller 节点会保持锁定并忽略后续命令，直到该设备再次报告 `connected`。恢复会自动进行；打开设备节点编辑器也会解除锁定，以便手动重试。

在通用电池监视器中，可选 KNX 输出以 DPT 1.005 发布总报警，并以 14 字节 DPT 16.001 文本每 2 秒轮播低电量设备名称。
