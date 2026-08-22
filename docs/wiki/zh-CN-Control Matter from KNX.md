---
layout: wiki
title: "Control Matter from KNX"
lang: zh-CN
permalink: /wiki/zh-CN-Control%20Matter%20from%20KNX
---
# 从 KNX 控制 Matter

此节点用于从 KNX 控制已经配对的 Matter endpoint。选择 Matter 设备后，编辑器会检测它的能力，并只显示与该 endpoint 匹配的 KNX 映射。

单击 Matter 设备字段或使其获得焦点时，即使已经选择了设备，也会始终打开完整的已配对 endpoint 列表；输入文字仍可筛选列表。

它替代未发布的多个专用 Matter 控制节点；当选择的 endpoint 是灯时，仍保留完整的灯光 UI。

## 配置

|字段|说明|
|--|--|
| KNX GW | 用于写入并响应已配置组地址的 KNX 网关。如果只需要 Node-RED 输出，可以留空。编辑器初始化期间会保留已保存的网关，只有用户明确选择后才会更改。 |
| Matter controller | 设备已在其中配网的 Matter Controller 配置节点。 |
| Matter device | 从已配对设备中选择的 Matter endpoint。UI 会根据真实能力重新构建。 |
| Switch / 插座 / 灯 On-Off | On/Off 命令和状态组地址，通常使用 DPT `1.001`。 |
| 门锁 | DPT `1.xxx` 命令组地址以 `true` 调用 `lockDoor`、以 `false` 调用 `unlockDoor`；独立状态组地址仅接收明确的已上锁/已解锁状态。如端点要求，远程操作 PIN 保存在凭据字段中。端点未声明的命令会被拒绝。 |
| 其他端点 | Window Covering、Thermostat、Fan 和 Switch 端点使用按能力选择的专用配置；Switch 的初始、长按和多按事件通过可选 flow 输出发送。插座、开关执行器、传感器、电池、功率和电能使用通用映射回退。**映射** 选项卡仅包含端点实际声明的功能；组地址留空即可禁用。 |
| 灯光控制 | 对灯光 endpoint 使用完整灯光 UI：相对调光（DPT `3.007`）、亮度百分比、RGB/HSV、色温、开灯亮度/温度、日/夜模式、最小/最大调光等级和调光速度。不支持的部分会隐藏。 |
| 传感器 | 传感器 endpoint 只在支持时显示对应测量/状态 GA：温度、湿度、照度、占用、接触和电池。 |
| Read at startup | 在部署/启动或设备重新连接时发布缓存的 Matter 值。 |
| Update local state from KNX write | 当配置的 KNX GA 收到写入 telegram 时，更新本地 Matter/KNX 缓存。 |
| Node Input/Output PINs | 显示 Node-RED 输入/输出端口，并在该字段下方显示 **流程输入** 区域。灯光会显示其支持的顶层灯光状态消息；其他端点会显示简单的 `{function,value}` 格式和高级 Matter 选择器。 |

## 流程输入消息

启用 **Node Input/Output PINs** 后，**流程输入** 区域会直接显示在选择器下方。对于灯光，它提供所支持顶层属性的可复制示例，例如 `msg.on`、`msg.dimming`、`msg.color_temperature` 和 `msg.color`。对于其他端点，该区域根据公布的结构生成，并显示 Endpoint ID、全部可读/可写属性和接受的命令。未选择 KNX 网关时仍然可用。

使用 `msg.payload = {function:"position",value:35}` 以易懂单位写入。省略 `value` 可读取支持的状态，例如 `{function:"temperature"}`；结果输出到 `msg.payload`，原始 Matter 详情保存在 `msg.matter`。可用功能取决于端点，包括 `onoff`、`level`、`position`、`open`、`close`、`stop`、设定点、风扇和传感器。门锁接受 `{function:"lock",value:true|false}`。

现有 flow 保持兼容。高级消息继续使用 `msg.clusterId` 配合 `msg.command`/`msg.args`，或使用 `msg.attribute` 和可选的 `msg.value`。Node ID 和 Endpoint ID 已由节点选择。

## 行为

节点根据 Matter 更新和 KNX 写入维护本地缓存，用该缓存响应 KNX 读取请求，并可在启动时读取/发送值。节点只监听已配置的组地址，因此会忽略无关的 KNX 流量。

每个已配对设备使用独立且有序的命令队列。因此，离线、超时或已移除的设备不会延迟使用同一 KNX 组地址的其他 Matter 设备。仍引用已移除设备的节点会立即拒绝命令，并以红色显示 **Device no longer commissioned**；请选择有效的 Matter 设备，或删除遗留的 Controller 节点。

设备不可用错误会保持锁定：后续 KNX 和 flow 命令将被忽略，且无法覆盖红色状态。一旦该 Matter 设备报告 `connected`，节点会自动恢复；打开节点编辑器也会解除锁定，以便手动重试。
