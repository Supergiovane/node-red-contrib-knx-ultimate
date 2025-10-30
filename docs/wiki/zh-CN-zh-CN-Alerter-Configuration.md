🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)
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


# Alerter 节点配置

使用 Alerter 节点可以在显示器上，或通过 node-red-contrib-tts-ultimate 节点（语音播报），提示被选中的设备是否处于告警状态，即 `payload` 为 **true** 。
该节点按可配置的时间间隔，逐条（一次一条）输出包含当前告警设备详细信息的消息。例如，它可以告诉你"有多少个、哪些窗户处于打开状态”。<br/>
节点直接从 KNX 总线读取设备数值。此外，你也可以向节点发送自定义告警，与 KNX 设备无关。<br/>
示例页面展示了在流程中的用法。<br/>

- **Gateway（网关）**

> 选择要使用的 KNX 网关。也可以不选择网关；此时仅处理进入该节点的消息。

- **Name（名称）**

> 节点名称。

- **告警轮询的启动方式**

> 选择触发开始发送告警消息的事件。

- **每条消息的间隔（秒）**

> 连续两条输出消息之间的时间间隔。

## 需要监控的设备

在此添加需要监控的设备。<br/>
填写设备的组地址，或为设备指定一个标签。<br/>

- **在连接/重连时读取每个设备的值**

> 启动或重连时，节点会为列表中的每个设备发送一次读取请求。

- **ADD 按钮**

> 向列表新增一行。

- **设备行 ** > 第一列为组地址（也可以填写任意文本，配合输入消息使用；参见示例页面）。第二列为设备简称（**最多 14 个字符** ）。第三列为设备全名。

- **DELETE 按钮**

> 从列表中移除该设备。

<br/>
<br/>

## 节点的输出消息

PIN1：按设定间隔，每个告警设备输出一条消息。<br/>
PIN2：输出一条汇总消息，包含所有处于告警状态的设备。<br/>
PIN3：仅输出最近一个进入告警状态的设备。<br/>

**PIN1** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
``` **PIN2** ```javascript
msg = {
  topic: "door, 0/0/11, 0/1/2, 0/0/9",
  devicename: "入户门, 客厅壁灯, 地下室壁灯, 书房灯",
  longdevicename: "主入户门, 客厅左侧壁灯, 地下室右侧壁灯, 书房顶灯",
  count: 4,
  payload: true
}
``` **PIN3** ```javascript
msg = {
  topic: "0/1/12",
  count: 3, // 处于告警状态的设备总数
  devicename: "卧室窗户",
  longdevicename: "卧室主窗",
  payload: true
}
```当所有设备均处于静止（无告警）时的输出：

**PIN1, PIN2, PIN3** ```javascript
msg = {
  topic: "",
  count: 0,
  devicename: "",
  longdevicename: "",
  payload: false
}
```<br/>
<br/>

## 节点的输入消息```javascript
msg.readstatus = true
```读取列表中每个设备的当前值。```javascript
msg.start = true
```启动一次"遍历所有告警设备并依次输出”的轮询。轮询在最后一个设备输出后结束；若需再次轮询，请再次发送该输入消息。

<br/>

**自定义设备告警** <br/>

要更新某个自定义设备的状态（true/false），发送如下输入消息：```javascript
msg = {
  topic: "door",
  payload: true // 也可为 false，以清除此设备的告警
}
```<br/>

## 示例

<a href="/node-red-contrib-knx-ultimate/wiki/SampleAlerter">点击此处查看示例</a>

<br/>
<br/>
<br/>
