---
layout: wiki
title: "快速入门"
lang: zh-CN
permalink: /wiki/zh-CN-Getting-Started
translation_key: "Getting-Started"
---

# 快速入门

新安装请按以下步骤操作。如果流程已经使用 KNX Ultimate 7，请先完成升级指南。

> [从第 7 版升级]({{ '/wiki/zh-CN-Migration-8' | relative_url }})

需要 Node.js 20.18.1 或更高版本，以及 Node-RED 3.1.1 或更高版本。

1. 打开 **管理节点面板 → 安装**，安装 `node-red-contrib-knx-ultimate`，然后重启 Node-RED。

2. 将 **KNX Device** 拖入流程。添加网关配置，填写 KNX 接口的地址和连接设置。有 ETS 组地址时可一并导入。

3. 选择系统中的组地址和对应数据点。开关命令使用该地址对应的布尔数据点，例如 `1.001`。

4. 将一个 **Inject** 节点连接到 KNX Device，令 `msg.payload` 为布尔值 `true` 或 `false`。将 KNX Device 输出连接到 **Debug**，查看收到的报文。

5. 确认地址后点击 **Deploy**。通过 Inject 发送命令。启用 **React to response**，以查看读取请求的响应。

## 从总线读取数值

启用 KNX Device 的手动按钮。操作依次为 **Toggle boolean**、**发送 KNX Read**（第二项）和 **写入自定义值**。选择 Read 后点击按钮即可读取已配置的地址。通用模式下无法使用此按钮读取操作。也可以从流程发送 `msg.readstatus = true`。

[KNX Device]({{ '/wiki/zh-CN-Device' | relative_url }}) · [KNX Gateway]({{ '/wiki/zh-CN-Gateway-configuration' | relative_url }}) · [示例]({{ '/wiki/zh-CN--SamplesHome' | relative_url }})

## 视频教程

[Max Supervibe — YouTube](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)
