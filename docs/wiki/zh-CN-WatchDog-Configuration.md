---
layout: wiki
title: "WatchDog-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-WatchDog-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-WatchDog-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration)

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

> Ethernet：检测 KNX‑Ultimate（Unicast）与 KNX/IP 接口之间的连接。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetLevel.png" width="90%">

> Ethernet + KNX TP：完整检测（支持路由器/接口）。向物理设备发送 Read 并等待 Response；以太网或 TP 的任何故障都会被上报。请在 ETS 中为某个执行器配置一条会响应读取的 **状态** GA。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/WatchDogEthernetKNXTPLevel.png" width="90%">

## 高级选项

| 属性 | 说明 |
|--|--|
| Retry interval (in seconds) | 以秒为单位的检测间隔。|
| Number of retry before giving an error | 连续失败多少次后报告错误。|

# WatchDog 的输出

当内部检测发现故障，或某个 KNX‑Ultimate 节点在流程中上报错误时，WatchDog 会输出消息。

**WatchDog 自身连接问题**

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration" target="_blank">详见此处</a>

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

[Sample WatchDog](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
