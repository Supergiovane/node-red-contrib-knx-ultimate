---
layout: wiki
title: "zh-CN-HUE Light sensor"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HUE%20Light%20sensor
---
---

<p>该节点从 HUE 光照传感器读取 Lux 事件并发布到 KNX。</p>

每当环境光变化时会输出 Lux 值。在 GA 字段输入 KNX 设备名或组地址（自动补全）以进行关联。

**一般的**
|属性|描述|
| - | - |
|KNX GW |选择要使用的KNX门户|
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
