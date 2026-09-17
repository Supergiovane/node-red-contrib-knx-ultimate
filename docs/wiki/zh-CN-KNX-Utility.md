---
layout: wiki
title: "KNX Utility"
lang: zh-CN
permalink: /wiki/zh-CN-KNX-Utility
translation_key: "KNX-Utility"
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

## 从第 7 版升级

请在 **KNX Ultimate 7** 仍安装时转换旧独立节点，并在升级前 Deploy。转换保留 ID、设置和连线，并提供流程备份及撤销。第 8 版不会加载已移除的节点类型。

[从第 7 版升级]({{ '/wiki/zh-CN-Migration-8' | relative_url }})
