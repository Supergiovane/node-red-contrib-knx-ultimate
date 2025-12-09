---
layout: wiki
title: "HUE Motion area"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Motion%20area
---
Hue 区域人体传感器节点订阅 Hue Bridge Pro 上 MotionAware 区域的聚合运动事件，并将“有人 / 无人”的结果同步到 KNX 或 Node-RED 流程。

在 GA 字段输入 KNX 设备名称或组地址即可完成绑定；输入时会显示匹配的建议。

**常规**

|属性|说明|
|--|--|
| KNX GW | 接收区域运动状态的 KNX 网关。 |
| HUE Bridge | 要使用的 Hue Bridge Pro。 |
| HUE Area | 要监控的 MotionAware 区域（舒适/安防），支持自动补全。 |
| 启动时读取状态 | 在启动或重新连接时读取当前值并发送到 KNX（默认：是）。 |

**映射**

|属性|说明|
|--|--|
| 运动 | 对应区域运动状态的 KNX 组地址（布尔量）。推荐 DPT：<b>1.001</b>。 |

**行为**

|属性|说明|
|--|--|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出；未选择 KNX 网关时会保持启用，以便 MotionAware 事件仍能进入流程。 |

### 输出

1. 标准输出  
   : `msg.payload` (boolean)：当区域检测到运动时为 `true`，否则为 `false`。

### 详情

`msg.payload` 携带所选 MotionAware 区域的最新聚合运动状态。

