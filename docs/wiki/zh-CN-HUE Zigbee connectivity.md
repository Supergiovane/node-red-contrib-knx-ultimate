---
layout: wiki
title: "HUE Zigbee connectivity"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Zigbee%20connectivity
---
> **已弃用：**此专用 HUE 节点仍可用于现有流程。新项目请使用 **HUE Controller**。该节点会在节点面板和画布上标记为 `(deprecated)`，颜色比 HUE Controller 更浅，编辑器顶部也会显示迁移提示。 此编辑器中带白色文字的高对比度橙色迁移按钮会在本地转换所有旧版 HUE 节点；完成后只会打开一封可编辑的邮件草稿。邮件绝不会自动发送。流程结束后，Node-RED 的固定消息会一直显示，直到您点击“确定”，并提供一个可选支持按钮；只有点击该按钮时才会打开捐赠页面。 开始前，请[在 YouTube 上观看说明视频](https://youtu.be/f0Evf2QFI7c)。

该节点从 HUE 设备读取 Zigbee 连接状态，并发布到 KNX。

在 GA 字段输入 KNX 设备名或组地址，输入时会自动联想。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 用于发布状态的 KNX 网关 |
| Hue Bridge | 要使用的 Hue Bridge |
| Hue Zigbee 连接 | 提供 Zigbee 连接信息的 HUE 传感器/设备（自动补全） |

**映射**

|属性|说明|
|--|--|
| 状态 | 映射 Zigbee 连接性的 KNX 组地址。连接时为 _true_，否则 _false_。|
| 启动时读取状态 | 在启动/重连时读取并发布至 KNX。默认："是”。|

### 输出

1. 标准输出
   : payload (boolean)：连接状态。

### 详情

`msg.payload` 为 true/false。\
`msg.status` 为文本： **connected, disconnected, connectivity\_issue, unidirectional\_incoming** 。
