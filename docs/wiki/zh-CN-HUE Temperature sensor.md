---
layout: wiki
title: "HUE Temperature sensor"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Temperature%20sensor
---
> **已弃用：**此专用 HUE 节点仍可用于现有流程。新项目请使用 **HUE Controller**。该节点会在节点面板和画布上标记为 `(deprecated)`，颜色比 HUE Controller 更浅，编辑器顶部也会显示迁移提示。 此编辑器中带白色文字的高对比度橙色迁移按钮会在本地转换所有旧版 HUE 节点；完成后只会打开一封可编辑的邮件草稿。邮件绝不会自动发送。流程结束后，Node-RED 的固定消息会一直显示，直到您点击“确定”，并提供一个可选支持按钮；只有点击该按钮时才会打开捐赠页面。 开始前，请[在 YouTube 上观看说明视频](https://youtu.be/f0Evf2QFI7c)。

此节点读取 HUE 温度传感器的温度（°C），并将其映射到 KNX。

在 GA 字段（名称或组地址）中输入以关联 KNX GA；输入时会显示设备建议。

**一般的**

|属性|描述|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| Hue Bridge | 选择要使用的 Hue Bridge |
| Hue 温度传感器 | HUE 温度传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重连时读取当前值并发送到 KNX（默认：否） |

**映射**

|属性|描述|
|--|--|
| 温度 | 温度（°C）的 KNX GA。推荐 DPT：<b>9.001</b> |

### 输出

1. 标准输出
   : `msg.payload`（number）：当前温度（°C）

### 详情

`msg.payload` 包含数值型温度。
