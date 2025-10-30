🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Plug) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Plug) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Plug) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Plug) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Plug) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Plug)

<!-- NAV START -->
导航: [首页](/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)  
概览: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [常见问题](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot) • [安全](/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY) • [文档：语言栏](/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)  
KNX 设备: [网关](/node-red-contrib-knx-ultimate/wiki/zh-CN-Gateway-configuration) • [设备](/node-red-contrib-knx-ultimate/wiki/zh-CN-Device) • [节点保护](/node-red-contrib-knx-ultimate/wiki/zh-CN-Protections)  
其他 KNX 节点: [场景控制器](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration) • [看门狗](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration) • [日志节点](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration) • [全局上下文](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable) • [告警器](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration) • [负载控制](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration) • [查看器](/node-red-contrib-knx-ultimate/wiki/zh-CN-knxUltimateViewer) • [自动响应](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder) • [HA 翻译器](/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator) • [物联网桥接](/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Bridge+configuration) • [灯](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light) • [电池](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Battery) • [按钮](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Button) • [接触](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Contact+sensor) • [设备软件更新](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Device+software+update) • [光照传感器](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light+sensor) • [运动](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Motion) • [场景](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Tapdial) • [温度](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Temperature+sensor) • [Zigbee 连接](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Zigbee+connectivity)  
示例: [日志](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/zh-CN-Manage-Wiki)
<!-- NAV END -->

---

# Hue 插座 / Plug

## 概述

Hue Plug 节点将飞利浦 Hue 智能插座映射到 KNX 组地址，实现：

- 总线上的开/关控制；
- 来自 Hue 平台的状态反馈；
- 可选的 `power_state`（on/standby）监控。

## 配置

|字段|说明|
|--|--|
| KNX GW | 使用的 KNX 网关 |
| Hue Bridge | 使用的 Hue 网桥 |
| 名称 | 要控制的 Hue 插座（自动提示） |
| 控制 | 发送开/关的 KNX 组地址（布尔 DPT） |
| 状态 | Hue 报告的开/关状态接收地址 |
| 电源状态 | 映射 Hue `power_state` 的可选组地址 |
| 启动时读取状态 | 部署时立即发送当前状态 |
| 引脚 | 启用 Node-RED 输入/输出引脚，用于高级控制或事件转发 |

## KNX 建议

- 控制与状态建议使用 DPT 1.xxx。
- `power_state` 可映射为布尔值（true=on, false=standby），或使用文本类 DPT 显示原始字符串。
- 接收到 KNX 读取 (`GroupValue_Read`) 时，节点返回缓存的 Hue 状态。

## Flow 集成

当启用引脚时：

- **输入** ：发送 Hue v2 载荷（如 `{ on: { on: true } }`）。
- **输出** ：在每次 Hue 事件时输出 `{ payload, on, power_state, rawEvent }`。

## Hue API

节点调用 `/resource/plug/{id}`。Hue 事件流用于捕获状态变化并同步到 KNX。
