🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)

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

# WatchDog（看门狗）

用于检测与网关或特定 KNX 设备的连接状况，并在出现故障时执行自动化操作。

**功能**

1. 周期性发送报文并等待应答，若总线连接异常则向流程输出消息。提供两种检测级别（见下）。
2. 通过消息修改配置节点（Config‑Node）的网关参数，实现 KNX/IP 路由器/接口的切换（如主备切换）。
3. 强制与 KNX 总线建立/断开连接。

## 以太网层与 KNX 双绞线层检测

WatchDog 提供两级检测：

- 以太网级：仅检测 KNX‑Ultimate 与 KNX/IP 接口（Unicast）之间的连通性。
- 以太网 + KNX‑TP：检查整条链路（以太网→TP）。需一个能响应读取请求的物理设备。

适合用于错误/连接故障告警（邮件通知、自动切换备份网关等）。

## 设置（SETTINGS）

| 属性 | 说明 |
|--|--|
| Gateway | 选择的 KNX 网关。|
| Group Address to monitor | 用于发送与监测的组地址；DPT 必须为 1.x（布尔）。|
| Name | 节点名称。|
| Auto start the watchdog timer | 在部署/启动时自动启动定时器。|
| Check level | 见上。|

**Check level**

> Ethernet：检测 KNX‑Ultimate（Unicast）与 KNX/IP 接口之间的连接。<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width="90%"><br/>

> Ethernet + KNX TP：完整检测（支持路由器/接口）。向物理设备发送 Read 并等待 Response；以太网或 TP 的任何故障都会被上报。请在 ETS 中为某个执行器配置一条会响应读取的 **状态** GA。<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" width="90%"><br/>

## 高级选项

| 属性 | 说明 |
|--|--|
| Retry interval (in seconds) | 以秒为单位的检测间隔。|
| Number of retry before giving an error | 连续失败多少次后报告错误。|

# WatchDog 的输出

当内部检测发现故障，或某个 KNX‑Ultimate 节点在流程中上报错误时，WatchDog 会输出消息。

**WatchDog 自身连接问题**

<a href="/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration" target="_blank">详见此处</a>

```javascript
msg = {
  type: "BUSError",
  checkPerformed: "Ethernet" // 或 "Eth+KNX",
  nodeid: "23HJ.2355",
  payload: true,
  description: "..."
}
```

**你的某个 KNX‑Ultimate 节点出现异常**

```javascript
msg = {
  type: "NodeError",
  checkPerformed: "Self KNX-Ultimate node reporting a red color status",
  nodeid: "23HJ.2355",
  payload: true,
  description: "...",
  completeError: {
    nodeid: "23HJ.2355",
    topic: "0/1/1",
    devicename: "Kitchen Light",
    GA: "0/1/1"
  }
}
```

**通过 setGatewayConfig 修改网关配置**

```javascript
msg = {
  type: "setGatewayConfig",
  checkPerformed: "The Watchdog node changed the gateway configuration.",
  nodeid: "23HJ.2355",
  payload: true,
  description: "New Config issued to the gateway. IP:224.0.23.12 Port:3671 PhysicalAddress:15.15.1\nBindLocalInterface:Auto",
  completeError: ""
}
```

**强制连接/断开**

```javascript
msg = {
  type: "connectGateway",
  checkPerformed: "The Watchdog issued a connection/disconnection to the gateway.",
  nodeid: "23HJ.2355",
  payload: true, // true=连接，false=断开
  description: "Connection",
  completeError: ""
}
```

---

# 输入消息（INPUT）

## 启动/停止 WatchDog

```javascript
msg.start = true; return msg; // 启动
```

```javascript
msg.start = false; return msg; // 停止
```

## 运行期修改 KNX/IP 网关设置

通过 `msg.setGatewayConfig` 更改 IP/Port/PhysicalAddress/Protocol 等；配置节点会应用并重连。Node‑RED 重启后恢复为配置节点中的设置。所有参数均为可选。

```javascript
msg.setGatewayConfig = { IP:"224.0.23.12", Port:3671, PhysicalAddress:"15.15.1", BindToEthernetInterface:"Auto",
  Protocol:"Multicast", importCSV:`"Group name" "Address" "Central" "Unfiltered" "Description" "DatapointType" "Security"
"Attuatori luci" "0/-/-" "" "" "" "" "Auto"
"Luci primo piano" "0/0/-" "" "" "" "" "Auto"
"Luce camera da letto" "0/0/1" "" "" "" "DPST-1-1" "Auto"` };
return msg;
```

仅更改 IP：

```javascript
msg.setGatewayConfig = { IP:"224.0.23.12" }; return msg;
```

**强制断开并禁用自动重连**

```javascript
msg.connectGateway = false; return msg;
```

**强制连接并启用自动重连**

```javascript
msg.connectGateway = true; return msg;
```

## 参见

[Sample WatchDog](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
