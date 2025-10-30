🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Motion) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Motion) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Motion) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Motion) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Motion)

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

<p>该节点订阅 Hue 运动传感器的事件，并将其同步到 KNX 以及 Node-RED 流程。</p>

在 GA 字段输入 KNX 设备名称或组地址即可自动补全；"Hue 传感器”旁的刷新按钮可重新加载 Hue 设备列表。

**常规**
|属性|说明|
| - | - |
|KNX GW |接收运动状态的 KNX 网关（选择后才显示 KNX 设置）|
|Hue Bridge|使用的 Hue 网桥|
| Hue 传感器 | 要使用的 Hue 运动传感器（支持自动补全与刷新）|

**映射**
|属性|说明|
|--|--|
| 运动 | 对应的 KNX 组地址；检测到运动时发送 `true`，恢复空闲时发送 `false`（推荐 DPT：<b>1.001</b>）|

**行为**
|属性|说明|
|--|--|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出；未选择 KNX 网关时会保持启用，确保 Hue 事件仍能进入流程 |

> ℹ️ 未选择 KNX 网关时，KNX 字段会自动隐藏，可将节点用作纯 Hue → Node-RED 监听器。

### 输出

1. 标准输出 — `msg.payload` (boolean)
   : 侦测到运动为 `true`，运动结束为 `false`。
