---
layout: wiki
title: "KNX Utility"
lang: zh-CN
permalink: /wiki/zh-CN-KNX-Utility
---
# KNX Utility

**KNX Utility** 将十一种 KNX 辅助功能整合到一个面板节点中。选择**功能**即可显示对应设置、图标及流程端口。**KNX Device（KNXUltimate）**仍是发送和接收 KNX 电报的主节点。

## 十一种功能，一个节点

| 功能及设置参考 | 用途 | 输入 / 输出 |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration) | 分别报告报警设备、全部报警设备或最近的报警。 | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder) | 使用配置的值或之前接收的值响应 KNX 组读取请求。 | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/zh-CN-DateTime-Configuration) | 使用 DPT 19.001、11.001 和 10.001 发送当前日期和时间。 | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration) | 监控网关或 KNX 设备并报告连接问题。 | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable) | 通过选定的 Node-RED 全局上下文存储共享 KNX 值。 | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration) | 将总线电报记录为 ETS 兼容 XML，并统计流量。 | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/zh-CN-Staircase-Configuration) | 控制楼梯照明定时器，支持状态、强制控制及提前提醒。 | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/zh-CN-Garage-Configuration) | 管理车库指令、脉冲控制、安全输入和自动关闭。 | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration) | 使用可配置的组地址和值调用、学习及保存场景。 | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration) | 根据功耗和功率限制断开及恢复配置的负载。 | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator) | 使用可配置的输入属性和映射表，将 Home Assistant 状态字符串转换为布尔值。 | 1 / 1 |

表格列出各功能的流程端口。AutoResponder 和 Global Context 直接使用总线和上下文。DateTime 使用定时发送和节点上的按钮，没有流程输入或输出端口。

Home Assistant Translator 有一个输入和一个输出，无需 KNX 网关。选择要转换的消息属性（如 `payload` 或 `data.new_state.state`），并编辑 `来源:true` / `来源:false` 映射，例如 `open:true` 和 `closed:false`。转换后的布尔值通过 `msg.payload` 输出；如需写入总线，请将输出连接到 KNX Device。

## 配置 Utility 节点

1. 将 **KNX Utility** 从节点面板拖入流程。
2. 选择**功能**，按需选择 KNX 网关，并填写该功能显示的设置。
3. 保存节点并检查输入输出连接，准备就绪后点击**部署**。

在编辑器中更改功能时，会预览对应设置。点击**取消**可保留之前保存的配置。表格中的链接提供各功能的设置及示例；原有页面继续作为专用节点的参考文档。

## 转换所有兼容旧版节点

打开 **KNX Utility** 或任一兼容旧版节点，点击**转换所有兼容的旧版 KNX 节点**并确认。转换覆盖编辑器**所有流程和子流程**中上述十一种功能的每个实例，不受当前标签页或所选节点限制。

确认后，在修改任何节点之前，浏览器会自动开始下载带有日期和时间的 JSON 备份，包含编辑器中所有当前流程，包括标签页、子流程、配置节点、分组和连线。文件使用 Node-RED 标准导出格式，可重新导入。与标准导出相同，节点声明的凭据不会包含在备份中。浏览器可能会询问文件保存位置。如果无法准备备份或启动下载，则不会转换任何节点。

转换在浏览器本地进行，保留节点 ID、已保存设置、网关引用、连接、位置和分组。保留 ID 可继续使用 AutoResponder 值文件及 Scene Controller 已记录的场景；Global Context 保留变量名及存储选择，Logger 保留文件设置。 Home Assistant Translator 保留输入属性和自定义转换表，包括有意留空的表。

确认后将关闭当前节点编辑器并丢弃未保存的编辑。整个转换批次可通过一次**撤销**恢复，也支持**重做**。请检查转换结果，再自行点击**部署**使更改生效。迁移不会自动部署。如果流程被锁定，需先解锁才能转换。

现有专用节点仍可加载和运行。它们已从节点面板隐藏，在现有流程中标记为 `(deprecated)`，并仍可编辑设置。KNX Device、Viewer、其他集成节点和路由节点继续承担各自的功能。
