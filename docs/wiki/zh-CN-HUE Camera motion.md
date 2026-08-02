---
layout: wiki
title: "HUE Camera motion"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Camera%20motion
---
> **已弃用：**此专用 HUE 节点仍可用于现有流程。新项目请使用 **HUE Controller**。该节点会在节点面板和画布上标记为 `(deprecated)`，颜色比 HUE Controller 更浅，编辑器顶部也会显示迁移提示。 此编辑器中的橙色迁移按钮会在本地转换所有旧版 HUE 节点；完成后会打开一封可编辑的邮件草稿，并在浏览器新窗口中打开捐赠页面。邮件绝不会自动发送。流程结束后，Node-RED 的固定消息会一直显示，直到您点击“确定”。

Hue Camera Motion 节点监听 Philips Hue 摄像头的运动事件，并将检测到/未检测到的状态映射到 KNX。

在 GA 输入框（名称或组地址）中开始输入，即可关联 KNX GA；输入时会显示匹配的设备。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| HUE Bridge | 选择要使用的 HUE Bridge |
| HUE 摄像头运动 | Hue 摄像头运动传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重新连接时读取当前值并发送到 KNX（默认：否） |

**映射**

|属性|说明|
|--|--|
| 运动 | 摄像头运动的 KNX 组地址（布尔值）。推荐 DPT：<b>1.001</b> |

### 输出

1. 标准输出
   : `msg.payload` (布尔值)：检测到运动时为 `true`，否则为 `false`

### 详细信息

`msg.payload` 保存 Hue 摄像头服务上次报告的运动状态。
