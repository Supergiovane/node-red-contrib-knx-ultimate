🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)
<!-- NAV START -->
导航: [首页](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)  
概览: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [常见问题](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot) • [安全](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY) • [文档：语言栏](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)  
KNX 设备: [网关](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Gateway-configuration) • [设备](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Device) • [节点保护](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Protections)  
其他 KNX 节点: [场景控制器](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration) • [看门狗](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration) • [日志节点](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration) • [全局上下文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable) • [告警器](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration) • [负载控制](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration) • [查看器](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-knxUltimateViewer) • [自动响应](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder) • [HA 翻译器](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator) • [物联网桥接](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)  
HUE: [Bridge](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Bridge%20configuration) • [灯](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light) • [电池](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Battery) • [按钮](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Button) • [接触](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Contact%20sensor) • [设备软件更新](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Device%20software%20update) • [光照传感器](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Light%20sensor) • [运动](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Motion) • [场景](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Scene) • [Tap Dial](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Tapdial) • [温度](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Temperature%20sensor) • [Zigbee 连接](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Zigbee%20connectivity)  
示例: [日志](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Sample) • [Switch Light](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)
<!-- NAV END -->
---

# KNX负载控制节点

<p>使用负载控制节点，当电流消耗超过一定阈值时，您可以自动管理负载（洗衣机，烤箱等）的断开连接。

设备智能关闭，检查设备的可能消耗以确定是否与其他设备将其关闭。<br/>
节点可以自动重新激活负载。<br/>
该节点一次根据您选择的顺序关闭一个设备（或多个设备）。<br/>

**一般的**

|属性|描述|
| - | - |
|网关|KNX门户。也可能不选择任何网关。在这种情况下，将仅考虑输入到节点的消息。|
|监视WH |小组地址代表您建筑物的总消费。|
|限制WH |电表可以承受的最大阈值。当超过此阈值时，节点开始关闭设备。|
|延迟关闭（S）|在几秒钟内表示，表示节点将评估消耗并关闭每个设备的频率。|
|延迟打开（S）|在几秒钟内表示，表示节点会评估消耗的频率并打开关闭的每个设备。|

<br/>

**负载控制**

在这里，您可以添加设备以在过载的情况下关闭。<br/>
选择要关闭的设备。输入设备名称或其组地址。<br/>
输入任何指示在第一行中选择的设备消耗的组地址。 **这是一个可选参数** 。如果该设备消耗的数量超过一定数量的瓦特，则意味着它正在使用。如果消耗较少，则该设备将被视为"不使用”，并且该设备将立即关闭。<br/>
如果启用了 \*自动恢复 \*，则"重置延迟”到期时，将自动重新激活设备。

## 输入

|属性|描述|
| - | - |
|`msg.readstatus = true` |迫使列表中每个设备的KNX总线读取值。_ **该节点本身已经完成了所有操作** _，但是如果需要，可以使用此命令强制重新阅读瓦特中当前值的重新阅读。| | |
|`msg.enable = true` |启用负载控制。|
|`msg.disable = true` |禁用负载控制。|
|`msg.reset = true` |重置节点状态并重新打开所有设备。 |
|`msg.shedding` |细绳。_&#x68DA;_&#x5F00;始形式的脱落序列，\*unshe&#x64;_&#x4EE5;开始反向脱落。使用此消息迫使脱落计时器开始/停止，而忽略了\*\*监视器WH \*\*组地址。设&#x7F6E;_&#x81EA;动\*再次启用\*\*监视wh \*\*组地址监视。|

## 输出

1. 标准输出
：有效载荷（字符串|对象）：命令的标准输出。

## 细节```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```# 样本

\<a href =" /node-red-contrib-knx-ultimate/wiki/SampleLoadControl”>单击此处以获取示例</a>

<br/>