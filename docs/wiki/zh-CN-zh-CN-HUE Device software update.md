---
layout: wiki
title: "zh-CN-HUE Device software update"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HUE%20Device%20software%20update/
---
---

<p>该节点监控 HUE 设备的软件更新状态，并发布到 KNX。</p>

开始在GA字段中键入KNX设备的名称或组地址，可用的设备开始显示
您正在打字。

**一般的**
|属性|描述|
| - | - |
|KNX GW |选择要使用的KNX门户|
|色相桥|选择要使用的色调桥|
| HUE Device | 要监控的 HUE 设备（自动补全） |

**映射**
|属性|说明|
|--|--|
| 状态 | 映射软件更新的 KNX 组地址：可用/准备/安装中为 _true_，否则 _false_ |
| 启动时读取状态 | 启动/重连时读取并发布至 KNX（默认"是”） |

### 输出

1. 标准输出
: payload (boolean)：更新标志。
: status (string)： **no\_update, update\_pending, ready\_to\_install, installing** 。
