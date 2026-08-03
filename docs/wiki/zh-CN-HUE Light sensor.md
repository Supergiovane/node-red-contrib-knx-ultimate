---
layout: wiki
title: "HUE Light sensor"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Light%20sensor
---
> **已弃用：**此专用 HUE 节点仍可用于现有流程。新项目请使用 **HUE Controller**。该节点会在节点面板和画布上标记为 `(deprecated)`，颜色比 HUE Controller 更浅，编辑器顶部也会显示迁移提示。 此编辑器中带白色文字的高对比度橙色迁移按钮会在本地转换所有旧版 HUE 节点；完成后只会打开一封可编辑的邮件草稿。邮件绝不会自动发送。流程结束后，Node-RED 的固定消息会一直显示，直到您点击“确定”，并提供一个可选支持按钮；只有点击该按钮时才会打开捐赠页面。 开始前，请[在 YouTube 上观看说明视频](https://youtu.be/f0Evf2QFI7c)。

该节点从 HUE 光照传感器读取 Lux 事件并发布到 KNX。

每当环境光变化时会输出 Lux 值。在 GA 字段输入 KNX 设备名或组地址（自动补全）以进行关联。

**一般的**

|属性|描述|
| - | - |
|KNX 网关 |选择要使用的KNX门户|
|色相桥|选择要使用的色调桥|
| HUE Sensor | 要使用的 HUE 光照传感器（自动补全） |
|在启动时阅读状态|阅读启动时的状态，并在启动/重新连接时将事件发射到KNX总线上。（默认"否”）|

**映射**

|属性|说明|
|--|--|
| Lux | 接收 Lux 数值的 KNX 组地址 |

### 输出

1. 标准输出
   : payload (number)：当前 Lux 数值

### 细节

`msg.payload` 为数值型 Lux。
