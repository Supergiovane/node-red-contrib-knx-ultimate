---
layout: wiki
title: "HUE Tapdial"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Tapdial
---
**Hue Tap Dial** 节点将 Tap Dial 的旋转服务映射到 KNX，并把原始 Hue 事件发送到 Node-RED 流程。配对新设备后，请点击设备字段旁的刷新图标。

### 选项卡

- **映射** - 选择旋转事件对应的 KNX 组地址和 DPT，支持 DPT 3.007、5.001、232.600。
- **行为** - 控制是否显示 Node-RED 输出引脚。未配置 KNX 网关时，引脚仍保持启用，以便事件继续进入流程。

### 常规设置

| 属性 | 描述 |
|--|--|
| KNX GW | 用于 GA 自动补全的 KNX 网关。 |
| Hue Bridge | 提供 Tap Dial 的 Hue 网桥。 |
| Hue Tap Dial | 旋钮设备（支持自动补全；刷新按钮重新获取列表）。 |

### 映射选项卡

| 属性 | 描述 |
|--|--|
| 旋转 GA | 接收旋转事件的 KNX 组地址（支持 DPT 3.007、5.001、232.600）。 |
| 名称 | GA 的说明名称。 |

### 输出

|#|端口|Payload|
|--|--|--|
|1|标准输出|`msg.payload`（对象）Tap Dial 产生的原始 Hue 事件。|

> ℹ️ 仅在选择 KNX 网关后才会显示 KNX 相关控件；在同时配置好 Hue 网桥和 KNX 网关之前，映射选项卡会保持隐藏。
